import { createHash } from 'node:crypto';
import { constants } from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import { writeFile, mkdir, realpath, lstat, open } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const inside = (parent, file) => { const relative = path.relative(parent, file); return relative === '' || (!relative.startsWith('..' + path.sep) && relative !== '..' && !path.isAbsolute(relative)); };
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const identity = file => process.platform === 'win32' ? file.toLowerCase() : file;
const fileIdentity = info => `${info.dev}:${info.ino}`;
async function boundedRead(file, limit, base) {
  const expected=await lstat(file,{bigint:true});
  if (!expected.isFile()) throw new Error('Capture inputs must be regular files, not pipes or devices.');
  const handle=await open(file,constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0) | (constants.O_NONBLOCK ?? 0));
  try {
    const before=await handle.stat({bigint:true});
    const actual=await realpath(file);
    if(!before.isFile() || fileIdentity(before)!==fileIdentity(expected) || !inside(base,actual) || fileIdentity(await lstat(actual,{bigint:true}))!==fileIdentity(before)) throw new Error('Capture identity/location changed before reading.');
    if(before.size>BigInt(limit)) throw new Error('Capture input exceeds its encoded-byte limit.');
    const chunks=[]; let size=0;
    for (;;) {
      const chunk=Buffer.allocUnsafe(64*1024);
      const {bytesRead}=await handle.read(chunk,0,chunk.length,null);
      if(!bytesRead) break;
      size+=bytesRead; if(size>limit) throw new Error('Capture input exceeds its encoded-byte limit.');
      chunks.push(chunk.subarray(0,bytesRead));
    }
    const after=await handle.stat({bigint:true});
    if(before.size!==after.size || before.mtimeNs!==after.mtimeNs || before.ctimeNs!==after.ctimeNs || BigInt(size)!==after.size) throw new Error('Capture changed during reading; review completed immutable captures.');
    return {bytes:Buffer.concat(chunks,size),identity:fileIdentity(before)};
  } finally { await handle.close(); }
}
const xml = text => String(text).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&apos;' }[c]));

// Triage captured evidence, never capture or mutate the site and never grade its aesthetics.
export async function reviewCaptures(manifestFile, outputDirectory) {
  const manifestPath = await realpath(manifestFile); const base = path.dirname(manifestPath);
  const sourceIdentities = new Set();
  if ((await lstat(manifestPath)).size > 256 * 1024) throw new Error('Capture manifest exceeds 256 KiB.');
  const manifestInput=await boundedRead(manifestPath,256*1024,base); sourceIdentities.add(manifestInput.identity);
  const manifestBytes=manifestInput.bytes; const manifest = JSON.parse(manifestBytes);
  if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.frames) || manifest.frames.length < 2 || manifest.frames.length > 48) throw new Error('Use schemaVersion 1 and 2..48 frames.');
  const output = path.resolve(outputDirectory); const captures = []; const tiles = [];
  for (const [index, frame] of manifest.frames.entries()) {
    if (!frame.file || path.isAbsolute(frame.file) || !frame.scene || !frame.label || !['forward','reverse','manual'].includes(frame.direction) || !['change','hold','static'].includes(frame.expectation)) throw new Error(`Frame ${index}: relative file, scene, label, direction and expectation required.`);
    if (!Number.isFinite(frame.progress) || frame.progress < 0 || frame.progress > 1 || !Number.isFinite(frame.atMs) || frame.atMs < 0 || !Number.isInteger(frame.viewport?.width) || !Number.isInteger(frame.viewport?.height) || frame.viewport.width < 1 || frame.viewport.height < 1) throw new Error(`Frame ${index}: invalid progress/time/viewport.`);
    if (frame.expectation !== 'change' && !frame.reason?.trim()) throw new Error(`Frame ${index}: intended hold/static needs a reason.`);
    const file = await realpath(path.resolve(base, frame.file));
    if (!inside(base, file)) throw new Error('Capture files must remain inside the manifest directory, including links.');
    if ((await lstat(file)).size > 32 * 1024 * 1024) throw new Error('Capture exceeds 32 MiB.');
    const captureInput=await boundedRead(file,32*1024*1024,base); sourceIdentities.add(captureInput.identity);
    const bytes=captureInput.bytes; const metadata = await sharp(bytes, { limitInputPixels: 20_000_000 }).metadata();
    let comparison = sharp(bytes, { limitInputPixels: 20_000_000 });
    if (frame.focus) {
      const { left, top, width, height } = frame.focus;
      if (![left,top,width,height].every(Number.isInteger) || left < 0 || top < 0 || width < 1 || height < 1 || left + width > metadata.width || top + height > metadata.height) throw new Error('Focus rectangle must fit captured image pixels.');
      comparison = comparison.extract(frame.focus);
    }
    comparison = comparison.resize(96,96,{fit:'fill'});
    // Compare two composited backgrounds: alpha-only fades remain visible, while RGB changes
    // inside fully transparent pixels cannot fake scene progression.
    const dark = await comparison.clone().flatten({background:'#000000'}).toColourspace('srgb').raw().toBuffer();
    const light = await comparison.clone().flatten({background:'#ffffff'}).toColourspace('srgb').raw().toBuffer();
    const pixels = Buffer.concat([dark,light]);
    const label = `${index + 1}. ${frame.scene} / ${frame.label}`.slice(0,100);
    const footer = `${frame.viewport.width}x${frame.viewport.height} ${frame.direction} p=${frame.progress.toFixed(3)} t=${frame.atMs}ms`;
    const tile = await sharp(bytes, { limitInputPixels: 20_000_000 }).resize(440,280,{fit:'contain',background:'#181818'}).extend({bottom:50,background:'#181818'}).composite([{input:Buffer.from(`<svg width="440" height="50"><text x="8" y="18" fill="white" font-family="sans-serif" font-size="12">${xml(label)}</text><text x="8" y="38" fill="#ddd" font-family="sans-serif" font-size="11">${xml(footer)}</text></svg>`),left:0,top:280}]).webp({quality:85}).toBuffer();
    tiles.push(tile);
    captures.push({ ...frame, realFile:file, file:frame.file, sha256:hash(bytes), image:{width:metadata.width,height:metadata.height}, pixels });
  }
  const intervals = [];
  for (let i = 1; i < captures.length; i++) {
    const a = captures[i-1], b = captures[i];
    const crop = frame => frame.focus ? [frame.focus.left,frame.focus.top,frame.focus.width,frame.focus.height] : null;
    const comparable = a.scene === b.scene && a.direction === b.direction && a.viewport.width === b.viewport.width && a.viewport.height === b.viewport.height && a.image.width === b.image.width && a.image.height === b.image.height && JSON.stringify(crop(a)) === JSON.stringify(crop(b));
    if (!comparable) { intervals.push({from:i-1,to:i,status:'not-comparable'}); continue; }
    let difference = 0; for (let j=0;j<a.pixels.length;j++) difference += Math.abs(a.pixels[j]-b.pixels[j]);
    const meanDifference = difference/a.pixels.length;
    const stateComparable = a.renderedState != null && b.renderedState != null;
    const sameState = stateComparable && isDeepStrictEqual(a.renderedState,b.renderedState);
    const travelled = Math.abs(b.progress-a.progress) >= 0.02;
    const suspect = a.expectation === 'change' && travelled && (meanDifference <= 0.75 || sameState);
    intervals.push({from:i-1,to:i,status:a.expectation !== 'change' ? 'intentional-hold-review' : suspect ? 'suspected-unexpected-hold' : 'review-transition',meanPixelDifference:meanDifference,renderedStateSame:stateComparable?sameState:null});
  }
  await mkdir(output,{recursive:true});
  const actualOutput = await realpath(output);
  const targets = ['contact-sheet.webp','review.json'].map(file=>path.join(actualOutput,file));
  for (const target of targets) {
    if (identity(target) === identity(manifestPath) || captures.some(frame=>identity(frame.realFile) === identity(target))) throw new Error('Review output cannot overwrite source evidence.');
    try {
      const info=await lstat(target,{bigint:true});
      if(sourceIdentities.has(fileIdentity(info))) throw new Error('Review output has source-file identity; preserve captured evidence.');
      if (info.isSymbolicLink() || info.nlink > 1) throw new Error('Review output cannot replace a symbolic or hard link.');
      throw new Error('Review output already exists; choose a fresh round directory.');
    } catch(error) { if (error.code !== 'ENOENT') throw error; }
  }
  const columns = Math.min(3,tiles.length), rows=Math.ceil(tiles.length/columns);
  const sheet=await sharp({create:{width:columns*440,height:rows*330,channels:3,background:'#181818'}}).composite(tiles.map((input,i)=>({input,left:(i%columns)*440,top:Math.floor(i/columns)*330}))).webp({quality:85}).toBuffer();
  await writeFile(targets[0],sheet,{flag:'wx'});
  const report = {schemaVersion:1,captureContext:{url:manifest.url ?? null,build:manifest.build ?? null,captureMode:manifest.captureMode ?? null},manifestSha256:hash(manifestBytes),frames:captures.map(({pixels,realFile,...frame})=>frame),intervals,humanApproval:'pending',limitations:['Low-resolution pixel/state triage cannot certify dead scroll or aesthetics.','Only caller-supplied captures and metadata were checked; ambient motion may hide a stalled story.','Review intentional holds, reverse, mobile and reduced motion against the approved storyboard.']};
  await writeFile(targets[1],JSON.stringify(report,null,2)+'\n',{flag:'wx'});
  return report;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const get = flag => { const index=process.argv.indexOf(flag); if(index<0 || !process.argv[index+1]) throw new Error('Usage: creative:review -- --manifest CAPTURES.json --output REVIEW_DIRECTORY'); return process.argv[index+1]; };
    const report=await reviewCaptures(get('--manifest'),get('--output'));
    console.log(JSON.stringify({frames:report.frames.length,suspectedHolds:report.intervals.filter(item=>item.status==='suspected-unexpected-hold').length,humanApproval:report.humanApproval}));
  } catch(error) { console.error(error.message); process.exitCode=1; }
}

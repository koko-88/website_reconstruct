import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {pathToFileURL} from 'node:url';

export const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
export function inventory(root) {
  root = fs.realpathSync(root);
  const files = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, {withFileTypes:true}).sort((a,b) => a.name.localeCompare(b.name))) {
      const full = path.join(dir, entry.name);
      if (entry.isSymbolicLink()) { throw new Error('Evidence symlinks are unsupported: ' + full); }
      if (entry.isDirectory()) { walk(full); }
      else if (entry.isFile()) {
        const rel = path.relative(root, full).split(path.sep).join('/');
        if (rel === 'manifest.json') { continue; }
        const bytes = fs.readFileSync(full);
        files.push({path:rel, bytes:bytes.length, sha256:sha256(bytes)});
      } else { throw new Error('Unsupported evidence entry: ' + full); }
    }
  }
  walk(root);
  return files.sort((a,b) => a.path.localeCompare(b.path));
}
export function seal(root, metadata = {}) {
  if (fs.existsSync(path.join(root,'manifest.json'))) { throw new Error('Already sealed; choose a new revision'); }
  const manifest = {schemaVersion:2, sealedAtUTC:new Date().toISOString(), metadata, files:inventory(root)};
  fs.writeFileSync(path.join(root,'manifest.json'),JSON.stringify(manifest,null,2)+'\n',{flag:'wx'});
  return manifest;
}
function verifyManifest(actual,manifest,problems) {
  const byPath = new Map(actual.map(f => [f.path,f]));
  const seen = new Set();
  if (!Array.isArray(manifest.files)) { throw new Error('Manifest has no file list'); }
  for (const expected of manifest.files) {
    if (typeof expected.path !== 'string' || expected.path.includes('\\') || path.posix.isAbsolute(expected.path) || expected.path.split('/').some(p=>!p || p==='.' || p==='..')) {
      problems.push('Unsafe manifest path'); continue;
    }
    if (seen.has(expected.path)) { problems.push('Duplicate manifest path: '+expected.path); }
    seen.add(expected.path);
    const found = byPath.get(expected.path);
    if (!found || found.bytes !== expected.bytes || found.sha256 !== expected.sha256) { problems.push('Missing or changed: '+expected.path); }
  }
  for (const file of actual) { if (!seen.has(file.path)) { problems.push('Unlisted: '+file.path); } }
}
function verifyPNG(bytes) {
  if(bytes.length<45||!bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))||bytes.toString('ascii',12,16)!=='IHDR'||bytes.readUInt32BE(16)<1||bytes.readUInt32BE(20)<1||bytes.toString('ascii',bytes.length-8,bytes.length-4)!=='IEND') { throw new Error('Invalid/incomplete PNG'); }
}
function jpegDimensions(bytes,pos,marker) {
          if([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker)) { if(bytes.readUInt16BE(pos+3)<1||bytes.readUInt16BE(pos+5)<1){ throw new Error('Invalid JPEG size'); }return true; }
  return false;
}
function verifyJPEG(bytes) {
        if(bytes.length<4||bytes.readUInt16BE(0)!==0xffd8||bytes.readUInt16BE(bytes.length-2)!==0xffd9) { throw new Error('Invalid/incomplete JPEG'); }
        let pos=2,dimensions=false;
        while(pos<bytes.length-4) {
          if(bytes[pos++]!==255) { continue; }
          while(bytes[pos]===255){ pos++; }
          const marker=bytes[pos++];if(marker===0xda||marker===0xd9){ break; }
          const length=bytes.readUInt16BE(pos);if(length<2){ throw new Error('Invalid JPEG segment'); }
          if(jpegDimensions(bytes,pos,marker)) { dimensions=true;break; }
          pos+=length;
        }
        if(!dimensions){ throw new Error('JPEG dimensions not found'); }
}
function markdownDelimiters(text) {
  const size=text.length,stop=new Uint32Array(size+1),angle=new Uint32Array(size+1),quote=new Uint32Array(size+1),nonSpace=new Uint32Array(size+1);
  stop[size]=angle[size]=quote[size]=nonSpace[size]=size;
  for(let index=size-1;index>=0;index--) {
    const char=text[index],space=/\s/.test(char);
    stop[index]=space||char===')'?index:stop[index+1];
    angle[index]=char==='>'?index:angle[index+1];
    quote[index]=char==='"'?index:quote[index+1];
    nonSpace[index]=space?nonSpace[index+1]:index;
  }
  return {stop,angle,quote,nonSpace};
}
function markdownClose(text,index,delimiters) {
  if(text[index]===')') { return index; }
  const title=delimiters.nonSpace[index];
  if(title===index||text[title]!=='"') { return -1; }
  const end=delimiters.quote[title+1];
  return text[end+1]===')'?end+1:-1;
}
function* markdownTargets(text) {
  const delimiters=markdownDelimiters(text),labels=/!?\[[^\[\]]*\]\(/g;
  let match;
  while((match=labels.exec(text))!==null) {
    const start=match.index+match[0].length;
    let end=delimiters.stop[start],close=-1;
    if(text[start]==='<'&&delimiters.angle[start+1]>start+1&&delimiters.angle[start+1]<text.length) {
      end=delimiters.angle[start+1]+1;close=markdownClose(text,end,delimiters);
    }
    if(close<0) { end=delimiters.stop[start];close=end>start?markdownClose(text,end,delimiters):-1; }
    if(close<0) { continue; }
    yield text.slice(start,end).replace(/^<|>$/g,'');
    labels.lastIndex=close+1;
  }
}
function verifyLinks(bytes,filename,canonical,onLink) {
        for(const target of markdownTargets(bytes.toString('utf8'))) {
          if(/^[a-z][a-z0-9+.-]*:/i.test(target)||target.startsWith('#')){ continue; }
          const clean=decodeURIComponent(target.split('#')[0].split('?')[0]);
          const resolved=path.resolve(path.dirname(filename),clean);
          if(resolved!==canonical&&!resolved.startsWith(canonical+path.sep)) { throw new Error('Link outside package; carry/verify dependency separately: '+target); }
          if(!fs.existsSync(resolved)){ throw new Error('Missing link: '+target); }
          onLink();
        }
}

export function verify(root, manifest) {
  const problems = [];
  const actual = inventory(root);
  verifyManifest(actual,manifest,problems);
  const canonical=fs.realpathSync(root);
  let json=0,images=0,links=0;
  for(const file of actual) {
    const filename=path.join(canonical,...file.path.split('/')),bytes=fs.readFileSync(filename);
    try {
      if(file.path.endsWith('.json')) { JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/,''));json++; }
      if(file.path.endsWith('.png')) { verifyPNG(bytes);images++; }
      if(/\.jpe?g$/i.test(file.path)) { verifyJPEG(bytes);images++; }
      if(file.path.endsWith('.md')) { verifyLinks(bytes,filename,canonical,()=>links++); }
    } catch(error) { problems.push(file.path+': '+error.message); }
  }
  return {result:problems.length?'FAIL':'PASS',checkedAtUTC:new Date().toISOString(),files:actual.length,checks:{json,images,links},problems,limit:'Hashes/JSON/image structure/local links only; image decoding/visuals, source, semantic coverage, rights and readiness need separate review'};
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const [mode,root,manifestPath] = process.argv.slice(2);
    if (!root || !['snapshot','seal','verify'].includes(mode)) { throw new Error('Usage: node package.mjs snapshot|seal|verify ROOT [MANIFEST]'); }
    let result;
    if (mode==='snapshot') { result = {schemaVersion:2,files:inventory(root)}; }
    if (mode==='seal') { result = seal(root); }
    if (mode==='verify') { result = verify(root,JSON.parse(fs.readFileSync(manifestPath||path.join(root,'manifest.json'),'utf8').replace(/^\uFEFF/,''))); }
    console.log(JSON.stringify(result,null,2));
    if (result.result==='FAIL') { process.exitCode=1; }
  } catch (error) { console.error(error.message); process.exitCode=1; }
}

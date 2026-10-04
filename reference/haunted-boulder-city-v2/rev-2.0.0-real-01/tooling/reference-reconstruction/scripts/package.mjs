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
      if (entry.isSymbolicLink()) throw Error('Evidence symlinks are unsupported: ' + full);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile()) {
        const rel = path.relative(root, full).split(path.sep).join('/');
        if (rel === 'manifest.json') continue;
        const bytes = fs.readFileSync(full);
        files.push({path:rel, bytes:bytes.length, sha256:sha256(bytes)});
      } else throw Error('Unsupported evidence entry: ' + full);
    }
  }
  walk(root);
  return files.sort((a,b) => a.path.localeCompare(b.path));
}
export function seal(root, metadata = {}) {
  if (fs.existsSync(path.join(root,'manifest.json'))) throw Error('Already sealed; choose a new revision');
  const manifest = {schemaVersion:2, sealedAtUTC:new Date().toISOString(), metadata, files:inventory(root)};
  fs.writeFileSync(path.join(root,'manifest.json'),JSON.stringify(manifest,null,2)+'\n',{flag:'wx'});
  return manifest;
}
export function verify(root, manifest) {
  const problems = [];
  const actual = inventory(root);
  const byPath = new Map(actual.map(f => [f.path,f]));
  const seen = new Set();
  if (!Array.isArray(manifest.files)) throw Error('Manifest has no file list');
  for (const expected of manifest.files) {
    if (typeof expected.path !== 'string' || expected.path.includes('\\') || path.posix.isAbsolute(expected.path) || expected.path.split('/').some(p=>!p || p==='.' || p==='..')) {
      problems.push('Unsafe manifest path'); continue;
    }
    if (seen.has(expected.path)) problems.push('Duplicate manifest path: '+expected.path);
    seen.add(expected.path);
    const found = byPath.get(expected.path);
    if (!found || found.bytes !== expected.bytes || found.sha256 !== expected.sha256) problems.push('Missing or changed: '+expected.path);
  }
  for (const file of actual) if (!seen.has(file.path)) problems.push('Unlisted: '+file.path);
  const canonical=fs.realpathSync(root);
  let json=0,images=0,links=0;
  for(const file of actual) {
    const filename=path.join(canonical,...file.path.split('/')),bytes=fs.readFileSync(filename);
    try {
      if(file.path.endsWith('.json')) { JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/,''));json++; }
      if(file.path.endsWith('.png')) {
        if(bytes.length<45||!bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))||bytes.toString('ascii',12,16)!=='IHDR'||bytes.readUInt32BE(16)<1||bytes.readUInt32BE(20)<1||bytes.toString('ascii',bytes.length-8,bytes.length-4)!=='IEND') throw Error('Invalid/incomplete PNG');
        images++;
      }
      if(/\.jpe?g$/i.test(file.path)) {
        if(bytes.length<4||bytes.readUInt16BE(0)!==0xffd8||bytes.readUInt16BE(bytes.length-2)!==0xffd9) throw Error('Invalid/incomplete JPEG');
        let pos=2,dimensions=false;
        while(pos<bytes.length-4) {
          if(bytes[pos++]!==255) continue;
          while(bytes[pos]===255)pos++;
          const marker=bytes[pos++];if(marker===0xda||marker===0xd9)break;
          const length=bytes.readUInt16BE(pos);if(length<2)throw Error('Invalid JPEG segment');
          if([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker)) { if(bytes.readUInt16BE(pos+3)<1||bytes.readUInt16BE(pos+5)<1)throw Error('Invalid JPEG size');dimensions=true;break; }
          pos+=length;
        }
        if(!dimensions)throw Error('JPEG dimensions not found');images++;
      }
      if(file.path.endsWith('.md')) {
        for(const match of bytes.toString('utf8').matchAll(/!?\[[^\]]*\]\((<[^>]+>|[^)\s]+)(?:\s+"[^"]*")?\)/g)) {
          const target=match[1].replace(/^<|>$/g,'');
          if(/^[a-z][a-z0-9+.-]*:/i.test(target)||target.startsWith('#'))continue;
          const clean=decodeURIComponent(target.split('#')[0].split('?')[0]);
          const resolved=path.resolve(path.dirname(filename),clean);
          if(resolved!==canonical&&!resolved.startsWith(canonical+path.sep)) throw Error('Link outside package; carry/verify dependency separately: '+target);
          if(!fs.existsSync(resolved))throw Error('Missing link: '+target);
          links++;
        }
      }
    } catch(error) { problems.push(file.path+': '+error.message); }
  }
  return {result:problems.length?'FAIL':'PASS',checkedAtUTC:new Date().toISOString(),files:actual.length,checks:{json,images,links},problems,limit:'Hashes/JSON/image structure/local links only; image decoding/visuals, source, semantic coverage, rights and readiness need separate review'};
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const [mode,root,manifestPath] = process.argv.slice(2);
    if (!root || !['snapshot','seal','verify'].includes(mode)) throw Error('Usage: node package.mjs snapshot|seal|verify ROOT [MANIFEST]');
    let result;
    if (mode==='snapshot') result = {schemaVersion:2,files:inventory(root)};
    if (mode==='seal') result = seal(root);
    if (mode==='verify') result = verify(root,JSON.parse(fs.readFileSync(manifestPath||path.join(root,'manifest.json'),'utf8').replace(/^\uFEFF/,'')));
    console.log(JSON.stringify(result,null,2));
    if (result.result==='FAIL') process.exitCode=1;
  } catch (error) { console.error(error.message); process.exitCode=1; }
}

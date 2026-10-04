import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {sha256} from './package.mjs';

export function inspectSource(file, maxBytes=5_000_000) {
  const size=fs.statSync(file).size;
  if (size>maxBytes) return {file:path.basename(file),bytes:size,status:'not-inspected',reason:'Size budget exceeded; no negative finding'};
  const bytes=fs.readFileSync(file),text=bytes.toString('utf8');
  const refs=[...text.matchAll(/(?:\/\/[#@]|\/\*[#@])\s*sourceMappingURL\s*=\s*([^\s*]+)/g)].map(match=>match[1]);
  const folded=text.toLowerCase();
  const renderingSignals=['getContext','webgl','webgpu','OffscreenCanvas','transferControlToOffscreen','requestAdapter','Worker','three','pixi'].filter(token=>folded.includes(token.toLowerCase()));
  const result={file:path.basename(file),bytes:size,sha256:sha256(bytes),status:'inspected static bytes',sourceMapReferences:refs.slice(0,100).map(ref=>({kind:ref.startsWith('data:')?'inline':'external',reference:ref.startsWith('data:')?'inline map omitted; inspect decoded bytes separately':ref.split('?')[0].split('#')[0]})),referencesTruncated:refs.length>100,renderingSignals,signalScan:'Case-insensitive substring signals include comments and unrelated text; they do not prove runtime use',claimType:'observed text signals; runtime renderer/use remains inference or unknown',limits:['No fetch, execution, endpoint guessing or permission inference','Map reference query values/fragments omitted; original bytes retain directives','Absence of tokens does not exclude minified/worker/GPU rendering']};
  if (path.extname(file)==='.map') {
    try { const map=JSON.parse(text); Object.assign(result,{map:{version:map.version,fileFieldPresent:typeof map.file==='string',mappingsPresent:typeof map.mappings==='string',mappingsCharacters:typeof map.mappings==='string'?map.mappings.length:0,emptyMappings:typeof map.mappings==='string'?map.mappings.length===0:null,sourceRootPresent:typeof map.sourceRoot==='string',sourceCount:Array.isArray(map.sources)?map.sources.length:0,embeddedSourceCount:Array.isArray(map.sourcesContent)?map.sourcesContent.filter(s=>typeof s==='string').length:0,indexedSections:Array.isArray(map.sections)?map.sections.length:0,limit:'Valid structure/nonempty mappings do not establish bundle match or useful original-source correspondence'}}); }
    catch { result.map={status:'malformed JSON'}; }
  }
  return result;
}
if (process.argv[1] && import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    if (!process.argv[2]) throw Error('Usage: node source-report.mjs FILE [FILE ...] (local public/supplied artifacts only)');
    console.log(JSON.stringify({schemaVersion:2,inspectedAtUTC:new Date().toISOString(),tool:{name:'source-report.mjs',sha256:sha256(fs.readFileSync(fileURLToPath(import.meta.url)))},files:process.argv.slice(2).map(f=>inspectSource(f))},null,2));
  } catch(error) { console.error(error.message); process.exitCode=1; }
}

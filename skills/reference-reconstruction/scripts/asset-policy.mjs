import fs from 'node:fs';
import path from 'node:path';
import {sha256} from './package.mjs';

export const json = file => JSON.parse(fs.readFileSync(file,'utf8').replace(/^\uFEFF/,''));
export const assetKinds=['html','css','javascript','image','svg','font','video','audio','media','media-segment','gltf','wasm','shader','json','binary','unknown'];
export const idPattern=/^[A-Za-z0-9][A-Za-z0-9_-]{0,79}$/;
export function fields(value, names, label) {
  if(!value||typeof value!=='object'||Array.isArray(value)) { throw new Error(label+' must be an object'); }
  for(const name of Object.keys(value)) { if(!names.includes(name)) { throw new Error('Unknown '+label+' field: '+name); } }
}
export function text(value,label,max=2000) {
  if(typeof value!=='string'||!value.trim()||value.length>max) { throw new Error('Record '+label); }
  return value;
}
export function strings(value,label,max=10000) {
  if(!Array.isArray(value)||value.length>max||value.some(v=>typeof v!=='string'||!v.trim()||v.length>2000)) { throw new Error('Invalid '+label); }
  return value;
}
export function hash(value,label) { if(!/^[a-f0-9]{64}$/.test(value)) { throw new Error('Invalid '+label+' SHA256'); }return value; }
export function confined(root,relative) {
  if(typeof relative!=='string'||relative.includes('\\')||path.posix.isAbsolute(relative)||/^[a-z]:/i.test(relative)||relative.split('/').some(p=>!p||p==='.'||p==='..'||p.includes(':'))) { throw new Error('Unsafe supplied path'); }
  root=fs.realpathSync(root);
  let current=root;
  for(const part of relative.split('/')) {current=path.join(current,part);if(fs.lstatSync(current).isSymbolicLink()) { throw new Error('Supplied symlink unsupported'); }}
  const resolved=fs.realpathSync(current);
  if(!resolved.startsWith(root+path.sep)||!fs.statSync(resolved).isFile()) { throw new Error('Supplied path escapes root'); }
  return resolved;
}
export function checkURL(value,policy) {
  const u=new URL(value);
  if(!['https:','http:'].includes(u.protocol)||u.username||u.password||!policy.allowedOrigins.includes(u.origin)) { throw new Error('Asset URL outside authorized origins'); }
  for(const key of u.searchParams.keys()) { if(!policy.publicQueryKeys.includes(key)||/token|password|secret|signature|credential|auth|session/i.test(key)) { throw new Error('Unapproved/private asset query key'); } }
  u.hash='';
  return u.href;
}
export const limitsDefault={maxAssets:1000,maxAssetBytes:32000000,maxTotalBytes:256000000,maxDepth:8,requestTimeoutMs:20000,totalTimeoutMs:300000,maxSourceBytes:5000000,maxPixels:40000000};
export function policy(input) {
  fields(input,['authorization','allowedOrigins','publicQueryKeys','limits'],'asset policy');
  text(input.authorization,'asset acquisition authority');
  strings(input.allowedOrigins,'allowedOrigins',50);
  if(!input.allowedOrigins.length) { throw new Error('Record at least one authorized origin'); }
  for(const value of input.allowedOrigins) {const u=new URL(value);if(!['https:','http:'].includes(u.protocol)||u.origin!==value||u.username||u.password){ throw new Error('Origins must be exact HTTP(S) origins'); }}
  const publicQueryKeys=input.publicQueryKeys??[];strings(publicQueryKeys,'publicQueryKeys',100);
  const limits={...limitsDefault,...input.limits};
  fields(limits,Object.keys(limitsDefault),'limits');
  for(const [key,value] of Object.entries(limits)) { if(!Number.isInteger(value)||value<1||value>limitsDefault[key]*10) { throw new Error('Invalid '+key); } }
  return {...input,publicQueryKeys,limits};
}
function validateSource(source,checked,ids) {
    fields(source,['id','root','path','url','kind','mime','sha256','type'],'source');
    if(typeof source.id!=='string'||!idPattern.test(source.id)||ids.has(source.id)){ throw new Error('Invalid/duplicate source ID'); }ids.add(source.id);
    if(!['file','capture'].includes(source.type)){ throw new Error('Source type must be file or capture'); }
    text(source.root,'source root');
    if(source.type==='file') {confined(source.root,source.path);checkURL(source.url,checked.policy);if(source.kind){ text(source.kind,'source kind',100); }}
    if(source.kind&&!assetKinds.includes(source.kind)){ throw new Error('Unsupported asset kind'); }
    if(source.sha256){ hash(source.sha256,'source'); }

}

function validateSeed(seed,checked) {
    fields(seed,['url','kind','evidenceId','sha256'],'seed');
    checkURL(seed.url,checked.policy);text(seed.evidenceId,'seed evidence');
    if(seed.kind&&!assetKinds.includes(seed.kind)){ throw new Error('Unsupported asset kind'); }
    if(seed.sha256){ hash(seed.sha256,'seed'); }

}
export function validateAcquisition(input) {
  fields(input,['schemaVersion','packageId','contractId','sourceId','phase','policy','sources','seeds'],'asset plan');
  if(input.schemaVersion!==1) { throw new Error('Expected asset plan schema 1'); }
  for(const key of ['packageId','contractId','sourceId']) { if(typeof input[key]!=='string'||!idPattern.test(input[key])){ throw new Error('Invalid '+key); } }
  text(input.phase,'requested phase',100);
  const checked={...input,policy:policy(input.policy),sources:input.sources??[],seeds:input.seeds??[]};
  if(!Array.isArray(checked.sources)||checked.sources.length>1000||!Array.isArray(checked.seeds)||checked.seeds.length>1000) { throw new Error('Invalid asset inputs'); }
  const ids=new Set();
  for(const source of checked.sources){validateSource(source,checked,ids);}
  for(const seed of checked.seeds){validateSeed(seed,checked);}
  return checked;
}
export function newOutput(out,sourceRoots=[]) {
  out=path.resolve(out);
  if(fs.existsSync(out)){ throw new Error('Output exists; use a new revision'); }
  const parent=fs.realpathSync(path.dirname(out));
  out=path.join(parent,path.basename(out));
  for(const root of sourceRoots.map(r=>fs.realpathSync(r))) { if(out===root||out.startsWith(root+path.sep)){ throw new Error('Output cannot be inside input evidence'); } }
  fs.mkdirSync(out);
  return out;
}
export function writeJSON(out,name,value) {fs.writeFileSync(path.join(out,name),JSON.stringify(value,null,2)+'\n',{flag:'wx'});}
export const identity = value => {try {const u=new URL(value);u.hash='';return u.href;}catch{return 'invalid:'+sha256(Buffer.from(String(value)));}};

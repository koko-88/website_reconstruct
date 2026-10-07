import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {nextSpecKitRecoveryBatch,recordSpecKitRecoveryBatch,completeSpecKitRecoveryRound,writeSpecKitRecoveryCandidate} from '../../../../node_modules/.cache/prodshape-recovery-bridge.mjs';
import {openRepository,adapterRepo,loadRecoverySession,resolveLead} from '../../../../node_modules/.cache/prodshape-recovery-bridge.mjs';
const root=process.cwd(), sid='hbc-canonical-product';
const dir=path.join(root,'.specify/productshape/recovery-inputs',sid);
const mode=process.argv[2], n=Number(process.argv[3]);
if(mode==='inspect'){
 const {session,batch}=await nextSpecKitRecoveryBatch(root,sid,28);
 await fs.writeFile(path.join(dir,'active-batch.json'),JSON.stringify(batch,null,2));
 let receipt=[],views=[];
 for(const s of batch.sources??batch.items??batch){
  const rel=s.path??s.locator; const buf=await fs.readFile(path.join(root,rel));
  const ext=path.extname(rel).toLowerCase();
  const r={id:s.id,path:rel,bytes:buf.length,sha256:crypto.createHash('sha256').update(buf).digest('hex')};
  if(['.png','.jpg','.jpeg','.webp','.gif'].includes(ext)){r.kind='image';}
  else if(['.woff','.woff2','.ttf','.mp4','.webm'].includes(ext)){r.kind='binary';}
  else {r.kind='text';let t=buf.toString('utf8'); r.lines=t.split('\n').length;
   if(ext==='.json') {try{const j=JSON.parse(t);r.keys=Object.keys(j);t=JSON.stringify(j,null,2);}catch{r.parseError=true;}}
   // Whole sources are loaded only for this batch. Compact excerpts retain observations and terminal outcomes.
   const lines=t.split('\n'); const max=rel.startsWith('skills/')?12:140;
   if(lines.length<=max)t=lines.join('\n');
   else {const selected=new Set([...Array(Math.min(14,lines.length)).keys(),...Array.from({length:Math.min(12,lines.length)},(_,i)=>lines.length-1-i)]);
    const terms=/observation|finding|result|verdict|assert|mismatch|expected|actual|reduced|motion|focus|faq|runtime|visible|phase|duration|state|story|asset|missing|fallback|error|warning|status|menu|dialog|contradict|source|scroll|viewport/i;
    for(let i=0;i<lines.length&&selected.size<max;i++)if(terms.test(lines[i])){selected.add(i);if(i+1<lines.length)selected.add(i+1);}
    t=[...selected].sort((a,b)=>a-b).map(i=>`${i+1}: ${lines[i]}`).join('\n');}
   views.push({id:s.id,path:rel,lines:r.lines,excerpt:t});
  }
  receipt.push(r);
 }
 await fs.writeFile(path.join(dir,`inspection-${n}.json`),JSON.stringify(receipt,null,2));
 await fs.writeFile(path.join(dir,'active-views.json'),JSON.stringify(views,null,2));
 console.log(JSON.stringify({batch:batch.map(s=>({id:s.id,path:s.path.replace('reference/haunted-boulder-city-v2/rev-2.0.0-real-01/','')})),views:views.map(v=>({id:v.id,lines:v.lines,excerpt:v.excerpt.slice(0,relLimit(v.path))}))}));
}
function relLimit(p){return p.startsWith('skills/')?220:2000;}
if(mode==='save'){
 const payload=JSON.parse(await fs.readFile(path.join(dir,`continuation-${n}.json`),'utf8'));
 const proposed=path.join(root,'.specify/productshape/recoveries',sid,'product/proposed');
 const byId=new Map();
 async function walk(p){for(const f of await fs.readdir(p,{withFileTypes:true})){const full=path.join(p,f.name);if(f.isDirectory())await walk(full);else if(f.name.endsWith('.md')){const t=await fs.readFile(full,'utf8');const id=t.match(/^id: (.+)$/m)?.[1];if(id)byId.set(id,{full,t});}}}await walk(proposed);
 for(const [id,c] of byId){const related=payload.findings.filter(f=>f.artifacts?.includes(id));if(!related.length)continue;
 const header=`## Continuation batch ${n} evidence reconciliation`;if(c.t.includes(header))throw Error('Batch already reconciled');
 const notes=related.map(f=>`- ${f.source}: ${f.note}`).join('\n');
 await writeSpecKitRecoveryCandidate(root,sid,path.relative(proposed,c.full).replaceAll('\\','/'),c.t+`\n${header}\n\n${notes}\n`);
 }
 await recordSpecKitRecoveryBatch(root,sid,payload);
 for(const r of payload.leadResolutions??[]){const repo=adapterRepo(await openRepository(root));await resolveLead(repo,await loadRecoverySession(repo,sid),r.id,r.resolution);}
 const result=await completeSpecKitRecoveryRound(root,sid,28);
 console.log(JSON.stringify({evidence:result.coverage.evidence,issues:result.issues,outcome:result.outcome}));
 await fs.writeFile(path.join(dir,`checkpoint-${n}.json`),JSON.stringify({batch:n,coverage:result.coverage,issues:result.issues,outcome:result.outcome},null,2));
 await fs.rm(path.join(dir,'active-batch.json'),{force:true});
 await fs.rm(path.join(dir,'active-views.json'),{force:true});
 await fs.rm(path.join(dir,'active-output.json'),{force:true});
 for(const f of await fs.readdir(dir))if(f.startsWith(`sheet-${n}-`))await fs.rm(path.join(dir,f));
 for(const f of await fs.readdir(dir))if(f.startsWith('review-E-'))await fs.rm(path.join(dir,f));
}

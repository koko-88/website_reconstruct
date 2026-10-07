import fs from 'node:fs/promises';import path from 'node:path';import crypto from 'node:crypto';
const d='.specify/productshape/recovery-inputs/hbc-canonical-product', b=JSON.parse(await fs.readFile(`${d}/active-batch.json`,'utf8'));
for(const s of b.filter(s=>s.path.endsWith('.json'))){const j=JSON.parse(await fs.readFile(s.path,'utf8'));if(!j.screenshot)continue;
const paired=b.find(x=>x.path===path.posix.join(path.posix.dirname(s.path),j.screenshot.path));let match='pair outside current batch; not read';if(paired)match=crypto.createHash('sha256').update(await fs.readFile(paired.path)).digest('hex')===j.screenshot.sha256;
console.log(JSON.stringify({id:s.id,phase:j.phase,requested:j.requestedPhase,pair:paired?.id,hashMatch:match,changed:j.captureChanged,readiness:j.readiness?.status,after:j.after?.status,width:j.screenshot.width,height:j.screenshot.height,actions:j.actionsThroughCheckpoint}));}

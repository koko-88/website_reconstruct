import fs from 'node:fs/promises';
const d='.specify/productshape/recovery-inputs/hbc-canonical-product';
const n=Number(process.argv[2]), config=JSON.parse(await fs.readFile(`${d}/decision-${n}.json`,'utf8'));
const batch=JSON.parse(await fs.readFile(`${d}/active-batch.json`,'utf8'));
const findings=batch.map(s=>{
 const f=config.items?.[s.id]??config.groups?.find(g=>Number(s.id.slice(2))>=g.from&&Number(s.id.slice(2))<=g.to)?.finding??config.defaults;
 if(!f)throw Error('No reviewed finding: '+s.id);
 return {source:s.id,...f,complete:true};
});
await fs.writeFile(`${d}/continuation-${n}.json`,JSON.stringify({...config,defaults:undefined,items:undefined,groups:undefined,findings},null,2));

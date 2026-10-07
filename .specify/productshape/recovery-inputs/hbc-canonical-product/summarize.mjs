import fs from 'node:fs/promises';
const d='.specify/productshape/recovery-inputs/hbc-canonical-product';
const batch=JSON.parse(await fs.readFile(`${d}/active-batch.json`,'utf8'));
function unwrap(o){if(Array.isArray(o))return o.map(unwrap);if(o&&typeof o==='object'){let q={};for(const[k,v]of Object.entries(o))q[k]=unwrap(v);return q;}if(typeof o==='string'&&o.includes('```json')){try{return JSON.parse(o.split('```json')[1].split('```')[0]);}catch{}}return o;}
function compact(o,depth=0){if(o==null||typeof o!=='object')return typeof o==='string'&&o.length>400?o.slice(0,400)+' [truncated]':o;
 if(Array.isArray(o)){if(o.length>28)return {length:o.length,head:o.slice(0,8).map(x=>compact(x,depth+1)),tail:o.slice(-3).map(x=>compact(x,depth+1))};return o.map(x=>compact(x,depth+1));}
 let r={};for(const[k,v]of Object.entries(o)){
 if(['style','styles'].includes(k)){r[k]=v;continue;}
 if(k==='elements'){r[k]=v.map(e=>({selector:e.selector,matches:e.matches?.map(m=>({class:m.class,rect:m.rect,display:m.style?.display,position:m.style?.position,font:m.style?.fontFamily,size:m.style?.fontSize,transform:m.style?.transform}))}));continue;}
 if(k==='assets'){r[k]=v.map(a=>({tag:a.tag,src:a.src,alt:a.alt,natural:a.natural,readyState:a.readyState,duration:a.duration}));continue;}
 r[k]=compact(v,depth+1);
 }return r;}
for(const s of batch.filter(s=>s.path.endsWith('.json')&&(!process.argv[2]||process.argv.slice(2).includes(s.id)))){
 const j=unwrap(JSON.parse(await fs.readFile(s.path,'utf8')));
 const out=compact(j);console.log(s.id+' '+s.path.split('/').at(-1)+' '+JSON.stringify(out));
}

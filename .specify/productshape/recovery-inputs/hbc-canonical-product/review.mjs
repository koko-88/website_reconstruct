import fs from 'node:fs/promises';
const d='.specify/productshape/recovery-inputs/hbc-canonical-product', batch=JSON.parse(await fs.readFile(`${d}/active-batch.json`,'utf8'));
function unwrap(o){if(Array.isArray(o))return o.map(unwrap);if(o&&typeof o==='object')return Object.fromEntries(Object.entries(o).map(([k,v])=>[k,unwrap(v)]));if(typeof o==='string'&&o.includes('```json')){try{return unwrap(JSON.parse(o.split('```json')[1].split('```')[0]));}catch{}}return o;}
function scan(o,p='',out=[]){if(!o||typeof o!=='object')return out;
 if(o.selector&&o.matches)out.push({selector:o.selector,matches:o.matches.map(m=>({rect:m.rect,display:m.style?.display,position:m.style?.position,font:m.style?.fontFamily,size:m.style?.fontSize}))});
 if(o.action)out.push({action:o.action,state:o.state});
 for(const[k,v]of Object.entries(o)){
 if(['log','elements','matches'].includes(k)&&Array.isArray(v)){for(let i=0;i<v.length;i++)scan(v[i],p+'/'+k+'/'+i,out);continue;}
 if(/^(environment|env|initial|readiness|ready|fonts|font|gate|result|status|verdict|summary|issues|problems|errors|warnings|failure|reason|canonicalAssessment|qualifiedId|details|afterAdditionalMs|additionalMs|queries|sourceFindings|observations|reduced|touch|keys|open|note|notes)$/.test(k)&&(!v||typeof v!=='object'))out.push({p:p+'/'+k,v});
 else if(['environment','env','initial','readiness'].includes(k))out.push({[k]:v});
 else if(k==='details'&&Array.isArray(v))out.push({details:v});
 else if(k==='text'&&typeof v==='string'&&!v.includes('```'))out.push({text:v.slice(0,600)});
 else if(k==='source'&&typeof v==='string')out.push({sourceCharacters:v.length,sections:v.split('\n').filter(l=>/^\s*(\/\/|function |const .*Media|.*addEventListener)/.test(l)).slice(0,35)});
 else if(k==='css'&&Array.isArray(v))out.push({cssCharacters:v.join('').length,media:v.join('').match(/@media[^{}]+/g)});
 else if(typeof v==='object')scan(v,p+'/'+k,out);
 }return out;}
for(const s of batch.filter(s=>s.path.endsWith('.json')&&(!process.argv[2]||process.argv.slice(2).includes(s.id)))){
const j=unwrap(JSON.parse(await fs.readFile(s.path,'utf8')));const v=scan(j);await fs.writeFile(`${d}/review-${s.id}.json`,JSON.stringify(v,null,2));console.log(s.id+' '+s.path.split('/').at(-1)+' '+JSON.stringify(v).slice(0,Number(process.env.REVIEW_LIMIT||3500)));
}

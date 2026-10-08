import fs from 'node:fs';
import vm from 'node:vm';
import {policy,checkURL} from './asset-policy.mjs';
import {kindFor,discover} from './asset-discovery.mjs';
import parseSrcset from 'parse-srcset';
import {sha256} from './package.mjs';

const source=fs.readFileSync(new URL('./asset-probe.js',import.meta.url),'utf8');
const probe=vm.runInNewContext('('+source+'\n)');
export const assetProbeSHA256=sha256(Buffer.from(source));
export function validateDiscovery(input) {return policy(input);}
export function observeAssets(context,input,caseId) {
  const p=policy(input),network=[],checkpoints=[],omissions=[],max=p.limits.maxAssets;
  const safe=value=>{try {return checkURL(value,p);}catch {return null;}};
  const onResponse=response=>{
    const request=response.request(),url=safe(response.url());
    if(!url){if(omissions.length<max)omissions.push({identitySHA256:sha256(Buffer.from(response.url())),reason:'outside asset acquisition boundary'});return;}
    if(network.length>=max){if(!omissions.some(o=>o.reason==='network-budget'))omissions.push({reason:'network-budget'});return;}
    const headers=response.headers(),mime=headers['content-type']||'',kind=kindFor(url,mime);
    const assetResponse=kind!=='unknown'&&!(kind==='json'&&['xhr','fetch'].includes(request.resourceType())&&!/\.(json|webmanifest)$/i.test(new URL(url).pathname));
    network.push({url,kind:kindFor(url,mime),via:'runtime-response',evidenceId:caseId,detail:{status:response.status(),method:request.method(),resourceType:request.resourceType(),mime,fromServiceWorker:response.fromServiceWorker(),contentLength:headers['content-length']||null},acquire:request.method()==='GET'&&response.status()===200&&assetResponse});
  };
  context.on('response',onResponse);
  return {
    note(reason){omissions.push({reason});},
    async checkpoint(page,evidenceId,environmentId,state) {
      const frames=[];
      for(const frame of page.frames()) {
        if(!safe(frame.url())){frames.push({status:'uninspected',reason:'frame outside asset boundary'});continue;}
        if(frames.length>=20){omissions.push({reason:'frame-budget'});break;}
        try {
          const result=await frame.evaluate(probe,{maxNodes:Math.min(10000,max*3),maxReferences:Math.min(10000,max)});
          const refs=[];
          for(const ref of [...result.references,...result.resources]) {
            if(ref.cssValue){const parsed=discover(Buffer.from('x{a:'+ref.cssValue+'}'),'css',ref.baseURL,p.limits.maxSourceBytes);for(const item of parsed.references)refs.push({...item,via:ref.via,detail:{...item.detail,...ref.detail}});if(parsed.limits.length)omissions.push({reason:'computed-style parse limit',limits:parsed.limits});}
            else if(ref.srcset) {for(const variant of parseSrcset(ref.srcset))refs.push({url:new URL(variant.url,ref.baseURL).href,kind:'image',via:ref.via,detail:{...ref.detail,variant}});}
            else refs.push(ref);
          }
          const filtered=[];
          for(const ref of refs) {
            const url=safe(ref.url);
            if(url)filtered.push({...ref,url,evidenceId,environmentId,state,acquire:ref.via!=='resource-timing'});
            else if(ref.url?.startsWith('data:')&&ref.url.length<=p.limits.maxAssetBytes*2)filtered.push({...ref,evidenceId,environmentId,state,acquire:true});
            else if(omissions.length<max)omissions.push({identitySHA256:sha256(Buffer.from(ref.url||'')),reason:'opaque/private/out-of-scope reference'});
          }
          frames.push({...result,pageURL:safe(result.pageURL),baseURL:safe(result.baseURL),references:filtered,resources:undefined,surfaces:result.surfaces.map(s=>({...s,source:s.source?safe(s.source):undefined})),evidenceId,environmentId,state});
        }catch{frames.push({status:'uninspected',reason:'frame probe failed',evidenceId,environmentId,state});}
      }
      checkpoints.push({evidenceId,environmentId,state,frames});
    },
    finish() {context.off('response',onResponse);return {schemaVersion:1,caseId,policy:p,probeSHA256:assetProbeSHA256,network,checkpoints,omissions,limits:['Bounded observed runtime paths only','Anonymous acquisition is a later response, not captured-byte identity','Response bodies, cookies and storage are not exported','Service-worker/worker/internal/generated assets require focused review']};}
  };
}

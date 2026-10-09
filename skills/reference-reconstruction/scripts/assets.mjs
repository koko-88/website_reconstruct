import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
import {validateAcquisition,checkURL,confined,newOutput,writeJSON,json,identity,text,strings,fields,hash,idPattern} from './asset-policy.mjs';
import {sha256,seal,verify} from './package.mjs';
import {discover,kindFor} from './asset-discovery.mjs';
import {verifyAsset} from './asset-verify.mjs';

export async function fetchAsset(url,p,budget,signal) {
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),p.limits.requestTimeoutMs);
  const abort=()=>controller.abort();signal?.addEventListener('abort',abort,{once:true});
  let current=checkURL(url,p),response;
  const redirects=[];
  try {
    if(signal?.aborted)throw Error('Acquisition deadline');
    for(let index=0;index<=5;index++){
      response=await fetch(current,{method:'GET',redirect:'manual',signal:controller.signal,credentials:'omit',headers:{'Accept-Encoding':'identity'}});
      if([301,302,303,307,308].includes(response.status)){
        await response.body?.cancel();
        if(index===5)throw Error('Redirect budget');
        const location=response.headers.get('location');if(!location)throw Error('Redirect without Location');
        const next=checkURL(new URL(location,current).href,p);redirects.push({from:current,to:next,status:response.status});current=next;continue;
      }
      break;
    }
    if(response.status!==200){await response.body?.cancel();throw Error('Asset HTTP status '+response.status);}
    if(response.headers.has('content-range')){await response.body?.cancel();throw Error('Partial response is not an original asset');}
    const length=response.headers.get('content-length');
    if(length!==null&&(!/^\d+$/.test(length)||Number(length)>Math.min(p.limits.maxAssetBytes,budget.remaining))){await response.body?.cancel();throw Error('Asset Content-Length budget');}
    const chunks=[];let bytes=0;
    for await(const chunk of response.body){
      bytes+=chunk.length;budget.remaining-=chunk.length;
      if(bytes>p.limits.maxAssetBytes||budget.remaining<0){controller.abort();throw Error('Asset/total byte budget');}
      chunks.push(chunk);
    }
    const body=Buffer.concat(chunks);
    if(!body.length)throw Error('Empty response');
    if(length!==null&&!response.headers.get('content-encoding')&&body.length!==Number(length))throw Error('Content-Length mismatch');
    return {bytes:body,mime:response.headers.get('content-type')||'',acquisition:{method:'anonymous GET',originalURL:url,finalURL:current,redirects,acquiredAtUTC:new Date().toISOString(),status:response.status,etag:response.headers.get('etag'),lastModified:response.headers.get('last-modified'),versionIdentity:'later live response; review against designated reference'}};
  }finally{clearTimeout(timer);signal?.removeEventListener('abort',abort);controller.abort();}
}
function embedded(value,maxBytes) {
  const comma=value.indexOf(',');if(comma<0)throw Error('Invalid data URL');
  const header=value.slice(5,comma),body=value.slice(comma+1);
  if(body.length>maxBytes*4)throw Error('Embedded byte budget');
  const base64=/(?:^|;)base64$/i.test(header);
  if(base64&&!/^[a-z0-9+/]*={0,2}$/i.test(body.replace(/\s/g,'')))throw Error('Malformed embedded base64');
  const bytes=base64?Buffer.from(body,'base64'):Buffer.from(decodeURIComponent(body));
  if(!bytes.length||bytes.length>maxBytes)throw Error('Embedded byte budget');
  return {bytes,mime:header.split(';')[0]||'text/plain'};
}
export async function acquireAssets(planInput,out) {
  const plan=validateAcquisition(planInput),p=plan.policy,start=Date.now(),deadline=start+p.limits.totalTimeoutMs;
  const inputs=[],supplied=new Map(),initial=[],runtime=[],issues=[];let suppliedInputBytes=0;
  for(const source of plan.sources) {
    if(source.type==='file'){
      const file=confined(source.root,source.path);
      suppliedInputBytes+=fs.statSync(file).size;
      if(suppliedInputBytes>p.limits.maxTotalBytes)throw Error('Supplied input total byte budget');
      if(fs.statSync(file).size>p.limits.maxAssetBytes)throw Error('Supplied asset byte budget');
      const bytes=fs.readFileSync(file);
      if(bytes.length>p.limits.maxAssetBytes)throw Error('Supplied asset byte budget');
      const actual=sha256(bytes);if(source.sha256&&actual!==source.sha256)throw Error('Supplied source hash mismatch');
      const url=checkURL(source.url,p);if(supplied.has(url))throw Error('Duplicate supplied URL; choose version authority');
      supplied.set(url,{bytes,mime:source.mime||'',acquisition:{method:'supplied original bytes',inputId:source.id,path:source.path,sha256:actual,versionIdentity:'supplied source; review designated version'}});
      inputs.push({id:source.id,type:'file',path:source.path,url,sha256:actual});
      initial.push({url,kind:source.kind||kindFor(url,source.mime),via:'supplied-file',evidenceId:source.id,acquire:true});
    }else{
      const manifest=json(confined(source.root,'manifest.json')),result=verify(source.root,manifest);
      if(result.result!=='PASS')throw Error('Capture input integrity failed');
      const run=json(confined(source.root,'run.json'));
      if(run.provenance?.contractId!==plan.contractId||run.provenance?.sourceId!==plan.sourceId)throw Error('Capture source/contract mismatch');
      const observationsFile=confined(source.root,'asset-observations.json');
      if(fs.statSync(observationsFile).size>p.limits.maxTotalBytes)throw Error('Observation input budget');
      const bytes=fs.readFileSync(observationsFile);
      if(bytes.length>p.limits.maxTotalBytes)throw Error('Observation input budget');
      if(source.sha256&&sha256(bytes)!==source.sha256)throw Error('Capture observations hash mismatch');
      const observations=JSON.parse(bytes);
      if(observations.schemaVersion!==1||!Array.isArray(observations.cases))throw Error('Invalid asset observations');
      inputs.push({id:source.id,type:'capture',manifestSHA256:sha256(fs.readFileSync(path.join(source.root,'manifest.json'))),observationsSHA256:sha256(bytes),captureResult:run.result});
      runtime.push({inputId:source.id,...observations});
      for(const item of observations.cases) {
        for(const ref of item.network||[])initial.push({...ref,evidenceId:ref.evidenceId||item.caseId});
        for(const checkpoint of item.checkpoints||[])for(const frame of checkpoint.frames||[])for(const ref of frame.references||[])initial.push(ref);
        if(item.omissions?.length)issues.push({inputId:source.id,reason:'runtime omissions require scoped review',omissions:item.omissions});
      }
    }
  }
  if(!initial.length&&!plan.seeds.length)throw Error('No asset discovery inputs; an empty inventory cannot prove completeness');
  for(const seed of plan.seeds)initial.push({...seed,via:'explicit-public-seed',acquire:true});
  out=newOutput(out,plan.sources.map(s=>s.root));
  fs.mkdirSync(path.join(out,'blobs'));
  const rows=new Map(),queue=[],budget={remaining:p.limits.maxTotalBytes},controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),p.limits.totalTimeoutMs);
  function add(ref,parent=null,depth=0) {
    let url,inline;
    try {
      if(typeof ref.url!=='string'||ref.url.length>p.limits.maxAssetBytes*4)throw Error('Reference budget');
      if(ref.url.startsWith('data:')){inline=embedded(ref.url,p.limits.maxAssetBytes);url='data:sha256:'+sha256(inline.bytes)+':base:'+sha256(Buffer.from(ref.baseURL||parent?.referenceBaseURL||parent?.acquisition?.finalURL||parent?.url||'')).slice(0,16);}
      else url=checkURL(ref.url,p);
    }catch{issues.push({reason:'unacquirable/unauthorized reference',identitySHA256:sha256(Buffer.from(ref.url||'')),parentId:parent?.id||null,evidenceId:ref.evidenceId||null});return;}
    let row=rows.get(url);
    if(!row){
      if(rows.size>=p.limits.maxAssets){if(!issues.some(i=>i.reason==='asset-count-budget'))issues.push({reason:'asset-count-budget'});return;}
      row={id:'A-'+sha256(Buffer.from(url)).slice(0,20),url,kind:ref.kind&&ref.kind!=='unknown'?ref.kind:kindFor(url,inline?.mime),mime:inline?.mime||'',referenceBaseURL:ref.baseURL||parent?.referenceBaseURL||parent?.acquisition?.finalURL||parent?.url||url,occurrences:[],dependencies:[],status:'not-acquired'};
      rows.set(url,row);
    }
    if(row.kind==='unknown'&&ref.kind&&ref.kind!=='unknown')row.kind=ref.kind;
    const occurrence={via:ref.via||'reference',evidenceId:ref.evidenceId||parent?.id||null,environmentId:ref.environmentId||null,state:ref.state||null,detail:ref.detail||{},fragment:(()=>{try{return new URL(ref.url).hash;}catch{return '';}})()};
    if(row.occurrences.length<1000)row.occurrences.push(occurrence);else issues.push({reason:'occurrence-budget',assetId:row.id});
    if(parent&&!parent.dependencies.includes(row.id))parent.dependencies.push(row.id);
    if(ref.sha256){if(row.expectedSHA256&&row.expectedSHA256!==ref.sha256)issues.push({reason:'conflicting expected hashes',assetId:row.id});row.expectedSHA256=ref.sha256;}
    if(ref.acquire!==false&&row.status==='not-acquired'){
      row.status='pending';queue.push({row,inline,depth});
    }
    return row;
  }
  for(const ref of initial)add(ref);
  try {
    while(queue.length){
      const {row,inline,depth}=queue.shift();
      if(controller.signal.aborted||Date.now()>=deadline){row.status='unavailable';row.reason='Total acquisition deadline';continue;}
      if(depth>p.limits.maxDepth){row.status='unavailable';row.reason='Dependency depth budget';continue;}
      try {
        let acquired;
        if(inline)acquired={...inline,acquisition:{method:'embedded original bytes',versionIdentity:'embedded in supplied/observed source; original rendering use needs evidence'}};
        else if(supplied.has(row.url))acquired=supplied.get(row.url);
        else acquired=await fetchAsset(row.url,p,budget,controller.signal);
        if(inline||supplied.has(row.url)){budget.remaining-=acquired.bytes.length;if(budget.remaining<0)throw Error('Total byte budget');}
        const digest=sha256(acquired.bytes);
        if(row.expectedSHA256&&digest!==row.expectedSHA256)throw Error('Reference byte identity mismatch');
        const local='blobs/'+digest+'.bin';
        if(!fs.existsSync(path.join(out,local)))fs.writeFileSync(path.join(out,local),acquired.bytes,{flag:'wx'});
        Object.assign(row,{status:'acquired',file:local,bytes:acquired.bytes.length,sha256:digest,mime:acquired.mime,acquisition:acquired.acquisition});
        const detected=kindFor(row.url,row.mime);
        if(row.kind==='unknown'||row.kind==='media'||(row.kind==='image'&&detected==='svg')||(['video','audio'].includes(row.kind)&&detected==='media'))row.kind=detected;
        let parsed;
        if(row.kind==='gltf'&&acquired.bytes.subarray(0,4).toString()==='glTF'){
          const {NodeIO}=await import('@gltf-transform/core');
          const doc=await new NodeIO().binaryToJSON(new Uint8Array(acquired.bytes));
          parsed=discover(Buffer.from(JSON.stringify(doc.json)),'gltf',acquired.acquisition.finalURL||row.referenceBaseURL||row.url,p.limits.maxSourceBytes);
          row.embeddedGLB=true;
        }else parsed=discover(acquired.bytes,row.kind,acquired.acquisition.finalURL||row.referenceBaseURL||row.url,p.limits.maxSourceBytes);
        row.discovery={limits:parsed.limits};
        row.dependencyReferences=[];
        for(const ref of parsed.references){
          const dependency=add(ref,row,depth+1);
          if(dependency)row.dependencyReferences.push({id:dependency.id,url:dependency.url,via:ref.via});
        }
      }catch(error){row.status='unavailable';row.reason=error.message.replace(/https?:\/\/\S+/g,'[URL omitted]').slice(0,300);}
    }
    for(const row of rows.values()){
      if(row.status!=='acquired')continue;
      if(controller.signal.aborted||Date.now()>=deadline){row.verification={status:'unverified',reason:'Total acquisition deadline'};continue;}
      const resources={};
      if(row.kind==='gltf'){
        // NodeIO is given only acquired bytes. External URLs/files are never resolved by it.
        const ownBytes=fs.readFileSync(path.join(out,row.file));
        const {NodeIO}=await import('@gltf-transform/core');
        const doc=row.embeddedGLB?await new NodeIO().binaryToJSON(new Uint8Array(ownBytes)):{json:JSON.parse(ownBytes.toString()),resources:{}};
        for(const entry of [...(doc.json.buffers||[]),...(doc.json.images||[])]){
          if(!entry.uri)continue;
          let target;
          if(entry.uri.startsWith('data:')){const bytes=embedded(entry.uri,p.limits.maxAssetBytes).bytes;target=[...rows.values()].find(r=>r.sha256===sha256(bytes));}
          else target=rows.get(identity(new URL(entry.uri,row.acquisition.finalURL||row.url).href));
          if(target?.status==='acquired')resources[entry.uri]=path.join(out,target.file);
        }
      }
      row.verification=await verifyAsset(path.join(out,row.file),row.kind,row.mime,{...p.limits,requestTimeoutMs:Math.min(p.limits.requestTimeoutMs,Math.max(1,deadline-Date.now()))},resources);
      const bufferUse=row.occurrences.find(o=>o.via==='gltf-buffer'&&Number.isInteger(o.detail.byteLength));
      if(row.kind==='binary'&&bufferUse)row.verification=row.bytes===bufferUse.detail.byteLength?{status:'verified',verifier:'glTF buffer declaration',level:'Declared buffer byte length; parent scene validation separate',sha256:row.sha256}:{status:'failed',reason:'glTF buffer byte length mismatch'};
    }
  }catch(error){issues.push({reason:'acquisition processing failed: '+error.message.slice(0,200)});}
  finally{clearTimeout(timer);controller.abort();}
  const assets=[...rows.values()],result=assets.length&&!issues.length&&assets.every(a=>a.status==='acquired'&&a.verification?.status==='verified'&&!a.discovery?.limits.length)?'ACQUIRED':'INCOMPLETE';
  writeJSON(out,'plan.json',{...plan,sources:plan.sources.map(({root,...source})=>source)});
  writeJSON(out,'inputs.json',inputs);
  writeJSON(out,'runtime-observations.json',runtime);
  writeJSON(out,'asset-run.json',{schemaVersion:1,packageId:plan.packageId,contractId:plan.contractId,sourceId:plan.sourceId,phase:plan.phase,result,startedAtUTC:new Date(start).toISOString(),completedAtUTC:new Date().toISOString(),tool:{name:'assets.mjs',sha256:sha256(fs.readFileSync(fileURLToPath(import.meta.url))),node:process.version,helpers:Object.fromEntries(['asset-policy.mjs','asset-discovery.mjs','asset-verify.mjs','asset-probe.js','asset-observer.mjs','package.mjs'].map(name=>[name,sha256(fs.readFileSync(new URL(name,import.meta.url)))])),dependencyLockSHA256:sha256(fs.readFileSync(new URL('../package-lock.json',import.meta.url)))},assets,issues,limits:['Acquisition status is not completeness, fidelity clearance, rights or adoption','Anonymous responses require version identity review','Format verification does not prove visual/codec/GPU parity']});
  seal(out,{kind:'asset-acquisition-run',packageId:plan.packageId,result});
  return {out,result,assets:assets.length,issues:issues.length};
}
export function loadRun(root) {
  const manifestPath=confined(root,'manifest.json'),manifest=json(manifestPath),integrity=verify(root,manifest);
  if(integrity.result!=='PASS')throw Error('Asset run integrity failed');
  const run=json(confined(root,'asset-run.json'));
  if(run.schemaVersion!==1||!Array.isArray(run.assets))throw Error('Invalid asset run');
  for(const key of ['packageId','contractId','sourceId'])if(typeof run[key]!=='string'||!idPattern.test(run[key]))throw Error('Invalid asset run '+key);
  text(run.phase,'asset run phase',100);
  for(const row of run.assets)if(typeof row.url!=='string'||identity(row.url)!==row.url)throw Error('Invalid asset URL identity');
  for(const row of run.assets)if(row.file){
    const bytes=fs.readFileSync(confined(root,row.file));
    if(sha256(bytes)!==row.sha256||bytes.length!==row.bytes)throw Error('Asset pin mismatch');
  }
  return {run,manifestSHA256:sha256(fs.readFileSync(manifestPath)),integrity};
}
export function assessAssets(root,review) {
  const loaded=loadRun(root),run=loaded.run;
  fields(review,['schemaVersion','contractId','sourceId','phase','assetRunManifestSHA256','coverage','obligations','dispositions','issueResolutions','verifications','assessor'],'asset review');
  for(const key of ['contractId','sourceId'])if(typeof review[key]!=='string'||!idPattern.test(review[key]))throw Error('Invalid review '+key);
  text(review.phase,'review phase',100);
  if(review.schemaVersion!==1||review.contractId!==run.contractId||review.sourceId!==run.sourceId||review.phase!==run.phase||review.assetRunManifestSHA256!==loaded.manifestSHA256)throw Error('Review scope/revision mismatch');
  text(review.assessor,'assessor');
  for(const name of ['coverage','obligations','dispositions','issueResolutions'])if(!Array.isArray(review[name]))throw Error('Expected review '+name);
  const external=new Map();
  for(const record of review.verifications||[]){
    fields(record,['url','sha256','result','tool','level','evidenceIds','authority'],'external verification');
    hash(record.sha256,'external verification');text(record.tool,'external verifier');text(record.level,'external verification level');text(record.authority,'external verification authority');strings(record.evidenceIds,'external verification evidence');
    if(record.result!=='PASS'||!record.evidenceIds.length||external.has(identity(record.url)))throw Error('Invalid/duplicate external verification');external.set(identity(record.url),record);
  }
  const effective=asset=>{if(!asset)return null;const record=external.get(asset.url);if(record&&record.sha256===asset.sha256&&asset.verification?.status==='unverified')return {status:'verified',verifier:record.tool,level:record.level,evidenceIds:record.evidenceIds,sha256:record.sha256};return asset.verification;};
  const blockers=[],mapping=[],byURL=new Map(run.assets.map(a=>[a.url,a])),byID=new Map(run.assets.map(a=>[a.id,a])),coverageIDs=new Set(),obligationIDs=new Set();
  if(!review.coverage.length||!review.obligations.length)blockers.push('No explicit coverage/asset obligations');
  const supported=values=>Array.isArray(values)&&values.length&&values.every(v=>typeof v==='string'&&v.trim());
  const authority=value=>typeof value==='string'&&value.trim();
  const dependencyComplete=(asset,seen=new Set())=>{
    if(!asset||asset.status!=='acquired'||effective(asset)?.status!=='verified')return false;
    if(seen.has(asset.id))return true;seen.add(asset.id);
    return asset.dependencies.every(id=>dependencyComplete(byID.get(id),seen));
  };
  for(const row of review.coverage){
    if(typeof row.id!=='string'||!row.id.trim()||coverageIDs.has(row.id))throw Error('Duplicate/missing coverage ID');coverageIDs.add(row.id);
    if(!['complete','excluded'].includes(row.disposition)||!supported(row.evidenceIds)||!authority(row.route)||!authority(row.state)||!authority(row.environmentId))blockers.push('Unresolved coverage: '+row.id);
    if(row.disposition==='excluded'&&(!authority(row.authority)||!authority(row.reason)))blockers.push('Unapproved coverage exclusion: '+row.id);
    if(!Array.isArray(row.surfaces)||!row.surfaces.length||row.surfaces.some(s=>!['complete','not-required','excluded'].includes(s.disposition)||!authority(s.kind)||!supported(s.evidenceIds)||!authority(s.reason)||(s.disposition!=='complete'&&!authority(s.authority))))blockers.push('Unreviewed rendering/discovery surfaces: '+row.id);
  }
  for(const item of review.obligations){
    if(typeof item.id!=='string'||!item.id.trim()||obligationIDs.has(item.id))throw Error('Duplicate/missing obligation ID');obligationIDs.add(item.id);
    if(!supported(item.coverageIds)||item.coverageIds.some(id=>!coverageIDs.has(id)))blockers.push('Missing coverage linkage: '+item.id);
    if(!supported(item.evidenceIds)||!authority(item.authority))blockers.push('Missing obligation authority/evidence: '+item.id);
    if(['excluded','none'].includes(item.mode)){
      if(!authority(item.reason))blockers.push('Unexplained asset disposition: '+item.id);
      continue;
    }
    if(!['original','replacement'].includes(item.mode)){blockers.push('Pending asset decision: '+item.id);continue;}
    const urls=item.mode==='replacement'?[item.replacement?.url]:item.urls;
    if(!supported(urls)){blockers.push('Missing asset binding: '+item.id);continue;}
    if(item.mode==='replacement'&&(!authority(item.replacement.authority)||!supported(item.replacement.fidelityEvidenceIds)))blockers.push('Unapproved/unverified replacement: '+item.id);
    if(!authority(item.slot))blockers.push('Missing implementation slot: '+item.id);
    if(item.sourceMatch?.status!=='confirmed'||!supported(item.sourceMatch.evidenceIds))blockers.push('Unconfirmed reference version: '+item.id);
    if(!['PASS','NOT REQUIRED'].includes(item.reuse?.result)||!authority(item.reuse?.authority)||!authority(item.reuse?.reason)||item.reuse?.phase!==run.phase)blockers.push('Unresolved phase-specific reuse: '+item.id);
    for(const url of urls){
      const asset=byURL.get(identity(url));
      if(!dependencyComplete(asset))blockers.push('Unavailable/unverified dependency closure: '+item.id);
      if(asset?.file)mapping.push({obligationId:item.id,coverageIds:item.coverageIds,slot:item.slot,mode:item.mode,url:asset.url,file:asset.file,sha256:asset.sha256,bytes:asset.bytes,kind:asset.kind,mime:asset.mime,metadata:asset.verification?.metadata,verification:effective(asset),occurrences:asset.occurrences,dependencies:asset.dependencies,reuse:item.reuse,sourceMatch:item.sourceMatch});
      if(item.expected&&asset?.verification?.metadata){
        for(const [name,value]of Object.entries(item.expected))if(asset.verification.metadata[name]!==value)blockers.push('Asset metadata mismatch: '+item.id+'/'+name);
      }
    }
  }
  for(const row of review.coverage)if(row.disposition==='complete'&&!review.obligations.some(o=>o.coverageIds?.includes(row.id)))blockers.push('Coverage without asset disposition: '+row.id);
  const reaches=(id,target,seen=new Set())=>{if(id===target)return true;if(seen.has(id))return false;seen.add(id);return byID.get(id)?.dependencies.some(child=>reaches(child,target,seen))||false;};
  const dispositions=new Map();
  for(const item of review.dispositions){
    const url=identity(item.url);
    if(dispositions.has(url)||!byURL.has(url))throw Error('Duplicate/unknown asset disposition');
    dispositions.set(url,item);
    if(!['required','source-only','excluded','not-required','allowed-unknown'].includes(item.mode)||!supported(item.evidenceIds)||!authority(item.authority)||!authority(item.reason))blockers.push('Unreviewed candidate: '+url);
    if(item.mode==='required'&&(!supported(item.obligationIds)||item.obligationIds.some(id=>!obligationIDs.has(id))))blockers.push('Unlinked required candidate: '+url);
    if(item.mode==='required'&&!mapping.some(m=>item.obligationIds?.includes(m.obligationId)&&(m.url===url||reaches(byURL.get(m.url)?.id,byURL.get(url)?.id))))blockers.push('Required candidate is not bound to implementation: '+url);
  }
  for(const asset of run.assets){
    if(mapping.some(m=>m.url===asset.url)&&dispositions.get(asset.url)?.mode!=='required')blockers.push('Implementation asset not classified required: '+asset.id);
    if(!dispositions.has(asset.url))blockers.push('Undispositioned asset: '+asset.id);
    if(asset.discovery?.limits.length&&!review.issueResolutions.some(r=>r.assetId===asset.id&&authority(r.authority)&&authority(r.reason)&&supported(r.evidenceIds)))blockers.push('Unresolved source discovery limits: '+asset.id);
  }
  if(run.issues.length&&!review.issueResolutions.some(r=>r.runIssues===true&&authority(r.authority)&&authority(r.reason)&&supported(r.evidenceIds)))blockers.push('Unresolved runtime/acquisition omissions');
  return {schemaVersion:1,result:blockers.length?'BLOCKED':'PASS',contractId:run.contractId,sourceId:run.sourceId,phase:run.phase,assetRunManifestSHA256:loaded.manifestSHA256,assessedAtUTC:new Date().toISOString(),assessor:review.assessor,blockers:[...new Set(blockers)],mapping,coverage:review.coverage,limits:['Scoped asset availability/completeness input only; existing integrity/fidelity/adaptation/reuse gates still apply','Review declarations require cited human/source evidence; this tool cannot authenticate authority','No retroactive changes to frozen reference gates']};
}
export function handoffAssets(root,review,out) {
  const assessment=assessAssets(root,review);
  out=newOutput(out,[root]);fs.mkdirSync(path.join(out,'blobs'));
  const needed=new Set(),{run}=loadRun(root),byID=new Map(run.assets.map(a=>[a.id,a]));
  function include(asset){if(!asset||needed.has(asset.id))return;needed.add(asset.id);for(const id of asset.dependencies)include(byID.get(id));}
  for(const item of assessment.mapping)include(run.assets.find(a=>a.url===item.url));
  for(const id of needed){const row=byID.get(id);if(row.file&&!fs.existsSync(path.join(out,row.file)))fs.copyFileSync(confined(root,row.file),path.join(out,row.file),fs.constants.COPYFILE_EXCL);}
  writeJSON(out,'asset-review.json',review);writeJSON(out,'asset-assessment.json',assessment);
  writeJSON(out,'implementation-assets.json',{schemaVersion:1,result:assessment.result,contractId:assessment.contractId,sourceId:assessment.sourceId,phase:assessment.phase,assetRunManifestSHA256:assessment.assetRunManifestSHA256,mapping:assessment.mapping,dependencies:run.assets.filter(a=>needed.has(a.id)),blockers:assessment.blockers,instructions:'Verify manifest and per-file hashes on receipt. Preserve original bytes; transformations/rewrites are derived implementation work. Resolve CSS/SVG/glTF relative dependencies through this URL-to-local map. Paths are relative to this handoff. PASS does not replace the four readiness gates.'});
  seal(out,{kind:'implementation-asset-handoff',result:assessment.result});
  return {out,result:assessment.result,blockers:assessment.blockers};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
  try{
    const [mode,input,reviewOrOut,out]=process.argv.slice(2);
    let result;
    if(mode==='acquire'&&input&&reviewOrOut)result=await acquireAssets(json(input),reviewOrOut);
    else if(mode==='assess'&&input&&reviewOrOut)result=assessAssets(input,json(reviewOrOut));
    else if(mode==='handoff'&&input&&reviewOrOut&&out)result=handoffAssets(input,json(reviewOrOut),out);
    else if(mode==='verify'&&input)result=loadRun(input);
    else throw Error('Usage: assets.mjs acquire PLAN NEW_OUT | assess RUN REVIEW | handoff RUN REVIEW NEW_OUT | verify RUN');
    console.log(JSON.stringify(result,null,2));if(['INCOMPLETE','BLOCKED'].includes(result.result))process.exitCode=1;
  }catch(error){console.error(error.message);process.exitCode=1;}
}

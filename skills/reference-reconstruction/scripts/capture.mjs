import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import os from 'node:os';
import {createRequire} from 'node:module';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {policy as assetPolicy} from './asset-policy.mjs';
import {seal,sha256} from './package.mjs';
import {appearancePolicy,probeOptions,waitAppearance,postAppearanceReasons,visualSample} from './settled-appearance.mjs';

const here=path.dirname(fileURLToPath(import.meta.url));
const probeSource=fs.readFileSync(path.join(here,'page-probe.js'),'utf8');
const probe=vm.runInNewContext('('+probeSource+'\n)');
const identifier=/^[A-Za-z0-9][A-Za-z0-9_-]{0,79}$/;
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
export async function bounded(promise,ms,label) {
  let timer;
  try { return await Promise.race([promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error(label+' deadline exceeded')),ms);})]); }
  finally { clearTimeout(timer); }
}
function keys(value,allowed,label) {
  if (!value || typeof value!=='object' || Array.isArray(value)) throw Error(label+' must be an object');
  for(const key of Object.keys(value)) if(!allowed.includes(key)) throw Error('Unknown '+label+' field: '+key);
}
function integer(value,min,max,label) { if(!Number.isInteger(value)||value<min||value>max) throw Error('Invalid '+label); }
function id(value,label) { if(typeof value!=='string'||!identifier.test(value)) throw Error('Invalid '+label); }
function strings(value,label,max=100) { if(!Array.isArray(value)||value.length>max||value.some(s=>typeof s!=='string'||!s||s.length>500)) throw Error('Invalid '+label); }
export function validatePlan(plan) {
  keys(plan,['schemaVersion','packageId','contractId','sourceId','authorization','allowedOrigins','publicQueryKeys','environments','cases','totalTimeoutMs','browserChannel','assetDiscovery'],'plan');
  if(plan.schemaVersion!==2) throw Error('Expected capture schema 2');
  if(plan.assetDiscovery!==undefined)assetPolicy(plan.assetDiscovery);
  if(plan.browserChannel!==undefined&&!['chrome','msedge','chromium'].includes(plan.browserChannel)) throw Error('Unsupported browser channel');
  for(const field of ['packageId','contractId','sourceId']) id(plan[field],field);
  if(typeof plan.authorization!=='string'||!plan.authorization.trim()||plan.authorization.length>2000) throw Error('Record capture authorization');
  strings(plan.allowedOrigins,'allowedOrigins',20);
  plan.publicQueryKeys ??= [];
  strings(plan.publicQueryKeys,'publicQueryKeys');
  for(const origin of plan.allowedOrigins) { const u=new URL(origin); if(!['https:','http:'].includes(u.protocol)||u.origin!==origin||u.username||u.password) throw Error('Origins must be exact HTTP(S) origins'); }
  const url=value=> {
    const u=new URL(value);
    if(!plan.allowedOrigins.includes(u.origin)||u.username||u.password) throw Error('Navigation outside authorized origins');
    for(const name of u.searchParams.keys()) if(!plan.publicQueryKeys.includes(name)||/token|password|secret|signature|credential/i.test(name)) throw Error('Unapproved/private URL query key');
    return u.href;
  };
  plan.totalTimeoutMs ??= 180000;
  integer(plan.totalTimeoutMs,1000,600000,'totalTimeoutMs');
  if(!Array.isArray(plan.environments)||!plan.environments.length||plan.environments.length>20) throw Error('Expected 1-20 environments');
  const envIDs=new Set();
  for(const env of plan.environments) {
    keys(env,['id','viewport','deviceScaleFactor','isMobile','hasTouch','locale','timezoneId','colorScheme','reducedMotion','fixture','session','consent'],'environment');
    id(env.id,'environment id');
    if(envIDs.has(env.id)) throw Error('Duplicate environment'); envIDs.add(env.id);
    keys(env.viewport,['width','height'],'viewport');
    for(const axis of ['width','height']) integer(env.viewport[axis],200,8000,'viewport '+axis);
    env.deviceScaleFactor ??= 1;
    if(typeof env.deviceScaleFactor!=='number'||env.deviceScaleFactor<1||env.deviceScaleFactor>4) throw Error('Invalid DPR');
    for(const field of ['isMobile','hasTouch']) { env[field]??=false; if(typeof env[field]!=='boolean') throw Error('Invalid '+field); }
    env.locale??='en-US'; env.timezoneId??='UTC'; env.colorScheme??='light'; env.reducedMotion??='no-preference';
    if(!['light','dark','no-preference'].includes(env.colorScheme)||!['reduce','no-preference'].includes(env.reducedMotion)) throw Error('Invalid preferences');
    for(const field of ['locale','timezoneId','fixture','session','consent']) if(typeof env[field]!=='string'||!env[field].trim()||env[field].length>500) throw Error('Record environment '+field);
  }
  const actions=list=> {
    if(!Array.isArray(list)||list.length>100) throw Error('Invalid actions');
    for(const action of list) {
      keys(action,['kind','selector','key','x','y','maxSteps','step','budgetMs','authority'],'action');
      if(!['scroll','scrollTo','sweep','click','hover','press'].includes(action.kind)) throw Error('Unsupported action');
      if(['click','hover','scrollTo'].includes(action.kind) && (typeof action.selector!=='string'||!action.selector||action.selector.length>500)) throw Error('Expected selector');
      if(['click','press'].includes(action.kind) && (typeof action.authority!=='string'||!action.authority.trim())) throw Error('Record reversible action authority');
      if(action.kind==='press'&&!['Tab','Shift+Tab','Escape','Enter','Space','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(action.key)) throw Error('Unsupported key');
      if(action.kind==='scroll') { integer(action.x??0,0,1_000_000,'scroll x'); integer(action.y,0,1_000_000,'scroll y'); }
      if(action.kind==='sweep') { integer(action.maxSteps,1,100,'sweep steps'); integer(action.step,100,8000,'sweep step'); integer(action.budgetMs,100,30000,'sweep budget'); }
    }
  };
  if(!Array.isArray(plan.cases)||!plan.cases.length||plan.cases.length>100) throw Error('Expected 1-100 cases');
  const caseIDs=new Set();
  for(const item of plan.cases) {
    keys(item,['id','environmentId','url','state','reset','actions','checkpoints'],'case'); id(item.id,'case id');
    if(caseIDs.has(item.id)) throw Error('Duplicate case'); caseIDs.add(item.id);
    if(!envIDs.has(item.environmentId)) throw Error('Unknown environment'); url(item.url);
    if(item.reset!=='fresh-context') throw Error('Runner supports fresh-context reset only');
    if(typeof item.state!=='string'||!item.state.trim()) throw Error('Expected named state');
    item.actions??=[]; actions(item.actions);
    if(!Array.isArray(item.checkpoints)||!item.checkpoints.length||item.checkpoints.length>100) throw Error('Expected 1-100 checkpoints');
    const cpIDs=new Set();
    for(const cp of item.checkpoints) {
      keys(cp,['id','phase','afterMs','required','absent','stableSelectors','timeoutMs','fullPage','actions','appearance'],'checkpoint'); id(cp.id,'checkpoint id');
      if(cpIDs.has(cp.id)) throw Error('Duplicate checkpoint'); cpIDs.add(cp.id);
      if(!['settled','transient'].includes(cp.phase)) throw Error('Phase must be settled or transient');
      cp.afterMs??=0; cp.timeoutMs??=10000; cp.fullPage??=false;
      integer(cp.afterMs,0,30000,'afterMs'); integer(cp.timeoutMs,100,30000,'readiness timeout');
      if(typeof cp.fullPage!=='boolean') throw Error('fullPage must be boolean');
      for(const name of ['required','absent','stableSelectors']) { cp[name]??=[]; strings(cp[name],name); }
      if(cp.phase==='settled'&&!cp.stableSelectors.length) throw Error('Settled capture needs explicit stable geometry selectors');
      appearancePolicy(cp);
      cp.actions??=[]; actions(cp.actions);
    }
  }
  return {plan,checkURL:url};
}
export function readyReasons(snapshot) {
  const r=snapshot.readiness,reasons=[];
  if(!['interactive','complete'].includes(r.documentState)) reasons.push('document');
  if(r.fonts!=='loaded') reasons.push('fonts:'+r.fonts);
  for(const s of r.required) if(!s.visible) reasons.push('required:'+s.selector);
  for(const s of r.absent) if(s.visible) reasons.push('visible-blocker:'+s.selector);
  for(const s of r.geometry) if(!s.count||s.truncated) reasons.push('geometry:'+s.selector);
  if(r.truncated) reasons.push('visible-image-budget');
  for(const image of r.images) if(!image.complete||image.naturalWidth===0||image.decode!=='ok') reasons.push('image:'+image.source.path+':'+image.decode);
  return reasons;
}
export const geometrySignature = snapshot => JSON.stringify(snapshot.readiness.geometry.map(s=>({selector:s.selector,count:s.count,rects:s.rects.map(r=>Object.fromEntries(Object.entries(r).map(([k,v])=>[k,Math.round(v*2)/2])))})));
export async function waitReady(page,cp) {
  return waitAppearance(page,cp,probe,readyReasons,geometrySignature);
}
async function perform(page,actions,log) {
  for(const action of actions) {
    const start=new Date().toISOString();
    if(action.kind==='click') await page.locator(action.selector).click();
    if(action.kind==='hover') await page.locator(action.selector).hover();
    if(action.kind==='press') await page.keyboard.press(action.key);
    if(action.kind==='scrollTo') await page.locator(action.selector).scrollIntoViewIfNeeded();
    if(action.kind==='scroll') await page.evaluate(({x,y})=>window.scrollTo({left:x,top:y,behavior:'instant'}),{x:action.x||0,y:action.y});
    const samples=[];
    if(action.kind==='sweep') {
      const deadline=Date.now()+action.budgetMs;
      let reachedBottom=false;
      for(let index=0;index<action.maxSteps && Date.now()<deadline;index++) {
        const state=await bounded(page.evaluate(y=>{window.scrollTo({top:y,behavior:'instant'});return {y:scrollY,height:document.documentElement.scrollHeight,viewport:innerHeight,time:performance.now()};},index*action.step),Math.max(1,deadline-Date.now()),'sweep');
        samples.push(state);
        if(state.y+state.viewport>=state.height-1) { reachedBottom=true;break; }
        await sleep(Math.min(100,Math.max(0,deadline-Date.now())));
      }
      await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
      log.push({action,start,samples,truncated:!reachedBottom,end:new Date().toISOString()});
    } else log.push({action,start,end:new Date().toISOString()});
  }
}
export async function capture(planInput,out,modulePath) {
  const {plan,checkURL}=validatePlan(structuredClone(planInput));
  let assetModule;
  if(plan.assetDiscovery){assetModule=await import('./asset-observer.mjs');assetModule.validateDiscovery(plan.assetDiscovery);}
  out=path.resolve(out);
  // An existing/frozen output is never reused. Atomic leaf creation also prevents concurrent reuse.
  if(fs.existsSync(out)) throw Error('Output exists; use a new revision');
  const require=createRequire(import.meta.url);
  const playwright=require(modulePath?path.resolve(modulePath):'playwright');
  const version=require(modulePath?path.join(path.resolve(modulePath),'package.json'):'playwright/package.json').version;
  fs.mkdirSync(out);
  const write=(rel,data)=>fs.writeFileSync(path.join(out,rel),typeof data==='string'||Buffer.isBuffer(data)?data:JSON.stringify(data,null,2)+'\n',{flag:'wx'});
  write('plan.json',plan);
  const runnerSHA256=sha256(fs.readFileSync(fileURLToPath(import.meta.url)));
  const provenance={schemaVersion:2,packageId:plan.packageId,contractId:plan.contractId,sourceId:plan.sourceId,playwrightVersion:version,runnerSHA256,probeSHA256:sha256(probeSource),appearancePolicySHA256:sha256(fs.readFileSync(path.join(here,'settled-appearance.mjs'))),planSHA256:sha256(fs.readFileSync(path.join(out,'plan.json'))),hostOS:{platform:os.platform(),release:os.release(),version:os.version(),architecture:os.arch()},headless:true,modifications:['Fresh browser context per case','Main-frame navigation guard via routing; HTTP cache disabled by interception','No source style/content/animation changes'],limits:['No auth/storage import','No physical-device/AT/browser-zoom/GPU parity claim','Same plan does not freeze live content, randomness or ambient frames']};
  let browser,timer,timedOut=false;
  const cases=[],errors=[],assetCases=[];
  try {
    browser=await playwright.chromium.launch({headless:true,timeout:30000,chromiumSandbox:true,...(plan.browserChannel?{channel:plan.browserChannel}:{})});
    provenance.browserChannel=plan.browserChannel||'Playwright bundled Chromium';
    provenance.browserVersion=browser.version();
    timer=setTimeout(()=>{timedOut=true;void browser.close();},plan.totalTimeoutMs);
    for(const item of plan.cases) {
      if(timedOut) throw Error('Total capture deadline exceeded');
      const env=plan.environments.find(e=>e.id===item.environmentId);
      const {id:envID,fixture,session,consent,...contextOptions}=env;
      const context=await browser.newContext({...contextOptions,acceptDownloads:false});
      const row={caseId:item.id,environmentId:envID,state:item.state,fixture,session,consent,reset:item.reset,actions:[],captures:[],network:[]};
      cases.push(row);
      const assetObserver=assetModule?assetModule.observeAssets(context,plan.assetDiscovery,item.id):null;
      try {
        const page=await context.newPage();
        page.setDefaultTimeout(10000);page.setDefaultNavigationTimeout(20000);
        page.on('dialog',dialog=>{row.actions.push({unexpectedDialog:dialog.type(),disposition:'dismissed, message omitted'});void dialog.dismiss();});
        page.on('response',response=>{
          if(row.network.length>=500) { row.networkTruncated=true;return; }
          const u=new URL(response.url());
          row.network.push({origin:u.origin,path:u.pathname,queryKeys:[...u.searchParams.keys()],status:response.status(),resourceType:response.request().resourceType()});
        });
        await context.route('**/*',route=> {
          const request=route.request();
          if(request.isNavigationRequest() && request.frame()===page.mainFrame()) {
            try { checkURL(request.url()); }
            catch { row.actions.push({blockedNavigation:'outside contract/public URL boundary'});return route.abort(); }
          }
          return route.continue();
        });
        const navigationStarted=Date.now();row.navigationStartedUTC=new Date(navigationStarted).toISOString();
        await page.goto(item.url,{waitUntil:'commit'});checkURL(page.url());
        await perform(page,item.actions,row.actions);
        for(const cp of item.checkpoints) {
          if(timedOut) throw Error('Total capture deadline exceeded');
          await perform(page,cp.actions,row.actions);
          await sleep(Math.max(0,navigationStarted+cp.afterMs-Date.now()));
          let readiness;
          if(cp.phase==='settled') readiness=await waitReady(page,cp);
          else readiness={status:'transient',snapshot:await bounded(page.evaluate(probe,probeOptions(cp)),cp.timeoutMs,'transient probe'),reasons:[],appearance:{state:'transient',why:'Requested temporal checkpoint; no convergence claim',policy:appearancePolicy(cp),limits:['No settled appearance claim']},elapsedMs:Date.now()-navigationStarted};
          const prefix=item.id+'--'+cp.id,record={evidenceId:prefix,sourceId:plan.sourceId,contractId:plan.contractId,caseId:item.id,checkpointId:cp.id,environmentId:envID,requestedPhase:cp.phase,phase:readiness.status,readiness,actionsThroughCheckpoint:row.actions.length,provenance};
          record.actualPublicURLBefore=checkURL(page.url());
          const before=readiness.snapshot;
          const pixels=before?(cp.fullPage?before.environment.scroll.width*before.environment.scroll.height:env.viewport.width*env.viewport.height)*env.deviceScaleFactor**2:Infinity;
          try {
          if(!before) {record.phase='unsettled';record.screenshotError='No observable snapshot';record.readiness.reasons.push('capture-snapshot-unavailable');errors.push(prefix+': no observable snapshot');}
          else if(pixels>30_000_000) { record.screenshotError='Pixel budget exceeded; use section captures';errors.push(prefix+': screenshot pixel budget');if(cp.phase==='settled'){record.phase='unsettled';record.readiness.reasons.push('capture-pixel-budget-exceeded');} }
          else {
            record.screenshotStartedUTC=new Date().toISOString();
            const bytes=await page.screenshot({type:'png',fullPage:cp.fullPage,animations:'allow',caret:'initial',timeout:10000});
            record.screenshotEndedUTC=new Date().toISOString();
            write(prefix+'.png',bytes);record.screenshot={path:prefix+'.png',bytes:bytes.length,sha256:sha256(bytes),width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20),format:'png',fullPage:cp.fullPage,animations:'allow',caret:'initial'};
            record.after=await bounded(page.evaluate(probe,{...probeOptions(cp),decodeMs:500}),3000,'post-capture probe');
            record.captureChanged=geometrySignature(before)!==geometrySignature(record.after);
            const appearanceChanged=cp.phase==='settled'?postAppearanceReasons(before,record.after,cp):[];
            const policy=appearancePolicy(cp);
            if(cp.phase==='settled'&&policy.visual&&policy.mode==='appearance'&&readiness.appearance.convergence.visual) {
              record.postVisual=await visualSample(page,record.after,policy,3000);
              if(record.postVisual.sha256!==readiness.appearance.convergence.visual.sha256) appearanceChanged.push('visual-changed-during-screenshot');
            }
            record.appearanceChanged=appearanceChanged.length>0;
            if(appearanceChanged.length) {record.phase='unsettled';record.readiness.reasons.push(...appearanceChanged.map(r=>'post-capture:'+r));}
            if(cp.phase==='settled'&&record.captureChanged) { record.phase='unsettled';record.readiness.reasons.push('geometry-changed-during-screenshot'); }
            if(cp.phase==='settled'&&readyReasons(record.after).length) { record.phase='unsettled';record.readiness.reasons.push(...readyReasons(record.after).map(reason=>'post-capture:'+reason)); }
          }
          record.actualPublicURLAfter=checkURL(page.url());
          } catch(error) {
            record.phase='unsettled';record.screenshotError=error.message;
            record.readiness.reasons.push('capture-operation-failed');errors.push(prefix+': '+error.message);
          }
          if(cp.phase==='settled'&&record.phase!=='settled') { record.readiness.appearance.state='unresolved';record.readiness.appearance.convergence.pass=false;record.readiness.appearance.why='Readiness or capture verification unresolved'; }
          if(cp.phase==='settled'&&record.phase!=='settled') errors.push(prefix+': '+record.readiness.reasons.join(', '));
          if(assetObserver){try{await bounded(assetObserver.checkpoint(page,prefix,envID,item.state),Math.min(cp.timeoutMs,10000),'asset checkpoint');}catch{assetObserver.note('asset checkpoint failed/timed out: '+prefix);errors.push(prefix+': asset checkpoint unavailable');}}
          write(prefix+'.json',record);row.captures.push({evidenceId:prefix,path:prefix+'.json',phase:record.phase});
        }
      } catch(error) { row.error=error.message;errors.push(item.id+': '+error.message); }
      finally { if(assetObserver)assetCases.push(assetObserver.finish());await context.close(); }
    }
  } catch(error) { errors.push(error.message); }
  finally { clearTimeout(timer);if(browser) await browser.close(); }
  if(timedOut) errors.push('Total capture deadline exceeded');
  write('run.json',{schemaVersion:2,result:errors.length?'INCOMPLETE':'CAPTURED',cases,errors,provenance,limits:'Raw capture status only; semantic coverage, reports, gates and asset decisions require inspection'});
  if(assetModule)write('asset-observations.json',{schemaVersion:1,sourceId:plan.sourceId,contractId:plan.contractId,probeSHA256:assetModule.assetProbeSHA256,cases:assetCases});
  seal(out,{packageId:plan.packageId,kind:'raw-capture-run',result:errors.length?'INCOMPLETE':'CAPTURED'});
  return {out,result:errors.length?'INCOMPLETE':'CAPTURED',cases:cases.length,errors};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const [planPath,out,modulePath]=process.argv.slice(2);
    if(!planPath||!out) throw Error('Usage: node capture.mjs PLAN.json NEW_OUTPUT_DIR [PLAYWRIGHT_MODULE_DIR]');
    const result=await capture(JSON.parse(fs.readFileSync(planPath,'utf8').replace(/^\uFEFF/,'')),out,modulePath);
    console.log(JSON.stringify(result,null,2));if(result.errors.length) process.exitCode=1;
  } catch(error) { console.error(error.message);process.exitCode=1; }
}

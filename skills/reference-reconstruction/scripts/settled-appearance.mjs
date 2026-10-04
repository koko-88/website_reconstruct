// Portable policy and bounded orchestration; browser reads live in page-probe.js.
import {sha256} from './package.mjs';

const STYLE_PROPERTIES=['display','visibility','opacity','transform','filter','clipPath','color','backgroundColor','fontFamily','fontSize','fontWeight','lineHeight','letterSpacing'];
const MOTION_PROPERTIES=['opacity','transform','filter'];
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function object(v,allowed,label) {
  if(!v||typeof v!=='object'||Array.isArray(v)) throw Error(label+' must be an object');
  for(const key of Object.keys(v)) if(!allowed.includes(key)) throw Error('Unknown '+label+' field: '+key);
}
function integer(v,min,max,label) { if(!Number.isInteger(v)||v<min||v>max) throw Error('Invalid '+label); }
function selector(v) { if(typeof v!=='string'||!v.trim()||v.length>500) throw Error('Invalid appearance selector'); }
function reason(v) { if(typeof v!=='string'||!v.trim()||v.length>1000) throw Error('Record scoped limitation/motion reason'); }
export function appearancePolicy(cp) {
  const p=structuredClone(cp.appearance||{});
  object(p,['mode','scope','selector','intervalMs','minStableMs','stableSamples','maxSamples','maxNodes','assertions','ambient','frames','visual','reason'],'appearance');
  p.mode??='appearance'; p.scope??='viewport'; p.intervalMs??=100; p.minStableMs??=300;
  p.stableSamples??=3;p.maxSamples??=100;p.maxNodes??=400;p.assertions??=[];p.ambient??=[];p.frames??=[];p.visual??=false;
  if(!['appearance','geometry-only'].includes(p.mode)) throw Error('Invalid appearance mode');
  if(!['viewport','region','full-page'].includes(p.scope)) throw Error('Invalid appearance scope');
  if(p.scope==='region') selector(p.selector);
  if(p.mode==='geometry-only') reason(p.reason);
  for(const [k,min,max] of [['intervalMs',20,1000],['minStableMs',100,10000],['stableSamples',3,20],['maxSamples',3,300],['maxNodes',10,2000]]) integer(p[k],min,max,k);
  if(typeof p.visual!=='boolean') throw Error('Invalid visual convergence flag');
  for(const k of ['assertions','ambient','frames']) if(!Array.isArray(p[k])||p[k].length>100) throw Error('Invalid '+k);
  for(const a of p.assertions) {
    object(a,['selector','minCount','maxCount','visible','minOpacity','styles','attributes'],'assertion');selector(a.selector);
    a.minCount??=1;a.maxCount??=2000;integer(a.minCount,0,2000,'minCount');integer(a.maxCount,a.minCount,2000,'maxCount');
    if(a.visible!==undefined&&typeof a.visible!=='boolean') throw Error('Invalid assertion visibility');
    if(a.minOpacity!==undefined&&(typeof a.minOpacity!=='number'||a.minOpacity<0||a.minOpacity>1)) throw Error('Invalid minimum opacity');
    if(a.styles!==undefined) { object(a.styles,STYLE_PROPERTIES,'asserted styles');for(const v of Object.values(a.styles)) if(typeof v!=='string'||v.length>500) throw Error('Invalid style expectation'); }
    if(a.attributes!==undefined) { if(!a.attributes||typeof a.attributes!=='object'||Array.isArray(a.attributes)) throw Error('Invalid attributes');for(const [k,v] of Object.entries(a.attributes)) if(!/^[a-zA-Z][a-zA-Z0-9:_-]{0,79}$/.test(k)||(v!==null&&(typeof v!=='string'||v.length>500))) throw Error('Invalid attribute expectation'); }
    if(!['visible','minOpacity','styles','attributes'].some(k=>a[k]!==undefined)&&a.minCount===1&&a.maxCount===2000) throw Error('Assertion needs an explicit state or count expectation');
  }
  for(const a of p.ambient) {
    object(a,['selector','properties','reason'],'ambient');selector(a.selector);reason(a.reason);
    if(!Array.isArray(a.properties)||!a.properties.length||a.properties.some(k=>!MOTION_PROPERTIES.includes(k))) throw Error('Only justified opacity/transform/filter motion may be excluded');
  }
  for(const f of p.frames) {
    object(f,['selector','mode','reason'],'frame');selector(f.selector);reason(f.reason);
    if(!['shell-only','content'].includes(f.mode)) throw Error('Invalid frame scope');
  }
  return p;
}
export const probeOptions=(cp,p=appearancePolicy(cp))=>({required:cp.required,absent:cp.absent,stableSelectors:cp.stableSelectors,limit:200,appearance:p});
export function appearanceSignature(snapshot) {
  const a=snapshot.appearance;
  if(!a) return null;
  return JSON.stringify({scope:a.scope,region:a.region,nodes:a.nodes.map(n=>({key:n.key,layout:n.layout,effectiveOpacity:n.ambientProperties.includes('opacity')?null:n.effectiveOpacity,computed:Object.fromEntries(Object.entries(n.computed).filter(([k])=>!n.ambientProperties.includes(k))),pseudo:n.pseudo.map(s=>Object.fromEntries(Object.entries(s).filter(([k])=>!n.ambientProperties.includes(k))))})),assertions:a.assertions,frames:a.frames});
}
export function appearanceReasons(snapshot,cp,p=appearancePolicy(cp)) {
  if(p.mode==='geometry-only') return [];
  const a=snapshot.appearance,reasons=[];
  if(!a) return ['appearance-probe-unavailable'];
  if(a.error) reasons.push('appearance-probe:'+a.error);
  if(a.truncated) reasons.push('appearance-node-budget');
  if(!a.nodes.length) reasons.push('appearance-empty-scope');
  if(p.scope==='region'&&(!a.region||a.region.count!==1||!a.region.inViewport)) reasons.push('appearance-region-not-uniquely-in-viewport');
  if(cp.fullPage||p.scope==='full-page') reasons.push('full-page-reveal-coverage-unproven');
  for(const assertion of a.assertions) if(!assertion.pass) reasons.push('assertion:'+assertion.selector+':'+assertion.failures.join('|'));
  for(const frame of a.frames) if(frame.mode!=='shell-only') reasons.push('iframe-content-unresolved:'+frame.key);
  for(const node of a.nodes) {
    if(node.animations.some(a=>a.active&&a.iterations!==null)) reasons.push('finite-motion:'+node.key);
    if(node.animations.some(a=>a.active&&a.iterations===null&&(!node.ambientProperties.length||a.properties.some(k=>!node.ambientProperties.includes(k))))) reasons.push('unclassified-motion:'+node.key);
  }
  return [...new Set(reasons)];
}
export function postAppearanceReasons(before,after,cp) {
  const p=appearancePolicy(cp),reasons=appearanceReasons(after,cp,p);
  if(p.mode!=='geometry-only'&&appearanceSignature(before)!==appearanceSignature(after)) reasons.push('appearance-changed-during-screenshot');
  return reasons;
}
async function bounded(promise,ms,label) {
  let timer;try { return await Promise.race([promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error(label+' deadline exceeded')),Math.max(1,ms));})]); } finally {clearTimeout(timer);}
}
export async function visualSample(page,snapshot,p,remaining) {
  if(typeof page.screenshot!=='function') throw Error('scoped-screenshot capability unavailable');
  const options={type:'png',animations:'allow',caret:'initial',timeout:Math.max(1,remaining)};
  if(p.scope==='region') {
    const r=snapshot.appearance.region;
    if(!r||!r.inViewport||r.count!==1) throw Error('region clip unavailable');
    options.clip=r.clip;
  }
  const env=snapshot.environment;
  const area=options.clip?options.clip.width*options.clip.height:env.cssViewport.width*env.cssViewport.height;
  if(area*env.dpr**2>30_000_000) throw Error("visual sample pixel budget exceeded");
  if(p.ambient.length) {
    if(typeof page.locator!=='function') throw Error('ambient mask capability unavailable');
    options.mask=p.ambient.map(a=>page.locator(a.selector));
  }
  // Exact lossless PNG byte equality is conservative; no tolerance or fabricated baseline.
  const bytes=await bounded(page.screenshot(options),remaining,'visual sample');
  return {sha256:sha256(bytes),bytes:bytes.length,scope:p.scope,clip:options.clip||null,maskedSelectors:p.ambient.map(a=>a.selector),animations:'allow',comparison:'exact PNG bytes'};
}
export async function waitAppearance(page,cp,probe,baseReasons,geometrySignature) {
  const p=appearancePolicy(cp),started=Date.now(),deadline=started+cp.timeoutMs,samples=[];
  let snapshot,prior=null,stableSince=null,streak=0,reasons=['not-sampled'],lastVisual=null,priorSignals=null;
  const limits=['Finite observations cannot rule out future timer/network changes; assertions must describe the expected named state.','DOM/style convergence is not renderer, glyph, video, canvas, shadow-root or provider-internal proof.','Viewport/region success does not cover offscreen reveals.'];
  if(!p.assertions.length) limits.push('No semantic assertions supplied; result only supports the sampled appearance window.');
  if(p.mode==='geometry-only') limits.push('Geometry-only evidence: '+p.reason+'; no settled appearance claim.');
  for(const f of p.frames) if(f.mode==='shell-only') limits.push('Iframe shell only: '+f.selector+'; '+f.reason+'; internals remain unresolved.');
  while(Date.now()<deadline&&samples.length<p.maxSamples) {
    const sample={index:samples.length,elapsedMs:Date.now()-started};
    try {
      snapshot=await bounded(page.evaluate(probe,{...probeOptions(cp,p),decodeMs:Math.min(500,deadline-Date.now())}),deadline-Date.now(),'probe');
      reasons=[...baseReasons(snapshot),...appearanceReasons(snapshot,cp,p)];
      sample.geometrySignature=geometrySignature(snapshot);sample.appearance=snapshot.appearance||null;sample.baseReadiness=snapshot.readiness;
      let visual=null;
      if(p.visual&&p.mode!=='geometry-only'&&p.scope!=='full-page'&&!cp.fullPage) visual=await visualSample(page,snapshot,p,deadline-Date.now());
      sample.visual=visual;lastVisual=visual;
      const signals={geometry:sample.geometrySignature,appearance:p.mode==='geometry-only'?null:appearanceSignature(snapshot),visual:visual?.sha256||null};
      sample.changedSignals=priorSignals?Object.keys(signals).filter(k=>signals[k]!==priorSignals[k]):['initial-sample'];
      priorSignals=signals;
      const signature=JSON.stringify(signals);
      const now=Date.now();
      if(!reasons.length&&signature===prior) streak++;
      else {streak=reasons.length?0:1;stableSince=reasons.length?null:now;}
      prior=signature;
      sample.stableSamples=streak;sample.stableForMs=stableSince===null?0:now-stableSince;sample.reasons=[...reasons];samples.push(sample);
      if(now<deadline&&!reasons.length&&streak>=p.stableSamples&&sample.stableForMs>=p.minStableMs) {
        const ambient=p.mode!=='geometry-only'&&(snapshot.appearance?.nodes.some(n=>n.ambientProperties.length)||p.ambient.length>0);
        return result('settled',p.mode==='geometry-only'?'unresolved':ambient?'settled-with-ambient-motion':'settled-static','converged within bounded observation window');
      }
    } catch(error) {
      reasons=[...new Set([...reasons,'sample-operation:'+error.message])];sample.reasons=[...reasons];samples.push(sample);streak=0;stableSince=null;prior=null;priorSignals=null;
    }
    await sleep(Math.min(p.intervalMs,Math.max(0,deadline-Date.now())));
  }
  if(streak<p.stableSamples||stableSince===null||Date.now()-stableSince<p.minStableMs) reasons.push('appearance-not-converged');
  reasons.push(Date.now()>=deadline?'readiness-deadline':'sample-budget-exhausted');
  return result('unsettled','unresolved','budget exhausted without all required signals');
  function result(status,state,why) {
    return {status,elapsedMs:Date.now()-started,snapshot,reasons:[...new Set(reasons)],samplesStable:streak,appearance:{state,why,claim:p.mode==='geometry-only'?'selected geometry only':p.scope+' sampled appearance; iframe interiors excluded unless independently proven',policy:p,budget:{timeoutMs:cp.timeoutMs,maxSamples:p.maxSamples,maxNodes:p.maxNodes,maxScannedNodes:10000,intervalMs:p.intervalMs,minStableMs:p.minStableMs,stableSamples:p.stableSamples},convergence:{pass:status==='settled'&&p.mode!=='geometry-only',stableSamples:streak,stableForMs:stableSince===null?0:Date.now()-stableSince,visual:lastVisual},samples,limits}};
  }
}

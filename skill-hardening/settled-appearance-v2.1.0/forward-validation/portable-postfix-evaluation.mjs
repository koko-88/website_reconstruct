import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {capture,waitReady} from '../../../skills/reference-reconstruction/scripts/capture.mjs';
import {appearancePolicy,appearanceReasons,appearanceSignature} from '../../../skills/reference-reconstruction/scripts/settled-appearance.mjs';

const out=path.dirname(fileURLToPath(import.meta.url));
const skill=path.resolve(out,'../../../skills/reference-reconstruction');
const cp={id:'MENU',phase:'settled',required:['main'],absent:[],stableSelectors:['main'],timeoutMs:1000,fullPage:false,appearance:{scope:'region',selector:'main',assertions:[{selector:'#toggle',attributes:{'aria-expanded':'true'}}]}};
let alpha=.1;
const box={x:0,y:0,width:200,height:100,top:0,left:0,right:200,bottom:100};
function element(tag,parent=null,id='') {
  const el={tagName:tag.toUpperCase(),parentElement:parent,id,hidden:false,textContent:'Fixture',offsetLeft:0,offsetTop:0,offsetWidth:200,offsetHeight:100,getBoundingClientRect:()=>({...box}),getAttribute:name=>name==='aria-expanded'&&id==='toggle'?'true':null,hasAttribute:()=>false,matches:()=>false,closest:()=>null,getAnimations:()=>[],contains(other){for(let n=other;n;n=n.parentElement)if(n===this)return true;return false;}};
  return el;
}
const root=element('html'),wrapper=element('section',root),menu=element('main',wrapper),child=element('div',menu),toggle=element('button',root,'toggle');
root.clientWidth=640;root.scrollWidth=640;root.scrollHeight=480;
wrapper.getAnimations=()=>[{playState:'running',pending:false,effect:{getComputedTiming:()=>({iterations:1}),getKeyframes:()=>[{opacity:0},{opacity:1}]}}];
const all=[root,wrapper,menu,child,toggle];
const styleDefaults={display:'block',visibility:'visible',opacity:'1',transform:'none',filter:'none',clipPath:'none',color:'rgb(0, 0, 0)',backgroundColor:'rgba(0, 0, 0, 0)',fontFamily:'sans-serif',fontSize:'16px',fontWeight:'400',lineHeight:'normal',letterSpacing:'normal',content:'none',direction:'ltr'};
const document={documentElement:root,readyState:'complete',fonts:{status:'loaded'},images:[],activeElement:null,querySelectorAll(selector){return selector==='main'?[menu]:selector==='#toggle'?[toggle]:[];},createTreeWalker(){let index=0;return {currentNode:root,nextNode:()=>all[++index]||null};}};
const context={document,NodeFilter:{SHOW_ELEMENT:1},location:{href:'http://fixture.example/'},innerWidth:640,innerHeight:480,scrollX:0,scrollY:0,devicePixelRatio:1,visualViewport:null,navigator:{userAgent:'Synthetic',platform:'Synthetic',language:'en-US',maxTouchPoints:0},matchMedia:()=>({matches:false}),performance:{now:()=>0,timeOrigin:0},getComputedStyle:(el,pseudo)=>({...styleDefaults,opacity:el===wrapper&&!pseudo?String(alpha):'1'}),URL,Intl,Date,setTimeout,clearTimeout};
const probe=vm.runInNewContext('('+fs.readFileSync(path.join(skill,'scripts/page-probe.js'),'utf8')+'\n)',context);
const regionSnapshots=[];
const page={async evaluate(_fn,options){alpha=alpha>=.9?.1:alpha+.1;const snapshot=await probe(options);regionSnapshots.push(snapshot);return snapshot;}};
const changingRegion=await waitReady(page,cp);
const effective=changingRegion.appearance.samples.map(s=>s.appearance.nodes.find(n=>n.tag==='main').effectiveOpacity);
assert.ok(new Set(effective).size>1);
assert.equal(changingRegion.status,'unsettled');
assert.equal(changingRegion.appearance.state,'unresolved');
assert.equal(changingRegion.appearance.convergence.pass,false);
assert.notEqual(appearanceSignature(regionSnapshots[0]),appearanceSignature(regionSnapshots.at(-1)));

// Provider and full-page policies must remain honest even for structurally static input.
const snapshot=structuredClone(regionSnapshots.at(-1));
snapshot.appearance.frames=[{key:'provider',mode:'content',inspectability:'same-origin document accessible, not sampled'}];
assert.ok(appearanceReasons(snapshot,cp).includes('iframe-content-unresolved:provider'));
snapshot.appearance.frames[0].mode='shell-only';
assert.ok(!appearanceReasons(snapshot,cp).some(r=>r.startsWith('iframe-content')));
assert.ok(appearanceReasons(snapshot,{...cp,fullPage:true}).includes('full-page-reveal-coverage-unproven'));
assert.throws(()=>appearancePolicy({...cp,appearance:{ambient:[{selector:'main',properties:['color'],reason:'Invalid decorative exclusion'}]}}));

// No real browser is loaded or launched: exercise only runner state transitions with a data-only adapter.
const moduleDir=path.join(out,'data-only-adapter');
fs.mkdirSync(moduleDir,{recursive:true});
fs.writeFileSync(path.join(moduleDir,'package.json'),JSON.stringify({name:'data-only-adapter',version:'0.0.0',main:'index.cjs'}));
const huge=structuredClone(regionSnapshots.at(-1));
huge.appearance.scope='viewport';huge.appearance.region=null;huge.appearance.frames=[];huge.appearance.assertions=[];
huge.environment.cssViewport={width:8000,height:8000};huge.environment.scroll={x:0,y:0,width:8000,height:8000};
const moduleSource=`const snapshot=${JSON.stringify(huge)};module.exports={chromium:{launch:async()=>({version:()=> 'data-only',close:async()=>{},newContext:async()=>({close:async()=>{},route:async()=>{},newPage:async()=>({setDefaultTimeout(){},setDefaultNavigationTimeout(){},on(){},mainFrame:()=>null,goto:async()=>{},url:()=> 'http://fixture.example/',evaluate:async()=>structuredClone(snapshot),screenshot:async()=>{throw Error('Unexpected screenshot call');}})})})}};`;
fs.writeFileSync(path.join(moduleDir,'index.cjs'),moduleSource);
const plan=JSON.parse(fs.readFileSync(path.join(skill,'assets/capture-plan.example.json'),'utf8'));
plan.allowedOrigins=['http://fixture.example'];plan.environments[0].viewport={width:8000,height:8000};
plan.cases=[{id:'GIANT',environmentId:plan.environments[0].id,url:'http://fixture.example/',state:'Static viewport',reset:'fresh-context',checkpoints:[{...cp,id:'VIEWPORT',appearance:{},required:[],stableSelectors:['main']}]}];
const giantOutput=path.join(out,'data-only-giant-run-postfix');
const giantRun=await capture(plan,giantOutput,moduleDir);
const giantRecord=JSON.parse(fs.readFileSync(path.join(giantOutput,'GIANT--VIEWPORT.json'),'utf8'));
assert.equal(giantRun.result,'INCOMPLETE');
assert.match(giantRecord.screenshotError,/Pixel budget/);
assert.equal(giantRecord.phase,'unsettled');
assert.equal(giantRecord.readiness.appearance.state,'unresolved');
assert.equal(giantRecord.readiness.appearance.convergence.pass,false);
assert.equal(fs.existsSync(path.join(giantOutput,'GIANT--VIEWPORT.png')),false);
const result={method:'Portable data-only evaluation; no browser, network, live site, installed-file mutation, or frozen evidence access',changingRegion:{status:changingRegion.status,state:changingRegion.appearance.state,convergence:changingRegion.appearance.convergence,effectiveOpacitySamples:effective,ancestorAnimationSampled:changingRegion.appearance.samples.some(s=>s.appearance.nodes.some(n=>n.tag==='section')),record:changingRegion},policyControls:{unsampledProviderUnresolved:true,shellOnlyExplicitlyBounded:true,fullPageRevealCoverageUnproven:true,invalidAmbientPropertyRejected:true},refusedScreenshot:{runResult:giantRun.result,phase:giantRecord.phase,appearanceState:giantRecord.readiness.appearance.state,convergencePass:giantRecord.readiness.appearance.convergence.pass,screenshotError:giantRecord.screenshotError,pngPresent:false}};
fs.writeFileSync(path.join(out,'portable-postfix-results.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({changingRegion:result.changingRegion.state,effectiveOpacitySamples:effective,refusedScreenshot:result.refusedScreenshot,policyControls:result.policyControls},null,2));


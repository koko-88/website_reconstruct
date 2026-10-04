import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {bounded,validatePlan,capture,readyReasons} from './capture.mjs';
import {inventory,seal,verify} from './package.mjs';
import {inspectSource} from './source-report.mjs';

const here=path.dirname(fileURLToPath(import.meta.url));
const fresh=()=>fs.mkdtempSync(path.join(os.tmpdir(),'reference-v2-test-'));
const example=()=>JSON.parse(fs.readFileSync(path.join(here,'../assets/capture-plan.example.json'),'utf8'));
function tempTest(fn) {
  return async()=> { const dir=fresh();try { await fn(dir); } finally {
    const resolved=path.resolve(dir);
    if(path.dirname(resolved)!==path.resolve(os.tmpdir())||!path.basename(resolved).startsWith('reference-v2-test-')) throw Error('Unexpected temporary cleanup target');
    fs.rmSync(resolved,{recursive:true,force:true});
  } };
}
test('example plan validates without requiring browser tooling',()=>assert.equal(validatePlan(example()).plan.schemaVersion,2));
test('plan rejects scripts, duplicate ids, foreign navigation, private queries and unknown conditions',()=>{
  for(const mutate of [p=>{p.evaluate='() => fetch("/write")';},p=>{p.cases.push(structuredClone(p.cases[0]));},p=>{p.cases[0].url='https://unapproved.example/';},p=>{p.cases[0].url+='?token=secret';},p=>{p.cases[0].checkpoints[0].stableSelectors=[];},p=>{p.cases[0].actions=[{kind:'click',selector:'#purchase'}];},p=>{p.environments[0].hasTouch='false';}]) {
    const p=example();mutate(p);assert.throws(()=>validatePlan(p));
  }
});
test('shared MCP probe is a complete standalone inspectable function',()=>{
  const code=fs.readFileSync(path.join(here,'page-probe.js'),'utf8');
  assert.equal(typeof vm.runInNewContext('('+code+'\n)'),'function');
});
test('a bounded promise terminates missing readiness',async()=>{
  const start=Date.now();await assert.rejects(bounded(new Promise(()=>{}),50,'readiness'),/deadline/);assert.ok(Date.now()-start<1000);
});
test('visible-image timeout and missing geometry cannot count as settled',()=>{
  const reasons=readyReasons({readiness:{documentState:'complete',fonts:'loaded',required:[],absent:[],geometry:[{selector:'main',count:0}],truncated:false,images:[{complete:true,naturalWidth:1,decode:'timeout',source:{path:'/image'}}]}});
  assert.ok(reasons.includes('geometry:main'));assert.ok(reasons.some(r=>r.endsWith(':timeout')));
});
test('manifest closure catches corrupted, unlisted and duplicate artifacts; seal refuses reuse',tempTest(dir=>{
  fs.writeFileSync(path.join(dir,'evidence.json'),'{}');const before=seal(dir);
  assert.equal(verify(dir,before).result,'PASS');assert.throws(()=>seal(dir),/sealed/);
  fs.writeFileSync(path.join(dir,'evidence.json'),'bad');assert.equal(verify(dir,before).result,'FAIL');
  fs.writeFileSync(path.join(dir,'extra.txt'),'unlisted');assert.ok(verify(dir,before).problems.some(p=>p.startsWith('Unlisted')));
  before.files.push({...before.files[0]});assert.ok(verify(dir,before).problems.some(p=>p.startsWith('Duplicate')));
  before.files.push({path:'../escape',bytes:1,sha256:'x'});assert.ok(verify(dir,before).problems.includes('Unsafe manifest path'));
}));
test('frozen/output destination is rejected before requiring Playwright',tempTest(async dir=>{
  await assert.rejects(capture(example(),dir,'missing-module'),/Output exists/);assert.equal(fs.readdirSync(dir).length,0);
}));
test('an intact hash cannot excuse malformed JSON, truncated images or broken package links',tempTest(dir=>{
  fs.writeFileSync(path.join(dir,'bad.json'),'{');fs.writeFileSync(path.join(dir,'bad.png'),'not png');fs.writeFileSync(path.join(dir,'report.md'),'[missing](absent.jpg)');
  const manifest=seal(dir),result=verify(dir,manifest);assert.equal(result.result,'FAIL');assert.equal(result.problems.length,3);
}));
test('public-source inspection parses maps without fetching or executing; oversized is unknown',tempTest(dir=>{
  const js=path.join(dir,'app.js');fs.writeFileSync(js,'// webgl signal and renderer worker comment, not runtime proof\n//# sourceMappingURL=app.js.map?public=true\nthrow Error("must never run");');
  const result=inspectSource(js);assert.equal(result.sourceMapReferences[0].reference,'app.js.map');assert.ok(result.renderingSignals.includes('webgl'));assert.ok(result.renderingSignals.includes('Worker'));assert.equal(inspectSource(js,2).status,'not-inspected');
  const map=path.join(dir,'app.js.map');fs.writeFileSync(map,JSON.stringify({version:3,sources:['a.js'],sourcesContent:['code'],mappings:''}));assert.equal(inspectSource(map).map.embeddedSourceCount,1);assert.equal(inspectSource(map).map.emptyMappings,true);assert.equal(inspectSource(map).map.fileFieldPresent,false);
  fs.writeFileSync(map,'broken');assert.equal(inspectSource(map).map.status,'malformed JSON');
}));

const modulePath=process.env.REFERENCE_PLAYWRIGHT_MODULE;
test('live local fixtures: lazy images, phases, reversible states, mobile preferences, timeout, giant capture and provenance', {skip:!modulePath,timeout:90000},tempTest(async dir=>{
  const server=http.createServer((req,res)=>{
    if(req.url==='/never.png') return; // Deliberately pending lazy image below the viewport.
    if(req.url==='/broken.png') { res.writeHead(404);res.end();return; }
    res.setHeader('Content-Type','text/html');
    const busy=req.url==='/busy';const giant=req.url==='/giant';
    res.end(`<!doctype html><html><head><style>body{margin:0}main{height:300px}#panel[hidden]{display:none}#spacer{height:${giant?'100000':'3000'}px}</style></head><body><main><h1>Fixture</h1><button id="menu">Menu</button><section id="panel" hidden>Open panel</section><canvas width="10" height="10"></canvas><svg width="10" height="10"><rect width="10" height="10"/></svg><div id="loader">Loading</div>${busy?'<img src="/broken.png">':''}</main><div id="spacer"></div><img loading="lazy" src="/never.png"><script>document.querySelector('#menu').addEventListener('click',()=>{document.querySelector('#panel').hidden=false});document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelector('#panel').hidden=true});${busy?'':'setTimeout(()=>document.querySelector("#loader").remove(),150);'}</script></body></html>`);
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const origin='http://127.0.0.1:'+server.address().port;
  try {
    const plan=example();plan.browserChannel=process.env.REFERENCE_BROWSER_CHANNEL||'chrome';plan.allowedOrigins=[origin];plan.environments[0].viewport={width:640,height:480};
    plan.environments.push({...structuredClone(plan.environments[0]),id:'ENV-M',viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'});
    const cp=(id,extra={})=>({id,phase:'settled',required:['main'],absent:['#loader'],stableSelectors:['main'],timeoutMs:2000,...extra});
    plan.cases=[{id:'BASE',environmentId:'ENV-D',url:origin+'/',state:'Root and menu',reset:'fresh-context',checkpoints:[cp('EARLY',{phase:'transient'}),cp('TOP'),cp('OPEN',{actions:[{kind:'click',selector:'#menu',authority:'Local synthetic reversible toggle'}],required:['#panel']}),cp('CLOSED',{actions:[{kind:'press',key:'Escape',authority:'Local synthetic close'}],absent:['#panel']})]},{id:'MOBILE',environmentId:'ENV-M',url:origin+'/',state:'Fresh mobile reduced',reset:'fresh-context',checkpoints:[cp('TOP')]}];
    const out=path.join(dir,'valid');const run=await capture(plan,out,modulePath);assert.deepEqual(run.errors,[]);
    assert.equal(run.result,'CAPTURED');
    const record=id=>JSON.parse(fs.readFileSync(path.join(out,id+'.json'),'utf8'));
    assert.equal(record('BASE--EARLY').phase,'transient');assert.equal(record('BASE--TOP').phase,'settled');
    assert.equal(record('BASE--TOP').readiness.snapshot.readiness.visibleImageCount,0);
    assert.equal(record('BASE--TOP').readiness.snapshot.readiness.geometry[0].samples[0].computed.height,'300px');
    assert.equal(record('BASE--OPEN').readiness.snapshot.readiness.required[0].samples[0].hidden,false);
    assert.equal(record('MOBILE--TOP').readiness.snapshot.environment.reducedMotion,true);assert.ok(record('MOBILE--TOP').readiness.snapshot.environment.maxTouchPoints>0);
    assert.ok(record('BASE--TOP').readiness.snapshot.nonDOM.surfaces.some(s=>s.tag==='canvas'&&s.renderer.startsWith('unknown')));
    const bytes=fs.readFileSync(path.join(out,'BASE--TOP.png'));assert.equal(bytes.readUInt32BE(16),640);assert.equal(bytes.readUInt32BE(20),480);
    assert.ok(record('BASE--TOP').provenance.planSHA256);assert.ok(record('BASE--TOP').screenshotStartedUTC<=record('BASE--TOP').screenshotEndedUTC);
    const manifest=JSON.parse(fs.readFileSync(path.join(out,'manifest.json'),'utf8'));assert.equal(verify(out,manifest).result,'PASS');
    const saved=JSON.stringify(inventory(out));await assert.rejects(capture(plan,out,modulePath),/Output exists/);assert.equal(JSON.stringify(inventory(out)),saved);
    plan.cases=[{id:'BUSY',environmentId:'ENV-D',url:origin+'/busy',state:'Never ready',reset:'fresh-context',checkpoints:[cp('TOP',{timeoutMs:400})]},{id:'GIANT',environmentId:'ENV-D',url:origin+'/giant',state:'Large page',reset:'fresh-context',checkpoints:[cp('FULL',{phase:'transient',fullPage:true})]}];
    const failOut=path.join(dir,'incomplete'),failed=await capture(plan,failOut,modulePath);assert.equal(failed.result,'INCOMPLETE');
    const timeout=JSON.parse(fs.readFileSync(path.join(failOut,'BUSY--TOP.json'),'utf8'));assert.equal(timeout.phase,'unsettled');assert.ok(timeout.readiness.reasons.some(r=>r.startsWith('visible-blocker')));
    const large=JSON.parse(fs.readFileSync(path.join(failOut,'GIANT--FULL.json'),'utf8'));assert.match(large.screenshotError,/Pixel budget/);assert.ok(!fs.existsSync(path.join(failOut,'GIANT--FULL.png')));
    assert.equal(verify(failOut,JSON.parse(fs.readFileSync(path.join(failOut,'manifest.json'),'utf8'))).result,'PASS');
  } finally { server.closeAllConnections();await new Promise(resolve=>server.close(resolve)); }
}));

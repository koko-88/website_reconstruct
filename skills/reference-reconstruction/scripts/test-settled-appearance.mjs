import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {createRequire} from 'node:module';
import {waitReady,validatePlan,capture} from './capture.mjs';
import {appearancePolicy,appearanceSignature,postAppearanceReasons} from './settled-appearance.mjs';

const checkpoint=(extra={})=>({id:'STATE',phase:'settled',required:['main'],absent:[],stableSelectors:['main'],timeoutMs:2200,fullPage:false,...extra});
const stateAssertion={selector:'#child',visible:true,minOpacity:0.99};
test('appearance policy validates data-only assertions and bounded exceptions',()=>{
  assert.equal(appearancePolicy(checkpoint()).scope,'viewport');
  for(const appearance of [{evaluate:'unsafe'}, {intervalMs:0},{maxNodes:1},{ambient:[{selector:'body',properties:['visibility'],reason:'bad'}]},{frames:[{selector:'iframe',mode:'shell-only'}]},{assertions:[{selector:'body',styles:{unlisted:'x'}}]},{mode:'geometry-only'}]) assert.throws(()=>appearancePolicy(checkpoint({appearance})));
  const example=JSON.parse(fs.readFileSync(new URL('../assets/capture-plan.example.json',import.meta.url),'utf8'));
  example.cases[0].checkpoints[0].appearance={assertions:[stateAssertion]};assert.equal(validatePlan(example).plan.schemaVersion,2);
});
test('capture verification catches appearance changes without geometry changes',()=>{
  const make=opacity=>({appearance:{scope:'viewport',region:null,nodes:[{key:'1:main',layout:{x:0,y:0,width:100,height:100},computed:{opacity},pseudo:[],animations:[],ambientProperties:[]}],assertions:[],frames:[],truncated:false}});
  assert.notEqual(appearanceSignature(make('0')),appearanceSignature(make('1')));
  assert.ok(postAppearanceReasons(make('0'),make('1'),checkpoint()).includes('appearance-changed-during-screenshot'));
});
const modulePath=process.env.REFERENCE_PLAYWRIGHT_MODULE;
test('synthetic settled-appearance regressions in a real browser',{skip:!modulePath,timeout:90000},async t=>{
  const require=createRequire(import.meta.url),playwright=require(modulePath),records=[];
  const provider=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html');res.end('<body><div style="opacity:0" id="provider">Not yet painted</div><script>setTimeout(()=>document.querySelector("#provider").style.opacity=1,1800)</script>');});
  await new Promise(r=>provider.listen(0,'127.0.0.1',r));
  const providerURL='http://127.0.0.1:'+provider.address().port;
  const base=body=>'<!doctype html><html><head><style>body{margin:0}main{width:300px;height:160px;background:white}#child{width:100px;height:40px;background:blue}'+(body.css||'')+'</style></head><body>'+body.html+'<script>'+(body.js||'')+'</script></body></html>';
  const fixtures={
    '/opacity':base({html:'<main><div id="child" style="opacity:0">Menu child</div></main>',js:'setTimeout(()=>document.querySelector("#child").style.opacity=1,650)'}),
    '/ancestor':base({css:'#ancestor{opacity:0;animation:parentReveal 250ms 500ms forwards}@keyframes parentReveal{to{opacity:1}}',html:'<section id="ancestor"><main><div id="child">Nested region</div></main></section>'}),
    '/transition':base({css:'#child{transform:translateX(20px);filter:blur(4px);animation:reveal 250ms 500ms forwards}@keyframes reveal{to{transform:none;filter:blur(0px)}}',html:'<main><div id="child">Transition</div></main>'}),
    '/ambient':base({css:'#ambient{width:120px;height:120px;overflow:hidden}#child{animation:ambient 2s linear infinite}@keyframes ambient{to{transform:rotate(360deg)}}',html:'<main><section id="ambient"><div id="child">Ambient</div></section></main>'}),
    '/frame':base({html:'<main><iframe src="'+providerURL+'" width="200" height="100"></iframe></main>'}),
    '/offscreen':base({html:'<main>Top</main><div style="height:1500px"></div><div id="child" style="opacity:0">Offscreen reveal</div>',js:'addEventListener("scroll",()=>{document.querySelector("#child").style.opacity=scrollY>1200?1:0})'}),
    '/scrolled':base({css:'main{margin-top:900px;background:red}',html:'<main><div id="child">Scrolled region</div></main>'}),
    '/never':base({html:'<main><div id="child" style="opacity:0">Never ready</div></main>'}),
    '/static':base({html:'<main><div id="child">Static</div></main>'}),
    '/visual':base({html:'<main><canvas id="pixels" width="100" height="40"></canvas></main>',js:'const c=document.querySelector("canvas").getContext("2d");let n=0;const timer=setInterval(()=>{c.fillStyle=(++n%2)?"red":"blue";c.fillRect(0,0,100,40);if(n===8)clearInterval(timer)},80)'})
  };
  const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html');res.end(fixtures[req.url]||fixtures['/static']);});
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  let browser,context;
  try {
    browser=await playwright.chromium.launch({headless:true,chromiumSandbox:true,channel:process.env.REFERENCE_BROWSER_CHANNEL||'chrome',timeout:30000});
    context=await browser.newContext({viewport:{width:640,height:480}});
    const page=await context.newPage();
    async function run(url,cp) {
      await page.goto('http://127.0.0.1:'+server.address().port+url,{waitUntil:'commit'});
      const result=await waitReady(page,cp);records.push({fixture:url,checkpoint:cp,result});return result;
    }
    await t.test('stable parent does not pass a delayed child opacity assertion',async()=>{
      const r=await run('/opacity',checkpoint({appearance:{assertions:[stateAssertion]}}));
      assert.equal(r.status,'settled');assert.equal(r.appearance.state,'settled-static');assert.ok(r.elapsedMs>=650);
      assert.ok(r.appearance.samples.some(s=>s.reasons.some(reason=>reason.startsWith('assertion:'))));
      assert.equal(r.snapshot.appearance.assertions[0].observed[0].computed.opacity,'1');
    });
    await t.test('delayed finite transform/filter animation blocks even without a semantic assertion',async()=>{
      const r=await run('/transition',checkpoint());assert.equal(r.status,'settled');assert.ok(r.elapsedMs>=750);
      assert.ok(r.appearance.samples.some(s=>s.reasons.some(reason=>reason.startsWith('finite-motion:'))));
      const node=r.snapshot.appearance.nodes.find(n=>n.tag==='div');assert.equal(node.computed.filter,'blur(0px)');
    });
    await t.test('region readiness includes ancestors with delayed finite motion',async()=>{
      const r=await run('/ancestor',checkpoint({appearance:{scope:'region',selector:'main'}}));assert.equal(r.status,'settled');assert.ok(r.elapsedMs>=750);assert.ok(r.appearance.samples.some(s=>s.reasons.some(reason=>reason.startsWith('finite-motion:'))));
    });
    await t.test('classified ambient motion stays observable and does not block static region convergence',async()=>{
      const cp=checkpoint({appearance:{visual:true,ambient:[{selector:'#ambient',properties:['transform'],reason:'Continuous decorative rotation; preserve movement and compare its surrounding layout'}]}});
      const r=await run('/ambient',cp);assert.equal(r.status,'settled');assert.equal(r.appearance.state,'settled-with-ambient-motion');
      assert.ok(r.snapshot.appearance.nodes.some(n=>n.animations.some(a=>a.active&&a.iterations===null)));
      assert.deepEqual(r.appearance.convergence.visual.maskedSelectors,['#ambient']);
      const transforms=r.appearance.samples.map(s=>s.appearance.nodes.find(n=>n.tag==='div').computed.transform);assert.ok(new Set(transforms).size>1);
      assert.equal(await page.locator('#child').evaluate(e=>e.getAnimations()[0].playState),'running');
    });
    await t.test('unclassified continuous motion cannot be silently ignored',async()=>{
      const r=await run('/ambient',checkpoint({timeoutMs:600}));assert.equal(r.status,'unsettled');assert.ok(r.reasons.some(s=>s.startsWith('unclassified-motion:')));
    });
    await t.test('cross-origin frame shell is not inner visual readiness',async()=>{
      const r=await run('/frame',checkpoint({timeoutMs:600}));assert.equal(r.status,'unsettled');assert.equal(r.appearance.state,'unresolved');assert.ok(r.reasons.some(s=>s.startsWith('iframe-content-unresolved:')));
      assert.match(r.snapshot.appearance.frames[0].inspectability,/cross-origin/);
      const shell=await run('/frame',checkpoint({appearance:{frames:[{selector:'iframe',mode:'shell-only',reason:'This checkpoint measures host wrapper only; provider content is a separate obligation'}]}}));
      assert.equal(shell.status,'settled');assert.ok(shell.appearance.limits.some(s=>s.includes('internals remain unresolved')));
    });
    await t.test('viewport cannot be promoted to full-page appearance, even after a reveal sweep and reset',async()=>{
      const cp=checkpoint({fullPage:true,timeoutMs:600});const r=await run('/offscreen',cp);assert.equal(r.status,'unsettled');assert.ok(r.reasons.includes('full-page-reveal-coverage-unproven'));
      await page.evaluate(()=>scrollTo(0,1600));await page.waitForFunction(()=>getComputedStyle(document.querySelector("#child")).opacity==="1",{},{timeout:1000});
      await page.evaluate(()=>scrollTo(0,0));await page.waitForFunction(()=>getComputedStyle(document.querySelector("#child")).opacity==="0",{},{timeout:1000});const reset=await waitReady(page,cp);assert.equal(reset.status,'unsettled');
      const geometry=await waitReady(page,checkpoint({fullPage:true,appearance:{mode:'geometry-only',reason:'Context geometry only; per-section reveal checkpoints carry appearance'}}));
      assert.equal(geometry.status,'settled');assert.equal(geometry.appearance.state,'unresolved');assert.equal(geometry.appearance.convergence.pass,false);
      const top=await waitReady(page,checkpoint());assert.equal(top.status,'settled');assert.match(top.appearance.claim,/viewport/);
    });
    await t.test('timeout preserves pending signals instead of force passing',async()=>{
      const r=await run('/never',checkpoint({timeoutMs:600,appearance:{assertions:[stateAssertion]}}));assert.equal(r.status,'unsettled');assert.equal(r.appearance.convergence.pass,false);assert.ok(r.reasons.includes('readiness-deadline'));assert.ok(r.reasons.some(s=>s.startsWith('assertion:')));assert.ok(r.appearance.samples.length>=3);assert.ok(r.elapsedMs<1500);
    });
    await t.test('sample-budget exhaustion is honest and distinct from timeout',async()=>{
      const r=await run('/static',checkpoint({appearance:{maxSamples:3,minStableMs:1000}}));assert.equal(r.status,'unsettled');assert.ok(r.reasons.includes('sample-budget-exhausted'));assert.equal(r.appearance.samples.length,3);
    });
    await t.test('region visual convergence detects changing canvas pixels beyond DOM geometry',async()=>{
      const r=await run('/visual',checkpoint({appearance:{scope:'region',selector:'main',visual:true,minStableMs:350}}));assert.equal(r.status,'settled');assert.ok(r.elapsedMs>=640);const hashes=r.appearance.samples.map(s=>s.visual?.sha256).filter(Boolean);assert.ok(new Set(hashes).size>1);assert.equal(r.appearance.convergence.visual.scope,'region');
    });
    await t.test('scrolled region visual sampling uses viewport coordinates',async()=>{
      await page.goto('http://127.0.0.1:'+server.address().port+'/scrolled');
      await page.evaluate(()=>scrollTo(0,800));
      assert.ok(await page.evaluate(()=>scrollY)>0);
      const r=await waitReady(page,checkpoint({required:['#child'],stableSelectors:['#child'],appearance:{scope:'region',selector:'main',visual:true}}));
      assert.equal(r.status,'settled',JSON.stringify(r.reasons));
      const region=r.snapshot.appearance.region;
      assert.equal(r.appearance.convergence.visual.clip.y,region.rect.y);
      const {default:sharp}=await import('sharp');
      const sample=await page.screenshot({clip:r.appearance.convergence.visual.clip});
      const {data,info}=await sharp(sample).raw().toBuffer({resolveWithObject:true});
      const edge=(info.width-1)*info.channels;
      assert.equal(data[edge],255);assert.equal(data[edge+1],0);assert.equal(data[edge+2],0);
    });
    await t.test('sample truncation and unavailable screenshot capability remain unresolved',async()=>{
      await page.goto('http://127.0.0.1:'+server.address().port+'/static');await page.evaluate(()=>{for(let n=0;n<30;n++)document.querySelector('main').appendChild(document.createElement('span')).textContent='x'});
      const capped=await waitReady(page,checkpoint({timeoutMs:400,appearance:{maxNodes:10}}));assert.equal(capped.status,'unsettled');assert.ok(capped.reasons.includes('appearance-node-budget'));
      const unsupported=await waitReady({evaluate:page.evaluate.bind(page)},checkpoint({timeoutMs:400,appearance:{visual:true}}));assert.equal(unsupported.status,'unsettled');assert.ok(unsupported.reasons.some(s=>s.includes('capability unavailable')));
    });
    await t.test('screenshot pixel refusal invalidates successful viewport appearance',async()=>{
      const dir=fs.mkdtempSync(path.join(os.tmpdir(),'reference-appearance-test-'));
      try {
        const plan=JSON.parse(fs.readFileSync(new URL('../assets/capture-plan.example.json',import.meta.url),'utf8'));
        const origin='http://127.0.0.1:'+server.address().port;plan.allowedOrigins=[origin];plan.browserChannel=process.env.REFERENCE_BROWSER_CHANNEL||'chrome';plan.environments[0].viewport={width:8000,height:8000};
        plan.cases=[{id:'PIXEL',environmentId:'ENV-D',url:origin+'/static',state:'Stable but no screenshot',reset:'fresh-context',checkpoints:[checkpoint()]}];
        const output=path.join(dir,'run'),r=await capture(plan,output,modulePath);assert.equal(r.result,'INCOMPLETE');
        const record=JSON.parse(fs.readFileSync(path.join(output,'PIXEL--STATE.json'),'utf8'));assert.equal(record.phase,'unsettled');assert.equal(record.readiness.appearance.state,'unresolved');assert.equal(record.readiness.appearance.convergence.pass,false);assert.ok(record.readiness.reasons.includes('capture-pixel-budget-exceeded'));assert.ok(!record.screenshot);
      } finally {if(path.dirname(path.resolve(dir))!==path.resolve(os.tmpdir())||!path.basename(dir).startsWith('reference-appearance-test-'))throw Error('Unexpected cleanup target');fs.rmSync(dir,{recursive:true,force:true});}
    });
  } finally {
    if(context)await context.close();if(browser)await browser.close();
    server.closeAllConnections();provider.closeAllConnections();await Promise.all([new Promise(r=>server.close(r)),new Promise(r=>provider.close(r))]);
    if(process.env.REFERENCE_APPEARANCE_RESULTS) fs.writeFileSync(path.resolve(process.env.REFERENCE_APPEARANCE_RESULTS),JSON.stringify({browserVersion:browser?.version(),playwrightVersion:require(path.join(modulePath,'package.json')).version,records},null,2)+'\n');
  }
});

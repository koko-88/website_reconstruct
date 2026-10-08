import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import vm from 'node:vm';
import {sha256,inventory,verify} from './package.mjs';
import {capture,validatePlan} from './capture.mjs';

let tools,discovery,format,policy;
try {tools=await import('./assets.mjs');discovery=await import('./asset-discovery.mjs');format=await import('./asset-verify.mjs');policy=await import('./asset-policy.mjs');}
catch(error){if(error.code!=='ERR_MODULE_NOT_FOUND')throw error;}
const assetTest=(name,fn)=>test(name,{skip:!tools},fn);
let png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aS1kAAAAASUVORK5CYII=','base64');
if(tools){const {default:sharp}=await import('sharp');png=await sharp({create:{width:4,height:4,channels:4,background:{r:0,g:0,b:0,alpha:1}}}).png().toBuffer();}
function removeFixture(dir){const target=fs.realpathSync(dir),parent=fs.realpathSync(os.tmpdir());if(path.dirname(target)!==parent||!path.basename(target).startsWith('reference-'))throw Error('Unsafe test cleanup');fs.rmSync(target,{recursive:true,force:true});}
async function fixture(fn){
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'reference-assets-'));
  const hits=[];
  const server=http.createServer((request,response)=>{
    hits.push(request.url);
    if(request.url==='/redirect'){response.writeHead(302,{location:'https://unauthorized.invalid/private.png'});response.end();return;}
    if(request.url==='/private'){response.writeHead(302,{location:'/asset.png?token=do-not-export'});response.end();return;}
    if(request.url==='/partial'){response.writeHead(206,{'content-type':'image/png','content-range':'bytes 0-2/100'});response.end('bad');return;}
    if(request.url==='/oversize'){response.writeHead(200,{'content-type':'image/png'});response.end(Buffer.alloc(2048));return;}
    if(request.url==='/html.png'){response.writeHead(200,{'content-type':'text/html'});response.end('<html>denied</html>');return;}
    if(request.url.startsWith('/asset.png')||request.url==='/second.png'){response.writeHead(200,{'content-type':'image/png','content-length':png.length});response.end(png);return;}
    if(request.url==='/missing'){response.writeHead(404);response.end();return;}
    response.writeHead(404);response.end();
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const origin='http://127.0.0.1:'+server.address().port;
  const plan={schemaVersion:1,packageId:'PKG',contractId:'CONTRACT',sourceId:'REFERENCE',phase:'local-validation',policy:{authorization:'Synthetic engineering fixture only',allowedOrigins:[origin],publicQueryKeys:['w']},sources:[],seeds:[{url:origin+'/asset.png?w=1',kind:'image',evidenceId:'E-1',sha256:sha256(png)}]};
  try{await fn({dir,origin,plan,hits});}finally{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));removeFixture(dir);}
}
function reviewFor(root,origin){
  const {run,manifestSHA256}=tools.loadRun(root);
  return {schemaVersion:1,contractId:run.contractId,sourceId:run.sourceId,phase:run.phase,assetRunManifestSHA256:manifestSHA256,assessor:'engineering-fixture',coverage:[{id:'C-1',route:'/',state:'default',environmentId:'desktop',disposition:'complete',evidenceIds:['E-1'],surfaces:[{kind:'image',disposition:'complete',reason:'Required image inspected',evidenceIds:['E-1']}]}],obligations:[{id:'O-1',mode:'original',coverageIds:['C-1'],evidenceIds:['E-1'],authority:'Synthetic fixture contract',urls:[origin+'/asset.png?w=1'],slot:'hero',sourceMatch:{status:'confirmed',evidenceIds:['E-1']},reuse:{result:'NOT REQUIRED',authority:'Synthetic fixture contract',reason:'Local fixture only',phase:run.phase}}],dispositions:run.assets.map(a=>({url:a.url,mode:'required',obligationIds:['O-1'],authority:'Synthetic fixture contract',reason:'Implementation input',evidenceIds:['E-1']})),issueResolutions:[]};
}

test('asset probe is a standalone passive function and default capture plan remains compatible',()=>{
  const source=fs.readFileSync(new URL('./asset-probe.js',import.meta.url),'utf8');
  assert.equal(typeof vm.runInNewContext('('+source+'\n)'),'function');
  const plan=JSON.parse(fs.readFileSync(new URL('../assets/capture-plan.example.json',import.meta.url)));
  assert.equal(validatePlan(plan).plan.schemaVersion,2);
});
assetTest('maintained parsers cover responsive, pseudo, masks, fonts, imports and escaped URLs',()=>{
  const css='@import "nested.css"; @media (min-width: 40em){.hero::before{background:image-set("a.png" 1x,url("b.png") 2x);mask:url(sprite.svg#mask)}} @font-face{font-family:Original;src:url(font.woff2);font-weight:100 900}';
  const parsed=discovery.discover(Buffer.from(css),'css','https://example.com/css/main.css');
  assert.deepEqual(new Set(parsed.references.map(r=>r.url)),new Set(['https://example.com/css/nested.css','https://example.com/css/a.png','https://example.com/css/b.png','https://example.com/css/sprite.svg#mask','https://example.com/css/font.woff2']));
  assert.equal(parsed.references.find(r=>r.kind==='font').detail.font['font-weight'],'100 900');
  assert.ok(parsed.references.find(r=>r.url.endsWith('a.png')).detail.conditions.length);
  const html=discovery.discover(Buffer.from('<base href="/media/"><picture><source media="(min-width: 800px)" srcset="wide.png 2x"><img src="small.png" srcset="small.png 1x, large.png 2x"></picture><video poster="poster.png"><source src="movie.mp4"></video><svg xmlns="http://www.w3.org/2000/svg"><use href="icons.svg#mark"/></svg>'),'html','https://example.com/page');
  for(const name of ['wide.png','small.png','large.png','poster.png','movie.mp4','icons.svg#mark'])assert.ok(html.references.some(r=>r.url==='https://example.com/media/'+name));
  assert.ok(html.references.some(r=>r.via==='inline-svg'&&r.url.startsWith('data:')));
  const svg=discovery.discover(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" xml:base="/icons/"><g xml:base="nested/"><image href="image.png"/></g></svg>'),'svg','https://example.com/page.svg');assert.ok(svg.references.some(r=>r.url==='https://example.com/icons/nested/image.png'));
});
assetTest('declared JS references are separated from inferred strings; no source execution',()=>{
  const parsed=discovery.discover(Buffer.from('import x from "./chunk.js"; new Worker("./worker.js"); const u=new URL("./texture.png",import.meta.url); const maybe="/unused.png"; throw new Error("must not execute")'),'javascript','https://example.com/app.js');
  assert.ok(parsed.references.some(r=>r.url.endsWith('/worker.js')&&r.acquire));
  assert.ok(parsed.references.some(r=>r.url.endsWith('/unused.png')&&r.acquire===false));
  assert.ok(parsed.limits.some(l=>l.includes('computed URLs')));
  assert.ok(discovery.discover(Buffer.from('not valid {'),'css','https://example.com/main.css').limits.some(l=>l.startsWith('parse-failed')));
});
assetTest('streaming inventories acquire declared segments and retain encryption/template limits',()=>{
  const hls=discovery.discover(Buffer.from('#EXTM3U\n#EXT-X-TARGETDURATION:10\n#EXT-X-KEY:METHOD=AES-128,URI="secret-key"\n#EXTINF:10,\nsegment.ts\n#EXT-X-ENDLIST\n'),'media','https://example.com/media/playlist.m3u8');
  assert.ok(hls.references.some(r=>r.url.endsWith('/segment.ts')));
  assert.ok(!hls.references.some(r=>r.url.includes('secret-key')));
  assert.ok(hls.limits.some(l=>l.includes('Encrypted')));
  const master=discovery.discover(Buffer.from('#EXTM3U\n#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="aud",NAME="English",URI="audio.m3u8"\n#EXT-X-STREAM-INF:BANDWIDTH=100000,AUDIO="aud"\nvideo.m3u8\n'),'media','https://example.com/master.m3u8');assert.ok(master.references.some(r=>r.url==='https://example.com/audio.m3u8'));
  const dash=discovery.discover(Buffer.from('<MPD><Period><BaseURL>media/</BaseURL><AdaptationSet><Representation><SegmentList><Initialization sourceURL="init.mp4"/><SegmentURL media="first.m4s"/></SegmentList><SegmentTemplate media="segment-$Number$.m4s"/></Representation></AdaptationSet></Period></MPD>'),'media','https://example.com/main.mpd');
  assert.ok(dash.references.some(r=>r.url==='https://example.com/media/first.m4s'));
  assert.ok(dash.limits.some(l=>l.includes('SegmentTemplate')));
});
assetTest('acquisition keeps query identity, deduplicates equal bytes, seals originals and checks reference hashes',async()=>{
  await fixture(async({dir,origin,plan})=>{
    plan.seeds.push({url:origin+'/second.png',evidenceId:'E-2',kind:'image'});
    const out=path.join(dir,'run'),result=await tools.acquireAssets(plan,out);
    assert.equal(result.result,'ACQUIRED');
    const {run}=tools.loadRun(out);
    assert.equal(run.assets.length,2);assert.equal(run.assets[0].file,run.assets[1].file);
    assert.equal(run.assets[0].verification.status,'verified');
    assert.ok(run.assets[0].url.includes('?w=1'));
    await assert.rejects(tools.acquireAssets(plan,out),/Output exists/);
    const bad=structuredClone(plan);bad.seeds[0].sha256='0'.repeat(64);
    const badOut=path.join(dir,'wrong-version');await tools.acquireAssets(bad,badOut);
    assert.match(tools.loadRun(badOut).run.assets[0].reason,/identity mismatch/);
  });
});
assetTest('redirect, private query, partial, oversized and disguised HTML inputs never clear acquisition',async()=>{
  await fixture(async({dir,origin,plan,hits})=>{
    plan.policy.limits={maxAssetBytes:1024};plan.seeds=['redirect','private','partial','oversize','html.png'].map((name,i)=>({url:origin+'/'+name,kind:'image',evidenceId:'E-'+i}));
    const out=path.join(dir,'bad');assert.equal((await tools.acquireAssets(plan,out)).result,'INCOMPLETE');
    const rows=tools.loadRun(out).run.assets;
    assert.ok(rows.filter(r=>r.status==='unavailable').length===4);
    assert.equal(rows.find(r=>r.url.endsWith('/html.png')).verification.status,'failed');
    assert.ok(!hits.some(url=>url.includes('token')));
  });
});
assetTest('supplied dependency closure preserves inputs and resolves aliases, SVG fragments and embedded bytes',async()=>{
  await fixture(async({dir,origin,plan})=>{
    const input=path.join(dir,'supplied');fs.mkdirSync(input);
    fs.writeFileSync(path.join(input,'index.html'),'<link rel="stylesheet" href="style.css"><img src="asset.png?w=1"><svg xmlns="http://www.w3.org/2000/svg"><image href="asset.png?w=1"/></svg>');
    fs.writeFileSync(path.join(input,'style.css'),'.x{mask:url(mask.svg#shape);background:url(asset.png?w=1)}');
    fs.writeFileSync(path.join(input,'mask.svg'),'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><path id="shape" d="M0 0h1v1z"/></svg>');
    const before=inventory(input);
    plan.sources=['index.html','style.css','mask.svg'].map((name,i)=>({id:'S-'+i,type:'file',root:input,path:name,url:origin+'/'+name}));
    const out=path.join(dir,'supplied-run');await tools.acquireAssets(plan,out);
    const {run}=tools.loadRun(out);
    assert.ok(run.assets.find(r=>r.url.endsWith('/style.css')).dependencies.length===2);
    assert.ok(run.assets.some(r=>r.url.startsWith('data:sha256:')&&r.dependencies.length===1),JSON.stringify(run.assets));
    assert.deepEqual(inventory(input),before);
    assert.throws(()=>policy.confined(input,'../elsewhere'),/Unsafe/);
    await assert.rejects(tools.acquireAssets(plan,path.join(input,'nested')),/inside input/);
  });
});
assetTest('completeness is scoped and blocks missing dispositions, versions, reuse and unbound candidates',async()=>{
  await fixture(async({dir,origin,plan})=>{
    const root=path.join(dir,'run');await tools.acquireAssets(plan,root);
    const review=reviewFor(root,origin);
    assert.equal(tools.assessAssets(root,review).result,'PASS');
    for(const mutate of [
      r=>r.dispositions=[],
      r=>r.obligations[0].sourceMatch.status='pending',
      r=>r.obligations[0].reuse.result='BLOCKED',
      r=>r.coverage[0].surfaces=[],
      r=>r.obligations[0].urls=[origin+'/missing'],
      r=>r.obligations[0].mode='none'
    ]){const bad=structuredClone(review);mutate(bad);assert.equal(tools.assessAssets(root,bad).result,'BLOCKED');}
    const before=inventory(root),out=path.join(dir,'handoff');
    assert.equal(tools.handoffAssets(root,review,out).result,'PASS');
    const packet=JSON.parse(fs.readFileSync(path.join(out,'implementation-assets.json')));
    assert.equal(sha256(fs.readFileSync(path.join(out,packet.mapping[0].file))),packet.mapping[0].sha256);
    assert.equal(verify(out,JSON.parse(fs.readFileSync(path.join(out,'manifest.json')))).result,'PASS');
    assert.deepEqual(inventory(root),before);
    fs.writeFileSync(path.join(root,packet.mapping[0].file),'corrupt');
    assert.throws(()=>tools.assessAssets(root,review),/integrity failed/);
  });
});
assetTest('format verification distinguishes invalid SVG/raster/WASM and unsupported textures',async()=>{
  await fixture(async({dir,plan})=>{
    const limits=policy.policy(plan.policy).limits,file=path.join(dir,'asset.bin');
    for(const [bytes,kind,mime,status]of [[png,'image','image/png','verified'],[Buffer.from('<svg><g></svg>'),'svg','image/svg+xml','failed'],[Buffer.from('<html/>'),'svg','image/svg+xml','failed'],[Buffer.from([0,97,115,109,1,0,0,0]),'wasm','application/wasm','verified'],[Buffer.from('wrong'),'wasm','application/wasm','failed'],[Buffer.from([171,75,84,88,32,50,48,187]),'image','image/ktx2','unverified']]){
      fs.writeFileSync(file,bytes);assert.equal((await format.verifyAsset(file,kind,mime,limits)).status,status);
    }
  });
});
assetTest('glTF dependencies are loaded from confined acquired bytes without loader network',async()=>{
  await fixture(async({dir,origin,plan})=>{
    const root=path.join(dir,'inputs');fs.mkdirSync(root);
    fs.writeFileSync(path.join(root,'model.gltf'),JSON.stringify({asset:{version:'2.0'},buffers:[{uri:'data:application/octet-stream;base64,AAAAAA==',byteLength:4}],scenes:[{}],scene:0}));
    plan.seeds=[];plan.sources=[{id:'S-GLTF',type:'file',root,path:'model.gltf',url:origin+'/model.gltf',kind:'gltf'}];
    const out=path.join(dir,'gltf');await tools.acquireAssets(plan,out);
    const {run}=tools.loadRun(out);
    assert.equal(run.assets.find(r=>r.kind==='gltf').verification.status,'verified');
    assert.equal(run.assets.find(r=>r.kind==='binary').verification.status,'verified');
  });
});
assetTest('external verification is pinned and cannot override corrupted formats',async()=>{
  await fixture(async({dir,origin,plan})=>{
    const input=path.join(dir,'input');fs.mkdirSync(input);const bytes=Buffer.from([171,75,84,88,32,50,48,187]);fs.writeFileSync(path.join(input,'texture.ktx2'),bytes);
    plan.seeds=[];plan.sources=[{id:'S-TEX',type:'file',root:input,path:'texture.ktx2',url:origin+'/texture.ktx2',kind:'image'}];
    const root=path.join(dir,'run');await tools.acquireAssets(plan,root);
    const review=reviewFor(root,origin),url=origin+'/texture.ktx2';review.obligations[0].urls=[url];
    assert.equal(tools.assessAssets(root,review).result,'BLOCKED');
    review.verifications=[{url,sha256:sha256(bytes),result:'PASS',tool:'synthetic installed decoder',level:'Engineering verification receipt only',authority:'Synthetic fixture',evidenceIds:['E-TEX']}];
    assert.equal(tools.assessAssets(root,review).result,'PASS');
    review.verifications[0].sha256='0'.repeat(64);assert.equal(tools.assessAssets(root,review).result,'BLOCKED');
  });
});
assetTest('opt-in capture discovers selected responsive sources, pseudo assets, shadows and worker requests',async t=>{
  if(!process.env.REFERENCE_PLAYWRIGHT_MODULE){t.skip('Set REFERENCE_PLAYWRIGHT_MODULE for synthetic browser engineering tests');return;}
  await fixture(async({dir,origin})=>{
    const runtimeHits=[];const server=http.createServer((req,res)=>{runtimeHits.push({url:req.url,method:req.method});
      if(req.url==='/'){res.writeHead(200,{'content-type':'text/html'});res.end('<html><style>div::before{content:"";background-image:url("/pseudo.png")}</style><div id="box">Ready</div><img src="/small.png" srcset="/large.png 2x"><script>const host=document.createElement("section");document.body.append(host);host.attachShadow({mode:"open"}).innerHTML=\'<img src="/shadow.png">\';const worker=new Worker("/worker.js");fetch("/api",{method:"POST"});</script></html>');}
      else if(req.url==='/api'){res.writeHead(200,{'content-type':'application/json'});res.end('{}');}
      else if(req.url==='/worker.js'){res.writeHead(200,{'content-type':'text/javascript'});res.end('fetch("/texture.png").then(()=>postMessage("done"))');}
      else{res.writeHead(200,{'content-type':'image/png'});res.end(png);}
    });
    await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
    const base='http://127.0.0.1:'+server.address().port;
    const plan={schemaVersion:2,packageId:'RAW',contractId:'CONTRACT',sourceId:'REFERENCE',authorization:'Synthetic fixture',allowedOrigins:[base],publicQueryKeys:[],browserChannel:process.env.REFERENCE_BROWSER_CHANNEL||'chrome',totalTimeoutMs:30000,environments:[{id:'desktop',viewport:{width:800,height:600},deviceScaleFactor:2,fixture:'synthetic',session:'anonymous',consent:'none'}],cases:[{id:'home',environmentId:'desktop',url:base+'/',state:'default',reset:'fresh-context',checkpoints:[{id:'assets',phase:'settled',required:['#box'],stableSelectors:['#box'],timeoutMs:10000}]}],assetDiscovery:{authorization:'Synthetic public assets',allowedOrigins:[base],publicQueryKeys:[],limits:{maxAssets:100}}};
    try {
      const out=path.join(dir,'raw');const result=await capture(plan,out,process.env.REFERENCE_PLAYWRIGHT_MODULE);assert.equal(result.result,'CAPTURED',JSON.stringify(result));
      const observations=JSON.parse(fs.readFileSync(path.join(out,'asset-observations.json')));
      const item=observations.cases[0],refs=item.checkpoints.flatMap(cp=>cp.frames.flatMap(f=>f.references||[]));
      for(const name of ['large.png','pseudo.png','shadow.png'])assert.ok(refs.some(r=>r.url===base+'/'+name),name);
      assert.ok(item.network.some(r=>r.url===base+'/texture.png'));
      assert.ok(refs.some(r=>r.via==='declared-srcset'&&r.detail.variant.d===2));
      assert.equal(verify(out,JSON.parse(fs.readFileSync(path.join(out,'manifest.json')))).result,'PASS');
      const before=inventory(out),assetOut=path.join(dir,'runtime-assets');
      const acquisition={schemaVersion:1,packageId:'RUNTIME-ASSETS',contractId:'CONTRACT',sourceId:'REFERENCE',phase:'local-validation',policy:plan.assetDiscovery,sources:[{id:'RAW-INPUT',type:'capture',root:out}],seeds:[]};
      await tools.acquireAssets(acquisition,assetOut);
      const imported=tools.loadRun(assetOut).run;
      assert.ok(imported.assets.some(a=>a.url===base+'/texture.png'&&a.status==='acquired'&&a.verification.status==='verified'));
      assert.ok(imported.assets.some(a=>a.url===base+'/worker.js'&&a.status==='acquired'));
      assert.deepEqual(inventory(out),before);
      assert.equal(runtimeHits.filter(r=>r.url==='/api'&&r.method==='GET').length,0);assert.equal(imported.assets.find(a=>a.url===base+'/api')?.status,'not-acquired');
    }finally{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
  });
});

assetTest('bounded request timeout retains unavailable originals without leaking private URLs',async()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'reference-asset-timeout-'));
  const server=http.createServer((req,res)=>{res.writeHead(200,{'content-type':'image/png'});res.write(Buffer.from([1]));});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const origin='http://127.0.0.1:'+server.address().port;
  try{
    const plan={schemaVersion:1,packageId:'TIMEOUT',contractId:'FC',sourceId:'REF',phase:'inspection',policy:{authorization:'Synthetic fixture',allowedOrigins:[origin],publicQueryKeys:[],limits:{requestTimeoutMs:100,totalTimeoutMs:1000}},seeds:[{url:origin+'/pending.png',kind:'image',evidenceId:'E-PENDING'}]};
    const start=Date.now(),out=path.join(dir,'run');assert.equal((await tools.acquireAssets(plan,out)).result,'INCOMPLETE');
    assert.equal(tools.loadRun(out).run.assets[0].status,'unavailable');assert.ok(Date.now()-start<5000);
  }finally{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));removeFixture(dir);}
});
assetTest('font verification records actual parsed family, glyph coverage and metrics',async t=>{
  if(!process.env.REFERENCE_TEST_FONT){t.skip('Optional supplied font fixture via REFERENCE_TEST_FONT');return;}
  const result=await format.verifyAsset(process.env.REFERENCE_TEST_FONT,'font','font/ttf',policy.limitsDefault);
  assert.equal(result.status,'verified',JSON.stringify(result));
  assert.ok(result.metadata[0].numGlyphs>0);assert.ok(result.metadata[0].characterSet.length>0);assert.ok(result.metadata[0].family);
});
assetTest('installed FFprobe verifies original audio stream/container metadata',async t=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'reference-asset-media-'));
  try{
    const bytes=Buffer.alloc(44+1600);bytes.write('RIFF');bytes.writeUInt32LE(bytes.length-8,4);bytes.write('WAVE',8);bytes.write('fmt ',12);bytes.writeUInt32LE(16,16);bytes.writeUInt16LE(1,20);bytes.writeUInt16LE(1,22);bytes.writeUInt32LE(8000,24);bytes.writeUInt32LE(16000,28);bytes.writeUInt16LE(2,32);bytes.writeUInt16LE(16,34);bytes.write('data',36);bytes.writeUInt32LE(1600,40);
    const file=path.join(dir,'original.wav');fs.writeFileSync(file,bytes);
    const result=await format.verifyAsset(file,'audio','audio/wav',policy.limitsDefault);
    if(result.status==='unverified'&&result.reason==='FFprobe unavailable'){t.skip('Optional installed FFprobe');return;}
    assert.equal(result.status,'verified',JSON.stringify(result));assert.equal(result.metadata.streams[0].type,'audio');
  }finally{removeFixture(dir);}
});

assetTest('acquisition plan requires explicit portable identities and rejects unknown policies',async()=>{
  await fixture(async({plan})=>{
    for(const key of ['packageId','contractId','sourceId']){const bad=structuredClone(plan);delete bad[key];assert.throws(()=>policy.validateAcquisition(bad),/Invalid/);}
    const bad=structuredClone(plan);bad.policy.execute='untrusted';assert.throws(()=>policy.validateAcquisition(bad),/Unknown/);
    const query=structuredClone(plan);query.seeds[0].url+='&token=private';assert.throws(()=>policy.validateAcquisition(query),/private/);
  });
});

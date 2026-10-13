import test, { mock } from 'node:test';
import assert from 'node:assert/strict';
import fsPromises, { mkdtemp, writeFile, readFile, mkdir, rm, symlink, link, stat, rename } from 'node:fs/promises';
import { syncBuiltinESMExports } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { reviewCaptures } from './review.mjs';

const prefix=path.join(tmpdir(),'creative-review-');
async function fixture(run) {
  const directory=await mkdtemp(prefix);
  try { await run(directory); } finally { assert.ok(path.resolve(directory).startsWith(prefix)); await rm(directory,{recursive:true,force:true}); }
}
const frame=(file,progress,extra={})=>({file,label:file,scene:'product',viewport:{width:100,height:100},progress,atMs:progress*1000,direction:'forward',expectation:'change',...extra});
async function image(directory,name,color) { await sharp({create:{width:100,height:100,channels:3,background:color}}).png().toFile(path.join(directory,name)); }
async function manifest(directory,frames) { const file=path.join(directory,'captures.json'); await writeFile(file,JSON.stringify({schemaVersion:1,frames})); return file; }

test('review distinguishes changing poses, suspected holds, intended reading and mobile groups without changing evidence',async()=>fixture(async directory=>{
  await image(directory,'a.png','red'); await image(directory,'b.png','blue');
  const original=await readFile(path.join(directory,'a.png'));
  const source=await manifest(directory,[frame('a.png',0),frame('a.png',0.2),frame('b.png',0.4,{expectation:'hold',reason:'read proof'}),frame('b.png',0.6),frame('b.png',0.8,{viewport:{width:390,height:844}})]);
  const report=await reviewCaptures(source,path.join(directory,'review'));
  assert.deepEqual(report.intervals.map(interval=>interval.status),['suspected-unexpected-hold','review-transition','intentional-hold-review','not-comparable']);
  assert.equal(report.humanApproval,'pending'); assert.equal(report.frames.length,5);
  assert.match(report.frames[0].sha256,/^[a-f0-9]{64}$/);
  assert.deepEqual(await readFile(path.join(directory,'a.png')),original);
  const sheet=await sharp(await readFile(path.join(directory,'review','contact-sheet.webp'))).metadata();
  assert.equal(sheet.width,1320); assert.equal(sheet.height,660);
}));
test('actual stable rendered pose flags a hold even when atmosphere changes; reverse comparisons remain useful',async()=>fixture(async directory=>{
  await image(directory,'a.png','red'); await image(directory,'b.png','blue');
  const source=await manifest(directory,[frame('a.png',1,{direction:'reverse',renderedState:{pose:2}}),frame('b.png',0.5,{direction:'reverse',renderedState:{pose:2}})]);
  const report=await reviewCaptures(source,path.join(directory,'review'));
  assert.equal(report.intervals[0].status,'suspected-unexpected-hold'); assert.ok(report.intervals[0].meanPixelDifference>10);
}));
test('review rejects malformed holds, excessive frame count and source overwrite',async()=>fixture(async directory=>{
  await image(directory,'a.png','red'); await image(directory,'b.png','blue');
  let source=await manifest(directory,[frame('a.png',0,{expectation:'static'}),frame('b.png',1)]);
  await assert.rejects(reviewCaptures(source,path.join(directory,'review')),/needs a reason/);
  source=await manifest(directory,Array.from({length:49},()=>frame('a.png',0)));
  await assert.rejects(reviewCaptures(source,path.join(directory,'review')),/2\.\.48/);
  const target=path.join(directory,'review'); await mkdir(target); await image(target,'contact-sheet.webp','red');
  source=await manifest(directory,[frame('review/contact-sheet.webp',0),frame('b.png',1)]);
  const bytes=await readFile(path.join(target,'contact-sheet.webp'));
  await assert.rejects(reviewCaptures(source,target),/overwrite source/);
  assert.deepEqual(await readFile(path.join(target,'contact-sheet.webp')),bytes);
}));
test('focus comparison catches a static subject; path traversal and linked outside roots are rejected',async()=>fixture(async directory=>{
  await image(directory,'a.png','red'); await image(directory,'b.png','blue');
  let source=await manifest(directory,[frame('a.png',0,{focus:{left:0,top:0,width:101,height:100}}),frame('b.png',1)]);
  await assert.rejects(reviewCaptures(source,path.join(directory,'review')),/must fit/);
  const nested=path.join(directory,'nested'); await mkdir(nested);
  source=await manifest(nested,[frame('../a.png',0),frame('../b.png',1)]);
  await assert.rejects(reviewCaptures(source,path.join(nested,'review')),/manifest directory/);
  await symlink(directory,path.join(nested,'outside'),process.platform==='win32'?'junction':'dir');
  source=await manifest(nested,[frame('outside/a.png',0),frame('outside/b.png',1)]);
  await assert.rejects(reviewCaptures(source,path.join(nested,'review')),/manifest directory/);
}));
test('hard-linked capture and manifest targets preserve source bytes on rejected review',async()=>fixture(async directory=>{
  await image(directory,'a.png','red'); await image(directory,'b.png','blue');
  const source=await manifest(directory,[frame('a.png',0),frame('b.png',1)]);
  const capturesBefore=await readFile(path.join(directory,'a.png')), manifestBefore=await readFile(source);
  const output=path.join(directory,'linked-capture'); await mkdir(output);
  await link(path.join(directory,'a.png'),path.join(output,'contact-sheet.webp'));
  await assert.rejects(reviewCaptures(source,output),/source-file identity/);
  assert.deepEqual(await readFile(path.join(directory,'a.png')),capturesBefore);
  const output2=path.join(directory,'linked-manifest'); await mkdir(output2);
  await link(source,path.join(output2,'review.json'));
  await assert.rejects(reviewCaptures(source,output2),/source-file identity/);
  assert.deepEqual(await readFile(source),manifestBefore);
}));
test('equivalent focus rectangles compare regardless of JSON key order',async()=>fixture(async directory=>{
  await image(directory,'a.png','red');
  const source=await manifest(directory,[frame('a.png',0,{focus:{left:0,top:0,width:50,height:50}}),frame('a.png',1,{focus:{height:50,width:50,top:0,left:0}})]);
  const report=await reviewCaptures(source,path.join(directory,'review'));
  assert.equal(report.intervals[0].status,'suspected-unexpected-hold');
}));
test('directory manifests and capture sources are rejected as non-regular inputs',async()=>fixture(async directory=>{
  await assert.rejects(reviewCaptures(directory,path.join(directory,'review')),/regular files/);
  const source=await manifest(directory,[frame('.',0),frame('.',1)]);
  await assert.rejects(reviewCaptures(source,path.join(directory,'review')),/regular files/);
}));
test('semantic painted states detect stalls through atmosphere regardless of key order',async()=>fixture(async directory=>{
  await image(directory,'a.png','red'); await image(directory,'b.png','blue');
  const source=await manifest(directory,[frame('a.png',0,{renderedState:{pose:2,camera:{x:1,y:2}}}),frame('b.png',1,{renderedState:{camera:{y:2,x:1},pose:2}})]);
  const report=await reviewCaptures(source,path.join(directory,'review'));
  assert.equal(report.intervals[0].status,'suspected-unexpected-hold');
}));
test('alpha changes count as visible changes; invisible RGB and null state do not fake progression',async()=>fixture(async directory=>{
  for (const [name,color] of [['opaque',{r:255,g:255,b:255,alpha:1}],['clear',{r:255,g:255,b:255,alpha:0}],['clear-blue',{r:0,g:0,b:255,alpha:0}]]) await sharp({create:{width:100,height:100,channels:4,background:color}}).png().toFile(path.join(directory,name+'.png'));
  const source=await manifest(directory,[frame('opaque.png',0,{renderedState:null}),frame('clear.png',0.5,{renderedState:null}),frame('clear-blue.png',1)]);
  const report=await reviewCaptures(source,path.join(directory,'review'));
  assert.equal(report.intervals[0].status,'review-transition'); assert.equal(report.intervals[0].renderedStateSame,null);
  assert.equal(report.intervals[1].status,'suspected-unexpected-hold');
}));
test('case aliases preserve source manifest on the actual filesystem without platform assumptions',async()=>fixture(async directory=>{
  await image(directory,'a.png','red'); await image(directory,'b.png','blue');
  const source=path.join(directory,'Review.json'); const original=JSON.stringify({schemaVersion:1,frames:[frame('a.png',0),frame('b.png',1)]}); await writeFile(source,original);
  let aliases=false;
  try { const a=await stat(source,{bigint:true}), b=await stat(path.join(directory,'review.json'),{bigint:true}); aliases=a.dev===b.dev && a.ino===b.ino; } catch(error) { if(error.code!=='ENOENT') throw error; }
  if(aliases) await assert.rejects(reviewCaptures(source,directory),/source evidence|source-file identity/);
  else await reviewCaptures(source,directory);
  assert.equal(await readFile(source,'utf8'),original);
}));
test('validated input handle rejects a replaced pathname before consuming substituted bytes',async()=>fixture(async directory=>{
  await image(directory,'a.png','red'); await image(directory,'b.png','blue');
  const source=await manifest(directory,[frame('a.png',0),frame('b.png',1)]), originalOpen=fsPromises.open;
  const replacement=path.join(directory,'b.png'), capture=path.join(directory,'a.png'); let changed=false;
  mock.method(fsPromises,'open',async(...args)=>{
    if(args[0]===capture && !changed) { changed=true; await rename(capture,path.join(directory,'original.png')); await link(replacement,capture); }
    return originalOpen(...args);
  }); syncBuiltinESMExports();
  try { await assert.rejects(reviewCaptures(source,path.join(directory,'review')),/identity\/location changed/); }
  finally { mock.restoreAll(); syncBuiltinESMExports(); }
  assert.equal(changed,true);
}));
test('exclusive output creation preserves evidence if a link appears after destination checks',async()=>fixture(async directory=>{
  await image(directory,'a.png','red'); await image(directory,'b.png','blue');
  const source=await manifest(directory,[frame('a.png',0),frame('b.png',1)]), originalWrite=fsPromises.writeFile;
  const capture=path.join(directory,'a.png'), bytes=await readFile(capture), output=path.join(directory,'review'); let changed=false;
  mock.method(fsPromises,'writeFile',async(...args)=>{
    if(args[0]===path.join(output,'contact-sheet.webp') && !changed) { changed=true; await link(capture,args[0]); }
    return originalWrite(...args);
  }); syncBuiltinESMExports();
  try { await assert.rejects(reviewCaptures(source,output),{code:'EEXIST'}); }
  finally { mock.restoreAll(); syncBuiltinESMExports(); }
  assert.equal(changed,true); assert.deepEqual(await readFile(capture),bytes);
}));
test('review rounds preserve existing reports instead of overwriting them',async()=>fixture(async directory=>{
  await image(directory,'a.png','red'); await image(directory,'b.png','blue');
  const source=await manifest(directory,[frame('a.png',0),frame('b.png',1)]), output=path.join(directory,'review');
  await reviewCaptures(source,output); const bytes=await readFile(path.join(output,'review.json'));
  await assert.rejects(reviewCaptures(source,output),/fresh round/);
  assert.deepEqual(await readFile(path.join(output,'review.json')),bytes);
}));

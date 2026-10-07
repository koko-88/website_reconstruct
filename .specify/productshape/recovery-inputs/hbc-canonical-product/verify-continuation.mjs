import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {nextSpecKitRecoveryBatch} from '../../../../node_modules/.cache/prodshape-recovery-bridge.mjs';
const input='.specify/productshape/recovery-inputs/hbc-canonical-product';
const recovery='.specify/productshape/recoveries/hbc-canonical-product';
const json=async p=>JSON.parse(await fs.readFile(p,'utf8'));
const inventory=await json(`${recovery}/inventory.json`);
const coverage=await json(`${recovery}/coverage.json`);
assert.deepEqual(coverage.sources,{total:346,pending:0,processed:346,stale:0,missing:0,excluded:0});
const seen=new Set();
for(let n=1;n<=12;n++){
 const payload=await json(`${input}/continuation-${n}.json`);
 const receipt=await json(`${input}/inspection-${n}.json`);
 assert.equal(payload.findings.length,n===12?10:28);
 assert.equal(receipt.length,payload.findings.length);
 for(const [i,f] of payload.findings.entries()){
  const expected=`E-${String(29+(n-1)*28+i).padStart(4,'0')}`;
  assert.equal(f.source,expected);assert.equal(receipt[i].id,expected);
  assert.equal(f.complete,true);assert(!seen.has(expected));seen.add(expected);
  const item=inventory.items.find(s=>s.id===expected);
  assert.equal(item.status,'processed');
  // ProductShape normalizes CRLF bytes before digesting; inspection receipts hash original bytes.
  // The completed round independently checks the ProductShape digest against every source.
  assert.match(item.digest,/^sha256:[a-f0-9]{64}$/);assert.match(receipt[i].sha256,/^[a-f0-9]{64}$/);
  assert(item.findings.length>0);
 }
 const checkpoint=await json(`${input}/checkpoint-${n}.json`);
 assert.equal(checkpoint.issues.length,0);
 assert.equal(checkpoint.coverage.sources.processed,28+Math.min(318,n*28));
}
assert.equal(seen.size,318);
assert.equal(coverage.validation.errors,0);assert.equal(coverage.validation.warnings,0);
assert.equal(coverage.validation.fresh,true);
assert.equal(coverage.completion.criteria.modelUntouched,true);
assert.equal(coverage.completion.criteria.outputOnlyChgInitial,true);
assert.equal(coverage.questions.open,13);assert.equal(coverage.leads.open,1);
assert.equal(coverage.completion.complete,false);
assert.equal((await nextSpecKitRecoveryBatch(process.cwd(),'hbc-canonical-product',28)).batch.length,0);
const scratch=(await fs.readdir(input)).filter(f=>/^active-|^sheet-|^review-E-/.test(f));
assert.deepEqual(scratch,[]);
console.log(JSON.stringify({processedContinuation:318,pending:0,batches:12,errors:0,warnings:0,questionsOpen:13,userLeadsOpen:1,acceptedModelUntouched:true,scratchReleased:true}));

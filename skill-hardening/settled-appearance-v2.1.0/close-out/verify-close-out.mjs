import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {inventory,sha256,verify} from '../../../skills/reference-reconstruction/scripts/package.mjs';

// Run from the repository root after the canonical validation commands.
const root='skill-hardening/settled-appearance-v2.1.0';
const out=root+'/close-out';
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const baseline=read(root+'/baseline.json');
const original=read(root+'/final-verification.json');
const audit=read(out+'/deletion-audit.json');
const frozen=baseline.roots.slice(0,2).map(b=>{
  assert.deepEqual(inventory(b.root),b.files,'Immutable file inventory changed: '+b.root);
  if(b.manifest!==null) assert.equal(sha256(fs.readFileSync(b.root+'/manifest.json')),b.manifest);
  const result=verify(b.root,{files:b.files});
  assert.equal(result.result,'PASS',JSON.stringify(result.problems));
  return {root:b.root,unchanged:true,manifestUnchanged:true,...result};
});
assert.deepEqual(inventory(root+'/before'),baseline.roots[2].files);
const repo='skills/reference-reconstruction';
const installed='C:/Users/kerol/.agents/skills/reference-reconstruction';
const skillFiles=inventory(repo);
assert.deepEqual(inventory(installed),skillFiles,'Installed copy differs');
const skillVerification=verify(repo,{files:skillFiles});
const installedVerification=verify(installed,{files:skillFiles});
assert.equal(skillVerification.result,'PASS',JSON.stringify(skillVerification.problems));
assert.equal(installedVerification.result,'PASS');
assert.equal(sha256(fs.readFileSync(original.contract.path)),original.contract.sha256,'Implementation contract changed');
assert.deepEqual(inventory(root).filter(f=>!f.path.startsWith('close-out/')),audit.retained,'Retained evidence changed or scratch artifacts present');
for(const file of audit.removed) assert.equal(fs.existsSync(root+'/'+file.path),false);
for(const file of original.artifacts) assert.equal(sha256(fs.readFileSync(root+'/'+file.path)),file.sha256);
const forwardHashes=read(root+'/forward-validation/final-source-hashes.json');
const forwardSourceComparison=forwardHashes.map(file=>{
  const current=sha256(fs.readFileSync(repo+'/scripts/'+file.file));
  const finalHash=original.changes.find(c=>c.path==='scripts/'+file.file)?.after?.sha256??file.sha256.toLowerCase();
  assert.equal(current,finalHash,'Final 2.1.0 inspection/test source changed');
  return {file:file.file,current,independentEvaluation:file.sha256.toLowerCase(),matchesEarlierEvaluation:current===file.sha256.toLowerCase(),matchesFinal210:true};
});
const replay=read(out+'/forward-replay.json');
assert.equal(replay.result,'PASS');
assert.deepEqual(replay.skillFiles,skillFiles);
assert.equal(replay.portable.changingRegion.state,'unresolved');
assert.equal(replay.portable.refusedScreenshot.convergencePass,false);
assert.equal(replay.portable.refusedScreenshot.pngPresent,false);
assert.equal(replay.finiteAncestor.convergencePass,false);
assert.equal(replay.finiteAncestor.ancestorIncluded,true);

function summary(file,browser) {
  const log=fs.readFileSync(out+'/'+file,'utf8');
  const values=Object.fromEntries(['tests','pass','fail','cancelled','skipped','todo'].map(k=>{
    const matches=[...log.matchAll(new RegExp('^# '+k+' (\\d+)\\r?$','gm'))];
    assert.equal(matches.length,1,'Missing/ambiguous TAP total: '+k);
    return [k,Number(matches[0][1])];
  }));
  assert.deepEqual(values,browser?{tests:25,pass:25,fail:0,cancelled:0,skipped:0,todo:0}:{tests:13,pass:11,fail:0,cancelled:0,skipped:2,todo:0});
  assert.ok(log.startsWith('Reference regression mode: '+(browser?'browser-enabled, serial (test-concurrency=1)':'dependency-free, default concurrency')));
  return {log:file,mode:browser?'serial browser':'default concurrency, browser disabled',...values};
}
const tests=[summary('tests-lightweight.log',false),summary('tests-repository.log',true),summary('tests-installed.log',true)];
for(const file of ['quick-validation-repository.log','quick-validation-installed.log']) assert.equal(fs.readFileSync(out+'/'+file,'utf8').trim(),'Skill is valid!');
const closeOutFiles=['deletion-audit.json','verify-close-out.mjs','replay-forward.mjs','forward-replay.json','close-out-report.md','reference-reconstruction-2.1.1.patch','tests-lightweight.log','tests-repository.log','tests-installed.log','quick-validation-repository.log','quick-validation-installed.log','synthetic-signals-repository.json','synthetic-signals-installed.json','verification.json'];
for(const file of inventory(out)) assert.ok(closeOutFiles.includes(file.path),'Unexpected close-out artifact: '+file.path);
for(const file of closeOutFiles.filter(f=>f!=='verification.json')) assert.ok(fs.existsSync(out+'/'+file),'Missing close-out artifact: '+file);
// Check cross-package report/contract links within the repository separately.
for(const file of [...inventory(root).filter(f=>f.path.endsWith('.md')).map(f=>root+'/'+f.path),original.contract.path]) {
  for(const match of fs.readFileSync(file,'utf8').matchAll(/!?\[[^\]]*\]\((<[^>]+>|[^)\s]+)(?:\s+"[^"]*")?\)/g)) {
    const target=match[1].replace(/^<|>$/g,'');
    if(/^[a-z][a-z0-9+.-]*:/i.test(target)||target.startsWith('#'))continue;
    const resolved=path.resolve(path.dirname(file),decodeURIComponent(target.split('#')[0].split('?')[0]));
    assert.ok(resolved.startsWith(path.resolve('.')+path.sep),'Link outside repository: '+target);
    assert.ok(fs.existsSync(resolved)||resolved===path.resolve(out+'/verification.json'),'Missing link: '+target);
  }
}
const git=args=>{
  const r=spawnSync('git',['-c','safe.directory=K:/website_reconstruct',...args],{encoding:'utf8'});
  assert.equal(r.status,0,r.stderr);return r.stdout.trimEnd();
};
const allowed=new Set(['skills/reference-reconstruction/SKILL.md','skills/reference-reconstruction/references/capture-plan.md','skills/reference-reconstruction/references/settled-appearance.md','skills/reference-reconstruction/scripts/run-tests.mjs',...audit.removed.map(f=>root+'/'+f.path),...closeOutFiles.map(f=>out+'/'+f)]);
const status=git(['status','--porcelain','--untracked-files=all','--ignored']);
const changed=status.split('\n').filter(Boolean).map(line=>line.trimEnd().slice(3));
for(const file of changed) assert.ok(allowed.has(file),'Unexpected repository change/scratch: '+file);
const diagnostics=['synthetic-signals-repository.json','synthetic-signals-installed.json'].map(file=>{
  const data=read(out+'/'+file);assert.ok(data.records.length>0);
  return {path:file,browserVersion:data.browserVersion,playwrightVersion:data.playwrightVersion,records:data.records.length};
});
const artifacts=inventory(out).filter(f=>f.path!=='verification.json');
const result={result:'PASS',checkedAtUTC:new Date().toISOString(),nodeVersion:process.version,baselineCommit:git(['rev-parse',audit.baselineCommit]),frozen,backupMatchesOriginallyInstalled:true,installedMatchesRepository:true,skillVerification,installedVerification,skillFiles,contract:{...original.contract,unchanged:true},retainedOriginalEvidence:audit.retained.length,removed:audit.removed.length,independentForwardEvidenceUnchanged:true,final210InspectionSourceUnchanged:true,forwardSourceComparison,currentSourceForwardReplay:'PASS (parent replay, not a new independent assessment)',tests,diagnostics,artifacts,repositoryChanges:changed,scratchArtifacts:[],limit:'Inspection/hardening close-out only; no implemented product fidelity acceptance. Asset decisions and target mappings retain their contract gates.'};
fs.writeFileSync(out+'/verification.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({result:result.result,frozen:frozen.map(f=>({root:f.root,files:f.files,result:f.result})),installedMatchesRepository:true,tests,removed:result.removed,scratchArtifacts:[]},null,2));

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {inventory,sha256} from '../../../skills/reference-reconstruction/scripts/package.mjs';

// Reuse the independent corrected reproducers in an isolated mirrored layout.
// This is a parent replay against final source, not a new independent assessment.
const root='skill-hardening/settled-appearance-v2.1.0';
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'reference-close-out-'));
const evaluations=['portable-postfix-evaluation.mjs','finite-ancestor-postfix-evaluation.mjs'];
try {
  fs.mkdirSync(path.join(temp,'skills'),{recursive:true});
  fs.cpSync('skills/reference-reconstruction',path.join(temp,'skills/reference-reconstruction'),{recursive:true});
  const target=path.join(temp,root,'forward-validation');
  fs.mkdirSync(target,{recursive:true});
  const executions=[];
  for(const script of evaluations) {
    const source=fs.readFileSync(root+'/forward-validation/'+script);
    fs.writeFileSync(path.join(target,script),source);
    const result=spawnSync(process.execPath,[path.join(target,script)],{cwd:temp,encoding:'utf8',timeout:30000,maxBuffer:5_000_000});
    assert.equal(result.status,0,result.stderr||result.error?.message);
    executions.push({script,sha256:sha256(source),exitCode:result.status,stdout:result.stdout,stderr:result.stderr});
  }
  const read=file=>JSON.parse(fs.readFileSync(path.join(target,file),'utf8'));
  const portable=read('portable-postfix-results.json');
  const finiteAncestor=read('finite-ancestor-postfix-results.json');
  assert.equal(portable.changingRegion.state,'unresolved');
  assert.equal(portable.refusedScreenshot.convergencePass,false);
  assert.equal(portable.refusedScreenshot.pngPresent,false);
  assert.equal(finiteAncestor.state,'unresolved');
  assert.equal(finiteAncestor.convergencePass,false);
  assert.equal(finiteAncestor.ancestorIncluded,true);
  fs.writeFileSync(root+'/close-out/forward-replay.json',JSON.stringify({result:'PASS',checkedAtUTC:new Date().toISOString(),method:'Parent replay of retained independent corrected reproducers in a disposable mirrored workspace; data-only, no browser or reference access',nodeVersion:process.version,skillFiles:inventory('skills/reference-reconstruction'),executions,portable,finiteAncestor,giantRun:read('data-only-giant-run-postfix/run.json'),giantCheckpoint:read('data-only-giant-run-postfix/GIANT--VIEWPORT.json')},null,2)+'\n');
  console.log('PASS: both corrected forward reproducers against current source');
} finally {
  const resolved=path.resolve(temp);
  assert.equal(path.dirname(resolved),path.resolve(os.tmpdir()));
  assert.ok(path.basename(resolved).startsWith('reference-close-out-'));
  fs.rmSync(resolved,{recursive:true,force:true});
}

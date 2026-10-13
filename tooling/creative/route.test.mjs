import test from 'node:test';
import assert from 'node:assert/strict';
import { routeCapabilities } from './route.mjs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, realpathSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
test('DOM/motion routing never selects a rendering engine', () => {
  assert.deepEqual(routeCapabilities().engines, []);
  const motion = routeCapabilities(['dom', 'motion']);
  assert.deepEqual(motion.engines, []);
  assert.ok(!motion.peers.includes('three') && !motion.peers.includes('pixi.js'));
  assert.deepEqual(routeCapabilities(['assets']).peers, []);
  assert.deepEqual(routeCapabilities(['textures']).peers, ['three']);
});
test('discovery honors the documented glTF Transform CLI override', () => {
  const output = execFileSync(process.execPath, [fileURLToPath(new URL('./discover.mjs', import.meta.url))], {
    env: { ...process.env, CREATIVE_GLTF_TRANSFORM_CLI: process.execPath }, encoding: 'utf8', timeout: 15000,
  });
  const entry = JSON.parse(output).commands.find(command => command.name === 'gltf-transform');
  assert.equal(entry.path, process.execPath);
  assert.equal(entry.override, 'CREATIVE_GLTF_TRANSFORM_CLI');
  assert.equal(entry.status, 'entrypoint-found-not-exercised');
  for (const invalid of ['tooling/creative/route.mjs', process.cwd()]) {
    const invalidOutput = execFileSync(process.execPath, [fileURLToPath(new URL('./discover.mjs', import.meta.url))], {
      env: { ...process.env, CREATIVE_GLTF_TRANSFORM_CLI: invalid }, encoding: 'utf8', timeout: 15000,
    });
    const rejected = JSON.parse(invalidOutput).commands.find(command => command.name === 'gltf-transform');
    assert.equal(rejected.status, 'invalid-override'); assert.equal(rejected.path, null);
  }
});
test('combined profiles deduplicate peers and reject unknown capabilities', () => {
  const result = routeCapabilities(['spatial', 'particles', 'spatial']);
  assert.deepEqual(result.engines, ['three', 'pixi.js']);
  assert.equal(result.peers.filter(name => name === 'react').length, 1);
  assert.throws(() => routeCapabilities(['unknown']), /Unknown capability/);
  const review = routeCapabilities(['review']);
  assert.deepEqual(review.toolsToProbe, []);
  assert.deepEqual(review.mcpToProbe, ['chrome-devtools', 'polypane-devtools', 'spector']);
});
test('discovery resolves selected consumer-local packages without executing or installing them',()=>{
  const prefix=path.join(tmpdir(),'creative-discovery-'); const directory=mkdtempSync(prefix);
  try {
    writeFileSync(path.join(directory,'package.json'),JSON.stringify({name:'consumer-fixture',private:true}));
    const moduleDirectory=path.join(directory,'node_modules','@ai-factory','creative-core'); mkdirSync(moduleDirectory,{recursive:true});
    writeFileSync(path.join(moduleDirectory,'package.json'),JSON.stringify({name:'@ai-factory/creative-core',version:'9.9.9-test',main:'index.js'}));
    writeFileSync(path.join(moduleDirectory,'index.js'),'throw new Error("Discovery must not execute this module")');
    const report=JSON.parse(execFileSync(process.execPath,[fileURLToPath(new URL('./discover.mjs',import.meta.url)),'--consumer',directory],{encoding:'utf8',timeout:15000}));
    assert.equal(report.resolutionRoot,directory);
    assert.equal(report.packages.find(entry=>entry.name==='@ai-factory/creative-core').version,'9.9.9-test');
    assert.equal(report.packages.find(entry=>entry.name==='three').status,'unavailable');
  } finally { assert.ok(realpathSync(directory).startsWith(prefix)); rmSync(directory,{recursive:true,force:true}); }
});
test('discovery resolves relative and empty PATH entries without weakening absolute override validation',()=>{
  const prefix=path.join(tmpdir(),'creative-discovery-'); const directory=mkdtempSync(prefix);
  try {
    mkdirSync(path.join(directory,'bin')); writeFileSync(path.join(directory,'bin','toktx.exe'),'fixture only'); writeFileSync(path.join(directory,'magick.exe'),'fixture only');
    const report=JSON.parse(execFileSync(process.execPath,[fileURLToPath(new URL('./discover.mjs',import.meta.url))],{cwd:directory,env:{...process.env,PATH:['bin',''].join(path.delimiter),CREATIVE_TOKTX_PATH:undefined,CREATIVE_MAGICK_PATH:undefined},encoding:'utf8',timeout:15000}));
    assert.equal(report.commands.find(entry=>entry.name==='toktx').path,path.join(directory,'bin','toktx.exe'));
    assert.equal(report.commands.find(entry=>entry.name==='magick').path,path.join(directory,'magick.exe'));
    assert.equal(report.commands.find(entry=>entry.name==='toktx').status,'entrypoint-found-not-exercised');
  } finally { assert.ok(realpathSync(directory).startsWith(prefix)); rmSync(directory,{recursive:true,force:true}); }
});

test('task-scoped discovery does not probe irrelevant engines or invalid overrides', () => {
  const cli = fileURLToPath(new URL('./discover.mjs', import.meta.url));
  const report = JSON.parse(execFileSync(process.execPath, [cli, 'dom', 'motion'], {
    encoding: 'utf8', env: { ...process.env, CREATIVE_BLENDER_PATH: 'invalid irrelevant override' }, timeout: 15000,
  }));
  assert.deepEqual(report.profiles, ['dom', 'motion']); assert.deepEqual(report.commands, []);
  assert.ok(!report.packages.some(item => item.name === 'three' || item.name === 'pixi.js'));
  assert.ok(!report.skills.some(item => item.name === 'pixijs'));
  for (const args of [['missing'], ['--unknown'], ['--consumer'], ['--output'], ['--mcp-inventory']]) {
    assert.throws(() => execFileSync(process.execPath, [cli, ...args], { encoding: 'utf8', stdio: 'pipe', timeout: 15000 }));
  }
});

test('explicit discovery output refreshes a current snapshot without retaining stale profiles', () => {
  const prefix = path.join(tmpdir(), 'creative-discovery-'); const directory = mkdtempSync(prefix);
  try {
    const output = path.join(directory, 'current.json'); const cli = fileURLToPath(new URL('./discover.mjs', import.meta.url));
    writeFileSync(output, JSON.stringify({ profiles: ['stale'], commands: ['obsolete'] }));
    execFileSync(process.execPath, [cli, 'dom', '--output', output], { stdio: 'pipe', timeout: 15000 });
    assert.deepEqual(JSON.parse(readFileSync(output, 'utf8')).profiles, ['dom']);
    execFileSync(process.execPath, [cli, 'motion', '--output', output], { stdio: 'pipe', timeout: 15000 });
    const current = JSON.parse(readFileSync(output, 'utf8'));
    assert.deepEqual(current.profiles, ['motion']); assert.deepEqual(current.commands, []);
    assert.ok(current.packages.some(entry => entry.name === 'gsap'));
  } finally { assert.ok(realpathSync(directory).startsWith(prefix)); rmSync(directory, { recursive: true, force: true }); }
});

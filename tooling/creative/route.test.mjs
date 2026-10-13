import test from 'node:test';
import assert from 'node:assert/strict';
import { routeCapabilities } from './route.mjs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
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

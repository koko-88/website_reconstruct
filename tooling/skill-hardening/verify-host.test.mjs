import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const script = fileURLToPath(new URL('./verify-host.mjs', import.meta.url));
const repoRoot = path.resolve(path.dirname(script), '../..');

test('read-only Stage 2 preflight produces a parseable and consistent capability inventory', () => {
  const run = spawnSync(process.execPath, [script], {
    cwd: repoRoot, encoding: 'utf8', timeout: 90000, maxBuffer: 256 * 1024,
  });
  assert.equal(run.status, 0, run.stderr || 'Preflight should not fail for optional tools');
  const result = JSON.parse(run.stdout);
  assert.equal(result.schema, 'website-reconstruction/skill-hardening-host-preflight/v1');
  assert.equal(result.readOnly, true);
  assert.equal(result.host.platform, process.platform);
  assert.equal(result.host.arch, process.arch);
  const ids = result.capabilities.map(c => c.id);
  assert.equal(ids.length, new Set(ids).size, 'No duplicate capability IDs');
  for (const id of ['node', 'npm', 'mise', 'uv', 'promptfoo', 'inspect-ai', 'ffmpeg', 'docker', 'playwright', 'skill-creator']) {
    assert(ids.includes(id), 'Missing declared capability: ' + id);
  }
  assert(result.capabilities.every(c => typeof c.available === 'boolean'));
  assert.deepEqual(result.requiredFailures, result.capabilities.filter(c => c.required && !c.available).map(c => c.id));
  assert.deepEqual(result.optionalMissing, result.capabilities.filter(c => !c.required && !c.available).map(c => c.id));
});

test('strict mode exits only if a required host prerequisite is missing', () => {
  const run = spawnSync(process.execPath, [script, '--strict'], {
    cwd: repoRoot, encoding: 'utf8', timeout: 90000, maxBuffer: 256 * 1024,
  });
  const result = JSON.parse(run.stdout);
  assert.equal(run.status === 0, result.requiredFailures.length === 0);
});

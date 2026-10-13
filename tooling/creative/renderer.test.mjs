import test from 'node:test';
import assert from 'node:assert/strict';
import { requireHardwareRenderer, testProfile } from './renderer.mjs';
test('hardware acceptance rejects forced software, masked and unclassified renderer evidence', () => {
  for (const renderer of ['masked', 'ANGLE (Google SwiftShader)', 'Mesa llvmpipe', 'softpipe', 'lavapipe', 'Microsoft Basic Render Driver', 'SomeRenderer', '', undefined]) {
    assert.throws(() => requireHardwareRenderer(renderer), /requires an observed hardware renderer/);
  }
  assert.throws(() => requireHardwareRenderer('ANGLE (NVIDIA Quadro P2000)', '1'));
  for (const renderer of ['ANGLE (NVIDIA Quadro P2000 Direct3D11)', 'AMD Radeon', 'Intel Iris', 'Apple M3', 'Adreno 740']) assert.equal(requireHardwareRenderer(renderer), renderer);
});
test('hardware remains default; portable is explicit and invalid profiles fail closed', () => {
  assert.equal(testProfile(), 'hardware'); assert.equal(testProfile('portable'), 'portable');
  for (const profile of ['software', '', 'skip']) assert.throws(() => testProfile(profile));
});

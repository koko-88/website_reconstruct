import { test, expect } from '@playwright/test';
import { measureScene } from './gpu';
import { requireHardwareRenderer } from '../../../tooling/creative/renderer.mjs';
for (const scene of ['instrument', 'journey'] as const) test(`${scene}: hardware frame-rate acceptance`, async ({ page }, info) => {
  test.skip(info.project.name === 'reduced', 'Reduced motion intentionally rests; active FPS is not applicable.');
  const { metrics, renderer } = await measureScene(page, info, scene);
  // Fail closed: no success/skip based on a renderer that cannot establish hardware execution.
  requireHardwareRenderer(renderer.renderer, process.env.CREATIVE_SOFTWARE_GPU);
  expect(metrics.frames / metrics.seconds).toBeGreaterThan(15);
  expect(metrics.calls / metrics.frames).toBeLessThan(40);
});

import { test, expect } from '@playwright/test';
import { measureScene } from './gpu';
for (const scene of ['instrument', 'journey'] as const) test(`${scene}: portable draw budget, idle rendering and live preference changes`, async ({ page }, info) => {
  const { stage, metrics, renderer } = await measureScene(page, info, scene);
  expect(renderer.glError).toBe(0);
  expect(metrics.frames).toBeGreaterThan(0);
  // Renderer-independent complexity acceptance stays active on software CI.
  expect(metrics.calls / metrics.frames).toBeLessThan(40);
  if (info.project.name !== 'reduced') expect(metrics.calls).toBeGreaterThan(0);
  info.annotations.push({ type: 'performance scope', description: 'Draw/lifecycle acceptance; attached FPS is diagnostic only. Hardware FPS acceptance is a separate test.' });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(stage).toHaveAttribute('data-active', 'false');
  await page.waitForTimeout(700);
  const idle = await page.evaluate(() => (window as unknown as { creativeTestMetrics: { calls: number } }).creativeTestMetrics.calls);
  await page.waitForTimeout(350);
  expect(await page.evaluate(() => (window as unknown as { creativeTestMetrics: { calls: number } }).creativeTestMetrics.calls)).toBe(idle);
  // Explicitly simulated hidden-document branch, distinct from real background-tab certification.
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new Event('visibilitychange')); });
  await expect(stage).toHaveAttribute('data-active', 'false');
});

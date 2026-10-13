import { test, expect } from '@playwright/test';
for (const scene of ['instrument', 'journey'] as const) test(`${scene}: native GPU call budget, idle rendering and live preference changes`, async ({ page }, info) => {
  await page.addInitScript(() => {
    const metrics = { calls: 0 };
    Object.assign(window, { creativeTestMetrics: metrics });
    for (const name of ['drawArrays', 'drawElements', 'drawArraysInstanced', 'drawElementsInstanced'] as const) {
      const original = WebGL2RenderingContext.prototype[name];
      (WebGL2RenderingContext.prototype[name] as unknown) = function (this: WebGL2RenderingContext, ...args: unknown[]) {
        metrics.calls++; return (original as Function).apply(this, args);
      };
    }
  });
  await page.goto(scene === 'instrument' ? '/#spatial' : '/showcase.html');
  const stage = page.getByTestId(scene === 'instrument' ? 'spatial-stage' : 'scene-journey');
  await expect(stage).toHaveAttribute('data-ready', 'true');
  await page.getByLabel(scene === 'instrument' ? 'Render quality' : 'Scene quality').selectOption('high');
  if (scene === 'instrument') { await page.getByRole('checkbox', { name: /Bloom/ }).check(); await stage.scrollIntoViewIfNeeded(); }
  await expect(stage).toHaveAttribute('data-active', info.project.name === 'reduced' ? 'false' : 'true');
  await page.waitForTimeout(500);
  const metrics = await page.evaluate(async () => {
    const metrics = (window as unknown as { creativeTestMetrics: { calls: number } }).creativeTestMetrics;
    const start = performance.now(); const initial = metrics.calls; let frames = 0;
    await new Promise<void>(resolve => { const sample = () => { frames++; performance.now() - start > 1000 ? resolve() : requestAnimationFrame(sample); }; requestAnimationFrame(sample); });
    return { frames, seconds: (performance.now() - start) / 1000, calls: metrics.calls - initial, environment: navigator.userAgent };
  });
  await info.attach('frame-budget', { body: JSON.stringify(metrics), contentType: 'application/json' });
  expect(metrics.frames / metrics.seconds).toBeGreaterThan(15);
  expect(metrics.calls / metrics.frames).toBeLessThan(40);
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

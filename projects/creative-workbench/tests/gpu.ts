import { expect, type Page, type TestInfo } from '@playwright/test';
export async function measureScene(page: Page, info: TestInfo, scene: 'instrument' | 'journey') {
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
  const renderer = await stage.locator('canvas').evaluate(element => {
    const gl = (element as HTMLCanvasElement).getContext('webgl2');
    if (!gl) throw new Error('Expected ready WebGL2 renderer.');
    const extension = gl.getExtension('WEBGL_debug_renderer_info');
    return { renderer: extension ? String(gl.getParameter(extension.UNMASKED_RENDERER_WEBGL)) : 'masked',
      vendor: extension ? String(gl.getParameter(extension.UNMASKED_VENDOR_WEBGL)) : 'masked',
      version: String(gl.getParameter(gl.VERSION)), glError: gl.getError(),
      width: element.width, height: element.height };
  });
  await info.attach('frame-budget', { body: JSON.stringify({ ...metrics, ...renderer,
    profile: process.env.CREATIVE_TEST_PROFILE || 'hardware', project: info.project.name }), contentType: 'application/json' });
  return { stage, metrics, renderer };
}

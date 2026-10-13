import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const digest = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex');
async function discipline(page: Page, mode: 'motion' | 'spatial' | 'particles') {
  await page.getByRole('navigation', { name: 'Disciplines' }).getByRole('button', { name: new RegExp(mode, 'i') }).click();
  await page.locator('#instrument').scrollIntoViewIfNeeded();
  if (mode !== 'motion') await expect(page.getByTestId(mode === 'spatial' ? 'spatial-stage' : 'particle-stage')).toHaveAttribute('data-ready', 'true');
}
async function stableCanvas(page: Page) {
  await page.getByRole('button', { name: 'Pause motion' }).click();
  await expect(page.locator('[data-active]')).toHaveAttribute('data-active', 'false');
  await page.waitForTimeout(600);
}

test('original responsive composition and keyboard navigation have no axe violations', async ({ page }, info) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('feel something');
  await page.keyboard.press('Tab'); await expect(page.getByRole('link', { name: 'Skip to instrument' })).toBeFocused();
  await page.keyboard.press('Enter');
  for (const mode of ['motion', 'spatial', 'particles'] as const) {
    await discipline(page, mode);
    const scan = await new AxeBuilder({ page }).analyze();
    expect(scan.violations).toEqual([]);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    expect(overflow).toBe(false);
    const screenshot = info.outputPath(`${mode}.png`);
    await page.screenshot({ path: screenshot, fullPage: true });
    await info.attach(`${mode}-${info.project.name}`, { path: screenshot, contentType: 'image/png' });
  }
});

test('GSAP progresses forward/reverse and reduced motion is static', async ({ page }, info) => {
  await page.goto('/'); await page.locator('#instrument').scrollIntoViewIfNeeded();
  await expect(page.getByTestId('scroll-composition')).toHaveAttribute('data-reduced', info.project.name === 'reduced' ? 'true' : 'false');
  const matrix = () => page.getByTestId('composition-form').evaluate(element => getComputedStyle(element).transform);
  await page.evaluate(() => scrollTo({ top: 450, behavior: 'instant' })); await page.waitForTimeout(150); const first = await matrix();
  await page.evaluate(() => scrollTo({ top: 900, behavior: 'instant' })); await page.waitForTimeout(150); const second = await matrix();
  await page.evaluate(() => scrollTo({ top: 450, behavior: 'instant' })); await page.waitForTimeout(150); const reverse = await matrix();
  if (info.project.name === 'reduced') expect(second).toBe(first); else expect(second).not.toBe(first);
  expect(reverse).toBe(first);
  await page.getByRole('button', { name: 'Pause motion' }).scrollIntoViewIfNeeded();
  await page.waitForTimeout(150); const beforePause = await matrix();
  await page.getByRole('button', { name: 'Pause motion' }).click();
  const paused = await matrix(); expect(paused).toBe(beforePause);
  await page.evaluate(() => scrollTo({ top: 900, behavior: 'instant' })); await page.waitForTimeout(150);
  expect(await matrix()).toBe(paused);
  await page.getByRole('button', { name: 'Resume motion' }).click();
});

test('spatial model, materials, shader, bloom and keyboard orientation render real pixel changes', async ({ page }, info) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  const requested: string[] = []; page.on('request', request => requested.push(request.url()));
  await page.goto('/');
  expect(requested.some(url => url.endsWith('form.glb'))).toBe(false);
  await discipline(page, 'spatial'); await stableCanvas(page);
  const canvas = page.locator('canvas');
  const original = digest(await canvas.screenshot());
  await page.getByRole('button', { name: 'Cobalt', exact: true }).click(); await page.waitForTimeout(200);
  expect(digest(await canvas.screenshot())).not.toBe(original);
  await page.getByRole('slider', { name: 'Orientation' }).focus(); await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('slider', { name: 'Orientation' })).toHaveValue('1');
  const bloom = page.getByRole('checkbox', { name: /Bloom/ });
  await expect(bloom).toBeDisabled(); await expect(bloom).not.toBeChecked();
  await page.getByLabel('Render quality').selectOption('high'); await page.waitForTimeout(400);
  const preBloom = digest(await canvas.screenshot()); // Compare bloom at unchanged High DPR/detail.
  await page.getByRole('checkbox', { name: /Bloom/ }).check();
  await expect(bloom).toBeEnabled(); await expect(bloom).toBeChecked();
  await page.getByLabel('Render quality').selectOption('eco');
  await expect(bloom).toBeDisabled(); await expect(bloom).not.toBeChecked();
  await page.getByLabel('Render quality').selectOption('high');
  await expect(bloom).toBeEnabled(); await expect(bloom).toBeChecked();
  await expect(page.getByTestId('spatial-stage')).toHaveAttribute('data-effects', 'true');
  await page.waitForTimeout(400); expect(digest(await canvas.screenshot())).not.toBe(preBloom);
  const stopped = digest(await canvas.screenshot()); await page.waitForTimeout(350);
  expect(digest(await canvas.screenshot())).toBe(stopped);
  const beforePattern = digest(await canvas.screenshot());
  const textureRequest = page.waitForResponse('**/poster.ktx2');
  await page.getByRole('checkbox', { name: 'Original pattern' }).check();
  expect((await textureRequest).ok()).toBe(true);
  await page.waitForTimeout(600);
  expect(digest(await canvas.screenshot())).not.toBe(beforePattern);
  await expect(page.getByText(/failed to load/)).toHaveCount(0);
  const graphics = await canvas.evaluate(element => {
    const gl = (element as HTMLCanvasElement).getContext('webgl2')!; const extension = gl.getExtension('WEBGL_debug_renderer_info');
    return { renderer: extension ? gl.getParameter(extension.UNMASKED_RENDERER_WEBGL) : 'masked', version: gl.getParameter(gl.VERSION), width: element.width, height: element.height, glError: gl.getError() };
  });
  expect(graphics.glError).toBe(0); await info.attach('gpu', { body: JSON.stringify(graphics), contentType: 'application/json' });
  expect(errors).toEqual([]);
});

test('Pixi field supports pause, spread, resize and repeated clean route remount', async ({ page }, info) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/'); await discipline(page, 'particles'); await stableCanvas(page);
  const canvas = page.locator('canvas');
  const first = digest(await canvas.screenshot());
  await page.getByRole('slider', { name: 'Spread' }).focus(); await page.keyboard.press('Home');
  await expect(page.getByRole('slider', { name: 'Spread' })).toHaveValue('30'); await page.waitForTimeout(150);
  const spread = digest(await canvas.screenshot()); expect(spread).not.toBe(first);
  await page.waitForTimeout(350); expect(digest(await canvas.screenshot())).toBe(spread);
  await page.getByRole('slider', { name: 'Orientation' }).focus(); await page.keyboard.press('End');
  await expect(page.getByRole('slider', { name: 'Orientation' })).toHaveValue('180');
  const rendered = await sharp(await canvas.screenshot()).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  let colored = 0; let centerX = 0; let centerY = 0;
  for (let y = 0; y < rendered.info.height; y++) for (let x = 0; x < rendered.info.width; x++) {
    const offset = (y * rendered.info.width + x) * 3;
    if (Math.abs(rendered.data[offset] - 32) + Math.abs(rendered.data[offset + 1] - 39) + Math.abs(rendered.data[offset + 2] - 32) > 60) { colored++; centerX += x; centerY += y; }
  }
  expect(colored).toBeGreaterThan(100);
  expect(Math.abs(centerX / colored - rendered.info.width / 2)).toBeLessThan(rendered.info.width / 8);
  expect(Math.abs(centerY / colored - rendered.info.height / 2)).toBeLessThan(rendered.info.height / 8);
  for (let index = 0; index < 3; index++) {
    await discipline(page, 'spatial'); await expect(page.locator('canvas')).toHaveCount(1);
    await discipline(page, 'particles'); await expect(page.locator('canvas')).toHaveCount(1);
  }
  if (info.project.name === 'desktop') {
    await page.setViewportSize({ width: 900, height: 700 }); await page.waitForTimeout(200);
    const dimensions = await canvas.evaluate(element => ({ width: element.width, box: element.getBoundingClientRect().width }));
    expect(Math.abs(dimensions.width - dimensions.box)).toBeLessThan(2);
  }
  await discipline(page, 'motion'); await expect(page.locator('canvas')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('ambient frames move only when allowed and rest offscreen', async ({ page }, info) => {
  await page.goto('/'); await discipline(page, 'particles');
  const canvas = page.locator('canvas'); await page.waitForTimeout(400); const initial = digest(await canvas.screenshot());
  await page.waitForTimeout(350); const later = digest(await canvas.screenshot());
  if (info.project.name === 'reduced') expect(later).toBe(initial); else expect(later).not.toBe(initial);
  await page.setViewportSize({ width: page.viewportSize()!.width, height: 400 });
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await expect(page.getByTestId('particle-stage')).toHaveAttribute('data-active', 'false');
});

test('missing model and unavailable GPU preserve usable DOM controls', async ({ page }) => {
  await page.route('**/form.glb', route => route.abort());
  await page.goto('/'); await page.getByRole('button', { name: /spatial/i }).click();
  await expect(page.getByRole('status', { name: '' }).filter({ hasText: /Model or graphics failed/ })).toBeVisible();
  await page.getByRole('navigation', { name: 'Disciplines' }).getByRole('button', { name: /motion/i }).click(); await expect(page.getByTestId('scroll-composition')).toBeVisible();
  await page.unroute('**/form.glb');
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (...args: Parameters<typeof original>) {
      if (String(args[0]).includes('webgl')) return null;
      return original.apply(this, args);
    } as typeof original;
  });
  await page.goto('/#spatial');
  await page.reload(); // A hash-only navigation does not create a document or run init scripts.
  await expect(page.getByText(/WebGL2 unavailable/)).toBeVisible();
  await expect(page.getByRole('slider', { name: 'Orientation' })).toBeEnabled();
});

test('lost graphics context yields explicit fallback and mode recovery', async ({ page }) => {
  await page.goto('/'); await discipline(page, 'spatial');
  await page.locator('canvas').evaluate(element => (element as HTMLCanvasElement).getContext('webgl2')!.getExtension('WEBGL_lose_context')!.loseContext());
  await expect(page.getByText(/Graphics context lost/)).toBeVisible();
  await expect(page.getByTestId('spatial-stage')).toHaveAttribute('data-ready', 'false');
  await discipline(page, 'motion'); await expect(page.getByTestId('scroll-composition')).toBeVisible();
  await discipline(page, 'spatial'); await expect(page.locator('canvas')).toHaveCount(1);
});

test('Pixi failed initialization and lost context recover without orphan canvases', async ({ page, context }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext; let attempts = 0;
    HTMLCanvasElement.prototype.getContext = function (...args: Parameters<typeof original>) {
      if (String(args[0]).includes('webgl') && ++attempts > 1) return null;
      return original.apply(this, args);
    } as typeof original;
  });
  await page.goto('/#particles');
  await expect(page.getByText(/Particle graphics unavailable/)).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(0);
  await discipline(page, 'motion'); await expect(page.locator('canvas')).toHaveCount(0);
  expect(errors).toEqual([]);
  const fresh = await context.newPage();
  fresh.on('pageerror', error => errors.push(error.message));
  await fresh.goto('/'); await discipline(fresh, 'particles');
  await fresh.locator('canvas').evaluate(element => (element as HTMLCanvasElement).getContext('webgl2')!.getExtension('WEBGL_lose_context')!.loseContext());
  await expect(fresh.getByText(/Particle graphics unavailable/)).toBeVisible();
  await expect(fresh.getByTestId('particle-stage')).toHaveAttribute('data-ready', 'false');
  await discipline(fresh, 'motion'); await discipline(fresh, 'particles');
  await expect(fresh.locator('canvas')).toHaveCount(1); await fresh.close();
  expect(errors).toEqual([]);
});

test('a consumer replacing modelUrl remains unready until the replacement actually loads', async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/form.glb?variant=second', async route => { await gate; await route.continue(); });
  await page.goto('/tests/fixtures/model-replacement.html');
  await expect(page.getByTestId('spatial-stage')).toHaveAttribute('data-ready', 'true');
  await page.getByRole('button', { name: 'Replace model' }).click();
  try {
    await expect(page.getByTestId('spatial-stage')).toHaveAttribute('data-ready', 'false');
    await expect(page.getByText('Loading original form…')).toBeVisible();
  } finally { release(); }
  await expect(page.getByTestId('spatial-stage')).toHaveAttribute('data-ready', 'true');
  await expect(page.locator('canvas')).toHaveCount(1);
});

test('texture readiness waits for decode and failed textures recover to the shader', async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/poster.ktx2', async route => { await gate; await route.continue(); });
  await page.goto('/#spatial');
  const stage = page.getByTestId('spatial-stage');
  await expect(stage).toHaveAttribute('data-ready', 'true');
  await page.getByRole('checkbox', { name: 'Original pattern' }).check();
  try { await expect(stage).toHaveAttribute('data-ready', 'false'); }
  finally { release(); }
  await expect(stage).toHaveAttribute('data-ready', 'true');
  await page.unroute('**/poster.ktx2');
  await page.route('**/poster.ktx2', route => route.abort());
  await page.reload();
  await expect(stage).toHaveAttribute('data-ready', 'true');
  await page.getByRole('checkbox', { name: 'Original pattern' }).check();
  await expect(page.getByText(/Model or graphics failed to load/)).toBeVisible();
  await expect(stage).toHaveAttribute('data-ready', 'false');
  await expect(stage).toHaveAttribute('data-active', 'false');
  await page.getByRole('checkbox', { name: 'Original pattern' }).uncheck();
  await expect(stage).toHaveAttribute('data-ready', 'true');
  await expect(page.locator('canvas')).toHaveCount(1);
});

test('discipline deep links reveal the instrument and ordinary anchors preserve its mode', async ({ page }) => {
  await page.goto('/#spatial');
  await expect(page.getByTestId('spatial-stage')).toHaveAttribute('data-ready', 'true');
  await expect.poll(() => page.locator('#instrument').evaluate(element => element.getBoundingClientRect().top)).toBeLessThan(100);
  // Two hash events before the next paint must cancel the first queued discipline scroll.
  await page.evaluate(() => {
    location.hash = 'particles'; dispatchEvent(new HashChangeEvent('hashchange'));
    location.hash = 'headline'; dispatchEvent(new HashChangeEvent('hashchange'));
    document.getElementById('headline')!.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(150);
  await expect.poll(() => page.locator('#instrument').evaluate(element => element.getBoundingClientRect().top)).toBeGreaterThan(200);
  await discipline(page, 'spatial');
  await page.getByRole('link', { name: /Back to the beginning/ }).click();
  await expect(page.getByTestId('spatial-stage')).toHaveAttribute('data-ready', 'true');
  await page.getByRole('link', { name: /Enter the instrument/ }).click();
  await expect(page.getByTestId('spatial-stage')).toHaveAttribute('data-ready', 'true');
});

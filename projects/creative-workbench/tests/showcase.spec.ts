import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
const digest = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex');
async function samePose(actual: Buffer, expected: Buffer) {
  const a = await sharp(actual).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const b = await sharp(expected).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  expect(a.info).toEqual(b.info);
  let changedPixels = 0; let maxChannelDifference = 0;
  for (let i = 0; i < a.data.length; i += 3) {
    let changed = false;
    for (let channel = 0; channel < 3; channel++) {
      const difference = Math.abs(a.data[i + channel] - b.data[i + channel]);
      maxChannelDifference = Math.max(maxChannelDifference, difference); changed ||= difference > 0;
    }
    if (changed) changedPixels++;
  }
  // Measured P2000 touch noise was two pixels differing by one 8-bit level after a roundtrip.
  // Geometry/time drift affects many pixels or larger differences and still fails this check.
  expect(maxChannelDifference).toBeLessThanOrEqual(1);
  expect(changedPixels).toBeLessThanOrEqual(10);
}

test('immersive original has reversible scroll, accessible manual chapters and stable pause', async ({ page }, info) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/showcase.html');
  const stage = page.getByTestId('scene-journey');
  await expect(stage).toHaveAttribute('data-ready', 'true');
  await expect(stage).toHaveAttribute('data-active', info.project.name === 'reduced' ? 'false' : 'true');
  await page.getByRole('button', { name: 'Pause motion' }).click();
  await expect(stage).toHaveAttribute('data-active', 'false');
  const canvas = page.locator('canvas');
  // Isolate renderer pixels from controls layered over the full-screen canvas.
  const pixels = () => canvas.screenshot({ style: '.shift-header,.shift-controls,.shift-overlay,.shift-scroll,.shift-title { opacity:0; }' });
  await page.waitForTimeout(300);
  const initialBytes = await pixels();
  await info.attach('initial-renderer', { body: initialBytes, contentType: 'image/png' });
  await info.attach('initial-viewport', { body: JSON.stringify(await canvas.evaluate(element => ({ box: element.getBoundingClientRect().toJSON(), width: element.width, height: element.height, scrollY, dpr: devicePixelRatio }))), contentType: 'application/json' });
  const initial = digest(initialBytes);
  await page.getByRole('slider', { name: 'Manual chapter' }).focus(); await page.keyboard.press('End');
  await expect(page.getByRole('slider', { name: 'Manual chapter' })).toHaveValue('100');
  await page.waitForTimeout(200); const end = digest(await pixels()); expect(end).not.toBe(initial);
  await page.getByRole('slider', { name: 'Manual chapter' }).focus(); await page.keyboard.press('Home');
  await expect(page.getByRole('slider', { name: 'Manual chapter' })).toHaveValue('0');
  await page.waitForTimeout(200); const returnedBytes = await pixels();
  await info.attach('returned-renderer', { body: returnedBytes, contentType: 'image/png' });
  await info.attach('returned-viewport', { body: JSON.stringify(await canvas.evaluate(element => ({ box: element.getBoundingClientRect().toJSON(), width: element.width, height: element.height, scrollY, dpr: devicePixelRatio }))), contentType: 'application/json' });
  await samePose(returnedBytes, initialBytes);
  await page.waitForTimeout(250); await samePose(await pixels(), returnedBytes);
  await page.getByRole('button', { name: 'Resume motion' }).click();
  // Allow demand frames but freeze ambient time to compare scroll geometry exactly.
  await page.emulateMedia({ reducedMotion: 'reduce' }); await expect(stage).toHaveAttribute('data-active', 'false');
  await page.waitForTimeout(250); const still = await pixels();
  await page.evaluate(() => scrollTo({ top: innerHeight * 0.8, behavior: 'instant' })); await page.waitForTimeout(250);
  await samePose(await pixels(), still);
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.waitForTimeout(250);
  await page.evaluate(() => scrollTo({ top: innerHeight * 0.8, behavior: 'instant' })); await page.waitForTimeout(200);
  await expect.poll(async () => Number(await page.getByRole('slider', { name: 'Manual chapter' }).inputValue())).toBeGreaterThan(30);
  await page.getByRole('button', { name: 'Pause motion' }).click(); await page.waitForTimeout(200);
  const separated = await pixels();
  await page.screenshot({ path: info.outputPath('shift-separated.png'), fullPage: false });
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await page.waitForTimeout(200);
  await samePose(await pixels(), separated);
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await page.getByRole('button', { name: 'Resume motion' }).click(); await page.waitForTimeout(200);
  await expect(page.getByRole('slider', { name: 'Manual chapter' })).toHaveValue('0');
  await page.getByRole('button', { name: 'Pause motion' }).click(); await page.waitForTimeout(200);
  expect(digest(await pixels())).not.toBe(digest(separated));
  await page.getByLabel('Scene quality').selectOption('high'); await page.waitForTimeout(400);
  const gl = await canvas.evaluate(element => (element as HTMLCanvasElement).getContext('webgl2')!.getError()); expect(gl).toBe(0);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  await page.screenshot({ path: info.outputPath('shift-assembled.png'), fullPage: false });
  await page.getByRole('link', { name: 'Explore ↘' }).click();
  await expect(page.getByRole('heading', { name: /Take the familiar/ })).toBeVisible();
  await expect(stage).toHaveAttribute('data-active', 'false');
  expect(errors).toEqual([]);
});

test('immersive asset failure preserves narrative and keyboard controls', async ({ page }) => {
  await page.route('**/form.glb', route => route.abort()); await page.goto('/showcase.html');
  await expect(page.getByText(/Scene failed to load/)).toBeVisible();
  await expect.poll(() => page.getByRole('img', { name: /Original folded form/ }).evaluate(img => (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0)).toBe(true);
  await expect(page.getByTestId('scene-journey')).toHaveAttribute('data-ready', 'false');
  await page.getByRole('slider', { name: 'Manual chapter' }).focus(); await page.keyboard.press('End');
  await expect(page.getByRole('slider', { name: 'Manual chapter' })).toHaveValue('100');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('immersive context loss during delayed model loading yields a decoded poster', async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/form.glb', async route => { await gate; await route.continue(); });
  try {
    await page.goto('/showcase.html');
    await expect(page.getByText('Assembling the original sculpture…')).toBeVisible();
    await page.locator('canvas').evaluate(element => (element as HTMLCanvasElement).getContext('webgl2')!.getExtension('WEBGL_lose_context')!.loseContext());
    await expect(page.getByText(/Scene failed to load or graphics context was lost/)).toBeVisible();
    await expect(page.getByTestId('scene-journey')).toHaveAttribute('data-ready', 'false');
    await expect(page.getByTestId('scene-journey')).toHaveAttribute('data-active', 'false');
    await expect.poll(() => page.getByRole('img', { name: /Original folded form/ }).evaluate(img => (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0)).toBe(true);
    await expect(page.getByRole('slider', { name: 'Manual chapter' })).toBeEnabled();
  } finally { release(); }
});

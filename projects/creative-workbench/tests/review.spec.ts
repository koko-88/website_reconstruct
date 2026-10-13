import { test } from '@playwright/test';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
test('browser captures integrate with the real contact-sheet reviewer', async ({}, info) => {
  test.skip(info.project.name !== 'desktop', 'Integration itself captures desktop and mobile/reduced variants.');
  test.setTimeout(120000);
  const root = fileURLToPath(new URL('../../..', import.meta.url));
  try {
    const result = await promisify(execFile)(process.execPath, ['--test', '--test-reporter=tap', 'tooling/creative/review.browser.test.mjs'], {
      cwd: root, timeout: 100000, windowsHide: true,
      env: { ...process.env, CREATIVE_REVIEW_URL: String(info.project.use.baseURL),
        CREATIVE_REVIEW_OUTPUT_ROOT: path.dirname(info.project.outputDir) },
    });
    await info.attach('contact-sheet-integration', { body: result.stdout + result.stderr, contentType: 'text/plain' });
  } catch (error) {
    const child = error as Error & { stdout?: string; stderr?: string };
    await info.attach('contact-sheet-integration', {
      body: (child.stdout || '') + (child.stderr || '') + '\n' + child.message, contentType: 'text/plain',
    });
    throw error; // Preserve the native failure after retaining its diagnostic transcript.
  }
  // execFile rejects on a nonzero exit; the child asserts real images, transitions and sheet output.
});

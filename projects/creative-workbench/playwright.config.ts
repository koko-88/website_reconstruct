import { defineConfig, devices } from '@playwright/test';
import { testProfile } from '../../tooling/creative/renderer.mjs';
const profile = testProfile(process.env.CREATIVE_TEST_PROFILE);
const run = process.env.CREATIVE_RUN_ID || new Date().toISOString().replaceAll(/[:.]/g, '-');
// Workers reload this config; propagate the parent identity instead of generating another timestamp.
process.env.CREATIVE_RUN_ID = run;
const artifacts = `../../artifacts/creative-production/${run}`;
export default defineConfig({
  testDir: './tests', testIgnore: profile === 'portable' ? '**/hardware.spec.ts' : [], forbidOnly: !!process.env.CI, timeout: 45000, expect: { timeout: 15000 }, workers: 1, retries: 0,
  outputDir: `${artifacts}/browser-results`,
  reporter: [['list'], ['json', { outputFile: `${artifacts}/browser.json` }], ['html', { outputFolder: `${artifacts}/browser-report`, open: 'never' }]],
  use: { baseURL: 'http://127.0.0.1:4173', channel: process.env.CREATIVE_BROWSER_CHANNEL || 'chrome', trace: 'retain-on-failure', screenshot: 'only-on-failure', launchOptions: { args: process.env.CREATIVE_SOFTWARE_GPU === '1' ? ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] : [] } },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 1000 } } },
    { name: 'touch', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium', channel: process.env.CREATIVE_BROWSER_CHANNEL || 'chrome' } },
    { name: 'reduced', use: { viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' } },
  ],
  webServer: { command: 'npm run preview', url: 'http://127.0.0.1:4173', reuseExistingServer: !process.env.CI, timeout: 30000 },
});

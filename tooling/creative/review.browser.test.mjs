import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { createHash, randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, expect } from '@playwright/test';
import { reviewCaptures } from './review.mjs';

// Opt-in integration against the already running, built maintained workbench.
// No new website, provider job or capture runtime. Caller owns the loopback preview.
test('real workbench manual/reverse/mobile/reduced captures integrate with the contact sheet',async()=>{
  const baseURL=process.env.CREATIVE_REVIEW_URL;
  if (!baseURL || !/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(baseURL)) throw new Error('CREATIVE_REVIEW_URL must identify the running loopback workbench.');
  const run=process.env.CREATIVE_REVIEW_RUN_ID || randomUUID();
  if(!/^[a-zA-Z0-9-]{1,80}$/.test(run)) throw new Error('CREATIVE_REVIEW_RUN_ID must be a short alphanumeric/hyphen round ID.');
  const output=path.resolve(fileURLToPath(new URL(`../../artifacts/creative-production/skill-hardening/captures-${run}/`,import.meta.url)));
  await mkdir(path.dirname(output),{recursive:true});
  await mkdir(output); // A repeated explicit round ID must not overwrite earlier captures.
  const browser=await chromium.launch({channel:process.env.CREATIVE_BROWSER_CHANNEL || 'chrome'});
  try {
    const frames=[];
    for(const variant of [{name:'desktop',width:1440,height:1000,reducedMotion:'no-preference'},{name:'mobile-reduced',width:390,height:844,reducedMotion:'reduce'}]) {
      const context=await browser.newContext({viewport:{width:variant.width,height:variant.height},reducedMotion:variant.reducedMotion});
      const page=await context.newPage(); const errors=[]; page.on('pageerror',error=>errors.push(error.message));
      await page.goto(baseURL+'/showcase.html');
      await expect(page.getByTestId('scene-journey')).toHaveAttribute('data-ready','true');
      await page.getByRole('button',{name:'Pause motion'}).click();
      await expect(page.getByTestId('scene-journey')).toHaveAttribute('data-active','false');
      await page.evaluate(()=>document.fonts.ready);
      const start=Date.now();
      for(const [index,progress] of [0,0.5,1,0.5,0].entries()) {
        await page.getByRole('slider',{name:'Manual chapter'}).fill(String(progress*100));
        // A demand-rendered canvas has no semantic pose readback. Wait for painting and retain
        // pixels; do not pretend the requested slider value is a measured rendered pose.
        await page.waitForTimeout(300);
        const file=`${variant.name}-${index}.png`; await page.screenshot({path:path.join(output,file)});
        frames.push({file,label:index===0?'arrival':index===2?'resolution':index===4?'return':'transformation',scene:variant.name,viewport:{width:variant.width,height:variant.height},progress,atMs:Date.now()-start,direction:index<3?'manual':'reverse',expectation:'change',motionPreference:variant.reducedMotion,ambientPaused:true});
      }
      assert.deepEqual(errors,[]); await context.close();
    }
    const build=createHash('sha256').update(await readFile(new URL('../../projects/creative-workbench/dist/showcase.html',import.meta.url))).digest('hex');
    const source=path.join(output,'captures.json'); await writeFile(source,JSON.stringify({schemaVersion:1,url:baseURL+'/showcase.html',build:{showcaseHtmlSha256:build,scope:'built HTML references hashed JS filenames; uncommitted local build'},captureMode:'paused manual poses; native scroll tested separately',frames},null,2));
    const report=await reviewCaptures(source,path.join(output,'review'));
    assert.equal(report.frames.length,10); assert.equal(report.humanApproval,'pending');
    assert.ok(report.intervals.some(interval=>interval.status==='review-transition' && interval.meanPixelDifference>1));
    console.log(`Capture evidence: ${output}`);
  } finally { await browser.close(); }
});

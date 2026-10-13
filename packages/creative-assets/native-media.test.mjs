import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { processMedia, runTool, toolPath } from './pipeline.mjs';

test('odd-dimension original video roundtrips to even H264/yuv420p with full decode', { timeout: 60000 }, async () => {
  const ffmpeg = toolPath(process.env.CREATIVE_FFMPEG_PATH, 'CREATIVE_FFMPEG_PATH');
  const ffprobe = toolPath(process.env.CREATIVE_FFPROBE_PATH, 'CREATIVE_FFPROBE_PATH');
  const versions = await Promise.all([runTool(ffmpeg, ['-version']), runTool(ffprobe, ['-version'])]);
  console.log(JSON.stringify({ nativeMediaVersions: versions.map(output => output.split(/\r?\n/)[0]) }));
  const directory = await mkdtemp(path.join(tmpdir(), 'creative-media-'));
  try {
    const source = path.join(directory, 'source', 'odd.mkv');
    await mkdir(path.dirname(source));
    await runTool(ffmpeg, ['-nostdin', '-y', '-f', 'lavfi', '-i', 'testsrc=size=321x181:rate=12', '-t', '1', '-c:v', 'ffv1', '-pix_fmt', 'yuv444p', '-metadata', 'comment=' + 'original-source-metadata-'.repeat(700), source]);
    const result = await processMedia(source, path.join(directory, 'derived', 'browser.mp4'), { source: 'Original procedural FFmpeg testsrc', license: 'LicenseRef-Project-Original' });
    const video = result.metadata.streams.find(stream => stream.codec_type === 'video');
    assert.equal(video.codec_name, 'h264'); assert.equal(video.pix_fmt, 'yuv420p');
    assert.equal(video.width, 320); assert.equal(video.height % 2, 0);
    assert.ok(Number(result.metadata.format.duration) <= 1.1);
    assert.ok(!result.metadata.streams.some(stream => stream.codec_type === 'audio'));
    assert.ok(result.bytes > 0);
    assert.equal(result.metadata.format.filename, 'browser.mp4');
    assert.ok(!JSON.stringify(result.metadata).includes(directory));
    const independentProbe = JSON.parse(await runTool(ffprobe, ['-v', 'error', '-show_format', '-of', 'json', path.join(directory, 'derived', 'browser.mp4')]));
    assert.equal(independentProbe.format.tags?.comment, undefined);
    const output = path.join(directory, 'derived', 'browser.mp4');
    const regenerated = await processMedia(source, output, { source: 'Original procedural fixture, regenerated', license: 'LicenseRef-Project-Original' });
    assert.equal(JSON.parse(await readFile(output + '.provenance.json', 'utf8')).attribution.source, regenerated.attribution.source);
    const previousMedia = await readFile(output); const previousReport = await readFile(output + '.provenance.json');
    const corrupt = path.join(directory, 'source', 'corrupt.mkv'); await writeFile(corrupt, 'invalid video fixture');
    await assert.rejects(processMedia(corrupt, output, { source: 'Original failure fixture', license: 'Project' }), /Tool failed/);
    assert.deepEqual(await readFile(output), previousMedia);
    assert.deepEqual(await readFile(output + '.provenance.json'), previousReport);
    assert.deepEqual((await readdir(path.dirname(output))).sort(), ['browser.mp4', 'browser.mp4.provenance.json']);
    const previousProbe = process.env.CREATIVE_FFPROBE_PATH;
    try {
      process.env.CREATIVE_FFPROBE_PATH = process.execPath; // Incompatible real probe returns non-JSON after successful encoding.
      await assert.rejects(processMedia(source, output, { source: 'Original probe failure fixture', license: 'Project' }), SyntaxError);
    } finally { process.env.CREATIVE_FFPROBE_PATH = previousProbe; }
    assert.deepEqual(await readFile(output), previousMedia);
    assert.deepEqual(await readFile(output + '.provenance.json'), previousReport);
    assert.deepEqual((await readdir(path.dirname(output))).sort(), ['browser.mp4', 'browser.mp4.provenance.json']);
    if (process.env.CREATIVE_MEDIA_BROWSER === '1') {
      const { chromium } = await import('playwright');
      const bytes = await readFile(path.join(directory, 'derived', 'browser.mp4'));
      const server = createServer((request, response) => {
        if (request.url === '/video.mp4') { response.writeHead(200, { 'Content-Type': 'video/mp4', 'Content-Length': bytes.length }); response.end(bytes); }
        else if (request.url === '/') { response.writeHead(200, { 'Content-Type': 'text/html' }); response.end('<!doctype html><html lang="en"><title>Original media roundtrip</title><video src="/video.mp4" muted controls playsinline preload="auto"></video></html>'); }
        else { response.writeHead(404); response.end(); }
      });
      let browser;
      try {
        await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
        browser = await chromium.launch({ channel: process.env.CREATIVE_BROWSER_CHANNEL || 'chrome' });
        const page = await browser.newPage();
        await page.goto(`http://127.0.0.1:${server.address().port}/`);
        await page.waitForFunction(() => { const video = document.querySelector('video'); return video.readyState >= 2 && video.videoWidth > 0; });
        const decoded = await page.evaluate(async () => {
          const video = document.querySelector('video'); await video.play();
          await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('No decoded browser video frame within 5 seconds')), 5000);
            video.requestVideoFrameCallback(() => { clearTimeout(timeout); resolve(); });
          });
          await new Promise(resolve => setTimeout(resolve, 300)); video.pause();
          return { width: video.videoWidth, height: video.videoHeight, time: video.currentTime, ready: video.readyState, error: video.error?.code ?? null };
        });
        assert.equal(decoded.width, 320); assert.equal(decoded.height % 2, 0);
        assert.ok(decoded.time > 0.1); assert.ok(decoded.ready >= 2); assert.equal(decoded.error, null);
        console.log(JSON.stringify({ browserMediaRoundtrip: decoded }));
      } finally {
        await browser?.close(); server.closeAllConnections();
        await new Promise(resolve => server.close(resolve));
      }
    }
  } finally {
    assert.ok(path.resolve(directory).startsWith(path.join(tmpdir(), 'creative-media-')));
    await rm(directory, { recursive: true, force: true });
  }
});

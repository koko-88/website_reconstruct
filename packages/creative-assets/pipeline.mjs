import { createHash } from 'node:crypto';
import { createReadStream, realpathSync } from 'node:fs';
import { copyFile, lstat, mkdir, mkdtemp, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import sharp from 'sharp';
import { NodeIO } from '@gltf-transform/core';

export async function hashFile(file) {
  const digest = createHash('sha256');
  for await (const chunk of createReadStream(file)) digest.update(chunk);
  return digest.digest('hex');
}
async function readRaster(file) {
  if ((await stat(file)).size > 64 * 1024 * 1024) throw new Error('Raster source exceeds the 64 MiB encoded-byte profile.');
  const chunks = []; let bytes = 0;
  for await (const chunk of createReadStream(file)) {
    bytes += chunk.length;
    if (bytes > 64 * 1024 * 1024) throw new Error('Raster source exceeds the 64 MiB encoded-byte profile.');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks, bytes);
}
function requireDistinctOutputs(files) {
  const identities = files.map(file => canonicalPath(file)).map(file => process.platform === 'win32' ? file.toLowerCase() : file);
  if (new Set(identities).size !== identities.length) throw new Error('Asset output paths collide; select distinct texture, decoder and provenance destinations.');
}
// Publish a validated set for one local writer. Each rename is atomic, not the whole set.
// Prepare all replacements/backups first; restore earlier files if a later rename fails.
async function publishFiles(pairs) {
  requireDistinctOutputs(pairs.map(([, to]) => to));
  const prepared = []; let published = 0; let retainRecovery = false;
  try {
    for (const [from, to] of pairs) {
      try { if ((await lstat(to)).isSymbolicLink()) throw new Error('Asset publication refuses to replace an existing output link.'); }
      catch (error) { if (error.code !== 'ENOENT') throw error; }
      const prefix = path.join(path.dirname(to), '.creative-publish-');
      await mkdir(path.dirname(to), { recursive: true });
      const directory = await mkdtemp(prefix);
      const item = { directory, prefix, to, next: path.join(directory, 'next'), previous: path.join(directory, 'previous'), existed: false };
      prepared.push(item);
      await copyFile(from, item.next);
      try { await copyFile(to, item.previous); item.existed = true; }
      catch (error) { if (error.code !== 'ENOENT') throw error; }
    }
    try {
      for (const item of prepared) { await rename(item.next, item.to); published++; }
    } catch (error) {
      try {
        for (let i = published - 1; i >= 0; i--) {
          const item = prepared[i];
          if (item.existed) await rename(item.previous, item.to);
          else await rm(item.to, { force: true });
        }
      } catch (rollbackError) {
        retainRecovery = true;
        throw new AggregateError([error, rollbackError], `Asset publication and recovery failed; backups retained in ${prepared.map(item => item.directory).join(', ')}`);
      }
      throw error;
    }
  } finally {
    if (!retainRecovery) for (const item of prepared) {
      if (!path.resolve(item.directory).startsWith(item.prefix)) throw new Error('Unexpected asset publication temporary path');
      await rm(item.directory, { recursive: true, force: true });
    }
  }
}
function canonicalPath(value) {
  let current = path.resolve(value); const missing = [];
  for (;;) {
    try { return path.join(realpathSync.native(current), ...missing.reverse()); }
    catch (error) {
      if (error.code !== 'ENOENT') throw error;
      const parent = path.dirname(current);
      if (parent === current) throw error;
      missing.push(path.basename(current)); current = parent;
    }
  }
}
export function requireSeparateDirectories(sourceDirectory, destination) {
  const source = canonicalPath(sourceDirectory); const output = canonicalPath(destination);
  const relative = path.relative(source, output);
  if (relative === '' || (!relative.startsWith('..' + path.sep) && relative !== '..' && !path.isAbsolute(relative))) throw new Error('Keep source assets separate from derived serving assets.');
}
export function toolPath(value, name) {
  if (!value || !path.isAbsolute(value)) throw new Error(`${name} must name an existing absolute tool path; discovery never installs tools.`);
  return value;
}
export async function runTool(executable, args, timeout = 120000) {
  await stat(executable);
  return new Promise((resolve, reject) => {
    const child = spawn(executable, args, { shell: false, windowsHide: true, detached: process.platform !== 'win32', stdio: ['ignore', 'pipe', 'pipe'] });
    let output = ''; const append = bytes => { output = (output + bytes.toString()).slice(-12000); };
    child.stdout.on('data', append); child.stderr.on('data', append);
    let timedOut = false; let closed = false; let code; let terminationFinished = false; let terminationError;
    const finish = () => {
      if (!closed || (timedOut && !terminationFinished)) return;
      if (timedOut) {
        const error = new Error(`Tool deadline exceeded: ${executable}${terminationError ? '; process-tree termination was not confirmed; working files must be retained' : ''}`);
        if (terminationError) error.preserveWorkingFiles = true;
        reject(error);
      } else code === 0 ? resolve(output) : reject(new Error(`Tool failed (${code}): ${output}`));
    };
    const timer = setTimeout(async () => {
      timedOut = true;
      try {
        if (process.platform === 'win32') {
          const taskkill = path.join(process.env.SystemRoot ?? process.env.WINDIR, 'System32', 'taskkill.exe');
          await new Promise((done, fail) => {
            const killer = spawn(taskkill, ['/pid', String(child.pid), '/t', '/f'], { shell: false, windowsHide: true, stdio: 'ignore' });
            killer.once('error', fail); killer.once('close', result => result === 0 ? done() : fail(new Error(`taskkill failed (${result})`)));
          });
        } else process.kill(-child.pid, 'SIGKILL');
      } catch (error) { terminationError = error; child.kill('SIGKILL'); }
      terminationFinished = true; finish();
    }, timeout);
    child.on('error', error => { clearTimeout(timer); if (timedOut) { terminationError ??= error; return; } reject(error); });
    child.on('close', result => { clearTimeout(timer); code = result; closed = true; finish(); });
  });
}
export async function processImage(source, directory, attribution) {
  if (!attribution?.source || !attribution?.license) throw new Error('Source and license/provenance declaration required. This does not grant distribution rights.');
  const input = path.resolve(source); const output = path.resolve(directory);
  requireSeparateDirectories(path.dirname(input), output);
  await mkdir(output, { recursive: true });
  const pixels = await readRaster(input);
  const staging = await mkdtemp(path.join(tmpdir(), 'creative-images-'));
  try {
  const results = [];
  for (const width of [480, 960]) for (const format of ['webp', 'avif']) {
    const destination = path.join(staging, `poster-${width}.${format}`);
    await sharp(pixels, { limitInputPixels: 20_000_000 }).resize({ width, withoutEnlargement: true }).toFormat(format, { quality: 80 }).toFile(destination);
    results.push({ file: path.basename(destination), bytes: (await stat(destination)).size, sha256: await hashFile(destination), width: (await sharp(await readFile(destination)).metadata()).width });
  }
  await sharp(pixels, { limitInputPixels: 20_000_000 }).resize({ width: 480 }).webp({ quality: 80 }).toFile(path.join(staging, 'poster.webp'));
  results.push({ file: 'poster.webp', bytes: (await stat(path.join(staging, 'poster.webp'))).size, sha256: await hashFile(path.join(staging, 'poster.webp')) });
  const manifest = { source: path.basename(input), sourceSha256: createHash('sha256').update(pixels).digest('hex'), attribution, outputs: results };
  await writeFile(path.join(staging, 'images.provenance.json'), JSON.stringify(manifest, null, 2) + '\n');
  await publishFiles([...results.map(item => item.file), 'images.provenance.json'].map(file => [path.join(staging, file), path.join(output, file)]));
  return manifest;
  } finally {
    if (!path.resolve(staging).startsWith(path.join(tmpdir(), 'creative-images-'))) throw new Error('Unexpected image temporary path');
    await rm(staging, { recursive: true, force: true });
  }
}
export async function inspectModel(file) {
  const bytes = (await stat(file)).size;
  if (bytes > 1_000_000) throw new Error('Model exceeds the 1 MB GLB profile.');
  const document = await new NodeIO().readBinary(await readFile(file));
  const root = document.getRoot();
  let triangles = 0;
  for (const mesh of root.listMeshes()) {
    if (!mesh.listPrimitives().length) throw new Error('Model contains an empty mesh.');
    for (const primitive of mesh.listPrimitives()) {
    const positions = primitive.getAttribute('POSITION');
    if (!positions || positions.getType() !== 'VEC3' || positions.getCount() < 3) throw new Error('Model primitive needs renderable positions.');
    if (!positions.getArray()?.every(Number.isFinite)) throw new Error('Model positions contain non-finite values.');
    const indices = primitive.getIndices();
    if (indices && (indices.getType() !== 'SCALAR' || ![5121, 5123, 5125].includes(indices.getComponentType()) || !indices.getArray()?.every(value => Number.isInteger(value) && value >= 0 && value < positions.getCount()))) throw new Error('Model indices must address existing positions.');
    const count = primitive.getIndices()?.getCount() ?? positions.getCount();
    if (primitive.getMode() !== 4) throw new Error('This production profile requires triangulated meshes.');
    if (count < 3 || count % 3 !== 0) throw new Error('Model primitive contains no complete triangles.');
    triangles += count / 3;
    }
  }
  let renderedMeshes = 0;
  (root.getDefaultScene() ?? root.listScenes()[0])?.traverse(node => { if (node.getMesh()) renderedMeshes++; });
  if (!renderedMeshes || !triangles) throw new Error('Model active scene contains no renderable mesh nodes.');
  const report = { file: path.basename(file), bytes, sha256: await hashFile(file), meshes: root.listMeshes().length, triangles, scenes: root.listScenes().length, requiredExtensions: root.listExtensionsRequired().map(extension => extension.extensionName) };
  if (!report.scenes || !report.meshes || triangles > 20000 || report.bytes > 1_000_000) throw new Error(`Model exceeds workbench profile or contains no scene: ${JSON.stringify(report)}`);
  if (report.requiredExtensions.length) throw new Error('Workbench baseline requires an uncompressed GLB; configure local decoders before selecting compressed variants.');
  return report;
}
export async function exportModel(script, sourceDirectory, publicDirectory) {
  const blender = toolPath(process.env.CREATIVE_BLENDER_PATH, 'CREATIVE_BLENDER_PATH');
  const cli = toolPath(process.env.CREATIVE_GLTF_TRANSFORM_CLI, 'CREATIVE_GLTF_TRANSFORM_CLI');
  const source = path.resolve(sourceDirectory); const output = path.resolve(publicDirectory);
  requireSeparateDirectories(source, output);
  await mkdir(source, { recursive: true }); await mkdir(output, { recursive: true });
  const logs = [];
  const staging = await mkdtemp(path.join(tmpdir(), 'creative-model-'));
  let retainWorkingFiles = false;
  try {
  const stagedSource = path.join(staging, 'source'); await mkdir(stagedSource);
  const stagedExporter = path.join(staging, 'exporter.py'); await copyFile(path.resolve(script), stagedExporter);
  logs.push(await runTool(blender, ['--background', '--factory-startup', '--python-exit-code', '1', '--python', stagedExporter, '--', stagedSource]));
  const raw = path.join(stagedSource, 'form.raw.glb'); const optimized = path.join(staging, 'form.glb');
  logs.push(await runTool(process.execPath, [cli, 'dedup', raw, optimized]));
  const report = await inspectModel(optimized);
  const manifest = { source: 'form.blend', sourceSha256: await hashFile(path.join(stagedSource, 'form.blend')), exporter: path.basename(script), exporterSha256: await hashFile(stagedExporter), rawSha256: await hashFile(raw), attribution: { source: 'Original procedural sculpture authored for this project', license: 'LicenseRef-Project-Original', distribution: 'Local development; publication requires project authorization' }, output: report };
  await writeFile(path.join(staging, 'model.provenance.json'), JSON.stringify(manifest, null, 2) + '\n');
  await publishFiles([...['form.blend', 'form.raw.glb'].map(file => [path.join(stagedSource, file), path.join(source, file)]), ...['form.glb', 'model.provenance.json'].map(file => [path.join(staging, file), path.join(output, file)])]);
  return { manifest, logs };
  } catch (error) {
    if (error.preserveWorkingFiles) { retainWorkingFiles = true; error.message += `; staging retained at ${staging}`; }
    throw error;
  } finally {
    if (!path.resolve(staging).startsWith(path.join(tmpdir(), 'creative-model-'))) throw new Error('Unexpected model temporary path');
    if (!retainWorkingFiles) await rm(staging, { recursive: true, force: true });
  }
}

export async function processTexture(source, destination, decoderDirectory) {
  const encoder = toolPath(process.env.CREATIVE_TOKTX_PATH, 'CREATIVE_TOKTX_PATH');
  const input = path.resolve(source); const output = path.resolve(destination);
  if (input === output) throw new Error('Never overwrite a source texture.');
  if (path.extname(output).toLowerCase() !== '.ktx2') throw new Error('This texture profile requires a KTX2 (.ktx2) destination.');
  requireSeparateDirectories(path.dirname(input), path.dirname(output));
  requireSeparateDirectories(path.dirname(input), path.resolve(decoderDirectory));
  await mkdir(path.dirname(output), { recursive: true });
  const pixels = await readRaster(input);
  const raster = await sharp(pixels, { limitInputPixels: 20_000_000 }).resize({ width: 512, height: 512, fit: 'cover' }).png().toBuffer();
  // Serve decoder bytes from the selected Three installation, never from a runtime CDN.
  let decoderSource = process.env.CREATIVE_BASIS_SOURCE_DIR;
  if (decoderSource) decoderSource = toolPath(decoderSource, 'CREATIVE_BASIS_SOURCE_DIR');
  else {
    try {
      const consumer = createRequire(path.join(process.cwd(), 'package.json'));
      decoderSource = path.join(path.dirname(path.dirname(consumer.resolve('three'))), 'examples/jsm/libs/basis');
    } catch { throw new Error('Texture production needs the selected Three installation or an absolute CREATIVE_BASIS_SOURCE_DIR. Assets-only does not install a renderer.'); }
  }
  for (const filename of ['basis_transcoder.js', 'basis_transcoder.wasm']) await stat(path.join(decoderSource, filename));
  requireSeparateDirectories(decoderSource, path.resolve(decoderDirectory));
  requireSeparateDirectories(decoderSource, path.dirname(output));
  requireDistinctOutputs([output, output + '.provenance.json', ...['basis_transcoder.js', 'basis_transcoder.wasm', 'LICENSE.txt', 'NOTICE.txt'].map(file => path.join(path.resolve(decoderDirectory), file))]);
  const temporary = await mkdtemp(path.join(tmpdir(), 'creative-texture-'));
  let retainWorkingFiles = false;
  try {
    const png = path.join(temporary, 'raster.png'); await writeFile(png, raster);
    const stagedTexture = path.join(temporary, 'texture.ktx2');
    const log = await runTool(encoder, ['--t2', '--encode', 'uastc', '--zcmp', '18', '--genmipmap', '--assign_oetf', 'srgb', stagedTexture, png]);
    const stagedDecoders = path.join(temporary, 'basis'); await mkdir(stagedDecoders);
    const decoders = [];
    for (const filename of ['basis_transcoder.js', 'basis_transcoder.wasm']) {
      const sourceFile = path.join(decoderSource, filename);
      const outputFile = path.join(stagedDecoders, filename); await copyFile(sourceFile, outputFile);
      decoders.push({ file: filename, sha256: await hashFile(outputFile), source: 'Selected local Basis Universal decoder source; Apache-2.0, see LICENSE.txt and NOTICE.txt' });
    }
    await copyFile(new URL('./BASIS-LICENSE.txt', import.meta.url), path.join(stagedDecoders, 'LICENSE.txt'));
    await writeFile(path.join(stagedDecoders, 'NOTICE.txt'), 'Basis Universal GPU texture transcoder, Binomial LLC. Apache License 2.0.\nhttps://github.com/BinomialLLC/basis_universal\nRedistributed unchanged from the selected local decoder source.\n');
    const report = { source: path.basename(input), sourceSha256: createHash('sha256').update(pixels).digest('hex'), output: path.basename(output), sha256: await hashFile(stagedTexture), bytes: (await stat(stagedTexture)).size, decoders };
    const stagedReport = path.join(temporary, 'provenance.json');
    await writeFile(stagedReport, JSON.stringify(report, null, 2) + '\n');
    await publishFiles([[stagedTexture, output], ...['basis_transcoder.js', 'basis_transcoder.wasm', 'LICENSE.txt', 'NOTICE.txt'].map(file => [path.join(stagedDecoders, file), path.join(path.resolve(decoderDirectory), file)]), [stagedReport, output + '.provenance.json']]);
    return { ...report, log }; // Native diagnostics stay in the local caller result, outside served provenance.
  } catch (error) {
    if (error.preserveWorkingFiles) { retainWorkingFiles = true; error.message += `; staging retained at ${temporary}`; }
    throw error;
  } finally {
    if (!path.resolve(temporary).startsWith(path.join(tmpdir(), 'creative-texture-'))) throw new Error('Unexpected texture temporary path');
    if (!retainWorkingFiles) await rm(temporary, { recursive: true, force: true });
  }
}

export async function processMedia(source, destination, attribution) {
  if (!attribution?.source || !attribution?.license) throw new Error('Source and license/provenance declaration required.');
  const ffmpeg = toolPath(process.env.CREATIVE_FFMPEG_PATH, 'CREATIVE_FFMPEG_PATH');
  const ffprobe = toolPath(process.env.CREATIVE_FFPROBE_PATH, 'CREATIVE_FFPROBE_PATH');
  const input = path.resolve(source); const output = path.resolve(destination);
  if (input === output) throw new Error('Never overwrite source media.');
  if (path.extname(output).toLowerCase() !== '.mp4') throw new Error('This media profile requires an MP4 (.mp4) destination.');
  requireSeparateDirectories(path.dirname(input), path.dirname(output));
  await mkdir(path.dirname(output), { recursive: true });
  const prefix = path.join(tmpdir(), 'creative-media-export-');
  const temporary = await mkdtemp(prefix);
  let retainWorkingFiles = false;
  try {
    const staged = path.join(temporary, 'media.mp4'); const sidecar = output + '.provenance.json';
    const snapshot = path.join(temporary, 'source' + path.extname(input)); await copyFile(input, snapshot);
    const sourceSha256 = await hashFile(snapshot);
    await runTool(ffmpeg, ['-nostdin', '-y', '-protocol_whitelist', 'file,pipe', '-i', snapshot, '-map_metadata', '-1', '-map_chapters', '-1', '-vf', "scale='max(2,trunc(min(1280,iw)/2)*2)':-2", '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '23', '-movflags', '+faststart', '-an', '-t', '30', staged]);
    const metadata = JSON.parse(await runTool(ffprobe, ['-v', 'error', '-protocol_whitelist', 'file,pipe', '-show_entries', 'stream=index,codec_name,codec_type,pix_fmt,width,height,duration:format=filename,format_name,duration,size', '-of', 'json', staged]));
    await runTool(ffmpeg, ['-nostdin', '-v', 'error', '-protocol_whitelist', 'file,pipe', '-i', staged, '-f', 'null', '-']);
    if (metadata.format) metadata.format.filename = path.basename(output);
    const report = { source: path.basename(input), sourceSha256, attribution, output: path.basename(output), sha256: await hashFile(staged), bytes: (await stat(staged)).size, metadata, profile: 'Muted H.264/yuv420p, faststart, maximum width 1280 and duration 30 seconds' };
    const stagedReport = path.join(temporary, 'provenance.json');
    await writeFile(stagedReport, JSON.stringify(report, null, 2) + '\n');
    await publishFiles([[staged, output], [stagedReport, sidecar]]);
    return report;
  } catch (error) {
    if (error.preserveWorkingFiles) { retainWorkingFiles = true; error.message += `; staging retained at ${temporary}`; }
    throw error;
  } finally {
    if (!path.resolve(temporary).startsWith(prefix)) throw new Error('Unexpected media temporary path');
    if (!retainWorkingFiles) await rm(temporary, { recursive: true, force: true });
  }
}

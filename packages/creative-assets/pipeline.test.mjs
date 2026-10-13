import test from 'node:test';
import assert from 'node:assert/strict';
import { lstat, mkdir, mkdtemp, open, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Document, NodeIO } from '@gltf-transform/core';
import { processImage, processTexture, processMedia, inspectModel, toolPath, hashFile, runTool, requireSeparateDirectories } from './pipeline.mjs';
async function removeFixture(directory) {
  const expected = path.join(tmpdir(), 'creative-assets-');
  assert.ok(path.resolve(directory).startsWith(expected));
  await rm(directory, { recursive: true, force: true });
}

test('tool handoff fails closed on missing/relative executable paths', () => {
  assert.throws(() => toolPath('', 'BLENDER'), /absolute/);
  assert.throws(() => toolPath('blender', 'BLENDER'), /absolute/);
});

test('failed media encoding preserves the previous served file and provenance', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'creative-assets-'));
  const previousEncoder = process.env.CREATIVE_FFMPEG_PATH; const previousProbe = process.env.CREATIVE_FFPROBE_PATH;
  try {
    const source = path.join(directory, 'source', 'original.mkv'); const output = path.join(directory, 'derived', 'video.mp4');
    await mkdir(path.dirname(source)); await mkdir(path.dirname(output));
    await writeFile(source, 'original source'); await writeFile(output, 'previous validated media');
    await writeFile(output + '.provenance.json', 'previous provenance');
    process.env.CREATIVE_FFMPEG_PATH = process.execPath; process.env.CREATIVE_FFPROBE_PATH = process.execPath;
    await assert.rejects(processMedia(source, output.replace('.mp4', '.webm'), { source: 'Original fixture', license: 'Project' }), /MP4/);
    await assert.rejects(processMedia(source, output, { source: 'Original fixture', license: 'Project' }), /Tool failed/);
    assert.equal(await readFile(output, 'utf8'), 'previous validated media');
    assert.equal(await readFile(output + '.provenance.json', 'utf8'), 'previous provenance');
    assert.deepEqual((await readdir(path.dirname(output))).sort(), ['video.mp4', 'video.mp4.provenance.json']);
  } finally {
    if (previousEncoder === undefined) delete process.env.CREATIVE_FFMPEG_PATH; else process.env.CREATIVE_FFMPEG_PATH = previousEncoder;
    if (previousProbe === undefined) delete process.env.CREATIVE_FFPROBE_PATH; else process.env.CREATIVE_FFPROBE_PATH = previousProbe;
    await removeFixture(directory);
  }
});

test('texture decoder filename rejects before encoding or changing decoder bytes', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'creative-assets-'));
  const previousEncoder = process.env.CREATIVE_TOKTX_PATH; const previousBasis = process.env.CREATIVE_BASIS_SOURCE_DIR;
  try {
    const source = fileURLToPath(new URL('../../projects/creative-workbench/assets/source/poster.svg', import.meta.url));
    const basisSource = path.join(directory, 'basis-source'); const basis = path.join(directory, 'derived-basis');
    await mkdir(basisSource); await mkdir(basis);
    for (const file of ['basis_transcoder.js', 'basis_transcoder.wasm']) await writeFile(path.join(basisSource, file), 'Original decoder fixture');
    const output = path.join(basis, 'basis_transcoder.js'); await writeFile(output, 'Previous served decoder');
    process.env.CREATIVE_TOKTX_PATH = process.execPath; process.env.CREATIVE_BASIS_SOURCE_DIR = basisSource;
    await assert.rejects(processTexture(source, output, basis), /KTX2|collide/);
    assert.equal(await readFile(output, 'utf8'), 'Previous served decoder');
    assert.deepEqual(await readdir(basis), ['basis_transcoder.js']);
  } finally {
    if (previousEncoder === undefined) delete process.env.CREATIVE_TOKTX_PATH; else process.env.CREATIVE_TOKTX_PATH = previousEncoder;
    if (previousBasis === undefined) delete process.env.CREATIVE_BASIS_SOURCE_DIR; else process.env.CREATIVE_BASIS_SOURCE_DIR = previousBasis;
    await removeFixture(directory);
  }
});
test('all native output profiles reject nested source directories', () => {
  assert.throws(() => requireSeparateDirectories('/source', '/source/derived'), /separate/);
  assert.throws(() => requireSeparateDirectories('/source', '/source'), /separate/);
  assert.doesNotThrow(() => requireSeparateDirectories('/source', '/derived'));
});

test('source isolation resolves directory links and nonexistent children before writing', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'creative-assets-'));
  try {
    const source = path.join(directory, 'source'); const alias = path.join(directory, 'alias');
    await mkdir(source); await symlink(source, alias, process.platform === 'win32' ? 'junction' : 'dir');
    const svg = path.join(source, 'original.svg');
    await writeFile(svg, '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"/>');
    await writeFile(path.join(source, 'poster.webp'), 'original sentinel');
    assert.throws(() => requireSeparateDirectories(source, path.join(alias, 'future', 'derived')), /separate/);
    await assert.rejects(processImage(svg, alias, { source: 'Original fixture', license: 'Project' }), /separate/);
    assert.equal(await readFile(path.join(source, 'poster.webp'), 'utf8'), 'original sentinel');
  } finally { await removeFixture(directory); }
});
test('native process deadlines are cleared and successful subprocess exits promptly', async () => {
  const script = `import {runTool} from ${JSON.stringify(new URL('./pipeline.mjs', import.meta.url).href)}; console.log(await runTool(process.execPath,['-e','console.log("completed")']));`;
  const output = await runTool(process.execPath, ['--input-type=module', '-e', script], 10000);
  assert.match(output, /completed/);
});

test('tool deadline closes an owned process tree before returning and its writer stops', { timeout: 10000 }, async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'creative-assets-'));
  try {
    const marker = path.join(directory, 'writer.txt');
    const worker = `const fs=require('node:fs');setInterval(()=>fs.appendFileSync(${JSON.stringify(marker)},'tick\\n'),20);`;
    const parent = `require('node:child_process').spawn(process.execPath,['-e',${JSON.stringify(worker)}],{stdio:'ignore',windowsHide:true});process.on('SIGTERM',()=>{});setInterval(()=>{},1000);`;
    await assert.rejects(runTool(process.execPath, ['-e', parent], 1000), /deadline exceeded/);
    const stopped = await readFile(marker, 'utf8'); assert.ok(stopped.length > 0);
    await new Promise(resolve => setTimeout(resolve, 300));
    assert.equal(await readFile(marker, 'utf8'), stopped);
  } finally { await removeFixture(directory); }
});
test('image pipeline preserves source and makes decoded derivatives with hashes', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'creative-assets-'));
  const source = fileURLToPath(new URL('../../projects/creative-workbench/assets/source/poster.svg', import.meta.url));
  const before = await readFile(source);
  try {
    await assert.rejects(processImage(source, directory), /provenance/);
    await assert.rejects(processImage(source, path.dirname(source), { source: 'Original', license: 'Project' }), /separate/);
    await assert.rejects(processImage(source, path.join(path.dirname(source), 'derived'), { source: 'Original', license: 'Project' }), /separate/);
    const result = await processImage(source, directory, { source: 'Original local art', license: 'LicenseRef-Project-Original' });
    assert.equal(result.outputs.length, 5);
    assert.ok(result.outputs.every(item => item.bytes > 0 && /^[a-f0-9]{64}$/.test(item.sha256)));
    assert.deepEqual(await readFile(source), before);
  } finally { await removeFixture(directory); }
});

test('image publication failure preserves previously served derivatives and provenance', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'creative-assets-'));
  try {
    const source = fileURLToPath(new URL('../../projects/creative-workbench/assets/source/poster.svg', import.meta.url));
    const output = path.join(directory, 'derived');
    await processImage(source, output, { source: 'Original fixture', license: 'Project' });
    const poster = await readFile(path.join(output, 'poster.webp'));
    const provenance = await readFile(path.join(output, 'images.provenance.json'));
    // A real obstructed derivative target must fail preparation before any served replacement.
    await rm(path.join(output, 'poster-960.avif')); await mkdir(path.join(output, 'poster-960.avif'));
    await writeFile(path.join(output, 'poster-960.avif', 'sentinel'), 'Preserve this obstructed path');
    await assert.rejects(processImage(source, output, { source: 'Changed attribution', license: 'Project' }));
    assert.deepEqual(await readFile(path.join(output, 'poster.webp')), poster);
    assert.deepEqual(await readFile(path.join(output, 'images.provenance.json')), provenance);
    assert.equal(await readFile(path.join(output, 'poster-960.avif', 'sentinel'), 'utf8'), 'Preserve this obstructed path');
    assert.ok((await readdir(output)).every(file => !file.startsWith('.creative-')));
  } finally { await removeFixture(directory); }
});

test('publication refuses an existing output link and preserves its target and provenance', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'creative-assets-'));
  try {
    const source = fileURLToPath(new URL('../../projects/creative-workbench/assets/source/poster.svg', import.meta.url));
    const output = path.join(directory, 'derived'); const target = path.join(directory, 'linked-target');
    await mkdir(output); await mkdir(target); await writeFile(path.join(target, 'sentinel'), 'Original linked data');
    const link = path.join(output, 'poster-480.webp');
    await symlink(target, link, process.platform === 'win32' ? 'junction' : 'dir');
    await writeFile(path.join(output, 'images.provenance.json'), 'Previous provenance');
    await assert.rejects(processImage(source, output, { source: 'Original fixture', license: 'Project' }), /output link/);
    assert.ok((await lstat(link)).isSymbolicLink());
    assert.equal(await readFile(path.join(target, 'sentinel'), 'utf8'), 'Original linked data');
    assert.equal(await readFile(path.join(output, 'images.provenance.json'), 'utf8'), 'Previous provenance');
  } finally { await removeFixture(directory); }
});

test('image and texture profiles reject oversized raster input before native encoding', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'creative-assets-'));
  const originalEncoder = process.env.CREATIVE_TOKTX_PATH;
  try {
    const source = path.join(directory, 'source', 'large.svg');
    await mkdir(path.dirname(source));
    await writeFile(source, '<svg xmlns="http://www.w3.org/2000/svg" width="5001" height="4000"><rect width="100%" height="100%" fill="red"/></svg>');
    await assert.rejects(processImage(source, path.join(directory, 'images'), { source: 'Original test fixture', license: 'Project' }), /pixel limit/i);
    process.env.CREATIVE_TOKTX_PATH = process.execPath; // Never reached: rejection must precede encoding.
    await assert.rejects(processTexture(source, path.join(directory, 'textures', 'large.ktx2'), path.join(directory, 'decoders')), /pixel limit/i);
    assert.match(await readFile(source, 'utf8'), /5001/);
  } finally {
    if (originalEncoder === undefined) delete process.env.CREATIVE_TOKTX_PATH; else process.env.CREATIVE_TOKTX_PATH = originalEncoder;
    await removeFixture(directory);
  }
});

test('raster encoded-byte limit rejects oversized files before buffering or native encoding', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'creative-assets-'));
  const previousEncoder = process.env.CREATIVE_TOKTX_PATH;
  try {
    const source = path.join(directory, 'source', 'large.png'); await mkdir(path.dirname(source));
    const handle = await open(source, 'w');
    try { await handle.truncate(64 * 1024 * 1024 + 1); } finally { await handle.close(); }
    await assert.rejects(processImage(source, path.join(directory, 'derived'), { source: 'Original size-limit fixture', license: 'Project' }), /encoded-byte/);
    process.env.CREATIVE_TOKTX_PATH = process.execPath;
    await assert.rejects(processTexture(source, path.join(directory, 'derived', 'large.ktx2'), path.join(directory, 'basis')), /encoded-byte/);
  } finally {
    if (previousEncoder === undefined) delete process.env.CREATIVE_TOKTX_PATH; else process.env.CREATIVE_TOKTX_PATH = previousEncoder;
    await removeFixture(directory);
  }
});

test('failed texture encoding leaves no browser-served intermediate', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'creative-assets-'));
  const originalEncoder = process.env.CREATIVE_TOKTX_PATH; const originalBasis = process.env.CREATIVE_BASIS_SOURCE_DIR;
  try {
    const source = path.join(directory, 'source', 'art.svg'); const basis = path.join(directory, 'basis-source');
    await mkdir(path.dirname(source)); await mkdir(basis);
    await writeFile(source, '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"/>');
    await writeFile(path.join(basis, 'basis_transcoder.js'), 'fixture'); await writeFile(path.join(basis, 'basis_transcoder.wasm'), 'fixture');
    process.env.CREATIVE_TOKTX_PATH = process.execPath; process.env.CREATIVE_BASIS_SOURCE_DIR = basis;
    await assert.rejects(processTexture(source, path.join(directory, 'public', 'poster.ktx2'), path.join(directory, 'public', 'basis')), /Tool failed/);
    assert.deepEqual(await readdir(path.join(directory, 'public')), []);
  } finally {
    if (originalEncoder === undefined) delete process.env.CREATIVE_TOKTX_PATH; else process.env.CREATIVE_TOKTX_PATH = originalEncoder;
    if (originalBasis === undefined) delete process.env.CREATIVE_BASIS_SOURCE_DIR; else process.env.CREATIVE_BASIS_SOURCE_DIR = originalBasis;
    await removeFixture(directory);
  }
});
test('production GLB has a real bounded uncompressed scene', async () => {
  const report = await inspectModel(fileURLToPath(new URL('../../projects/creative-workbench/public/assets/form.glb', import.meta.url)));
  assert.equal(report.meshes, 4); assert.ok(report.triangles > 1000);
  assert.deepEqual(report.requiredExtensions, []);
});

test('model inspection rejects empty geometry and meshes absent from the active scene', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'creative-assets-'));
  try {
    const empty = new Document(); empty.createScene(); empty.createMesh();
    const emptyFile = path.join(directory, 'empty.glb'); await writeFile(emptyFile, await new NodeIO().writeBinary(empty));
    await assert.rejects(inspectModel(emptyFile), /empty|renderable/);
    const orphan = new Document(); const buffer = orphan.createBuffer();
    const positions = orphan.createAccessor().setType('VEC3').setArray(new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0])).setBuffer(buffer);
    const mesh = orphan.createMesh().addPrimitive(orphan.createPrimitive().setAttribute('POSITION', positions));
    orphan.createScene(); orphan.createNode().setMesh(mesh);
    const orphanFile = path.join(directory, 'orphan.glb'); await writeFile(orphanFile, await new NodeIO().writeBinary(orphan));
    await assert.rejects(inspectModel(orphanFile), /active scene/);
    orphan.getRoot().listScenes()[0].addChild(orphan.getRoot().listNodes()[0]);
    mesh.listPrimitives()[0].setIndices(orphan.createAccessor().setType('SCALAR').setArray(new Uint16Array([0, 1, 9])).setBuffer(buffer));
    const indexedFile = path.join(directory, 'bad-indices.glb'); await writeFile(indexedFile, await new NodeIO().writeBinary(orphan));
    await assert.rejects(inspectModel(indexedFile), /indices/);
    positions.setArray(new Float32Array([NaN, 0, 0, 1, 0, 0, 0, 1, 0]));
    const nonfiniteFile = path.join(directory, 'nonfinite.glb'); await writeFile(nonfiniteFile, await new NodeIO().writeBinary(orphan));
    await assert.rejects(inspectModel(nonfiniteFile), /non-finite/);
  } finally { await removeFixture(directory); }
});
test('serving model and local texture decoder match recorded source provenance', async () => {
  const assets = new URL('../../projects/creative-workbench/public/assets/', import.meta.url);
  const images = JSON.parse(await readFile(new URL('images.provenance.json', assets), 'utf8'));
  for (const image of images.outputs) assert.equal(await hashFile(new URL(image.file, assets)), image.sha256);
  const manifest = JSON.parse(await readFile(new URL('model.provenance.json', assets), 'utf8'));
  assert.equal(await hashFile(new URL('form.glb', assets)), manifest.output.sha256);
  assert.equal(await hashFile(new URL('../../projects/creative-workbench/assets/source/form.blend', import.meta.url)), manifest.sourceSha256);
  assert.equal(await hashFile(new URL('export-form.py', import.meta.url)), manifest.exporterSha256);
  const texture = JSON.parse(await readFile(new URL('poster.ktx2.provenance.json', assets), 'utf8'));
  assert.equal(await hashFile(new URL('poster.ktx2', assets)), texture.sha256);
  for (const decoder of texture.decoders) assert.equal(await hashFile(new URL(`basis/${decoder.file}`, assets)), decoder.sha256);
  assert.match(await readFile(new URL('basis/LICENSE.txt', assets), 'utf8'), /Apache License/);
});

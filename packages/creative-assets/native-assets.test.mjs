import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exportModel, processTexture, toolPath, hashFile } from './pipeline.mjs';

async function removeFixture(directory) {
  assert.ok(path.resolve(directory).startsWith(path.join(tmpdir(), 'creative-native-assets-')));
  await rm(directory, { recursive: true, force: true });
}

test('native KTX export preserves the published texture when decoder publication is obstructed', { timeout: 120000 }, async () => {
  toolPath(process.env.CREATIVE_TOKTX_PATH, 'CREATIVE_TOKTX_PATH');
  const directory = await mkdtemp(path.join(tmpdir(), 'creative-native-assets-'));
  try {
    const source = fileURLToPath(new URL('../../projects/creative-workbench/assets/source/poster.svg', import.meta.url));
    const output = path.join(directory, 'derived', 'poster.ktx2'); const basis = path.join(directory, 'derived', 'basis');
    const result = await processTexture(source, output, basis);
    assert.ok(result.bytes > 0); assert.equal(result.sha256, await hashFile(output));
    const previous = await readFile(output); const provenance = await readFile(output + '.provenance.json');
    const decoder = await readFile(path.join(basis, 'basis_transcoder.wasm'));
    const blocked = path.join(directory, 'blocked-basis'); await writeFile(blocked, 'Preserve existing file');
    await assert.rejects(processTexture(source, output, blocked));
    assert.deepEqual(await readFile(output), previous); assert.deepEqual(await readFile(output + '.provenance.json'), provenance);
    assert.deepEqual(await readFile(path.join(basis, 'basis_transcoder.wasm')), decoder);
    assert.equal(await readFile(blocked, 'utf8'), 'Preserve existing file');
    assert.ok((await readdir(path.dirname(output))).every(file => !file.startsWith('.creative-')));
  } finally { await removeFixture(directory); }
});

test('Blender export preserves the published GLB when optimized model inspection rejects bytes', { timeout: 120000 }, async () => {
  toolPath(process.env.CREATIVE_BLENDER_PATH, 'CREATIVE_BLENDER_PATH');
  const previousCLI = process.env.CREATIVE_GLTF_TRANSFORM_CLI;
  toolPath(previousCLI, 'CREATIVE_GLTF_TRANSFORM_CLI');
  const directory = await mkdtemp(path.join(tmpdir(), 'creative-native-assets-'));
  try {
    const script = fileURLToPath(new URL('./export-form.py', import.meta.url));
    const source = path.join(directory, 'source'); const output = path.join(directory, 'derived');
    const result = await exportModel(script, source, output);
    assert.equal(result.manifest.output.meshes, 4); assert.ok(result.manifest.output.triangles > 0);
    const model = await readFile(path.join(output, 'form.glb')); const provenance = await readFile(path.join(output, 'model.provenance.json'));
    const blend = await readFile(path.join(source, 'form.blend')); const raw = await readFile(path.join(source, 'form.raw.glb'));
    const rejectedCLI = path.join(directory, 'rejected-cli.mjs');
    await writeFile(rejectedCLI, "import{writeFile}from'node:fs/promises';await writeFile(process.argv.at(-1),'Invalid optimized GLB fixture');");
    process.env.CREATIVE_GLTF_TRANSFORM_CLI = rejectedCLI;
    await assert.rejects(exportModel(script, source, output));
    assert.deepEqual(await readFile(path.join(output, 'form.glb')), model);
    assert.deepEqual(await readFile(path.join(output, 'model.provenance.json')), provenance);
    assert.deepEqual(await readFile(path.join(source, 'form.blend')), blend);
    assert.deepEqual(await readFile(path.join(source, 'form.raw.glb')), raw);
    assert.ok((await readdir(output)).every(file => !file.startsWith('.creative-')));
  } finally { process.env.CREATIVE_GLTF_TRANSFORM_CLI = previousCLI; await removeFixture(directory); }
});

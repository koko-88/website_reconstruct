import { existsSync, statSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { homedir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { registry } from './route.mjs';
const root = fileURLToPath(new URL('../..', import.meta.url));
const consumerArg = process.argv.indexOf('--consumer');
let consumerRoot = root;
if (consumerArg >= 0) {
  if (!process.argv[consumerArg + 1]) throw new Error('--consumer requires an existing consumer workspace directory.');
  consumerRoot = path.resolve(process.argv[consumerArg + 1]);
  if (!statSync(path.join(consumerRoot, 'package.json')).isFile()) throw new Error('Selected consumer needs a regular package.json.');
}
const require = createRequire(path.join(consumerRoot, 'package.json'));
const skillRoots = process.env.CREATIVE_SKILL_ROOTS?.split(path.delimiter) ?? [path.join(root, 'skills'), path.join(homedir(), '.agents', 'skills'), path.join(homedir(), '.codex', 'skills'), path.join(homedir(), '.codex', 'skills', '.system')];
const modules = [...new Set(Object.values(registry.profiles).flatMap(profile => [...profile.packages, ...profile.peers]))];
const packages = [];
for (const name of modules) {
  try {
    const resolved = require.resolve(name); let directory = path.dirname(resolved); let metadata;
    while (directory !== path.dirname(directory)) {
      try { const candidate = JSON.parse(await readFile(path.join(directory, 'package.json'), 'utf8')); if (candidate.name === name) { metadata = candidate; break; } } catch {}
      directory = path.dirname(directory);
    }
    packages.push({ name, status: 'installed', version: metadata?.version ?? 'unknown', entry: resolved, peers: metadata?.peerDependencies });
  } catch (error) { packages.push({ name, status: 'unavailable', reason: error.code }); }
}
const skills = [...new Set(Object.values(registry.profiles).flatMap(profile => profile.skills))].map(name => {
  const file = skillRoots.map(directory => path.join(directory, name, 'SKILL.md')).find(existsSync);
  return { name, status: file ? 'installed' : 'not-found-in-search-roots', path: file ?? null };
});
const commands = [...new Set(Object.values(registry.profiles).flatMap(profile => profile.tools))].map(name => {
  const envName = name === 'gltf-transform' ? 'CREATIVE_GLTF_TRANSFORM_CLI' : `CREATIVE_${name.replaceAll('-', '_').toUpperCase()}_PATH`;
  const explicit = process.env[envName];
  const regularFile = file => { try { return path.isAbsolute(file) && statSync(file).isFile(); } catch { return false; } };
  if (explicit !== undefined && !regularFile(explicit)) return { name, status: 'invalid-override', path: null, override: envName, reason: 'Override must identify an existing absolute regular file; no fallback is selected.' };
  const candidates = explicit !== undefined ? [explicit] : (process.env.PATH ?? '').split(path.delimiter).flatMap(directory => [name, `${name}.exe`, `${name}.cmd`, `${name}.ps1`].map(file => path.resolve(directory, file)));
  const file = candidates.find(regularFile);
  return { name, status: file ? 'entrypoint-found-not-exercised' : 'not-found', path: file ?? null, override: envName };
});
let mcp = { status: 'not-supplied', note: 'Session exposure must be obtained from the calling agent; local config is not live service health.' };
const mcpArg = process.argv.indexOf('--mcp-inventory');
if (mcpArg >= 0) {
  const inventory = JSON.parse(await readFile(process.argv[mcpArg + 1], 'utf8'));
  mcp = { status: 'exposed-not-certified', tools: inventory.filter(tool => /blender|babylon|spector|figma|canva|higgsfield|firecrawl|image_gen|chrome[-_]devtools|polypane/.test(tool.name)).map(tool => tool.name) };
}
const report = { timestamp: new Date().toISOString(), lane: registry.lane, resolutionRoot: consumerRoot, node: process.version, platform: process.platform, packages, skills, commands, mcp, certification: 'Discovery only; see executed functional evidence in IMPLEMENTATION_VERIFICATION.md.' };
const outputArg = process.argv.indexOf('--output');
if (outputArg >= 0) await writeFile(process.argv[outputArg + 1], JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
export const registry = JSON.parse(await readFile(new URL('./capabilities.json', import.meta.url), 'utf8'));
export function routeCapabilities(names = ['dom']) {
  const selected = [...new Set(names)];
  if (!selected.length) selected.push('dom');
  for (const name of selected) if (!Object.hasOwn(registry.profiles, name)) throw new Error(`Unknown capability ${name}. Choose: ${Object.keys(registry.profiles).join(', ')}`);
  const merge = field => [...new Set(selected.flatMap(name => registry.profiles[name][field] ?? []))];
  return { lane: registry.lane, profiles: selected, guidance: registry.guidance, packages: merge('packages'), peers: merge('peers'), skills: merge('skills'), toolsToProbe: merge('tools'), mcpToProbe: merge('mcp'), engines: merge('engines'), installation: 'Select only the consumer workspace and required engine peers; discovery/routing does not install.', verification: 'Build, functional browser checks, visual review and required asset roundtrip; installation is not certification.' };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { console.log(JSON.stringify(routeCapabilities(process.argv.slice(2)), null, 2)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}

#!/usr/bin/env node
/**
 * Stage-2 skill-hardening capability preflight.
 *
 * Read-only: it never downloads software, opens a browser, modifies the repository,
 * calls a model, or invokes remote services. Output is machine-readable JSON.
 *
 * A CLI's presence does not prove its readiness for a real capture/evaluation task.
 */
import {spawnSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {homedir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const requireFromRoot = createRequire(path.join(root, 'package.json'));
const strict = process.argv.includes('--strict');
const jobs = [
  {id: 'node', bin: 'node', args: ['--version'], required: true},
  {id: 'npm', bin: 'npm', args: ['--version'], required: true},
  {id: 'mise', bin: 'mise', args: ['--version'], required: true},
  {id: 'uv', bin: 'uv', args: ['--version'], required: false},
  {id: 'promptfoo', bin: 'promptfoo', args: ['--version'], required: false},
  {id: 'inspect-ai', bin: 'inspect', args: ['--version'], required: false},
  {id: 'ffmpeg', bin: 'ffmpeg', args: ['-version'], required: false},
  {id: 'docker', bin: 'docker', args: ['--version'], required: false, note: 'Optional Browsertrix Crawler host prerequisite; never an application runtime dependency'},
];

function inspectCli(job) {
  const r = spawnSync(job.bin, job.args, {
    cwd: root, timeout: 6000, encoding: 'utf8',
    windowsHide: true, shell: process.platform === 'win32',
    maxBuffer: 64 * 1024,
  });
  const lines = String(r.stdout || r.stderr || '').split(/\r?\n/).map(x => x.trim()).filter(Boolean);
  return {id: job.id, required: job.required, available: !r.error && r.status === 0,
    identity: (!r.error && r.status === 0) ? (lines[0] || 'present') : null,
    note: job.note || undefined};
}

function inspectNodePackage(name) {
  try {
    const resolved = requireFromRoot.resolve(name + '/package.json');
    return {id: name, available: true, path: path.relative(root, resolved).replaceAll('\\', '/')};
  } catch {
    try {
      const resolved = requireFromRoot.resolve(name);
      return {id: name, available: true, path: path.relative(root, resolved).replaceAll('\\', '/')};
    } catch {
      return {id: name, available: false, note: 'Not resolved in this repository; an external agent runtime may provide its own Playwright'};
    }
  }
}

const roots = [
  process.env.AGENTS_SKILLS_DIR && path.join(process.env.AGENTS_SKILLS_DIR, 'skill-creator', 'SKILL.md'),
  path.join(homedir(), '.agents', 'skills', 'skill-creator', 'SKILL.md'),
  path.join(homedir(), '.claude', 'skills', 'skill-creator', 'SKILL.md'),
].filter(Boolean);
const skillCreator = {id:'skill-creator', available:roots.some(existsSync),
  note:'Only conventional agent skill paths are checked; other clients may use different roots'};
const capabilities = jobs.map(inspectCli);
const all = [...capabilities, inspectNodePackage('playwright'), skillCreator];
const failures = all.filter(c => c.required && !c.available).map(c => c.id);
const optionalMissing = all.filter(c => !c.required && !c.available).map(c => c.id);

const result = {
  schema: 'website-reconstruction/skill-hardening-host-preflight/v1',
  host: {platform:process.platform, arch:process.arch},
  readOnly: true,
  capabilities: all,
  requiredFailures: failures,
  optionalMissing,
  caveats: [
    'Presence is not runtime reachability or validated behavior.',
    'MCP connections, Polypane and browser access need separate live verification.',
    'Inspect Evals package availability is environment-specific and is not proven by Inspect AI CLI presence.',
    'Browsertrix Crawler requires Docker; it is optional and outside the no-Docker website runtime.',
    'Skill evaluation and acquisition fidelity gates are not satisfied by this preflight.'
  ]
};
console.log(JSON.stringify(result, null, 2));
if (strict && failures.length) process.exitCode = 1;

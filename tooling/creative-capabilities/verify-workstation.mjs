import { existsSync, readFileSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import net from "node:net";
import { fileURLToPath } from "node:url";

const args = new Set(process.argv.slice(2));
const ciMode = args.has("--ci");
const strictMode = args.has("--strict");
const root = resolve(fileURLToPath(new URL("../../", import.meta.url)));

const results = [];
const push = (capability, status, surface, resolvedPath = null, detail = null) => {
  results.push({ capability, status, surface, resolved: resolvedPath, detail });
};

function run(command, commandArgs = [], cwd = root) {
  const result = spawnSync(command, commandArgs, {
    cwd,
    encoding: "utf8",
    windowsHide: true,
    shell: false,
  });
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`.trim();
  return { ok: !result.error && result.status === 0, output, status: result.status, error: result.error?.message };
}

function commandCandidates(name) {
  const finder = process.platform === "win32" ? "where.exe" : "which";
  const found = run(finder, [name]);
  if (!found.ok || !found.output) return [];
  return [...new Set(found.output.split(/\r?\n/).map((v) => v.trim()).filter(Boolean))];
}

function expandHome(path) {
  return path.startsWith("~/") ? join(homedir(), path.slice(2)) : path;
}

function probeExecutable(capability, commands, versionArgs = ["--version"], surface = "shell", extraPaths = []) {
  const candidates = [...commands.flatMap(commandCandidates), ...extraPaths.map(expandHome).filter(existsSync)];
  for (const candidate of [...new Set(candidates)]) {
    const probed = run(candidate, versionArgs);
    if (probed.ok || probed.output) {
      push(capability, "AVAILABLE", surface, candidate, probed.output.split(/\r?\n/).slice(0, 4).join(" "));
      return;
    }
  }
  push(capability, "MISSING", surface, null, `Commands checked: ${commands.join(", ")}`);
}

function skillFamily(capability, prefix) {
  const roots = [
    join(homedir(), ".agents", "skills"),
    join(homedir(), ".codex", "skills"),
    join(homedir(), ".cursor", "skills"),
    join(homedir(), ".config", "opencode", "skills"),
    join(homedir(), ".claude", "skills"),
  ];
  const hits = [];
  for (const dir of roots) {
    if (!existsSync(dir)) continue;
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (entry.toLowerCase().startsWith(prefix) && existsSync(join(full, "SKILL.md"))) hits.push(full);
    }
  }
  push(capability, hits.length ? "AVAILABLE" : "MISSING", "agent-skill", hits.join("; ") || null,
    hits.length ? `${hits.length} skill installation(s) detected.` : `No ${prefix}* skill with SKILL.md found.`);
}

function codexMcpNames() {
  const config = join(homedir(), ".codex", "config.toml");
  if (!existsSync(config)) return [];
  const raw = readFileSync(config, "utf8");
  return [...raw.matchAll(/^\[mcp_servers\.([^\]]+)\]/gm)].map((m) => m[1].replace(/^[\"']|[\"']$/g, ""));
}

function checkMcpConfig() {
  const configured = new Set(codexMcpNames());
  const expectedBabylon = [
    "babylon-material", "babylon-geometry", "babylon-render-graph",
    "babylon-particles", "babylon-gui", "babylon-flow-graph", "babylon-smart-filters",
  ];
  const spector = join(homedir(), "creative_tools", "Spector.js", "mcp", "dist", "index.js");
  push("Spector.js MCP", existsSync(spector) && configured.has("spector") ? "CONFIGURED"
      : existsSync(spector) ? "PRESENT_UNCONFIGURED" : "MISSING",
    "mcp-stdio", existsSync(spector) ? spector : null,
    configured.has("spector") ? "Codex configuration contains mcp_servers.spector." : "Codex MCP entry not detected.");

  const present = expectedBabylon.filter((name) => configured.has(name));
  push("Babylon authoring MCPs", present.length === expectedBabylon.length ? "CONFIGURED"
      : present.length ? "PARTIAL" : "MISSING_CONFIG",
    "mcp-stdio", present.join(", ") || null,
    present.length === expectedBabylon.length ? "All seven Babylon MCP entries detected."
      : `Missing: ${expectedBabylon.filter((name) => !configured.has(name)).join(", ")}`);

  push("Blender MCP", configured.has("blender") ? "CONFIGURED" : "MISSING_CONFIG",
    "mcp-local-bridge", null,
    configured.has("blender") ? "Codex configuration contains mcp_servers.blender; reachability checked separately."
      : "Codex MCP entry not detected.");
}

function testPort(host, port, timeoutMs = 700) {
  return new Promise((resolvePromise) => {
    const socket = net.createConnection({ host, port });
    const done = (value) => {
      socket.destroy();
      resolvePromise(value);
    };
    socket.setTimeout(timeoutMs);
    socket.once("connect", () => done(true));
    socket.once("timeout", () => done(false));
    socket.once("error", () => done(false));
  });
}

function projectContract() {
  const manifestPath = join(root, "tooling", "creative-capabilities", "capability-manifest.json");
  const miseToml = join(root, "mise.toml");
  const miseLock = join(root, "mise.lock");
  const oldPs = join(root, "tooling", "creative-capabilities", "verify-workstation.ps1");
  const profile = join(root, "tooling", "reconstruction-workstation", "mise.toml");

  try {
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    const ok = manifest.reproducibility?.controlPlane === "mise"
      && manifest.reproducibility?.projectConfig === "mise.toml"
      && manifest.reproducibility?.workstationConfig === "tooling/reconstruction-workstation/mise.toml";
    push("Capability manifest", ok ? "VALID" : "INVALID", "project-control-plane", manifestPath,
      ok ? `schemaVersion=${manifest.schemaVersion}` : "Missing or inconsistent reproducibility metadata.");
  } catch (error) {
    push("Capability manifest", "INVALID", "project-control-plane", manifestPath, error.message);
  }

  const tomlText = existsSync(miseToml) ? readFileSync(miseToml, "utf8") : "";
  const lockText = existsSync(miseLock) ? readFileSync(miseLock, "utf8") : "";
  const configOk = /node\s*=\s*"24\.19\.0"/.test(tomlText) && /lockfile\s*=\s*true/.test(tomlText);
  push("Project mise config", configOk ? "VALID" : "INVALID", "project-control-plane", miseToml,
    configOk ? "Node 24.19.0 and committed lockfile policy declared." : "Required project toolchain declarations are missing.");

  const lockOk = /version\s*=\s*"24\.19\.0"/.test(lockText)
    && /platforms\.linux-x64/.test(lockText)
    && /platforms\.windows-x64/.test(lockText);
  push("Project mise lock", lockOk ? "VALID" : "INVALID", "project-control-plane", miseLock,
    lockOk ? "Windows x64 and Linux x64 Node artifacts are locked." : "Missing required Node lock entries.");

  push("Reusable workstation profile", existsSync(profile) ? "VALID" : "MISSING",
    "machine-bootstrap", profile, existsSync(profile) ? "Declarative machine profile found." : null);

  push("Legacy PowerShell workstation verifier", existsSync(oldPs) ? "PRESENT_FORBIDDEN" : "ABSENT",
    "project-control-plane", oldPs, existsSync(oldPs) ? "Reproducibility must not depend on the legacy PowerShell verifier." : null);

  const nodeOk = process.version === "v24.19.0";
  push("Node project toolchain", nodeOk ? "AVAILABLE" : "VERSION_MISMATCH", "mise-tool", process.execPath, process.version);

  const npmProbe = run(process.platform === "win32" ? "npm.cmd" : "npm", ["--version"]);
  const npmVersion = npmProbe.output.split(/\r?\n/)[0]?.trim();
  push("npm bundled toolchain", npmProbe.ok && npmVersion === "11.17.0" ? "AVAILABLE" : "VERSION_MISMATCH",
    "node-bundled", commandCandidates(process.platform === "win32" ? "npm.cmd" : "npm")[0] ?? null,
    npmVersion || npmProbe.error || "npm unavailable");
}

projectContract();

if (!ciMode) {
  skillFamily("GSAP AI Skills", "gsap");
  skillFamily("PixiJS Skills", "pixijs");

  probeExecutable("glTF Transform", ["gltf-transform"], ["--version"]);
  probeExecutable("gltfpack", ["gltfpack"], ["-h"]);
  probeExecutable("FFmpeg", ["ffmpeg"], ["-version"]);
  probeExecutable("KTX-Software", ["ktx"], ["--version"], "shell", [
    "~/scoop/apps/ktx-software/current/bin/ktx.exe",
  ]);
  probeExecutable("Blender", ["blender"], ["--version"], "desktop-cli",
    process.platform === "win32" ? [
      "C:/Program Files/Blender Foundation/Blender 5.1/blender.exe",
      "C:/Program Files/Blender Foundation/Blender 5.0/blender.exe",
      "C:/Program Files/Blender Foundation/Blender 4.5/blender.exe",
      "C:/Program Files/Blender Foundation/Blender 4.2/blender.exe",
    ] : []);
  probeExecutable("GIMP", ["gimp", "gimp-3.0", "gimp-console", "gimp-console-3.0"], ["--version"], "desktop-cli",
    process.platform === "win32" ? [
      "C:/Program Files/GIMP 3/bin/gimp-console-3.0.exe",
    ] : []);
  probeExecutable("RenderDoc CLI", ["renderdoccmd"], ["version"], "native-cli",
    process.platform === "win32" ? ["C:/Program Files/RenderDoc/renderdoccmd.exe"] : []);

  checkMcpConfig();
  const blenderReachable = await testPort("127.0.0.1", 9876);
  push("Blender MCP bridge", blenderReachable ? "REACHABLE" : "NOT_REACHABLE", "mcp-local-bridge",
    "127.0.0.1:9876", blenderReachable ? "TCP bridge reachable." : "Blender/add-on may simply not be running.");

  push("WebGPU Inspector", "OPTIONAL_MANUAL_CHECK", "browser-extension", null,
    "Browser extension state is intentionally not inferred from filesystem heuristics.");
} else {
  push("Host-only creative capabilities", "SKIPPED_CI", "host-boundary", null,
    "Desktop/MCP/browser capability reachability is verified on the fidelity host, not a Linux CI runner.");
}

const width = Math.max(...results.map((r) => r.capability.length), 10);
for (const row of results) {
  console.log(`${row.capability.padEnd(width)}  ${row.status.padEnd(20)}  ${row.surface}${row.resolved ? `  ${row.resolved}` : ""}`);
}
console.log("\nJSON:");
console.log(JSON.stringify(results, null, 2));

const hardFailures = new Set(["INVALID", "VERSION_MISMATCH", "PRESENT_FORBIDDEN"]);
const contractFailed = results.some((r) => hardFailures.has(r.status));
const strictFailed = strictMode && results.some((r) =>
  ["MISSING", "MISSING_CONFIG", "NOT_REACHABLE", "PARTIAL"].includes(r.status)
);
process.exitCode = contractFailed || strictFailed ? 1 : 0;

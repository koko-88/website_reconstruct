import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const repo = join(homedir(), "creative_tools", "Spector.js");
const mcp = join(repo, "mcp");
if (!existsSync(join(mcp, "package-lock.json"))) {
  throw new Error("Pinned Spector.js MCP checkout is missing mcp/package-lock.json: " + mcp);
}

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const npx = process.platform === "win32" ? "npx.cmd" : "npx";

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, stdio: "inherit", shell: false, windowsHide: true });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(command + " exited with " + result.status);
}

run(npm, ["ci"], mcp);
run(npx, ["playwright", "install", "chromium"], mcp);
run(npm, ["run", "build"], mcp);

if (!existsSync(join(mcp, "dist", "index.js"))) {
  throw new Error("Spector.js MCP build completed without mcp/dist/index.js");
}

console.log("Spector.js MCP build verified.");

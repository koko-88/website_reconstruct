# Creative execution capabilities — CEC-WR-01

Status: **ACTIVE — capability shelf for implementation**
Date: **2026-10-05**
Applies to: reusable website-reconstruction implementation. Haunted Boulder City is the first consuming fixture, not the scope boundary of this shelf.

## Purpose

The project must not enter implementation with evidence/specification only. This capability shelf records the authoring, motion, GPU, media, debugging and asset-pipeline tools that agents may use when the task requires them.

Availability does **not** mean every library is imported into every slice. The task/spec/evidence selects the smallest capable path; unused runtimes must not be shipped merely because they are installed.

## Capability matrix

| Capability | Tool | Integration surface | Install timing | Use gate |
| --- | --- | --- | --- | --- |
| DOM/timeline motion | GSAP + plugins | project npm | task-selected bootstrap | select when timeline/state complexity materially benefits from it |
| Agent motion knowledge | official GSAP AI Skills | Codex/Cursor/OpenCode skills | workstation setup | always available to coding agents |
| Motion debugging | GSDevTools / CustomEase / MotionPathHelper | GSAP package | app bootstrap | motion tuning/debugging |
| Visual keyframe authoring | Theatre.js Core + Studio | project npm; Studio dev-only | app bootstrap | use when hand-tuned timeline/keyframe authoring is useful |
| Creative WebGL/WebGPU | Three.js | project npm | app bootstrap | use when evidence/task justifies GPU 3D/custom rendering |
| Full 3D engine alternate | Babylon.js | project npm | app bootstrap | escalation when engine-level facilities are materially useful |
| GPU 2D/particles | PixiJS | project npm | app bootstrap | use when DOM/CSS is not the right renderer for 2D GPU effects |
| Scroll synchronization | Lenis | project npm | app bootstrap | only when smooth/synchronized scroll is an explicit task need |
| WebGL diagnostics | Spector.js MCP | local MCP server | workstation setup | agent-visible WebGL frame/shader/texture/state inspection |
| WebGPU diagnostics | WebGPU Inspector | browser extension/local capture | workstation setup | WebGPU-only diagnostics |
| 3D inspection/optimization | glTF Transform CLI | global CLI | workstation setup | glTF/GLB inspect/transform/optimize |
| Mesh optimization | gltfpack / meshoptimizer | global/native CLI | workstation setup | mesh simplification/compression/optimization |
| GPU texture pipeline | KTX-Software / Basis Universal | desktop/CLI | workstation setup | KTX2/UASTC/ETC1S texture work |
| 3D asset authoring | Blender LTS | desktop app | workstation setup | modeling/materials/lighting/render/bake |
| image/texture authoring | GIMP | desktop app | workstation setup | masks/textures/compositing/replacements |
| media pipeline | FFmpeg | CLI | workstation setup | transcode/frame extraction/media normalization |

## Integration model

These capabilities do not all integrate the same way:

| Surface | Tools | Agent relationship |
| --- | --- | --- |
| Agent-native skills | GSAP AI Skills | Read automatically from the agent skill directory; no MCP required |
| MCP tool | Spector.js MCP | Connect once to Codex/Claw as a local stdio MCP server; exposes WebGL diagnostics as structured tools |
| Shell/CLI | glTF Transform, gltfpack, FFmpeg, KTX | Agent invokes them through its normal shell/tool execution when the task needs them |
| Browser diagnostic | WebGPU Inspector | Used inside the browser/DevTools; not an MCP dependency by default |
| Desktop authoring | Blender, GIMP | Local authoring applications; automation/CLI is optional, not a prerequisite for normal use |
| Project runtime | GSAP, Theatre.js, Three.js, Babylon.js, PixiJS, Lenis | Install in the application package only after the task selects them; they are shipped code, not workstation-global tools |

Run `tooling/creative-capabilities/verify-workstation.ps1` before installing anything again. A FOUND capability is reused; only MISSING capabilities are installed or repaired. Browser-extension checks remain manual unless a deterministic browser-management source is added later.

## Approved runtime candidates

The packages below are approved candidates, not a bootstrap bundle. Do **not** install them all when `package.json` is created. The accepted task/plan selects the smallest required subset, then that subset is pinned in the project lockfile.

| Capability | Candidate package(s) |
| --- | --- |
| DOM/timeline motion | `gsap` |
| Visual keyframe authoring | `@theatre/core`, with `@theatre/studio` dev-only when selected |
| GPU 3D/custom rendering | `three` |
| Full 3D engine escalation | `@babylonjs/core`, `@babylonjs/loaders`, inspector dev-only when selected |
| GPU 2D/particles | `pixi.js` |
| Smooth/synchronized scroll | `lenis` |

A task that needs none of these installs none of them. Availability on the workstation or in this catalog never overrides the active Spec Kit plan/task.

## Workstation setup

### Agent skills

```powershell
npx skills add https://github.com/greensock/gsap-skills --all -g
```

### 3D command-line tooling

```powershell
npm install --global @gltf-transform/cli gltfpack
```

### Spector.js MCP

Keep the clone outside the application repository:

```powershell
git clone https://github.com/BabylonJS/Spector.js.git
cd Spector.js
npm run mcp:install
npm run mcp:build
```

For Codex, configure a local stdio MCP server that runs:

```text
node <absolute-path-to-Spector.js>\mcp\dist\index.js
```

Do not commit a machine-specific absolute MCP path to the project.

### Desktop/browser tools

Only when an accepted task needs one and the verifier reports it missing, install a current stable/LTS release of:
- Blender LTS
- GIMP
- FFmpeg
- KTX-Software
- WebGPU Inspector browser extension

Pin the resolved installed versions in the local capability receipt before the first task that depends on them. Do not install or upgrade workstation tools merely to make this catalog look complete.

## Selection rules

1. Evidence/specification determines the required capability; installed tools do not expand scope.
2. Prefer authored/inspectable motion over repeated blind CSS tweaking when a task is timing/sequence-heavy.
3. Prefer DOM/CSS/GSAP for DOM effects; escalate to Pixi/Three/Babylon only when the observable requirement benefits from GPU rendering.
4. Do not use multiple render engines for the same surface without an explicit engineering reason.
5. Theatre Studio is development authoring UI only; production uses saved state/core as required.
6. GPU work requires independent browser acceptance; Spector/WebGPU Inspector are diagnostics, not fidelity acceptance.
7. Asset-production tools create implementation fixtures; they never mutate sealed reference evidence.
8. All runtime and tool choices remain subordinate to the active Constitution, fidelity contract, Spec Kit task and acceptance evidence.

## First-use verification

Before a task relies on a capability, record:
- installed/resolved version;
- command/package/plugin identity;
- execution surface (CLI/MCP/browser/desktop/npm);
- smoke result that does not consume a paid model when a deterministic check is available;
- any project-specific limitation.

No capability is considered production-ready merely because installation succeeded.

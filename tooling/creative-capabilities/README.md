# Creative execution capabilities — CEC-WR-01

Status: **ACTIVE — planning-visible workstation capability inventory**
Date: **2026-10-06**
Applies to: reusable website reconstruction. Haunted Boulder City is the current consumer, not the scope boundary of the workstation.

## Purpose

This file tells planning/execution agents which authoring, motion, GPU, media, debugging and asset-pipeline capabilities may already exist on the workstation.

Two boundaries are mandatory:

1. **Workstation capability availability is reusable and may be pre-provisioned.**
2. **Project runtime dependencies remain task-selected.** A tool being installed never means its npm runtime belongs in the website.

After technical replanning, reusable workstation metadata may be extracted outside this repository. The project must then retain only the selected project dependencies/configuration plus the minimal reference needed to discover the global capability inventory.

## Capability matrix

| Capability | Tool | Integration surface | Workstation role | Project-use gate |
| --- | --- | --- | --- | --- |
| DOM/timeline motion | GSAP + plugins | project npm | runtime candidate | select only when timing/state complexity benefits |
| Agent motion knowledge | official GSAP AI Skills | global agent skills | pre-provisionable | planning/coding knowledge; no runtime implication |
| Agent Pixi knowledge | PixiJS skills | global agent skills | pre-provisionable | use when PixiJS is selected or evaluated |
| Motion debugging | GSDevTools / CustomEase / MotionPathHelper | GSAP package | runtime/dev candidate | select with GSAP when useful |
| Visual keyframe authoring | Theatre.js Core + Studio | project npm; Studio dev-only | runtime/dev candidate | use when hand-tuned keyframe authoring is justified |
| Creative WebGL/WebGPU | Three.js | project npm | runtime candidate | use when evidence/task justifies custom GPU rendering |
| Full 3D engine alternate | Babylon.js | project npm | runtime candidate | alternate/escalation when engine-level facilities are useful |
| Babylon graph authoring | seven Babylon MCP servers | local stdio MCPs | pre-provisionable authoring | use only when a Babylon graph workflow is selected |
| GPU 2D/particles | PixiJS | project npm | runtime candidate | use when DOM/CSS is not the right 2D renderer |
| Scroll synchronization | Lenis | project npm | runtime candidate | only for explicit smooth/synchronized scroll need |
| WebGL diagnostics | Spector.js MCP | local stdio MCP | pre-provisionable diagnostic | use for browser WebGL frame/shader/texture/state inspection |
| 3D scene automation | Blender MCP | local MCP → Blender bridge | pre-provisionable authoring | use when direct scene/material/render manipulation is useful |
| Heavy GPU diagnostics | RenderDoc | desktop GUI + native CLI | pre-provisionable diagnostic | escalation for low-level GPU/frame debugging |
| Optional WebGPU diagnostics | WebGPU Inspector | browser extension | optional | never assume installed; use only if specifically selected |
| 3D inspection/optimization | glTF Transform CLI | global CLI | pre-provisionable | glTF/GLB inspect/transform/optimize |
| Mesh optimization | gltfpack / meshoptimizer | global/native CLI | pre-provisionable | mesh simplification/compression/optimization |
| GPU texture pipeline | KTX-Software | CLI | pre-provisionable | KTX2/UASTC/ETC1S texture work |
| 3D asset authoring | Blender LTS | desktop + CLI | pre-provisionable | modeling/materials/lighting/render/bake |
| Image/texture authoring | GIMP | desktop + console | pre-provisionable | masks/textures/compositing/replacements |
| Media pipeline | FFmpeg | CLI | pre-provisionable | transcode/frame extraction/media normalization |

## Integration model

| Surface | Tools | Agent relationship |
| --- | --- | --- |
| Agent-native skills | GSAP AI Skills, PixiJS Skills | Discovered from global agent skill roots; no MCP required |
| MCP tools | Spector.js, Blender MCP, Babylon authoring servers | Host-local structured tools; configuration/reachability must be verified separately from installation |
| Shell/CLI | glTF Transform, gltfpack, FFmpeg, KTX-Software, Blender CLI, GIMP console, RenderDoc CLI | Agent invokes through shell when selected and available |
| Desktop/GUI | Blender, GIMP, RenderDoc | Host-local GUI capabilities; remote/cloud execution must not assume them |
| Browser diagnostic | WebGPU Inspector | Optional browser/profile capability; not baseline |
| Project runtime | GSAP, Theatre.js, Three.js, Babylon.js, PixiJS, Lenis | Installed in the application only after the accepted plan/task selects them |

Run `tooling/creative-capabilities/verify-workstation.ps1` before repairing or reinstalling anything. Interpret its states precisely: an installed desktop app can be outside `PATH`; an MCP build/config can exist without a live workflow; remote/cloud hosts require separate provisioning.

## Approved runtime candidates

These are candidates, not a bootstrap bundle:

| Capability | Candidate package(s) |
| --- | --- |
| DOM/timeline motion | `gsap` |
| Visual keyframe authoring | `@theatre/core`, with `@theatre/studio` dev-only when selected |
| GPU 3D/custom rendering | `three` |
| Full 3D engine escalation | `@babylonjs/core`, `@babylonjs/loaders`, inspector dev-only when selected |
| GPU 2D/particles | `pixi.js` |
| Smooth/synchronized scroll | `lenis` |

Do not create or commit a root `package.json` containing the whole capability shelf before replanning. The application bootstrap owns only the runtime/dev dependencies selected by the accepted technical plan.

## Workstation baseline

The workstation may be proactively provisioned with reusable tools and skills. Reuse what is already installed; only repair/reinstall when deterministic verification shows that the required surface is actually unavailable.

Expected reusable surfaces currently include:

- GSAP and PixiJS agent skills;
- Spector.js MCP;
- Blender + Blender MCP;
- seven Babylon authoring MCP servers;
- glTF Transform and gltfpack;
- FFmpeg;
- KTX-Software;
- GIMP;
- RenderDoc GUI/CLI.

Machine-specific paths, ports and user-profile configuration stay local and must not be committed as portable project configuration.

## Selection rules

1. Evidence/specification determines the required capability; installed tools do not expand product scope.
2. Workstation provisioning and website runtime dependency selection are separate decisions.
3. Prefer DOM/CSS/GSAP for DOM effects; escalate to Pixi/Three/Babylon only when the observable requirement benefits from another renderer.
4. Do not use multiple render engines for the same surface without an explicit engineering reason.
5. Theatre Studio and engine inspectors are development authoring/debugging surfaces unless the accepted plan explicitly requires otherwise.
6. GPU diagnostics do not substitute for independent browser fidelity acceptance.
7. Asset-production tools create implementation fixtures; they never mutate sealed reference evidence.
8. A missing optional host-local tool may degrade to an evidenced equivalent; a missing capability required by the accepted task blocks that dependent task.
9. All choices remain subordinate to the Constitution, fidelity contract, active Spec Kit artifacts and acceptance evidence.

## First-use verification

Before a task relies on a capability, record:

- installed/resolved version or identity;
- execution surface (skill/MCP/CLI/browser/desktop/npm);
- whether the current host can actually reach it;
- deterministic smoke result when possible;
- any project-specific limitation.

Installation, configuration and live reachability are distinct states.

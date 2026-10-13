# Creative Production implementation plan

Inspection HEAD: 7a6236880f2e7579ac4af534d67444821b4c0d8c. Preserve existing mise edits,
storybook lock/log and dirty attached worktrees. Root package/lock were ignored provisional files.
No existing workbench source was found. Promote root to native npm workspaces. Reuse Three
0.186.1, Fiber 9.8.1, Drei 10.7.9 and React 19.3.0. Postprocessing 6.39.5 peers permit Three
<0.187; avoid major renderer upgrades.

## Architecture and design

React/Vite with small peer-dependent source packages: creative-core (visibility/preferences,
fallbacks/quality), creative-motion, creative-three, creative-pixi, creative-assets.
projects/creative-workbench consumes all profiles; future projects select packages/engine peers.
Full factory install includes reference runtimes; scoped consumer installs exclude root/workbench.
No universal renderer or custom scene framework.

Original editorial instrument: warm paper, ink, rust, lime; numbered disciplines, large type, one
live viewport and native controls. Motion, spatial and particles have separate lazy routes.
Narrow screens stack controls. Content/state stay in DOM. No remote fonts/models.

Reuse GSAP/PixiJS/UI UX Pro Max guidance and native asset tools. Blender 5.2.2 CLI/KTX 4.4.2 exist,
Blender MCP initially disconnected; the existing enabled addon now responds after launching Blender. Use a separate headless exporter for reproducible assets. Reuse glTF Transform
4.5.1/gltfpack 1.3.0. Graph freshness was updated to inspection HEAD; new untracked creative files still require source verification.

## Validation

TypeScript/build; Node routing/assets tests; production Playwright with installed Chrome/axe,
screenshots, pixel/state change, reverse scroll, pause/reduced stability, keyboard/touch, remount,
failed GLB/GPU failure. Record actual renderer/frame statistics; software rendering does not
certify hardware performance. Run reconstruction regressions/sealed packet checker. Independent
engineering service review if available, otherwise pending before integration.

## Checkpoint

Sequential execution. CP-T01 through CP-T07 are implemented and the local handoff is reconciled.
Browser 48/48 plus the subsequent stronger Bloom check 3/3, current portable/clean 19/19,
assets-only 16/16 without renderer peers, selected Blender/glTF/KTX 2/2, media/Chrome 1/1 and
reconstruction 46/46 pass without skips. Logic 11/11 preserves 481 sealed reference files.
Native MCP repairs and missing ImageMagick are verified. All submitted Qodo reviews were
collected; coverage remains incomplete and the final bounded metadata correction was functionally
verified without another independent review. Hosted CI/optional generation and physical-mobile/
cross-browser certification remain unverified. No commit/push/deployment. Details, dispositions
and evidence paths remain owned by IMPLEMENTATION_VERIFICATION.md.

## Immersive reference

Add /showcase.html to the maintained workbench, consuming a reusable SceneJourney exported by
creative-three. GSAP ScrollTrigger owns a mutable 0..1 progress ref; the renderer reads it in
useFrame and uses invalidate for demand rendering. No per-frame React state. Reuse the original
four-mesh GLB with instance material ownership, bounded shader points and an optional High bloom.
Three composition chapters assemble, separate and resolve the sculpture. DOM narrative and
keyboard/manual progress remain usable at rest and during GPU failure. CSS sticky positioning
keeps native scrolling. No additional engine, proprietary scene format or remote runtime asset.

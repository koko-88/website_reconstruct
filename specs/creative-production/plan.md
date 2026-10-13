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

Sequential execution. CP-T01 through CP-T05 and CP-09 are implemented. Complete delivery browser48/48, portable14/14, selected Blender/glTF/KTX2/2, media/browser1/1 and reconstruction46/46 pass without skips; logic11/11 preserves sealed bytes. Native MCP repairs and missing ImageMagick are verified. CP-T06 awaits final Qodo all-asset correction disposition and the final clean/pointer check. No commit/push/deployment. Details and evidence paths remain owned by IMPLEMENTATION_VERIFICATION.md.

## Immersive reference

Add /showcase.html to the maintained workbench, consuming a reusable SceneJourney exported by
creative-three. GSAP ScrollTrigger owns a mutable 0..1 progress ref; the renderer reads it in
useFrame and uses invalidate for demand rendering. No per-frame React state. Reuse the original
four-mesh GLB with instance material ownership, bounded shader points and an optional High bloom.
Three composition chapters assemble, separate and resolve the sculpture. DOM narrative and
keyboard/manual progress remain usable at rest and during GPU failure. CSS sticky positioning
keeps native scrolling. No additional engine, proprietary scene format or remote runtime asset.

## Skill hardening plan

Work directly in the current C: worktree, preserving all existing dirty work. Snapshot the old
canonical skill in ignored skills/creative-production-workspace/skill-snapshot. Analyze the exact
first-party video transcript and visible frames plus pinned source repositories. Extend the
canonical skill and existing routing, adding no renderer or provider account. Reuse installed
design/GSAP/Pixi skills and Playwright/Sharp. A capture-manifest review utility supplies contact
sheets and temporal triage without adopting Scroll Craft's coupled engine/device schema.

Use three paired fresh-context evaluations, serialized to preserve repository execution mode;
Skill Creator explicitly authorizes evaluation subagents. Use official aggregation/viewer in the
sibling workspace. Judge objective orchestration; subjective creative judgment stays human.
Description-trigger optimization is unselected. No separate website, commit or push.

Prior Qodo operation a6f1d31c-65ca-4563-a928-36481a754de3 was collected in K: artifacts and has
incomplete coverage with four asset-integrity findings. Reconcile their dispositions explicitly;
the old pending review prose does not establish completed certification.

Hardening checkpoint: canonical progressive references, composed routing/consumer discovery,
source/provider handoff and capture-manifest reviewer are implemented. Portable 32/32, actual
workbench sheet integration 1/1, isolated browser 48/48, native reconstruction 46/46 and sealed
packet 11/11 pass. First browser and sandbox reconstruction failures are retained; no root cause
is fabricated. Three serialized paired prompt evaluations cover objective orchestration only
(15/15 hardened, 6/15 old). Official review viewer exists; human feedback remains pending.
Original asset pipeline has six unresolved independent findings; final coverage details remain
in the central verification authority. Source is uncommitted/unpushed.

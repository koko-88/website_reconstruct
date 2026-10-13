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

## Skill hardening plan

The hardening branch used a C: worktree, preserving its existing dirty work. Snapshot the old
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
These hardening-branch asset findings are reconciled against the later main fixes during this merge;
current dispositions and fresh integrated checks belong to IMPLEMENTATION_VERIFICATION.md.
Historical paired planning results do not certify the merged runtime or subjective quality.

## Merge reconciliation, 2026-10-13

Merge main 84dd500 with hardening 945d53d in the existing K: checkout. Preserve main's later
asset/lifecycle/metadata fixes and stronger tests; integrate all hardening references/evals,
review utility, consumer-local discovery and routing. No new engine/dependencies/site or agents.
Verify build, the union portable suite, full browser suite, actual review captures, selected native
assets/media, reconstruction and sealed pointers. Collect requested Qodo review, disposition
against current source, then stage only reconciled merge files. Leave MERGE_HEAD intact and
HEAD unchanged for the user's manual commit/push. Results belong to the central verification owner.

Merge checkpoint: integrated build, portable 34/34, browser 48/48, native assets 2/2, media/Chrome
1/1, capture-review 1/1 and reconstruction 46/46 pass without skips. Historical hardening evidence
is preserved and final packet/pointers pass 11/11. Requested Qodo operation is collected with
partial coverage and two explicitly open hosted CI gaps; no runtime merge failure in tested
profiles. Current merge/index/parent state and evidence paths are owned by the central report.
Human subjective approval/untested profiles remain explicit. No commit or push.

## Factory hardening, 2026-10-13

Base main 7c4aacea; sequential execution, preserve user deletions and all worktrees.
CP-F01/F02: canonical AGENTS/constitution policy and native Cursor/Cline pointers; reuse registries,
source packages and research tools. Filter discovery by profiles with fail-closed arguments; no new
control plane or intelligence app. Remove obsolete inventories/debug log and five accidental index
gitlinks only. Preserve sealed reference, skill-hardening history and ProductShape recovery.
CP-F03: separate portable render/lifecycle/draw-budget checks from hardware FPS acceptance;
validate renderer and attach metrics. Retain thresholds/default hardware acceptance; CI selects
portable and reports hardware NOT_RUN. No additional GPU infrastructure.
CP-F04/F05: ignored Skill Creator outputs become local locators. Provision pinned Linux archives
in runner temp using SHA256 before extraction; reuse mise glTF CLI/native tests. Execute contact
sheets with Playwright's managed preview and software renderer.
CP-F06: contract regressions, clean-checkout links, full suites, workflow/shell validation and Qodo
review. Results stay in IMPLEMENTATION_VERIFICATION.md; hosted confirmation requires commit/push.
Cross-artifact analysis: traces CP-F01..06/CP-01/05/06/08/CP-H04; no HBC gate advancement,
evidence mutation, provider expansion or additional agents.

Factory checkpoint: CP-F01..05 implemented. Portable Node 37/37/build pass; browser 49 pass with
two duplicate-wrapper skips, actual review included; hardware4/4 with reduced FPS cases inapplicable;
native assets2/2/media1/1, all46 reconstruction cases across full+font runs and sealed packet11/11
pass. Checkout3/3, instruction/configuration validation and actual no-drift lock check pass.
Authorized Qodo auto review returned two supported issues, both repaired and covered by 38/38
portable checks and a child-failure transcript control. Independent coverage is partial; final fix
review/handoff remains CP-F06. Hosted modified commit, physical devices and subjective quality
remain NOT_RUN; no new governance artifacts, installation, commit or push.

Final factory checkpoint: CP-F01..06 complete for the authorized uncommitted handoff. Four supported
Qodo findings repaired, native checks 38/38 and positive/negative/default-run review controls pass;
final Qodo operation 4b8ac859 collects zero new findings with partial coverage and a retained ledger.
Default native run identity now survives worker config reloads. New WebLoved Shorts observations
and the supplied factory transcript are mapped in the existing creative source-map. Central report
owns exact results/dispositions and remaining hosted/physical/human acceptance; no certification
claim from partial service coverage or video branding. Main remains 7c4aacea, no commit/push.

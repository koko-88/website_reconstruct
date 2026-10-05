# Implementation Plan: Home Entry and Ready Hero Fidelity

**Feature**: `001-home-entry-fidelity` | **Date**: 2026-10-05 (Africa/Cairo) | **Spec**: [spec.md](spec.md)

**Setup result**: `FEATURE_SPEC=specs/001-home-entry-fidelity/spec.md`, `IMPL_PLAN=specs/001-home-entry-fidelity/plan.md`, `FEATURE_DIR=specs/001-home-entry-fidelity`, logical `BRANCH=001-home-entry-fidelity`. Actual Git checkout: `main`; setup reads `.specify/feature.json` and does not create a branch. No branch, commit, implementation, deployment or target acceptance was performed by this planning run.

**Planning base**: `cc473f2c4e32e7c8b5493a4fa3423e4a3a7ad02a`; specification SHA-256 `daaad35a1ca6a6969e8c08fa048874e0773c96c4d8aad8fc89070b384aee76e3`.

## Summary

Independently reconstruct the root loader and ready home/header as a production-quality, locally served fidelity experiment. Preserve the loader/hero overlap, type metrics, responsive crops, ambient layers, pointer/touch/reduced branches and keyboard relationships. The slice stops at the closed header and home boundary: it does not deliver the complete production website, downstream controls, commerce, adaptation or publication.

Select semantic static HTML, strict TypeScript and Vite after comparing vanilla, Astro, React, Next.js and SvelteKit. Use native CSS for entrances and ambient clocks, and small typed controllers for entry state, title measurement and pointer/scroll cancellation. No framework, router, smooth-scroll engine, animation library, backend or generic state infrastructure is needed for this slice. [Research](research.md) owns the decisions, alternatives and primary-source rationale; [data model](data-model.md) and [contracts](contracts/home-ui.md) define the observable interfaces.

## Technical Context

| Area | Decision |
| --- | --- |
| Language/runtime | Semantic HTML, authored CSS, strict TypeScript; Node **24.19.0** and npm **11.17.0**, observed locally. Exact supported dependency releases are resolved and locked at implementation bootstrap; no floating version is permitted in a validation receipt. |
| Build | Vite vanilla TypeScript multi-file application, static output. `tsc --noEmit` is required separately because Vite transpilation does not type-check. Use `strict`, `isolatedModules`, DOM libraries and bundler resolution. |
| Dependencies | Production: no client framework or animation/state dependency. Development: Vite, TypeScript, ESLint/typescript-eslint, Vitest, `@playwright/test`, `pixelmatch`, `pngjs`, `@axe-core/playwright`. Pin compatible exact versions and commit `package-lock.json`; record browser binary hash/version separately. |
| Storage/integrations | Local immutable fixture copies, JSON manifests and validation artifacts. No database, service worker, analytics, persistence, provider script, external API or runtime font/CDN request. |
| Tests | Vitest for clock/state/formula logic; Playwright for built-output contracts, temporal evidence, named ready captures, keyboard and targeted accessibility; existing canonical evidence supplies references, not target-generated golden images. |
| Target | Reference Windows 10/headless Chrome 154.0.8037.58/DPR1 profile, en-US/LTR/light/Africa-Cairo. D=1440x900 fine pointer; M/R=390x844 emulated touch with desktop UA; R reduced before navigation. Current installed browser/OS parity is not assumed. |
| Scope/scale | One root, loader + closed header + hero, three canonical cases, three fresh repetitions each, nine boundary widths and four height/tablet variants. Future sections remain separate slices. |
| Performance | Aim for refresh-rate animation with one coalesced frame callback and grouped reads/writes; animate independent transform/opacity layers and bound blur. Record frame/long-task traces in the canonical normal runs. No invented network SLA or universal 60fps acceptance threshold. The mandatory readiness deadline remains 10s. |
| Constraints | Independent authoring, no reference app/CSS/HTML copying, no overflow concealment of content defects, no source-controlled sealed-evidence writes, no fake deferred destinations; asset and calibration prerequisites below remain separate from design completion. |

### Phase 0 unknowns and disposition

Before selection, framework/build, motion ownership, state orchestration, title measurement, fixture availability, test/capture tooling, environment geometry and tolerance methodology were **NEEDS CLARIFICATION**. Research decisions R-01..R-09 resolve each technical choice. No material product clarification or unresolved technical choice remains. Exact dependency lock creation, missing-media supply and numerical calibration are explicit implementation preparation work, not invented observations or permission to pass without them.

## Constitution Check

Gate assessed before Phase 0 and again after Phase 1:

| Constitutional gate | Pre-research | Post-design and evidence |
| --- | --- | --- |
| I Canonical authority/progressive disclosure | PASS: constitution -> FC revision 3 -> home-specific packet/spec | PASS: all decisions reference owners; no new governance file or policy revision |
| II Integrity/uncertainty | PASS: existing evidence only; O/S/U/D separated | PASS: fixtures copied/read-only, reference hashes verified, missing bytes/deviations explicit; no recapture or historical receipt rewrite |
| III Fidelity | PASS: FR-001..018 preserved | PASS: state graph, distinct timing origins, native capability branch, content-driven height and role-specific type retained; no maximum-height shortcut |
| IV Verification | PASS: specification supplies named acceptance | PASS: contract matrix covers all FR/SC; separate temporal, geometry, raster and independent review gates; no target acceptance claimed |
| V Portability/reproducibility | PASS: planning can precede route qualification | PASS: exact lock/browser/fixture/spec/run receipts planned; execution decisions remain in RP/RR, not embedded model selection |
| Workflow | PASS: bounded specification exists | PASS: plan stops at Phase 1; task generation and cross-artifact analysis precede Critical implementation |

No unjustified constitutional violation exists. Scope, asset availability, route admission and target acceptance are different gates. RR-HBC-01 currently qualifies no Critical route; this does not block planning, and this plan does not qualify one. Critical implementation needs the applicable routing/reviewer/deadline/retry admission before assignment, or a separately admitted bounded qualification run. Refer to [RP-HBC-01](../../model-selection/routing-policy.md) and [RR-HBC-01](../../model-selection/runtime-route-registry.md); do not duplicate their rules in new project policy.

## Project Structure

### Design artifacts produced now

```text
specs/001-home-entry-fidelity/
  spec.md                         existing product specification, unchanged
  checklists/                     existing requirements checklist, unchanged
  plan.md                         architecture, phases and gates
  research.md                     decisions and alternatives
  data-model.md                   fixture, lifecycle and result types
  contracts/home-ui.md            observable home/entry interface
  contracts/fixtures.md           local dependency/provenance interface
  contracts/verification.md       acceptance matrix, calibration and receipts
  quickstart.md                   planned setup and validation commands
  design-validation.json          planning checks only
```

`tasks.md` belongs to the later speckit-tasks phase and is not generated here.

### Planned implementation layout (not present yet)

```text
package.json / package-lock.json / .node-version / .npmrc
index.html                        independently authored complete static home
vite.config.ts / tsconfig.json / eslint.config.mjs / playwright.config.ts
public/fixtures/home/             local-only selected visual fixtures
src/
  main.ts                         explicit initialize/dispose composition
  home/
    entry.ts                      lifecycle owner and deadlines
    capabilities.ts               motion/input/visibility listeners
    typography.ts                 measured title fit
    hero.ts                       fine-pointer hero scroll variables
    flashlight.ts                 tracked viewport light and cancellation
    ambient.ts                    fog activation/visibility pausing
    types.ts                      local state/snapshot interfaces
  styles/
    foundation.css                reset, fonts, tokens, focus, stable gutter
    header.css / hero.css / entry.css / effects.css
fixtures/home/manifest.json       provenance and hashes, not shipped evidence
scripts/
  verify-fixtures.mjs             allowlisted bytes and reference integrity
  validate-home-inputs.mjs        environment and calibration preflight
  compare-home.mjs                region comparator using maintained libraries
  prepare-home-run.mjs            immutable run manifest and invocation journal
  run-home-browser.mjs            thin Playwright invocation/output wrapper
  validate-home-results.mjs       completeness/zero-missing-results gate
tests/
  unit/entry.test.ts / typography.test.ts / hero.test.ts
  browser/entry.spec.ts / home-ready.spec.ts / home-responsive.spec.ts
  browser/home-motion.spec.ts / home-keyboard.spec.ts / fallback.spec.ts
  support/cases.ts / readiness.ts / recorder.ts / scroll-context.ts
  calibration/home.json           frozen numerical limits and sensitivity proof
  reference/home-manifest.json    pointers/hashes/region coordinates, not app source
artifacts/home/<run-id>/           ignored captures/traces/results; durable receipt exported
```

**Structure decision**: one application at repository root alongside the existing evidence/specification directories. Keep served fixture files separate from provenance/reference inventories and keep browser helpers out of the production bundle. Use feature-local controllers with explicit lifecycle methods; no shared services layer, event bus, component framework clone or monorepo. Later sections may add their own controllers/styles without changing entry ownership; template-based markup can be reconsidered when actual duplication warrants Astro or another established static approach.

## Implementation design

### Static document and entry safety

Author the required copy, heading/section association, header, links, closed hidden navigation target and loader status as ordinary HTML. Default content is readable and loader coverage inactive. A tiny independently authored pre-paint bootstrap in the head enables normal entry, records navigation/setup origins and installs the 7s missing-initialization failsafe. It uses guarded browser APIs; a bootstrap exception leaves the readable default. The main module takes ownership of the guard only after entry initialization is established. Do not defer this safety guard to the same module whose failure it protects against.

Reduced preference is resolved before activating normal loading. Fast dismissal releases content immediately and removes the loader at +50ms. Normal dismissal races page-load + font-settlement + navigation floor against the setup-relative ceiling. One idempotent transition wins; competing callbacks are canceled or ignored. Hero release and loader removal remain separate scheduled effects. Late module arrival after the failsafe adopts visible content and never replays entry. Loader removal and ready appearance remain independent milestones.

Initialize the entry owner and its ceiling before optional title/pointer/ambient enhancements; an enhancement exception cannot cancel the loading safety path. Retain the bootstrap guard until entry scheduling is successfully installed, and test partial initialization failure. Root-only entry establishes top scroll/restoration intent before measurement; do not use this slice to override deferred fragment navigation.

A full brand-root navigation/reload creates a new lifecycle. A within-document home return never creates one. No session storage or SPA router is introduced. Default menu remains closed and hidden; preserve `aria-controls`, roles and fragment strings without accepting deferred journeys or adding fake anchor sections. Preserve the reference lower seam only as an inert bounded comparison-context layer when visible in the HOME crop; do not implement marquee content/behavior or offscreen pages to alter the screenshot.

### Property ownership and state complexity

CSS owns loader/hero entrances and ambient keyframes. TypeScript changes lifecycle markers and computed motion variables; its controllers do not animate the same property on the same node. Use a stable title measurement/layout wrapper, a separate scroll wrapper and an inner entrance wrapper; use an outer media scroll wrapper with a separate image timeline layer. Fog drift and fog-parting likewise own parent/child layers. A layer inventory records stacking, masks, opacity and pointer-events before visual tuning.

Use a local discriminated state machine, not a generic library: normal `loading -> parting -> released -> removed`, fast `fast-dismiss -> removed`, fallback `failsafe-released`. Track cancellation generations and every pending callback. Capabilities are orthogonal state (width, pointer/hover, preference, visibility); layout never infers input from width. Controllers expose `initialize`, `refresh` where relevant and `dispose`; subscriptions/timers/observers are removed on disposal. Tests cover duplicate signals, disposal and initialization after fallback.

### Responsive/type geometry

Read final source declarations through packet locators as S evidence; independently author resulting layout. Apply inclusive <=760, <=1100 and >=1800 relationships with viewport-relative units and measured content area. Desktop min-height is `max(850px,100svh)`; narrow min-height `max(760px,100svh)`; permit content-driven growth and remove superseded maximums. CSS media queries use viewport width, not container/client width. Scene overscan is locally clipped; required text/controls are not clipped or concealed with document-level overflow hiding.

Desktop uses `scrollbar-gutter: stable`. HOME-D's viewport remains1440, header/hero flow1425 and 4.6vw gutters about66.24; the raw root clientWidth field1440 is not a substitute for measured flow width. Preflight all these values separately. Never hardcode an application width1425 or subtract15 from every viewport. Touch flow390 retains its recorded geometry.

Use the three available font inspection fixtures as local copies; body Arial remains an environment dependency. Canvas text measurement with explicit tracking plus DOM line-box checks determines proportional shrink-only title fit after fonts/load/resize. Recalculate from the natural CSS font size, avoiding cumulative shrinking. A ResizeObserver schedules a coalesced measurement only when necessary; write only changed fit values to avoid loops. Check Manticore ascenders/ink, city nowrap and star allocation, explicit two-line titles, body sentence wraps and focused controls across every recorded boundary. A font-settlement promise cannot certify correct rendered font identity.

### Motion/input

Retain declared entry easings/durations and independent fog/mark clocks from M-01..04/12; contracts enumerate timing and state assertions. Use CSS transforms/opacity on bounded layers. Ambient visibility activation uses IntersectionObserver where available; document hidden explicitly pauses CSS fog and cancels frame work. Unsupported observer capability retains the visible baseline rather than hiding content.

Fine-pointer normal light events coalesce to one requestAnimationFrame, clamp coordinates and cancel tracking on leave/blur/hidden/touch/capability changes. Fine-pointer hero scroll applies the declared photograph/title formulas with current measured hero height and restores top values at scroll zero. Touch/coarse/no-hover uses feature-detected native view timeline toward22svh across hero exit; unsupported capability selects the documented still photograph. No JavaScript scroll-timeline polyfill or inertia engine is introduced. Reduced/switching cleanup resets variables/transforms and stops prohibited loops; fresh reduced and switched tests are different cases.

### Fixture/assets and production boundary

Available: Manticore, display/Anton and Space Mono inspection bytes. Missing: hero original and960 variant, `fog.webp`, standalone `bz-logo.svg`. SVG arrows/star and noise are source-embedded code descriptions; independently author geometric icons/static grain, without transplanting paths or encoded source. Record their concrete files and visual consequences when implemented.

The preferred missing-media path is exact local originals supplied or collected under an explicit applicable allowance, stored outside sealed evidence with hashes and origin records. This plan does not fetch them or expand the contract to authorize publication. If originals cannot be supplied, record a concrete permitted replacement and measured consequence before acceptance; unresolved or materially incompatible replacement blocks the affected fidelity result. Do not crop a baseline screenshot into a hero texture or use a gradient as proof. Font/markup/state work can proceed independently, but every mandatory dependency must resolve before SC-007 or HOME appearance can pass. [Fixture contract](contracts/fixtures.md) owns the checkable selection and status fields.

### Bounded scroll verification context

A standalone viewport-height hero has insufficient document travel for its full scroll/exit branches. After the untouched canonical ready capture, the browser test may append a neutral, inert, aria-hidden continuation with no fragment IDs, copy or controls and height at least twice the greater of measured hero height and viewport height. This target-only test context supplies native scroll range without implementing later sections. Record its dimensions and insertion/removal times; assert actual scrollY and supported timeline progress, never drive transforms directly. Label motion samples as modified verification context and exclude them from canonical layout/raster proof. Return to scroll zero, remove the continuation, and recheck the unmodified top composition with no entry replay. This demonstrates the home controller/timeline under supplied scroll range, not an assembled later-section journey. The harness lives only in tests and is absent from built application output.

## Testing and verification architecture

Use complementary levels, not duplicative tests:

1. Pure-clock unit tests exercise the lifecycle race, distinct time origins, exact offsets, cancellation, fallback adoption and formula boundaries. Fake timers are valid here, not a substitute for real browser chronology.
2. Built-output browser tests assert semantic state, readiness descendants and generated styles, font success/media decode, actual layer geometry, input cancellation, reduced/no-script paths and keyboard order. Observe real clocks with bounded polling; do not fast-forward animations or use network-idle as readiness.
3. Canonical raw viewport captures and phase/timestamp records retain live motion. Region raster/geometry/type/crop comparison uses immutable canonical inputs and separately calibrated numerical limits. A screenshot proves its named phase only.
4. Accessibility checks cover all specification semantics/focus and targeted automated violations. Record any correction with evidence/reason/consequence/assertion; automation does not establish uninspected assistive-technology parity.
5. Independent eligible review inspects source independence, evidence precedence, missing states, capture integrity and deviations after machine/browser checks. Route selection remains an execution-policy concern.

Serial canonical capture workers and zero automatic acceptance retries preserve each of the nine fresh results. One explicit acceptance-run ID links portable, canonical and variant invocations through an append-only session manifest; each invocation owns a unique output directory so Playwright cleanup cannot erase previous results. Diagnostic reruns receive new invocation IDs linked to the original failure. The aggregate validator reads the selected run manifest and refuses missing or overwritten attempts. Portable Chromium can run deterministic smoke/contract tests; fidelity comparisons require the recorded reference profile or an explicit calibrated environment deviation. Firefox/WebKit are optional future diagnostics, not proof of reference parity.

The complete requirement-to-check matrix, capture procedure, result fields and calibration gate are in [verification contract](contracts/verification.md). Read [quickstart](quickstart.md) for future commands. The scripts/configuration above are planned deliverables, not existing runnable application tests.

## Browser acceptance and tolerance calibration

Preflight browser executable/version/hash, OS, actual body font, viewport/flow/gutter, DPR, scale, input, preference, locale/timezone, fixture hashes and canonical SHA values. Three independent contexts per HOME-D/M/R case must pass readiness within10s from navigation, including loader absent, decoded visual dependencies and correct descendant opacity/filter/displacement. Gather three consecutive geometry samples within0.5 CSS px at100ms intervals; this is a convergence rule, not geometric fidelity tolerance. Required finite entrance animation remains disqualifying even when its parent rectangle is stable.

Capture normal loading, parting/overlap and ready, or reduced fast entry and ready, with navigation/setup/dismissal-relative timestamps. Sample semantic phases rather than guessing one universal E-060 screenshot timestamp. Compare the five specified named regions. Preserve raw animations with `page.screenshot({ animations: 'allow' })`; do not use Playwright screenshot defaults to establish motion completion. Retain unmasked PNGs, DOM/style samples, diffs/overlays and traces.

Numerical raster/geometry/timing limits must be locked in `tests/calibration/home.json` before evaluating target fidelity. Planning does not invent a pixel threshold. Calibrate from reference metrics and environment/capture characterization, account for the limited one-PNG-per-state reference corpus, and validate limits against deliberate type/crop/position/timing perturbations. Target repeatability can characterize test noise but never redefine what reference fidelity means. Uncalibrated or overly broad limits yield BLOCKED_ACCEPTANCE. Required copy, line count, clip/overlap, state ordering, input prohibitions, provenance and reference integrity have zero unexplained deviations independent of aggregate image error.

Masks name only supported uncontrollable ambient regions and cannot cover required type, crop landmarks or controls. Fog overlaps meaningful imagery, so retain an unmasked composition/crop review and separate ambient range/character assessment even where narrow diagnostic masks are justified. Threshold changes require evidence-backed recalibration, versioned rationale and rerun of affected results; do not relax limits because the target failed.

## Delivery order and failure gates

| Stage | Concrete outcome / gate |
| --- | --- |
| Preparation | Generate tasks from this plan; analyze spec/plan/tasks consistency; admit execution route; pin toolchain/lock/browser and fixture manifest; preserve reference hashes. Resolve media and establish calibration before fidelity verdicts. |
| Static home | Complete semantic HTML, no-script baseline, typography/crop/header/height/layers; ready-state assertions at D/M/R and responsive edges. |
| Entry | Bootstrap guard, idempotent lifecycle and overlapping entrances; exact clock tests plus normal/delayed/reduced/failsafe browser phases. |
| Home motion | Independent fog/mark/light/scroll/touch behavior; cancellation, reverse-to-top and capability fallback checks. |
| Acceptance | All FR/SC checks, nine retained fresh canonical runs, responsive/input/keyboard/fallback scenarios, calibrated region comparisons, independent review and complete receipt. |

These are dependency stages, not executable tasks or completed results. Any material new behavior ambiguity returns to the specification owner. A baseline mismatch returns to the affected layout/motion decision; no feature deletion or threshold inflation. Missing fixture/calibration/environment admission produces an explicit blocked acceptance result rather than a product clarification invented by the planner.

## Complexity Tracking

No constitutional exception or speculative infrastructure is requested. The few local controllers are justified by distinct lifecycle/property owners and meaningful clock/cancellation tests. React hydration/prerender infrastructure, a timeline engine, global event bus, server, router, polyfill and custom capture platform are rejected for this bounded requirement. Established tools handle build, unit/browser execution and pixel comparison.

## Planning completion record

Phase 0 research and Phase 1 design are complete; execution/acceptance remain pending. Extension configuration `.specify/extensions.yml` was absent before and after planning, so there were no before/after hooks to dispatch. Setup returned the logical feature identifier without changing actual branch `main`. Artifacts: this plan, research, data-model, three interface contracts, quickstart and the planning-only validation receipt. The spec, constitution, policy owners, frozen evidence and historical preparation receipt remain unchanged.

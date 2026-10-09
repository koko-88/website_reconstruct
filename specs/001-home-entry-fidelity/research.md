# Phase 0 Research: Home Entry and Ready Hero

Original research: 2026-10-05 (Africa/Cairo). Scope: [spec.md](spec.md), FR-001..018. This is planning research, not new reference inspection or target acceptance. At that planning base, the root contained evidence/specification/tooling and no frontend app or production package manifest. A historical package under `skill-hardening/` was not adopted. Read-only assignments covered stack, motion/assets and browser verification; only the primary planner wrote artifacts. The 2026-10-06 capability replan is recorded in R-10..R-13 below; provisional root npm state now exists but is not an application architecture.

## Authority and inspected inputs

[Constitution](../../.specify/memory/constitution.md) -> [PRODUCT.md / FC-TARGET-DESIGN-01 revision 4](../../PRODUCT.md) -> [IP-HBC-01](../../implementation-scope/pre-build-packet/README.md) -> [active spec](spec.md). The [index](../../implementation-scope/pre-build-packet/evidence-index.md) resolves E2-013/E2-014, E-030/040/041/055/060/062/080 and the home source-declaration spans. Inspected named D/M/R HOME PNGs and home-specific JSON/source records; no live reference browser execution, new capture or source reuse. Packet final-rule reconciliation applies: FR-007 overrides obsolete maximum-height shorthand. Model execution admission remains external to this technical selection.

## R-01 Build and rendering stack

**Decision:** semantic static HTML + strict TypeScript + Vite. **Rationale:** complete content before scripts, precise entry ownership, no hydration clock, direct CSS/layout control, small independently testable state modules. This architecture supports the actual motion-rich single-root workload; production quality comes from semantics, ownership, reproducibility and acceptance rather than framework selection. No backend, multi-page app, CMS or shared application state is required now.

| Viable approach | Fidelity/motion/state | Responsive/accessibility/fallback | Verification/reproducibility | Maintenance/expansion and disposition |
| --- | --- | --- | --- | --- |
| Static HTML + TS/Vite | Direct DOM/layer ownership, bounded state/controller | Native markup works without JS; CSS controls inclusive widths | Static built output and small dependencies | Selected; explicit modules prevent a monolithic script. Later repeated content may justify templates |
| Astro static + TS | Equivalent DOM/native motion, build-time components | Static output, no required client runtime | Extra compiler/checker, mature static pipeline | Strongest alternative; reconsider when real repeated markup or content authoring needs component templates |
| React + Vite | Mature declarative state; keep per-frame values outside render state | Typical client-only mount fails no-script; static rendering/hydration must be added | Hydration/Strict Mode cleanup adds another lifecycle | Defer until interactive shared data/state justifies runtime; reject custom prerender infrastructure just for this slice |
| Next.js static export | React plus established prerender | No-script HTML possible; client API/hydration discipline needed | Export restrictions and server/image/cache conventions | Not selected; server/routing needs are absent |
| SvelteKit static | Strong components/reactivity; native motion still needed | Prerender with SSR retained satisfies static baseline | Established adapter but added route/compiler surface | Viable; no existing team/stack constraint makes it win now |

**Alternatives considered:** all above can render the design. None automatically solves font identity, exact crop, entry phases or input capability changes. Choose the smallest mature tooling that meets these rather than assuming a familiar framework.

Vite uses HTML as the build entry and produces static assets; its current guide requires Node20.19+ or22.12+. Vite's TypeScript pipeline requires a separate type-check. [Vite guide](https://vite.dev/guide/), [build](https://vite.dev/guide/build.html), [TypeScript](https://vite.dev/guide/features.html#typescript).

Astro provides static components and optional client islands. [Astro islands](https://docs.astro.build/en/concepts/islands/). React hydration requires matching server/client markup and development Strict Mode helps expose missing effect cleanup. [React hydration](https://react.dev/reference/react-dom/client/hydrateRoot), [Strict Mode](https://react.dev/reference/react/StrictMode). Next and SvelteKit support static prerender/export under their documented restrictions. [Next export](https://nextjs.org/docs/app/guides/static-exports), [Svelte static adapter](https://svelte.dev/docs/kit/adapter-static).

## R-02 Motion, state and property ownership

Re-evaluated with the available shelf in R-10: retain this decision. GSAP is a currently available, explicitly evaluated alternative; the original future-option wording is not an availability assumption or dependency selection.

**Decision:** CSS entrances/ambient clocks + typed entry state machine + event-driven rAF. **Rationale:** the small home state graph and declared easing/timing relations are directly expressible; explicit nested wrappers prevent entrance/scroll/parting transforms from overwriting each other. No global event bus or motion abstraction framework.

**Alternatives considered:** WAAPI is useful for future interruption/current-frame reversal; GSAP is a mature timeline/capability-cleanup alternative; Motion supports browser playback/sequences; XState is useful for genuinely coupled parallel state. None removes a scoped native limitation here. Do not add ScrollTrigger/inertia, springs, Canvas or WebGL: the home contract is DOM/texture/type, and adding a renderer increases accessibility/measurement burden.

GSAP supplies media-query cleanup, Motion supplies sequence playback, and WAAPI cancellation requires guarding rejected completion promises. These remain future options, not dependencies. [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia%28%29/), [Motion animate](https://motion.dev/docs/animate), [WAAPI cancel](https://developer.mozilla.org/en-US/docs/Web/API/Animation/cancel), [XState](https://stately.ai/docs).

Coalesce pointer/scroll reads and writes, use timestamps, explicitly cancel on capability/visibility changes and pause CSS fog separately. Restrict expensive blur to the required bounded layers; profile rather than flattening effects. [rAF](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame), [visibility](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event), [animation performance](https://web.dev/articles/animations-guide).

## R-03 Progressive entry and readiness

**Decision:** readable HTML/default-hidden loader; independent pre-paint marker/failsafe bootstrap; normal module owns the idempotent lifecycle only after initialization succeeds. **Rationale:** FR-016 survives missing module delivery without needing the failed module to recover. Normal floor/navigation, ceiling/setup and release/removal/dismiss clocks remain distinct. Reduced preference is checked before normal choreography. Late initialization adopts the visible state.

**Alternatives considered:** SPA mount fails no-script; bootstrap in the main module fails the missing-initialization path; an all-images/network-idle gate changes the lifecycle; a fixed timeout cannot certify decoded imagery or revealed descendants. Loader-complete and fidelity-ready remain separate objects.

Font settlement does not prove the intended faces succeeded; decode success/positive natural dimensions/currentSrc are stronger than image `complete`. Verify manifest hash and rendered metrics too. [FontFaceSet ready](https://developer.mozilla.org/en-US/docs/Web/API/FontFaceSet/ready), [image decode](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decode).

## R-04 Responsive/input/title geometry

**Decision:** authored final-rule CSS with independent capability state, static touch fallback, measured shrink-only title fitting. **Rationale:** width controls layout while pointer/hover controls light/scroll effects. Fit starts from natural role-specific CSS metrics after font/load/resize, never cumulatively shrinks or scales glyphs horizontally.

**Alternatives considered:** device-name breakpoints, width-only motion branch, universal hero max-height, overflow hiding and replacing type with a generic scale all violate fidelity. A touch-timeline polyfill is unnecessary because the still photograph is explicitly allowed.

Feature-detect the precise timeline/range features; animation shorthand resets timeline properties, so declare the timeline after it. Support is not universal. Capability listeners must clear old tracking/transforms. [animation-timeline](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline), [CSS.supports](https://developer.mozilla.org/en-US/docs/Web/API/CSS/supports_static), [media-query change](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList/change_event), [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver), [measureText](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/measureText).

**Evidence reconciliation:** `styles.css:622` declares stable scrollbar gutter (S); E2-014/header/hero and HOME-D rectangles show1425 flow with1440 viewport (O). `4.6vw` therefore gives66.24 gutters; title width is1425 minus twice66.234375. Root clientWidth1440 in a sidecar does not negate that flow width. Preserve native stable gutter, not a hardcoded1425 page width. [CSS Overflow specification](https://drafts.csswg.org/css-overflow-3/#scrollbar-gutter-property).

## R-05 Browser/verification tooling

**Decision:** Playwright Test on built static output, Vitest for pure state/clock/formula checks, pixelmatch/pngjs for explicit canonical-buffer comparison, targeted axe plus keyboard/visual review. **Rationale:** mature isolated contexts, media/input emulation, resource fault injection, traces and captures without custom browser infrastructure. Serial canonical runs keep every attempt.

**Alternatives considered:** WebDriver can work but needs extra orchestration; direct CDP is a diagnostic supplement; manual-only review lacks repeatability; Linux Docker visual snapshots do not reproduce Windows font/rendering conditions. Bundled Chromium is useful for functional tests but not silently equivalent to the reference browser. Browser version is not reproduced by spoofing UA. [Browsers](https://playwright.dev/docs/browsers), [emulation](https://playwright.dev/docs/emulation), [isolation](https://playwright.dev/docs/browser-contexts), [accessibility](https://playwright.dev/docs/accessibility-testing).

## R-06 Passive temporal capture and calibration

**Decision:** real-time state/style sampling and raw `page.screenshot` with animations allowed; immutable canonical PNG comparison after independent readiness; versioned numerical calibration before target judgments. **Rationale:** default screenshot assertions can fast-forward finite animations/restart infinite ones and manufacture completion. Fake clocks test timers, not compositor choreography. Keep navigation and capture-start/end timestamps. [Screenshot assertion behavior](https://playwright.dev/docs/api/class-pageassertions#page-assertions-to-have-screenshot-1), [capture API](https://playwright.dev/docs/api/class-page#page-screenshot), [clock](https://playwright.dev/docs/clock).

**Alternatives considered:** update-snapshot baselines, one aggregate diff number, blanket fog masking, geometry-only readiness and arbitrary sleep are rejected. One canonical PNG per D/M/R is not a measured same-state variance sample. Target repeatability only estimates runner noise. Calibrate metric precision/raster sensitivity and independent scheduling overhead; require controlled perturbation tests to detect wrong type/crop/position/timing. Keep unchanged raw references and unmasked captures, and retain bounded uncertainty if the environment cannot be qualified. [Visual comparison environment limits](https://playwright.dev/docs/test-snapshots).

## R-07 Fixture availability and authoring independence

**Decision:** local copies of the three present font fixtures; manifest-gated missing photography/fog/brand; independently drawn simple icons and static noise. [Fixture contract](contracts/fixtures.md) lists concrete bytes and gaps. **Rationale:** phase clearance permits already-present local fixtures, but does not conjure missing media or authorize reference source copying. Exact original supply is preferred for fidelity; a replacement must be a selected file with measured consequences before acceptance.

**Alternatives considered:** hotlinking live assets, screenshot-derived scenery, generic gradient substitution, copying SVG/CSS encoded source and pretending filename declarations are bytes are rejected. No off-scope spirit/video/photo asset collection is planned. New acquisition is separate from historical evidence and needs an applicable allowance; public release/real adaptation still use FC TR/TA gates.

## R-08 Reproducible toolchain and expansion

Replanned package scope: exact selected direct names and the independent `app/` package/lock are in R-12. Root provisional npm state is preserved and cannot satisfy application bootstrap. Node/npm versions were rechecked; compatible release pins remain implementation bootstrap work, not unspecified product behavior.

**Decision:** observed Node24.19.0/npm11.17.0; lock exact compatible dependency versions at implementation bootstrap; subsequent runs use `npm ci`. Record package/lock/browser/spec/fixture hashes. **Rationale:** a declared package version alone is not browser/OS/font reproducibility. [Node releases](https://nodejs.org/en/about/previous-releases), [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci/).

**Alternatives considered:** floating latest installers, unrestricted snapshot updates, introducing a service worker/CDN/API or copying existing inspection scripts as application code. Future frameworks/WAAPI/GSAP can be reconsidered for actual repeated markup or interrupted stateful sections; no new backend or routing requirement is invented now.

## R-09 Gates and completion

**Decision:** planning completes with implementation inputs explicit; machine/browser acceptance, calibration, asset-resolution and execution admission remain pending. **Rationale:** the active specification already treats those as preparation dependencies and defers control journeys, adaptation and publication. No unresolved product choice warrants blocking design.

**Alternatives considered:** requiring public asset licenses before this allowed local run, qualifying an execution route from research, treating the old commerce gate as current scope, or proclaiming a complete production website from home alone. All conflict with canonical ownership. [Plan](plan.md) records pre/post constitutional checks; [verification contract](contracts/verification.md) defines concrete fail/blocked outcomes.

## R-10 Capability replanning audit

Date: 2026-10-06 (Africa/Cairo). Base: checked-out `main` HEAD `48eafc8eb78964a6d23bacb5192fa3e333688cfc`; spec hash unchanged. **Verdict: TARGETED_REPLAN_REQUIRED.** Existing R-01..R-09 remain correct except the root-package layout, incomplete direct dev inventory and insufficiently explicit staged/build fixture integrity. The richer shelf does not create a new product requirement. No plan restart, application implementation, task generation, root package mutation or new reference capture occurred.

**Inputs:** authority path and active design artifacts; the [current capability audit](../../IMPLEMENTATION_VERIFICATION.md#capability-and-redundancy-audit) (the former CEC shelf/verifiers were deleted; their earlier availability observations remain historical); sealed [non-DOM report](../../reference/haunted-boulder-city-v2/rev-2.0.0-real-01/non-dom-rendering.md); relevant WP/RP/RR ownership. One read-only motion research assignment challenged engine selection using primary documentation; its findings are planning support, not route qualification or Critical implementation review.

The workstation probe resolved GSAP/Pixi skill files, glTF Transform 4.5.1, gltfpack 1.3, FFmpeg 7.1.1, KTX 4.4.2, Blender 5.2.2 LTS and RenderDoc CLI 1.46. RenderDoc GUI file presence is not a tested GUI workflow. Spector build/config and all seven Babylon configurations were detected, not live authoring workflows. Blender MCP was configured with bridge unreachable; GIMP was unresolved by the verifier's command/path search; WebGPU Inspector remains an optional manual check. These results characterize this host/session only. Do not infer uninstall/absence from a failed path search or install/repair an unselected capability. The verifier's version probes may accept nonempty output even with nonzero exit, so AVAILABLE is limited to resolution/probe evidence, not end-to-end qualification. Root npm state was reported TEMP_BUNDLE_UNTRACKED; Git independently confirmed both manifests untracked. No root install/prune/repair was run.

| Existing decision | Evidence/requirement | Available alternatives | Keep/change | Reasoning |
| --- | --- | --- | --- | --- |
| Static HTML + strict TS + Vite | FR-005..008/013..016, R-01 | Astro, React, Next, SvelteKit | Keep | Native semantics/readable fallback and direct measured DOM layers meet the bounded single-root slice |
| CSS entry and independent ambient clocks | FR-002..004/010/012; M-01..04/12 | GSAP, WAAPI, Theatre | Keep; update availability rationale | Fixed sequence and one dismissal; no accepted interactive replay/seek/reversal requires an engine |
| Typed state and distinct deadline origins | FR-003/016 | Engine callbacks, XState | Keep | Readiness races/bootstrap safety remain application logic under every engine |
| Nested ownership and rAF formulas | FR-006/009/010 | GSAP quickSetter/ScrollTrigger, renderer ticker | Keep | Direct sampled values have no required smoothing; cleanup/property isolation remain necessary |
| Native touch timeline/still fallback | FR-011 | ScrollTrigger, Lenis, polyfill | Keep | Fallback is explicitly accepted, so broader animation support is not needed |
| DOM/textured fog/photo/light rendering | FR-008..012; bounded non-DOM report | Pixi, Three, Babylon, Blender renders | Keep | No unexplained GPU/particle/3D surface; alternate renderer adds measurement/semantic burden |
| Root application package | Provisional local root bundle; Constitution V | app package, npm workspace, root conversion | Change to independent app/ | Preserve root state and prove accepted dependencies without parent installation |
| Dev dependency inventory | strict TS and mature validation | broad bundle, bespoke runner | Clarify direct names | Include Node configuration types and ESLint base package; avoid inferred creative dependencies |
| Fixture source -> stage -> build | FR-008/018; SC-007 | static public stage, imported assets | Keep stages; strengthen | Vite public passthrough requires exact file-set/hash checks, including stale/unlisted output |
| Responsive/title-fit geometry | FR-006/007/011 | hardcoded dimensions, GPU text, container-only breakpoints | Keep | Current final-rule/min-height/gutter/input distinctions remain sound |
| Passive temporal/canonical acceptance | FR-017/018; SC-001..008 | GSDevTools seeking, GPU capture, snapshots | Keep | Diagnostic authoring controls cannot prove real chronological acceptance |
| Media/calibration/environment/route gates | R-07/R-09; FC/RP/RR | fabricate fixtures, relax thresholds, assume tool availability | Keep; classify | They are dependent implementation/acceptance/execution gates, not replanning blockers |

GSAP's labels/position parameters help coordinated overlap editing; playback controls help interactive reversal/seek/replay; matchMedia/context can revert collected animation branches. Those are concrete benefits when needed. Here the typed owner still must implement load/font races, independent guard, external timers/listeners and CSS visibility state. Native CSS provides negative phases and paused/resumed clocks; one-shot removal does not need an authored timeline. Debug CSS with browser animation/style samples and traces. Do not select GSAP merely to obtain a scrubber. [GSAP Timeline](https://gsap.com/docs/v3/GSAP/Timeline/), [matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/), [context](https://gsap.com/docs/v3/GSAP/gsap.context()/), [CSS Animations](https://www.w3.org/TR/css-animations-1/).

If a reproduced timing/property/lifecycle defect cannot be corrected cleanly within the bounded design, reconsider GSAP against that defect with measured before/after evidence. Preserve the state controller and distinct monotonic origins; default ticker lag smoothing adjusts engine time after stalls and affects delayedCalls. If curves are ported, CustomEase can represent the declared cubic-bezier rather than replacing it with a generic ease. No engine can make missing media or calibration disappear. CSS cancellation need not emit animationend; cleanup is explicit. WAAPI cancellation also requires guarding rejected finished promises. [GSAP ticker](https://gsap.com/docs/v3/GSAP/gsap.ticker/), [CustomEase](https://gsap.com/docs/v3/Eases/CustomEase/), [Web Animations cancellation](https://www.w3.org/TR/web-animations-1/#cancel-an-animation).

## R-11 Simplest sufficient mechanism per observable requirement

This mapping chooses mechanisms; the existing verification contract retains every FR/SC acceptance obligation and detailed check ID.

| Requirement | Selected sufficient path | Capability decision |
| --- | --- | --- |
| FR-001 fresh entry | native root document/top reset; feature-local init/dispose | no router/storage |
| FR-002 loader composition | semantic status + decorative DOM, textures, CSS clocks | no canvas/particles |
| FR-003 bounded lifecycle | idempotent typed state + navigation/setup/dismiss-relative timers | no timeline clock substitution |
| FR-004 reveal | nested CSS condensation/exit/parting/held hero entrances | GSAP evaluated/unselected |
| FR-005 hierarchy | static authored header/home markup and fixture strings | no component runtime |
| FR-006 typography | local faces/system Arial, detached measureText + DOM line-box checks | canvas measurement only; no GPU text |
| FR-007 geometry | final-rule CSS, svh minima, stable gutter, content growth | no fixed app width or hidden defects |
| FR-008 photo/layers | selected exact image variants, cover/focal CSS, scrims/texture/SVG/static grain | optional external replacement authoring only after concrete selection |
| FR-009 light | radial CSS layer + clamped coalesced pointer variables and cancellation | no shader/renderer |
| FR-010 home motion | independent CSS fog/mark clocks + direct hero rAF formulas and native hidden pause | no engine ticker or inertia |
| FR-011 responsive/touch | inclusive viewport CSS, orthogonal input queries, precise native timeline detection/still fallback | no scroll polyfill/Lenis |
| FR-012 reduced | early preference resolution, static CSS branch, cancel timers/frame work; distinct fresh/switch records | no second motion system |
| FR-013 semantics | native roles/names/status/aria-hidden decorative layers | no canvas semantic mirror |
| FR-014 keyboard | native links/button/tab order and authored visible focus | downstream journeys still deferred |
| FR-015 deviations | explicit reason/consequence/assertion record + focused review/axe | no unsupported AT equivalence |
| FR-016 fallback | readable static HTML + independent tiny pre-paint 7s guard | no failed-module-dependent recovery |
| FR-017 temporal proof | isolated built-output Playwright, passive chronology, appearance and convergence samples | authoring seek excluded from acceptance |
| FR-018 integrity | immutable references; package/fixture preflight; calibrated comparator and receipts | diagnostics supplement independent acceptance |

## R-12 Capability selection and exact dependency boundary

| Capability | Relevant to slice? | Role if selected | Runtime/dev/workstation | Reason/disposition |
| --- | --- | --- | --- | --- |
| GSAP skills | Yes, alternative evaluation | planning/coding knowledge | workstation | consulted knowledge does not add runtime |
| GSAP/CustomEase | evaluated, unselected | DOM sequence/curve control | runtime candidate | no material present advantage over fixed CSS choreography |
| GSDevTools/MotionPathHelper | unselected | animation authoring/debug UI | dev candidate | no selected GSAP/motion path; never shipped |
| Theatre Core/Studio | no | visual keyframe authoring | runtime/dev candidates | no hand-authored scene timeline requirement |
| PixiJS + skills | no renderer need | GPU 2D/particles and knowledge | runtime/workstation candidates | textured DOM layers explain scoped effects |
| Three.js | no | custom GPU/3D renderer | runtime candidate | no evidence-backed 3D surface |
| Babylon core/loaders/inspector | no | scene engine/loading/debug | runtime/dev candidates | no scene/GLB; inspector excluded |
| seven Babylon MCPs | no | material/geometry/render/particle/GUI/flow/filter graph authoring | workstation | no selected graph workflow; configured does not mean exercised |
| Spector.js MCP | no selected use | WebGL frame/shader/state inspection | workstation | no selected WebGL surface; bounded internals remain unknown |
| Blender + MCP | no selected use | model/material/render/bake | workstation | generated scenery cannot prove missing photo/brand equivalence |
| glTF Transform/gltfpack | no | inspect/optimize mesh assets | workstation | no glTF input |
| KTX-Software | no | GPU texture compression | workstation | DOM image fixtures need no KTX pipeline |
| GIMP | conditional, unselected | concrete permitted texture/replacement editing | workstation | verify resolution if needed; not a required build step |
| FFmpeg | optional diagnostics, unselected | frame extraction from retained target recordings | workstation | no home video/transcode requirement; recordings/frames do not replace raw ready PNGs |
| RenderDoc | no selected use | low-level frame diagnostics | workstation | DOM/paint/performance tools fit current surface |
| WebGPU Inspector | no | WebGPU diagnostics | optional workstation | availability and GPU rendering not assumed |
| Lenis | no | smooth/synchronized scroll | runtime candidate | native scroll contract, no inertia requirement |
| Browser/evidence tooling | yes | DOM/AX/style/layer/performance diagnostic review | workstation | use relevant existing surface; no new reference execution |
| Playwright/Vitest/pixelmatch/pngjs/axe | yes | repeatable browser/unit/comparison/accessibility checks | dev | selected established validation tools |

**Application runtime:** exactly `dependencies: {}`; standard DOM/CSS/SVG APIs and independently authored TypeScript compile into the local bundle. Static image/font fixtures are assets, not npm runtime dependencies.

**Direct development dependencies:** exactly `vite`, `typescript`, `@types/node`, `eslint`, `@eslint/js`, `typescript-eslint`, `vitest`, `@playwright/test`, `pixelmatch`, `pngjs`, `@axe-core/playwright`. `@eslint/js` supplies the selected base JS recommended rules; typescript-eslint supplies TS integration; explicit browser/Node globals need no globals package. `.mjs` image scripts avoid unnecessary type packages. Transitive dependencies are locked by npm, not individually promoted to direct application declarations. Pin compatible exact released versions together during implementation bootstrap and record the lock hash; this pass selects exact package identities, does not fabricate a tested version matrix or reuse the root provisional lock. Node24.19.0/npm11.17.0 were locally rechecked.

**Reusable/global capabilities:** skills, native CLIs/desktop tools, MCP integrations and browser diagnostics remain external, verified before actual reliance. No workstation native binary/wrapper or MCP server is an app package dependency. Any externally authored replacement is stored as a concrete local fixture with recipe/output provenance so the build does not require its author's workstation.

**Explicitly excluded direct packages for this slice:** `gsap`, `three`, `pixi.js`, `lenis`, `@theatre/core`, `@theatre/studio`, `@babylonjs/core`, `@babylonjs/loaders`, `@babylonjs/inspector`; also React/Next/Astro/SvelteKit, Motion, XState, scroll polyfills, native-tool npm wrappers, GUI/engine inspectors and provider widgets. Availability is not a selection. Later scope/defect-driven reconsideration requires a bounded plan/lock/coverage update.

**Package location correction:** use one independent `app/` package rather than converting the provisional root bundle or configuring workspaces. Preserve root package/lock/node_modules without delete/reinstall/prune/commit. Application-local commands and resolution checks must fail on missing declared dependencies; no parent fallback or root creative import. A clean-checkout run proves self-containment. The package layout changes no root URL, visible document or deployment scope. [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci/) explains why ci must be scoped to the accepted application lock rather than the preserved root installation.

**Fixture pipeline correction:** retain repository-root source -> application public staging -> application static build. Use exact selected file-set/hash verification across stages and automatic build preflight. Vite serves/copies public files as-is; Git ignores are not a build allowlist. Reject stale/unlisted files, escaping links and accidental source/metadata/test/inspector output. Original bytes are not automatically optimized by an available tool. [Vite root/publicDir](https://vite.dev/config/shared-options.html#publicdir). Implement these checks in existing planned fixture/preflight/build helpers; do not create a separate asset service, plugin platform or capability launcher.

## R-13 Remaining gates, stale complexity and future reusable information

| Dependency/question | Replanning/tasks blocker? | Later gate |
| --- | --- | --- |
| Town original/960 variant, fog, logo missing | No; selection path is defined and ordered preparation work can be generated | affected visual implementation and SC-007/appearance acceptance need supplied allowed originals or concrete compatible replacements |
| Exact compatible direct releases/lock absent | No; direct set and package boundary decided | implementation bootstrap/preflight and reproducible acceptance |
| Numeric geometry/raster/timing calibration pending | No; methodology/zero-deviation rules remain | BLOCKED_ACCEPTANCE until reviewed locked limits/sensitivity proof |
| Reference browser/OS/system Arial qualification pending | No | canonical comparisons need exact profile or explicit qualified/calibrated deviation; portable contracts remain separate |
| No qualified Critical route/reviewer | No, owned by RP/RR | execution admission before Critical assignment; this audit qualifies no route |
| Optional GIMP resolution/live creative MCP workflow unverified | No | blocks only a future dependent selected capability; no repair/install required now |
| Real content/CTA mapping and public reuse | No; excluded/deferred | FC adaptation/release gates |
| Newly discovered material behavior ambiguity | None identified | return to owning spec/evidence authority before dependent implementation |

No unresolved decision must be answered before generating tasks. Tasks must retain these preparation/acceptance gates and then undergo cross-artifact analysis. Readiness is not implementation or fidelity PASS.

Unnecessary complexity remains rejected: no render-engine abstraction, custom motion platform, package monorepo, asset service, global event bus, generic state library, speculative scene production or expanded browser/device certification. Existing typed controllers, test-only scroll continuation and per-invocation evidence wrapper remain justified by distinct property/lifecycle owners and retained attempts. Clarify reduced interruption with cancellation generations rather than a second dismissal; keep exact normal timestamps and a separate switch record. Diagnostic failure first returns to browser DOM/style/paint/timing inspection, not blanket GPU-tool activation.

The stale assumptions corrected are root-package placement, the historical no-package observation being mistaken for current state, treating GSAP primarily as a future option without a current selection rationale, an incomplete direct dev inventory and relying on staging intent without exact build integrity. No viewport, scope, media permission, acceptance threshold, frozen observation or product requirement changed.

Reusable CEC installation paths, version probes, ports, desktop/bridge state, MCP configuration and skill discovery should eventually live in a workstation/global inventory with a stable discovery reference. Do not migrate them in this pass. Keep this feature self-contained: exact selected dependency/lock/configuration, local fixture/provenance contracts, comparison locators and gates, and the minimal capability discovery pointer. Host receipts belong to actual runs; machine paths/credentials/live-status claims are not portable requirements. No new governance file or competing constitution is needed.

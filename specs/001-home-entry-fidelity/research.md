# Phase 0 Research: Home Entry and Ready Hero

Date: 2026-10-05 (Africa/Cairo). Scope: [spec.md](spec.md), FR-001..018. This is planning research, not new reference inspection or target acceptance. Existing root structure contains evidence/specification/tooling and no frontend app or production package manifest. A historical package under `skill-hardening/` is not an application stack constraint and was not adopted. Read-only research assignments covered stack, motion/assets and browser verification; only the primary planner wrote artifacts.

## Authority and inspected inputs

[Constitution](../../.specify/memory/constitution.md) -> [FC-TARGET-DESIGN-01 revision 3](../../implementation-scope/fidelity-scope-contract.md) -> [IP-HBC-01](../../implementation-scope/pre-build-packet/README.md) -> [active spec](spec.md). The [index](../../implementation-scope/pre-build-packet/evidence-index.md) resolves E2-013/E2-014, E-030/040/041/055/060/062/080 and the home source-declaration spans. Inspected named D/M/R HOME PNGs and home-specific JSON/source records; no live reference browser execution, new capture or source reuse. Packet final-rule reconciliation applies: FR-007 overrides obsolete maximum-height shorthand. Model execution admission remains external to this technical selection.

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

**Decision:** observed Node24.19.0/npm11.17.0; lock exact compatible dependency versions at implementation bootstrap; subsequent runs use `npm ci`. Record package/lock/browser/spec/fixture hashes. **Rationale:** a declared package version alone is not browser/OS/font reproducibility. [Node releases](https://nodejs.org/en/about/previous-releases), [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci/).

**Alternatives considered:** floating latest installers, unrestricted snapshot updates, introducing a service worker/CDN/API or copying existing inspection scripts as application code. Future frameworks/WAAPI/GSAP can be reconsidered for actual repeated markup or interrupted stateful sections; no new backend or routing requirement is invented now.

## R-09 Gates and completion

**Decision:** planning completes with implementation inputs explicit; machine/browser acceptance, calibration, asset-resolution and execution admission remain pending. **Rationale:** the active specification already treats those as preparation dependencies and defers control journeys, adaptation and publication. No unresolved product choice warrants blocking design.

**Alternatives considered:** requiring public asset licenses before this allowed local run, qualifying an execution route from research, treating the old commerce gate as current scope, or proclaiming a complete production website from home alone. All conflict with canonical ownership. [Plan](plan.md) records pre/post constitutional checks; [verification contract](contracts/verification.md) defines concrete fail/blocked outcomes.
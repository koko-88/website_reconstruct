# Reference-reconstruction 2.1.0 hardening report

The installed skill and repository copy now use reusable Settled-Appearance checks. No website was implemented, no reference was recaptured, and frozen v1 plus the sealed real-v2 revision remain unchanged. The new writable [implementation scope](../../implementation-scope/fidelity-scope-contract.md) makes the intended design/experience specification fidelity-ready, with separate implementation dependencies below.

## Audit: exact false-settled entry points

| Existing v2 location | Reliability gap | Correction |
| --- | --- | --- |
| `page-probe.js`: `visible` / `selection` | Geometry/display visibility does not establish effective opacity, descendant readiness or filter/transform completion; sampled styles were not convergence inputs | Optional scoped descendant/pseudo/ancestor style records and all-match named-state assertions, including effective ancestor opacity |
| `capture.mjs`: `geometrySignature` / `waitReady` | Three matching parent rectangles at roughly 100ms intervals can precede delayed children or transitions | Bounded healthy geometry + appearance windows; scheduled/active finite motion checked; observed-window claim and semantic limits explicit |
| `page-probe.js`: iframe surface record / `readyReasons` | Host document/fonts/images and accessible iframe shell say nothing about provider fonts/media/data | In-scope frame content remains unresolved; explicit shell-only contract limits do not clear interiors |
| `perform(sweep)` / `fullPage` screenshot | A bounded sweep followed by top reset can rearm offscreen reveals; viewport image decode does not cover full-page appearance | Full-page appearance stays unresolved; explicit geometry-only context claim is preserved; per-section checkpoints carry reveal evidence |
| `capture.mjs`: post-capture checks | Parent geometry and host readiness can remain constant across a changed-looking screenshot | Descendant/ancestor/style/assertion verification and optional scoped visual recheck invalidate the sidecar on change |
| Pixel-budget refusal / missing snapshot | A failed image could leave the checkpoint's appearance clearance intact despite an INCOMPLETE run | Explicit failure reason, unresolved appearance and false convergence; no fabricated PNG or lost checkpoint diagnostics |

## Policy and implementation

`settled-appearance.mjs` supplies data-only validated policy, bounded orchestration and scoped visual sampling. The standalone portable probe carries observations through any capable evaluate adapter; the maintained Playwright capture adapter supplies screenshots. No website-specific helper/selectors or hard-coded reference delay was added. Existing schema2 plans, fresh contexts, authorization/navigation boundaries, visible-image budgets, provenance, overwrite refusal and sealing remain.

States are transient, settled-static, settled-with-ambient-motion and unresolved. Sidecars retain policy/budgets, sample signals and changing dimensions, assertion failures, finite/continuous motion, convergence windows, screenshot hashes/clips/masks and limits. Raw legacy phase labels remain compatible, but geometry-only `settled` explicitly has unresolved appearance and false appearance convergence.

Optional scoped screenshot convergence is supplementary: exact PNG hashes can detect canvas changes with stable DOM, but cannot prove intended semantic completion or unseen future changes. Diagnostic ambient masks use justified stable regions; final evidence remains unmasked and animations continue. Playwright Test's [toHaveScreenshot](https://playwright.dev/docs/api/class-pageassertions#page-assertions-to-have-screenshot-1) was evaluated: its baseline/test-runner requirements and animation-disabling defaults do not fit a portable raw capture core. Public [page.screenshot](https://playwright.dev/docs/api/class-page#page-screenshot) and [getAnimations](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAnimations) provide useful maintained signals. Missing capabilities and frame/offscreen/raster limits remain explicit.

## Validation and preservation

- Skill-creator quick validation passes using existing Python 3.14/PyYAML; no dependencies were installed. Skill links/resources and staged/installed byte identity pass.
- [Installed synthetic results](tests-installed-final.log): **25 passed, 0 failed, 0 skipped**, including every requested case, existing v2 regressions, finite ancestor motion, unclassified ambient motion, sample/node budgets, canvas convergence and screenshot refusal. Node 24.19.0, installed Playwright 1.62.1 and sandbox-enabled Chrome; sampled [installed diagnostics](synthetic-signals-installed.json) record the actual browser version.
- [Independent forward validation](forward-validation/assessment.md) reproduced ancestor/compositing and screenshot-refusal defects and verified their fixes with isolated portable artifacts. Its browser skips make no real-browser claim; the installed suite supplies that validation.
- Initial restricted-shell startup stalled, and a concurrent installed attempt hit host native-memory exhaustion. Only three verified processes from this task's stalled initial test were stopped; serial installed execution passed without disabling browser security. Historical failure logs are retained.
- [Verification](stage-verification.json) preserves all **172** frozen-v1 files and **306** sealed-v2 inventoried files plus unchanged manifest bytes. [Baseline](baseline.json), the byte-identical `before/` copy, `changes.json`, and `reference-reconstruction-2.1.0.patch` preserve rollback/diff evidence. Restore the six changed files from `before/` and remove only the three listed additions to roll back either skill copy; this does not change reference evidence. `final-verification.json` records installed equality and final hashes.

## Actual fidelity scope and remaining dependencies

U-01/SR-33 remains unresolved and blocking under the old sealed commerce-inclusive contract. Under new FC-TARGET-DESIGN-01, selectable Eventbrite inventory/backend/purchase states are excluded exact obligations; existing reviewed host CTA/panel evidence supports the visual role, and replacement functionality is assessed under the target adaptation contract. This changes the applicable obligation rather than inventing evidence or modifying the sealed gate.

**Reference design/experience fidelity is READY within the documented Chromium/source/ambient bounds.** Remaining dependencies are only: **(1)** per-group authorized assets/fonts/code or actual documented replacements with metric/crop/motion consequences (U-02/SR-42 still blocks dependent implementation); **(2)** real target content/data/CTA-action mappings and stress fixtures before adaptation. Neither requires an Eventbrite selectable fixture. No additional material reference evidence gap was demonstrated by hardening validation.

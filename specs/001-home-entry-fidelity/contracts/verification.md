# Verification Interface: Home Fidelity Acceptance

Applies to [spec](../spec.md) and [plan](../plan.md). This is the planned target acceptance interface, not an executed result. The reference capture helpers/plans are evidence/replay seeds; do not run sealed reference application code or overwrite original receipts to validate this slice. Implement only small target environment/readiness/recording/comparison helpers, using maintained Playwright/image libraries.

## Case catalogue and runner contract

Canonical projects use Windows/headless Chrome154.0.8037.58/DPR1, en-US, Africa/Cairo, LTR/light, zero root scroll and no imported storage:

| Case | Viewport/input/preference | Reference |
| --- | --- | --- |
| HOME-D-READY |1440x900, normal, fine/hover,1425 measured hero flow via stable gutter |`raw-run-01/D--HOME` |
| HOME-M-READY |390x844, normal, emulated coarse/touch, recorded desktop UA,390 flow |`raw-run-01/M--HOME` |
| HOME-R-READY |390x844, same touch/UA, reduced before root navigation |`raw-run-01/R--HOME` |

References resolve through [index](../../../implementation-scope/pre-build-packet/evidence-index.md); E2-013 qualifies appearance and E2-014 supplies current geometry. Inspect actual platform/font/browser identity. Browser UA overrides do not qualify an engine. A missing reference-profile binary/OS is a recorded environment dependency; portable tests can still run, but parity cannot be claimed. Qualification of a different environment must be explicit, calibrated and limited to its demonstrated effects.

Three fresh isolated contexts per canonical case: nine attempted runs, all retained, `workers=1`, acceptance `retries=0`. Use zero-based monotonic navigation-relative timestamps; initialize independent observer telemetry before navigation. Enabling preference/touch only after navigation fails fresh-case setup. Do not spread an unrelated device descriptor. Unknown zoom remains unknown; record visual scale separately.

Responsive cases: widths759/760/761,1099/1100/1101,1799/1800/1801 under each E-040 row's recorded height/input, plus1024x768,768x1024 from E-030 and844x390/1440x400 from E-041. Compare only supported home/header facts/final rules, not resized D PNGs or unrelated section rasters. Supplemental narrow-fine/wide-coarse cases are prospective branch tests. Normal/reduced/touch support fallback are separately labeled.

### Run identity and output preservation

Before the first browser invocation, `acceptance:prepare` reads an explicit unique `HBC_ACCEPTANCE_RUN` ID and creates `artifacts/home/<run-id>/session.json`, recording the immutable spec/build/fixture/calibration identity and planned check catalogue. Every invocation requires a unique `HBC_ACCEPTANCE_INVOCATION` ID, writes only `artifacts/home/<run-id>/invocations/<invocation-id>/`, and appends its command/start/end/status/attempt pointers to the session journal. The Playwright outputDir and report/trace destinations use that invocation namespace. Refuse existing IDs and altered run inputs; never clean the acceptance-run root. Keep portable/canonical/variant outputs distinct within the same session. Diagnostic reruns are additional linked invocations, never replacement files or hidden retries. `validate:home-results --run <run-id>` reads that exact manifest, requires all planned groups and nine fresh canonical outcomes, checks artifact hashes and combines receipts into acceptance.json. An incomplete invocation is a retained failure/NOT_RUN, not a missing attempt silently ignored.

### Scroll-only verification context

An isolated home may fill its viewport and provide no travel. MO-04/MO-05 therefore append a test-only neutral inert aria-hidden continuation, with no text, controls or anchor IDs, **after** the unmodified canonical capture. Height is at least2*max(measured hero height, viewport height), so tests can scroll through the full hero exit. Record insertion/removal, document extent, actual scrollY and native view-timeline/animation samples. Tests use native scrolling and never set effect transforms or replay source scripts. Label every affected capture/sample as `target-test-continuation`, exclude it from canonical static comparison, and do not claim later-section integration. Return to zero, remove the continuation and confirm unchanged top geometry/appearance/no loader replay. The continuation helper is test code only and cannot appear in served production markup/bundle. Short-height cases that naturally scroll are recorded separately without needing this context.

## Required check matrix

IDs below are stable acceptance check groups for later task traceability. Unit checks do not replace browser/visual proof.

| Requirement | Checks | Acceptance/output |
| --- | --- | --- |
| FR-001 |EN-01 root reset, EN-02 brand/reload, EN-03 in-page return |fresh top/closed menu, independent entry, no replay on scroll return; SC-001/002 |
| FR-002 |EN-04 loader anatomy and loading capture |title/light/mist/status/dots/coordinates/progress hierarchy, decorative semantics; SC-002/003 |
| FR-003 |EN-05 exact-clock race; EN-06 delayed real browser |navigation floor/setup ceiling/dismiss offsets, once-only effects and decoded-ready separation; SC-002 |
| FR-004 |EN-07 real phase sequence and sampled layer styles |condensation/parting/exit/overlap/hero reveal in declared order/easing; SC-002 |
| FR-005 |VI-01 D/M/R five regions |required ordered copy/header/attribution/explore/coordinates; SC-001/003 |
| FR-006 |VI-02 fonts/metrics/fit; RS-01 resize/font settlement |expected faces/line count/ascenders/fit, no cumulative shrink or unauthorized substitution; SC-003/004 |
| FR-007 |RS-02 current hero/header/gutter/height geometry |content-driven min-height, no old max, zero clipping/overlap/overflow concealment; SC-003/004 |
| FR-008 |VI-03 image crop/focal/layer depth |decoded town/brand/fog, correct scrim/crop/stack/input transparency; SC-003/007 |
| FR-009 |MO-01 light track; MO-02 leave/blur/hidden/touch/switch |bounded primary coordinates, clear queued tracking, no coarse/reduced light; SC-005 |
| FR-010 |MO-03 fog/mark samples; MO-04 scroll forward/reverse |independent clocks/ranges, native hidden pause, photo/title formulas and restored top; SC-005 |
| FR-011 |RS-03 all13 recorded variants; MO-05 crossed width/input and touch feature fallback |visibility/density/wrap/crop/placement, timeline or still branch, no desktop effect leakage; SC-004/005 |
| FR-012 |EN-08 fresh reduced; MO-06 switched preference |0/50ms fast path, stationary samples and zero running scoped animations, distinct session labels; SC-001/005 |
| FR-013 |AX-01 role/name/state; AX-02 status/decorative exclusions |principal heading/image alt/closed menu/link relationships, one polite status; SC-006 |
| FR-014 |AX-03 Tab/Shift+Tab/skip visibility/brand activation |specified order, no hidden/decorative stops or invisible focus; SC-006 |
| FR-015 |AX-04 targeted axe/focus/contrast review/deviations |document correction reason/evidence/consequence/assertion; no AT parity claim; SC-006/008 |
| FR-016 |FB-01 no-script; FB-02 missing main/late main |readable static home,7000ms guard clears coverage/entrance hold, no replay; SC-002/008 |
| FR-017 |RD-01 convergence/deadline; EN-09 captured chronology |every required phase/predicate/timestamp retained, timeout fails; SC-001/002/008 |
| FR-018 |CA-01 calibrated limits; RC-01 reference/fixture/environment receipt |immutable canonical inputs, no generated baseline/masking defects, O/S/U/D preserved; SC-003/007/008 |

SC-001 requires all nine trials within10s; SC-002 includes delayed readiness, competing signals, no-script and missing initialization; SC-003 five regions; SC-004 all13 recorded variants; SC-005 all branches/cancellations; SC-006 keyboard/semantics; SC-007 every visual dependency with concrete source/consequences; SC-008 complete coverage/results/review. A filtered test run cannot satisfy the aggregate gate.

## Ready and temporal capture procedure

1. Verify fixture/reference hashes and locked calibration. Start a fresh context with all input/motion/environment conditions set. Attach a passive recorder for lifecycle DOM changes, navigation origin and real timestamps before navigating; do not inject replacement motion or force state classes.
2. Start deadline at root navigation, not after load. Observe loading/parting/overlap or reduced fast entry. Check DOM/style values independently of app telemetry. Capture at least the required phases with screenshot request/completion times, chronological samples and video/trace when useful. Use observed state predicates rather than waiting for E-060 exact sample times.
3. Poll at100ms within10s. Require loading marker/coverage/loader absent; scroll zero; expected count/text/roles; intended header/title/attribution/bottom opacity/filter/entry displacement; successful expected fonts and decoded visible image/texture assets; finite entrance animations finished. Include inherited effective opacity and generated/pseudo layers.
4. Require three consecutive independent geometry samples changing<=0.5 CSSpx while the other predicates remain true. Compare stable layout wrappers for ambient content. Classify fog/rotation as explicit property-specific ambient exceptions; an infinite animation label alone is not enough. A stable invisible child or paused entrance fails readiness.
5. Capture raw viewport PNG with animations allowed, CSS scale and no masking. Recheck base/appearance predicates after capture. An intervening failure invalidates the capture; retain it with a failed disposition.
6. Decode the explicit canonical PNG and compare the five regions with the prelocked geometry/type/raster metrics. Save unmasked actuals, separate diagnostic masks, overlays/diffs and per-region numbers. Never create an expected snapshot from the target or invoke update-snapshots for fidelity.
7. Perform motion/input/keyboard/fallback variants and aggregate every attempt/limitation. Machine results precede reviewer judgment; unexplained material image/state differences prevent acceptance.

`page.screenshot({animations:'allow', fullPage:false, scale:'css'})` is the capture primitive. Default `toHaveScreenshot()` animation disabling/stability loop is not entry proof. `networkidle`, fixed sleeps, parent rectangles, timeout completion, font promise or loader telemetry alone are insufficient. Fake-clock unit tests may prove exact timer arithmetic; real CSS/browser chronology is separate.

Hidden/blur cancellation requires native state change confirmed by actual `visibilityState`/focus. If the automation runtime cannot background the page, retain a bounded headed/manual check with environment, action, time/style samples and reviewer result. Synthetic dispatch tests only handler logic. Similarly, do not claim physical-device or assistive-technology verification from emulation/axe.

## Tolerance calibration contract

Planned `tests/calibration/home.json` is a mandatory versioned feature input. Status defaults NOT_CALIBRATED; the runner refuses fidelity verdicts until CALIBRATED. It must contain numeric limits, not placeholder prose.

Required fields: profile ID/version/hash/lock time; canonical reference IDs/hashes; environment/browser/font qualification; case and region coordinates; geometry/type metrics and allowed residuals; raster algorithm/package/version/channel-distance/pixel-count/ratio limits; timing-origin-specific tolerance; mask coordinates/reasons/unmasked obligations; calibration sample/perturbation results; review disposition. Reject missing/NaN/unbounded/negative numeric values, broad mask coverage of meaningful regions and a profile matching no run environment.

Calibration procedure before target evaluation:

1. Characterize the exact runner with independent font/gutter/rendering and real scheduling probes. Verify required face bytes/system Arial and1440/1425 flow. Estimate pixel-edge precision/measurement rounding and actual sampling/capture overhead. Pin browser flags and record hardware/headless differences.
2. Use source-declared constants as exact unit targets. Derive real-time tolerances from measured scheduling/frame/probe overhead while keeping required origin/order/floor/ceiling unchanged. Observed loader timestamps remain brackets, not universal goals.
3. Establish metric and per-region raster limits from authoritative measured records and reference edge/crop analysis. The reference corpus has one canonical PNG per state: same-state source variance is **not measured**. Do not derive noise from D vs M vs R, historical JPEG vs current PNG, or arbitrary target errors. Target repeatability diagnoses runner noise only.
4. Qualify the comparator with clearly labeled derived perturbations, leaving original files untouched: known position offsets, changed title edges/line occupancy, missing controls, crop-landmark shift, scrim error and timing/order errors. Limits must reject every material defect class and accept only explained capture precision/residuals. Derived calibration artifacts are not new reference observations/baselines.
5. Ambient phase assessment retains unmasked region composition, density/depth/softness and time-series range/independence. Narrow diagnostic masks may exclude documented uncontrollable pixels, never the headline/control/crop landmark. Mask area alone cannot waive a fog-overlapped photograph region. If phase noise prevents reliable numeric proof, retain an explicit bounded reviewed ambient result and categorical crop/layer checks; do not inflate whole-page thresholds.
6. Review and lock profile before target comparisons. Keep raw outcomes and perform separate sensitivity checks. Later threshold changes require versioned evidence/rationale/review and invalidate affected results; failure alone is not justification.

Categorical limits independent of calibration: zero missing required strings/roles/states/assets, zero clipped glyphs/control overlap, zero unintended horizontal content overflow, zero prohibited coarse/reduced light or fresh-reduced running motion, zero copied reference code, no discarded trials, no missing result/unknown promoted to PASS. Geometry stability0.5 CSSpx is not geometric accuracy. Pixel ratio is not an adequate substitute for type/crop/structure.

## Result and receipt interface

Planned `artifacts/home/<run-id>/acceptance.json` contains:

- `schemaVersion`, `runId`, session manifest/hash and every invocation/attempt linkage, wall-clock and navigation-relative origins, scope/local-only phase;
- spec/plan/task/base/final revisions, actual branch/worktree, author/reviewer and applicable route receipt references;
- exact Node/npm/package-lock/manifest/calibration IDs and hashes, command list and exit codes;
- browser executable/hash/version/channel/headless/flags, OS build, actual font identity, viewport/root/body/hero widths/gutter, DPR/visual scale/zoom-knownness, UA, input media/touch, locale/timezone/direction/light/motion, fresh storage/scroll setup;
- every case/trial, all required check IDs/FR/SC mappings, phase timestamps/samples, readiness predicates, finite/ambient classification, screenshot interval/hash/path, region/diff/geometry/type results, test-continuation context and diagnostics;
- asset/font/environment/accessibility deviations with concrete consequences/assertions/disposition;
- limits/manual checks/reviewer result and aggregate outcome.

Check statuses: PASS (proved within contract), FAIL (observed violation), BLOCKED (required asset/environment/calibration/tool precondition missing), NOT_RUN (not attempted). Aggregate PASS requires all mandatory checks/trials PASS and documented permitted deviations; BLOCKED/NOT_RUN cannot be silently treated as passes. Deferred menu/section/provider journeys are scoped exclusions, not passed checks.

Retain all artifacts long enough for the required review and route receipt; durable result pointers must resolve after integration. Human visual/browser acceptance examines D/M/R region composition, loader overlap, type/crop, recorded edge cases, live motion and focused controls; record the specific checks and outcome rather than an unstructured approval. This review supplements machine checks. Independent eligible implementation review remains required by RP/RR; this planning run does not perform or substitute for it.

Revalidate frozen/sealed reference digests after acceptance, never rewrite E2-013, packet `verification.json`, capture sidecars or originals. The packet verifier has a historical evidence-only change gate and writes its own receipt; it is not the target acceptance runner. Target helpers may reuse the published method/contracts, not copy reference application code or repurpose historical PASS as new results.

# Phase 1 Data Model: Home Entry and Ready Hero

This static slice has no persisted domain database, API, user account or provider model. These entities describe reference-equivalent inputs, orthogonal runtime state and reviewable test results. Ownership is [spec.md](spec.md), technical decisions [plan.md](plan.md); interface validation is in [home](contracts/home-ui.md), [fixtures](contracts/fixtures.md) and [verification](contracts/verification.md).

## HomeFixture

Fields: `id`, `revision`, `mode=local-reference-validation`, two ordered heading strings, attribution prefix/name/href, two ordered intro sentences, hero alt, brand accessible name/alt/root href, ticket label/href, menu name/controls target, skip label/href, explore name/href, coordinates, and asset-role bindings. Use the observed strings/order, including Unicode apostrophe/coordinates. Fragment destinations remain `#about`, `#creator`, `#tickets`; root is `/`. Heading line count=2, intro sentence count=2, one brand/ticket/menu/attribution/explore, one hidden navigation target. No arbitrary content adaptation in this fixture.

Relationships: one fixture binds all required `AssetRecord`s and is shared by D/M/R. Validation rejects missing roles, invented copy/destinations, accidental menu acceptance, or remote visual dependencies. Build-time static HTML is the rendering source; a matching test fixture records expected strings without a custom template renderer.

## AssetRecord

Fields: `id`, `role`, `kind` (font/image/texture/mark/icon/noise/system-font), `status` (present/missing/selected/verified), `evidenceRefs`, `origin`, `localPath`, `sha256`, `bytes`, `intrinsicSize`, `fontFamily/weight/style`, `variants`, `crop/focal`, `alt`, `authoringBasis`, `phaseAllowance`, `deviationRefs`. System font records include installed family/file/version where available rather than a fabricated repository digest.

Replanned serving identity: `localPath` is repository-relative beneath `local-fixtures/home/`; `stagedPath` and `builtPath` are repository-relative beneath `app/public/fixtures/home/` and `app/dist/fixtures/home/`; `runtimeUrl` is the local `/fixtures/home/...` request. A verified serving record requires selected-file set equality and hash/size identity across source, stage and build. Authoring tool/recipe identity is recorded only for an actually selected derived/replacement file; workstation availability alone is not an asset binding.

Relationships: fixture -> role -> record(s); font/image variant bytes have individual hashes. A missing record has no invented path/hash. A selected replacement has concrete source/file and effect measurements. `verified` requires bytes/hash/type/decode/metric checks as relevant; presence alone never confers a public license. Records cannot bind app.js/styles.css/index.html/widget code as application dependencies. Manifest is kept outside served public assets.

## EntrySession

Fields: unique `sessionId`, `navigationOrigin`, `bootstrapAt`, `setupAt`, `mode` (normal/fresh-reduced/no-script/failsafe), `phase`, `pageLoadSettledAt`, `fontSettledAt`, `dismissAt`, `dismissReason` (ready/ceiling/reduced/failsafe), `releaseAt`, `removedAt`, `generation`, `pendingTimers`, `disposed`. Time values are monotonic milliseconds relative to navigation; timestamps also retain wall-clock origin for records.

Transitions:

| From | Event/guard | To/effect |
| --- | --- | --- |
| default readable | normal bootstrap | loading; activate coverage; independent7s guard |
| loading | page load and font settlement and navigation>=1600ms | parting; once-only dismiss; schedule release+260ms/removal+1500ms |
| loading | setup elapsed>=3600ms before ready branch | same parting path; reason=ceiling |
| parting | release deadline | released; hero entrances unheld, loader exit continues |
| released | removal deadline | removed; cancel residual entry work |
| default/active normal | reduced before entry or during current session | fast-dismiss; immediate coverage/entrance release, remove+50ms; cancel prohibited movement |
| bootstrap loading without initialized owner | bootstrap guard expires | failsafe-released; remove coverage/entrance hold; late module adopts, no replay |
| any | dispose/new document | dispose timers/listeners and invalidate generation |

Invariant: at most one dismissal/removal/release effect per session; no new session from in-page scroll/home return; switching back to normal never replays loader. If reduced interrupts a normal exit, record cancellation and the switch as its own case, never label it fresh reduced.

Reduced interruption preserves the original `dismissAt/dismissReason`; record the switch separately, invalidate pending normal release/removal callbacks, release immediately if still held and schedule only the remaining removal once. If already removed, no new removal is scheduled. Cleanup does not depend on `animationend` firing after an animation is canceled.

## CapabilityState

Fields: CSS viewport width/height, actual hero/flow dimensions, `finePointer`, `coarsePointer`, `hover`, `reducedMotion`, `documentVisible`, `focused`, `touchTimelineSupported`, `observerSupported`. Layout category is derived only from inclusive CSS width rules; effect branch is derived independently from input/preference. Width can be narrow with fine input or wide with coarse input. Listener/observer updates invalidate queued effects before applying a new branch.

## HeroEffectState

Fields: nonnegative `scrollY`, measured `heroHeight`, pending frame ID, photo displacement/scale, title displacement/opacity, light (default/tracked/hidden), bounded x/y, fog banks with visibility/paused flag and independent clocks. No persistence. Fine normal formulas: photo y*.25 and1+y*.00008, title y*.10 and clamp(1-y/heroHeight). Touch branch ends toward22svh when supported or remains still; reduced resets dynamic values. Invariant: one owner per property/layer; hidden/touch/reduced/capability cleanup clears tracking and pending frames.

## ReadySample and ReadyCheckpoint

Sample fields: session/case/time; loader coverage/presence; expected text/roles; effective ancestor+descendant opacity/filter/entry displacement; generated-layer styles; font faces and metrics; media decode/currentSrc/natural dimensions; named geometry; finite/infinite animation inventory; limits/errors. Static layout wrappers are measured independently of permitted ambient transforms.

Checkpoint fields: sample sequence, observation window, convergence, semantic/appearance predicates, readiness deadline10s, classified ambient exceptions, capture start/end, raw capture hash and result. Requires three consecutive geometry samples within0.5 CSSpx and all appearance/media/font predicates throughout that window. Loader complete does not imply ready. Terminal outcomes are PASS/FAIL/BLOCKED/NOT_RUN with explicit reasons; a timeout cannot force-pass.

## CalibrationProfile

Fields: version/status (NOT_CALIBRATED/CALIBRATED), cases/reference IDs/hashes, environment qualification, regions/coordinate system, masks/reasons/exclusions, comparison algorithm/version, per-metric numerical limits, source/classification/rationale, perturbation results, reviewer, lockedAt/hash. Geometry, raster and timing limits are separate. Semantic prohibitions remain categorical. CALIBRATED requires numeric values, sensitivity proof and qualified conditions before any target result is evaluated; reclassification changes version and invalidates affected results.

## AcceptanceRun and Deviation

Run fields: run ID, append-only session manifest, unique invocation IDs and immutable output paths/attempt linkage, spec/plan/task/base revision, actual branch/worktree, toolchain/lock/browser/OS/fixture/calibration identity, author/reviewer route receipt references where applicable, commands, all attempted case/trial results, FR/SC coverage, captures/samples/diffs/traces, timestamps, test-continuation context, deviations/limitations and final result. Detailed shape in verification contract. No discarded retries, overwritten invocation artifacts or automatic baselines.

Replanned package identity: record `applicationRoot=app`, application manifest/lock hashes, exact direct dependency inventory, actual tool resolution, staged/build fixture checks and clean-checkout execution result. Paths such as `artifacts/home/` and `tests/calibration/` in the verification interface are application-relative. The root provisional package/lock are never the acceptance dependency identity.

Deviation fields: ID, requirement/evidence, category (environment/asset/accessibility), reason, concrete before/after consequence, measurement/assertion, affected cases, reviewer disposition. Unexplained differences fail; approved correction does not rewrite reference. Public release/target adaptation decisions remain under FC rather than this entity.

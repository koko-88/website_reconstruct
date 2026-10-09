# Quickstart: Planned Home Fidelity Validation

This is a validation/run guide for the future implementation of [plan.md](plan.md), not a claim that an application package/lock or test commands exist now. The root npm bundle is provisional capability/bootstrap state, not an application. Phase 1/replanning creates design artifacts only. Tasks exist; run cross-artifact analysis under [logic verification](../../LOGIC_VERIFICATION.md) before implementation. Use RP/RR for execution selection and [implementation verification](../../IMPLEMENTATION_VERIFICATION.md) for engineering acceptance/review. No production deployment or provider service is required. All application-relative paths/commands below use `app/`.

## Prerequisites

- Use the feature's future implementation checkout/worktree and independent `app/` package. Node24.19.0/npm11.17.0 were rechecked on the planning host; record any compatible qualified change.
- Preserve root `package.json`, `package-lock.json` and `node_modules`: no root install/ci/prune/delete/commit/conversion. Implementation bootstrap creates only `app/package.json` and `app/package-lock.json`, pins exact compatible releases from the [plan's direct dependency set](plan.md#technical-context), and tracks application configuration/scripts. Runtime dependencies are empty. No workspace linkage, parent tool resolution or floating latest installer in acceptance. Prove clean-checkout execution without root packages.
- Resolve mandatory town/fog/logo fixture bytes under [fixture contract](contracts/fixtures.md), place permitted local-only source bytes under repository-root gitignored `local-fixtures/home/`, and verify system Arial. Implementation adds the ignore for `app/public/fixtures/home/` before staging. Selected source -> stage -> built passthrough identities must match; neither source nor stage is committed. Missing assets may permit isolated logic checks but block affected fidelity acceptance.
- Supply the exact Windows/reference Chrome profile or a separately documented qualified comparison environment; inspect actual executable/version/hash. Do not replace the user's installed Chrome using a blind browser-install command. Portable bundled Chromium is a distinct functional-test profile.
- Prepare and lock the numeric calibration input before target comparisons, following [verification contract](contracts/verification.md). Default NOT_CALIBRATED must block acceptance.

## Setup, build and isolated checks

Once implementation has created the manifest/lock/config/scripts:

```powershell
Set-Location 'K:\website_reconstruct\app'
npm ci
npm run stage:fixtures
npm run verify:fixtures
npm run typecheck
npm run lint
npm run test:unit
npm run build
```

Expected: application-lock-respecting install with application-local tool resolution; verified local fixture/reference hashes; zero tracked local-only/staged fixture bytes; all type/lint/state-clock checks pass; independently authored local static output in ignored `app/dist/`. `build` repeats staging/preflight automatically and verifies the exact staged/built fixture set and byte hashes, rejecting stale files. Build contains complete readable home HTML, selected local assets and no reference app/provider code, fixture metadata, tests, continuation helper, inspector or provisional root-bundle imports. This local build is not a publication artifact.

Unit scenarios: delayed setup preserves navigation-relative1600ms floor and setup-relative3600ms ceiling; competing readiness/ceiling dismisses once;260/1500 offsets;0/50 reduced path; stale timer/cancellation/disposal; late init after7000ms fallback; formula return-to-zero and shrink-only fit behavior. These do not prove actual CSS choreography.

## Built-output browser run

The planned Playwright `webServer` builds/serves the static output on127.0.0.1 using a fixed local port; tests do not rely on HMR. `npm run preview -- --host 127.0.0.1 --port 4173 --strictPort` is the manual viewer only, not a production server/deployment action.

Use the implementation's environment file/configuration to point to the recorded reference browser executable; `validate:home-inputs` must report the actual engine/OS/font/gutter conditions before acceptance:

```powershell
npm run validate:home-inputs
$env:HBC_ACCEPTANCE_RUN = 'home-' + [guid]::NewGuid().ToString('N')
npm run test:browser -- --project=portable-contracts --project=home-d --project=home-m --project=home-r --project=home-variants --workers=1 --retries=0
npm run validate:home-results -- --run $env:HBC_ACCEPTANCE_RUN
```

Expected: portable contracts labeled separately; nine independent canonical attempts retained; normal loading/parting-overlap/ready and reduced fast-entry/ready captured; ready predicates and three stable samples pass within10s from navigation; all13 recorded size variants plus width/input cross-checks pass; every mandatory FR/SC check covered. Native hidden/blur checks use a confirmed headed background action or an explicit recorded manual result if headless automation cannot produce it. No failure disappears through retry.

`test:browser` invokes Playwright Test directly. Configuration requires a new run ID and namespaces
native results/reports/traces so old evidence is retained. Native metadata and attachments carry
input identity and check/trial results. Projects home-d/m/r each contain three fresh cases; variants
and portable contracts remain labeled separately in the same invocation. The minimal feature result
validator checks the native report for all catalogue entries, nine trials, calibrated comparisons and
required review. It cannot pass incomplete/skipped groups. Diagnostics use a new linked run ID;
there is no prepare-run script, subprocess wrapper or session journal. No command updates baselines.

## Required fault and accessibility scenarios

Delay font/load readiness to exercise the ceiling while keeping ready appearance separately failed until actual decode/font success; target both readiness and ceiling signals to prove once-only behavior. Disable JavaScript for a static readable home. Block the main module while permitting independent bootstrap, then observe7000ms coverage release; delayed module arrival must not replay entry. Reload/brand-root resets entry; scroll return does not.

Check primary pointer tracking/clamp/leave/blur/hidden/touch/capability cleanup; fine scroll forward/reverse; supported and unsupported touch timeline; fresh reduced versus normal-to-reduced switch; independent normal fog/mark phases and hidden pause. When the standalone hero lacks scroll travel, tests append the neutral inert continuation only after the untouched ready capture, record its modified context and actual native scroll/timeline values, then remove it before the returned-top comparison. It has no destination IDs/content and is never shipped. Inspect Tab and Shift+Tab, skip focus visibility, brand keyboard navigation, accessible roles/names/menu closed state and polite loader status; run targeted axe and image-backed focus/contrast review. Document necessary corrections before acceptance.

## Review output and failure handling

Open the retained report/traces and `artifacts/home/<run-id>/acceptance.json`; inspect unmasked D/M/R images, five-region overlays/diffs, timestamped motion samples, size variants and focus. A complete receipt distinguishes commands executed, cases PASS/FAIL/BLOCKED/NOT_RUN, every attempted trial and deviations. Independent implementation review appropriate to the high-risk slice and human/browser visual dispositions must be attached before acceptance.

Missing media, unqualified reference conditions or NOT_CALIBRATED thresholds produce BLOCKED results, not placeholder screenshots or a new baseline. A structural/type/crop/timing failure requires repair or a justified explicit deviation and rerun under the unchanged calibrated contract. Preserve reference inputs and all failed attempts. Local slice acceptance never authorizes public distribution, adaptation, downstream journeys or Eventbrite commerce.

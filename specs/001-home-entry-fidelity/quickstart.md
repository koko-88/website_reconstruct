# Quickstart: Planned Home Fidelity Validation

This is a validation/run guide for the future implementation of [plan.md](plan.md), not a claim that an application, dependency lock or test commands exist now. Phase 1 creates design artifacts only. Generate tasks and run cross-artifact analysis before Critical implementation; its execution admission remains under RP/RR. No production deployment or provider service is required.

## Prerequisites

- Use the repository root with the feature's future implementation checkout/worktree. Node24.19.0/npm11.17.0 are the recorded planning host versions; record any compatible qualified change.
- Implementation bootstrap must pin exact compatible releases and commit `package-lock.json`, TypeScript/ESLint/Vite/Playwright configuration and the scripts named below. No floating latest installer in acceptance.
- Resolve mandatory town/fog/logo fixture bytes under [fixture contract](contracts/fixtures.md), copy allowed present fonts locally and verify system Arial. A missing asset may permit isolated logic checks but blocks affected fidelity acceptance.
- Supply the exact Windows/reference Chrome profile or a separately documented qualified comparison environment; inspect actual executable/version/hash. Do not replace the user's installed Chrome using a blind browser-install command. Portable bundled Chromium is a distinct functional-test profile.
- Prepare and lock the numeric calibration input before target comparisons, following [verification contract](contracts/verification.md). Default NOT_CALIBRATED must block acceptance.

## Setup, build and isolated checks

Once implementation has created the manifest/lock/config/scripts:

```powershell
Set-Location 'K:\website_reconstruct'
npm ci
npm run verify:fixtures
npm run typecheck
npm run lint
npm run test:unit
npm run build
```

Expected: lock-respecting install; verified local fixture/reference hashes; all type/lint/state-clock checks pass; independently authored static output in `dist/`. Build contains complete readable home HTML, local assets and no reference app/provider code or runtime third-party visual requests.

Unit scenarios: delayed setup preserves navigation-relative1600ms floor and setup-relative3600ms ceiling; competing readiness/ceiling dismisses once;260/1500 offsets;0/50 reduced path; stale timer/cancellation/disposal; late init after7000ms fallback; formula return-to-zero and shrink-only fit behavior. These do not prove actual CSS choreography.

## Built-output browser run

The planned Playwright `webServer` builds/serves the static output on127.0.0.1 using a fixed local port; tests do not rely on HMR. `npm run preview -- --host 127.0.0.1 --port 4173 --strictPort` is the manual viewer only, not a production server/deployment action.

Use the implementation's environment file/configuration to point to the recorded reference browser executable; `validate:home-inputs` must report the actual engine/OS/font/gutter conditions before acceptance:

```powershell
npm run validate:home-inputs
$env:HBC_ACCEPTANCE_RUN = 'home-' + [guid]::NewGuid().ToString('N')
npm run acceptance:prepare
$env:HBC_ACCEPTANCE_INVOCATION = 'portable-01'
npm run test:browser -- --project=portable-contracts
$env:HBC_ACCEPTANCE_INVOCATION = 'canonical-01'
npm run test:browser -- --project=home-d --project=home-m --project=home-r --workers=1 --retries=0
$env:HBC_ACCEPTANCE_INVOCATION = 'variants-01'
npm run test:browser -- --project=home-variants --workers=1 --retries=0
npm run validate:home-results -- --run $env:HBC_ACCEPTANCE_RUN
```

Expected: portable contracts labeled separately; nine independent canonical attempts retained; normal loading/parting-overlap/ready and reduced fast-entry/ready captured; ready predicates and three stable samples pass within10s from navigation; all13 recorded size variants plus width/input cross-checks pass; every mandatory FR/SC check covered. Native hidden/blur checks use a confirmed headed background action or an explicit recorded manual result if headless automation cannot produce it. No failure disappears through retry.

`acceptance:prepare` creates the selected run manifest; `test:browser` wraps Playwright Test and requires unique invocation IDs. Output/report/trace folders are namespaced per invocation so later commands cannot erase earlier attempts. Projects `home-d/m/r` each contain three fresh cases/trials; `home-variants` contains responsive, motion/input, keyboard and fault/fallback groups. `validate:home-results` reads the explicit run manifest, checks all invocation/attempt coverage plus calibrated per-region comparisons and review completeness; it cannot return overall PASS before required review records exist. No command updates expected snapshots.

## Required fault and accessibility scenarios

Delay font/load readiness to exercise the ceiling while keeping ready appearance separately failed until actual decode/font success; target both readiness and ceiling signals to prove once-only behavior. Disable JavaScript for a static readable home. Block the main module while permitting independent bootstrap, then observe7000ms coverage release; delayed module arrival must not replay entry. Reload/brand-root resets entry; scroll return does not.

Check primary pointer tracking/clamp/leave/blur/hidden/touch/capability cleanup; fine scroll forward/reverse; supported and unsupported touch timeline; fresh reduced versus normal-to-reduced switch; independent normal fog/mark phases and hidden pause. When the standalone hero lacks scroll travel, tests append the neutral inert continuation only after the untouched ready capture, record its modified context and actual native scroll/timeline values, then remove it before the returned-top comparison. It has no destination IDs/content and is never shipped. Inspect Tab and Shift+Tab, skip focus visibility, brand keyboard navigation, accessible roles/names/menu closed state and polite loader status; run targeted axe and image-backed focus/contrast review. Document necessary corrections before acceptance.

## Review output and failure handling

Open the retained report/traces and `artifacts/home/<run-id>/acceptance.json`; inspect unmasked D/M/R images, five-region overlays/diffs, timestamped motion samples, size variants and focus. A complete receipt distinguishes commands executed, cases PASS/FAIL/BLOCKED/NOT_RUN, every attempted trial and deviations. Required eligible independent implementation review and human/browser visual dispositions must be attached before acceptance.

Missing media, unqualified reference conditions or NOT_CALIBRATED thresholds produce BLOCKED results, not placeholder screenshots or a new baseline. A structural/type/crop/timing failure requires repair or a justified explicit deviation and rerun under the unchanged calibrated contract. Preserve reference inputs and all failed attempts. Local slice acceptance never authorizes public distribution, adaptation, downstream journeys or Eventbrite commerce.

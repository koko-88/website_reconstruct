# Implementation verification

This is the sole centralized Markdown authority for code, integration, runtime and engineering
acceptance verification and risk-based review. [Logic verification](LOGIC_VERIFICATION.md) owns
requirements/governance consistency. Feature specifications and linked contracts retain their
individual acceptance criteria, environments, calibration, state/capture recipes and result fields.

## Engineering acceptance

Use the existing stack's native checks: Node test runner for reconstruction tooling; the selected
application's TypeScript, ESLint, Vitest and Playwright once that package exists. Test observable
behavior, failure controls and integration boundaries. Run relevant checks after changes and broaden
only when an unresolved risk justifies it. Missing tools, skipped suites and absent application
packages are NOT_RUN or explicit limitations, never successful acceptance.

Local checks and CI, including temporary loopback fixtures and browser integration checks, are
authorized. Keep CI read-only except its own run/artifacts; other GitHub operations remain
user-controlled. No commit/push, deployment, new paid service, dependency installation or external
orchestrator launch follows from verification permission. [RP-HBC-01](model-selection/routing-policy.md)
owns execution mode/isolation; test-runner workers are distinct from agent execution concurrency.

Preserve frozen/sealed bytes, provenance, fixture source/stage/build integrity and clean-package
reproducibility. Visual acceptance needs calibrated canonical comparisons plus temporal/state,
responsive, input, reduced-motion and keyboard/focus checks required by the feature. Screenshots,
stable parent geometry, installation receipts or model self-report cannot prove those behaviors.
Do not erase failed attempts, change thresholds to hide drift, or replace meaningful criteria with
generic build success. Keep normal fallback behavior distinct from simulated failure evidence.

## Review and results

Review every changed diff for correctness, maintainability, security, dependencies and acceptance
coverage, scaled to risk. Small mechanical changes can use focused self-review plus relevant checks.
High-risk state/motion, accessibility, trust-boundary, evidence-integrity, destructive or broad
architectural changes need independent review by a human or a separately tasked competent reviewer
before integration. Independence means a separate assessment, not a required different model family.
Use the approved execution mode for any reviewer agent; a pending review blocks integration, not
authorized preparation, implementation or checks. Record outstanding review explicitly.

Use native runner reports, traces, attachments and CI artifacts as the execution record. One concise
task/plan disposition links revision, inputs/configuration, commands/exit results, review, deviations,
remaining limits and next action. Native logs may retain model identity when exposed; unknown identity
does not replace behavior verification. Do not duplicate logs into qualification receipts or retry
journals. Required feature-level provenance/coverage aggregation remains necessary where native
reports cannot establish it.

## Existing commands

From the repository root (Node 24.19.0 is locked in mise):

```powershell
node --test --test-concurrency=1 --test-timeout=180000 skills/reference-reconstruction/scripts/test-capture.mjs skills/reference-reconstruction/scripts/test-settled-appearance.mjs skills/reference-reconstruction/scripts/test-assets.mjs
python implementation-scope/pre-build-packet/verify.py
```

`mise run repro:verify` invokes the same native Node suites; CI installs the committed skill test
dependencies, requires asset parser imports, verifies lock consistency and runs the packet checker.
Browser/font/media integration remains separately labeled when those host inputs are absent.
For installed browser integration, set `REFERENCE_PLAYWRIGHT_MODULE` to an
existing Playwright module directory and `REFERENCE_BROWSER_CHANNEL` to an installed channel. Asset
parsers resolve from the skill's declared installation. Do not install missing dependencies silently.
Serial suite workers preserve the demonstrated native-memory safeguard. The native three-minute
test timeout bounds host launch/shutdown stalls; feature readiness deadlines remain separate.
All skips must be reported.
Application commands remain prospective in the [home quickstart](specs/001-home-entry-fidelity/quickstart.md).

## Capability and redundancy audit

Audit boundary: tracked source/configuration across all phases, installed skill directories and
runtime entrypoints, session tool metadata and existing dependency declarations. Frozen references,
historical hardening/model/installation receipts and ProductShape recovery data remain historical.
This is a dependency/capability audit, not certification of every installed integration.
Discovery artifacts cover 121 global/project skill entries and 910 exposed tools by namespace;
advice overlap does not justify deleting distinct global skills or connectors.

| Phase / mechanism | Verified dependency or overlap | Disposition |
| --- | --- | --- |
| Agent routing/recovery | Native session tools and approved external runtimes already supply dispatch, isolation, logs and resource limits | Remove permanent agent ownership, vendor preference mandates, universal qualification lifecycle, family-switch counters and duplicated route receipts; retain task dependencies, isolation and checkpoints |
| Spec Kit skills/adapters/templates | Shared PowerShell core plus agent discovery adapters; skill and command formats differ | Retain supported adapters and installed manifests; point to the two authorities and require approved mode; installation defaults are not runtime selection |
| ProductShape | Installed 0.22.0 CLI exposes validate and recover-next/record/candidate/round; recover-start has no brief option | Retain extension, recovery data and bounded helpers: recorded custom-brief bridge fills a verified CLI gap; do not run historical mutation helpers as current verification |
| Reconstruction evidence/capture/assets | Playwright cannot supply evidence sealing, descendant readiness classification, bounded acquisition policy, parser checks or provenance/rights decisions by itself | Retain tested domain helpers and exact skill package/lock; standard parsers and browser APIs do the underlying work |
| Regression invocation | Node supports suite selection, reporters, exit status and serial workers natively | Remove run-tests.mjs subprocess wrapper; invoke node --test directly through package/mise tasks |
| Planned home browser execution | Playwright supports projects, metadata, outputDir, native JSON/blob/HTML reports, attachments, traces, retries and workers | Replace planned prepare-home-run/run-home-browser/session journal with one native invocation and unique run output; retain minimal feature provenance, completeness and calibrated comparison checks |
| Benchmark inspection | Inspect AI + Evals already provide task/scorer/log tooling; AgentCompass overlaps and historically has Windows limitations | Retain existing offline verifier/pins for unique smoke checks; make AgentCompass bootstrap opt-in; no benchmark tool is a production acceptance gate |
| Beads | Git history shows tracker removed; Cursor hooks still invoke absent bd | Remove orphan Cursor hooks; existing tasks/plan own work state |
| Reproducibility/workstation | Git history shows tooling shelf/bootstrap/verifiers deleted; mise and CI still invoke them | Remove dead tasks/aliases and pointers; keep locked Node/creative CLI capabilities and supply native checks in CI; no deleted infrastructure restored |
| Creative authoring/MCP/frameworks | Session exposes browser, Figma, Blender/Babylon and related tools; host packages/skills indicate options, not selected app dependencies | Retain optional capabilities; choose per accepted requirement and probe required integration before use; home keeps DOM/CSS/TypeScript without a renderer dependency |
| Installed global skills/connectors | Discovery entries overlap in advice, but have distinct phase/domain scope and live outside this repo | Retain installations; use relevant skills only, with canonical repo policy taking precedence; no account/plugin changes |

Established interfaces: [Node test runner](https://nodejs.org/docs/latest-v24.x/api/test.html),
[Playwright configuration](https://playwright.dev/docs/test-configuration),
[Playwright reporters](https://playwright.dev/docs/test-reporters) and
[mise tasks](https://mise.jdx.dev/tasks/). Custom code remains only for obligations these interfaces
do not implement. Historical observations and receipts are not rewritten by consolidation.

## Audit validation, 2026-10-09

The packet checker passes all 11 checks, including byte identity for all 481 reference files and
linked-document paths/anchors. Native integration regressions pass 41 tests with zero skips using
installed Chrome/Playwright, font parsers and FFprobe. The restricted browser attempt stalled and was
stopped; its log remains alongside the successful bounded host run. Native mise verification passes
25 tests with four explicitly skipped optional cases in its default profile; the full integration run
covers those cases. Node/Python/PowerShell syntax, JSON/TOML/YAML parsing, the installed Spec Kit
workflow graph and feature prerequisites pass. All 60 feature task IDs and feature criteria remain;
the roadmap gate, historical packet receipt, recovery data and sealed/frozen bytes are unchanged.
Mise lock dry-run reports no version changes; hosted CI has not run against these uncommitted edits.

The optional Inspect verification-only bootstrap fails closed: installed Inspect AI is 0.3.276 on
Python 3.12.15, but Inspect Evals/MCP and other snapshot dependencies are missing. Historical READY
receipts do not describe the current installation. No repair/install was performed; this optional
benchmark gap does not block repository hardening or website acceptance. External orchestrators and
creative/account integrations were inventoried, not launched or certified. Independent review of
this broad governance change remains pending before integration. No commit or push was made.

Local validation artifacts are under `artifacts/governance-hardening/` (ignored); the native reports
and dependency audit retain executed checks and limitations without another governance document.

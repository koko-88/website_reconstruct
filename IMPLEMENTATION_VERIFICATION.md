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
Native media checks require `REFERENCE_FFPROBE_PATH` and streaming test fixtures additionally require
`REFERENCE_FFMPEG_PATH`, each an absolute path to an existing trusted executable. PATH lookup is not
used. All skips must be reported.
Application commands remain prospective in the [home quickstart](specs/001-home-entry-fidelity/quickstart.md).

## Capability and redundancy audit

Audit boundary: tracked source/configuration across all phases, installed skill directories and
runtime entrypoints, session tool metadata and existing dependency declarations. Frozen references,
historical hardening/model/installation receipts and ProductShape recovery data remain historical.
This is a dependency/capability audit, not certification of every installed integration.
The earlier discovery artifacts recorded 121 global/project skill entries and 910 exposed tools by namespace;
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

## Historical governance-hardening validation, 2026-10-09

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

## Production engineering audit and corrections, 2026-10-09

This audit supersedes the session-status claims in the historical validation above. The user
authorized implementation after initially requesting an audit. Corrections are working-tree changes;
website delivery still requires ROADMAP admission. No dependency installation, commit, push, release,
account change or external orchestrator execution occurred.

### Scope and evidence boundaries

The inspected repository is `K:/website_reconstruct`, branch `main`, HEAD
`ede455c858f2944d0b532fe2442006d2b4924640`; the governance-hardening parent is
`66167f44921032afba4cd4519a4251ac3cdf4bfb`. Git history, active source/configuration, canonical
instructions, installed relevant skill/runtime source, specifications, native tests and connected
GitHub logs were examined. Frozen reference and historical receipts were used as evidence, not
rewritten as current policy. Initial local changes to `.gitignore` and the generated graph guidance
in `AGENTS.md` were accounted for. Root provisional package/lock/dependencies were preserved.

There is no tracked `app/` application, application package, runtime dependency graph, deployment,
or implemented website acceptance result to certify. ROADMAP lines 9 and 175â€“184 explicitly retain
the delivery gate; the home quickstart labels its commands prospective. Application state-machine,
accessibility, performance and browser-fidelity risks remain specified obligations, not observed
production defects. Tooling test success does not prove those obligations.

Architecture discovery used the connected code-review-graph first, then current source. Its twelve
communities include frozen/historical material; the snapshot was stale relative to these edits.
The latest-governance change scan reported 61 files and zero changed functions/risk, but churn lookup
timed out and callback-oriented JavaScript tests were missing from `tests_for` edges. Actual native
test files exist. Neither an empty edge query nor that risk score proves absence of defects.

Independent review is Qodo's authenticated review service, not this agent's self-review. The initial
deep review compares the governance parent with the working tree: operation
`9931ccc8-6c2c-4d0c-800c-ebc899450cb6`, local review
`6ef50134-8a3a-4f04-b421-8b8f141ac465`, retained in
`artifacts/production-audit/qodo-initial.json`. It returned eight findings. Its configured issue and
compliance reviewers completed, with safety-net coverage; skills/spec/UI/persona/cross-repo reviewers
were skipped. The service's complete flag applies to its submitted diff and enabled reviewers,
not repository-wide or visual certification.

A separate deep full-source review uses remote root commit
`157efedd6276b56304f219ec2d1a03b5d808dcc1` (containing only `reference/`) as the comparison
baseline, exposing active current files beyond the latest diff. Frozen reference, hardening history,
ProductShape recovery data and the archived skill shelf are excluded from the architectural claim.
Its operation is `846145a8-afd9-4df1-8b4d-65dc061823be`, local review
`7f46127d-2446-4224-a9f4-bd7ae6e6b2df`, retained in `artifacts/production-audit/qodo-architecture.json`.
It completed with eight findings but explicitly reports `coverage.complete=false`,
`analysis.reason=incomplete_input`, and warning `incomplete_coverage`. Issue/compliance reviewers and
safety net ran; the other five dimensions were skipped. This is independent architectural input,
not comprehensive independent certification. Historical-baseline review does not establish which
later commit introduced a finding. Six findings were confirmed, repaired and checked; two were
rejected with evidence below. Final review covers the complete intended correction diff.

Final review lifecycle: operation `f7cc0afc-24dd-4870-9d6c-85d854fd7745` introduced the subtitle
regression A19; full operation `baf112bc-ca2a-40eb-9889-009b16d0285f` introduced A20. Both were
reproduced and repaired with retained negative/positive evidence. Final operation
`18b851c2-1487-4d0d-ae36-cd6f9a2190fd` completed: deep, full mode (`delta_unavailable`), configured
diff coverage complete, issue/compliance and safety net ran, no skipped files/warnings and zero
current findings. Native result: `artifacts/production-audit/qodo-handoff.json`; checkpoint
`93bbf350739f46578cafcfc3c958c93f`, reviewed tree `78308cbb8051ddc25e564a751d8c4b6987824fc4`.
The five other reviewer dimensions remain skipped; the earlier broad architectural run remains
partial. This final disposition-only documentation update follows the reviewed source snapshot.

Qodo's final `finding_state.complete=true` ledger nevertheless retains seven `still_open` records,
with no `resolved` records: 7131a97e (A09), 9aaac979 (A03), 7022b070 (A02), 07c6b196 (A04),
965b384a (A08), aee3e1fe (A19), 6c84a48f (A20). These labels are retained, not silently dismissed
or presented as service-closed. Current source/native checks support the dispositions below; A08
remains a deliberately mitigated hosted integration gap. The current zero-finding assessment and
the retained ledger are different outputs. Another unchanged review would not establish closure;
the next integration review must inspect these dispositions. No PR finding was mutated.

### Confirmed findings and implemented dispositions

Severity is this engineering audit's assessment: P1 threatens evidence integrity or blocks a required
engineering gate; P2 causes workflow, reproducibility or maintainability failures; P3 is a bounded
documentation discrepancy. Qodo's `remediation_recommended`/`informational` levels are retained in
its native result and are not invented numeric severities.

| ID / severity / scope | Exact source and supporting evidence | Impact and disposition |
| --- | --- | --- |
| A01 P1, repository evidence/CI | `.github/workflows/reproducibility.yml`; `.gitattributes`; `implementation-scope/pre-build-packet/verification.json`; `reference/haunted-boulder-city-v2/rev-2.0.0-real-01/manifest.json`. Connected run 37911342897 fails byte identity and eleven sealed-manifest entries. Raw Git blobs versus recorded checkout bytes show twelve newline-only differences including preseal data. | Linux checkout changes sealed originals. Added native Git `-text` evidence default and twelve exact `text eol=crlf` exceptions; no manifest/digest normalization. New `implementation-scope/pre-build-packet/test_checkout.py` verifies both Git conversion profiles and rejects deliberate newline corruption. Fixed locally; hosted confirmation pending. |
| A02 P1, planned feature contract, not implemented runtime | `specs/001-home-entry-fidelity/contracts/verification.md` run identity; `tasks.md` T008/T033/T034/T040/T046/T051/T052â€“T058; `plan.md`, `quickstart.md`, `data-model.md`. Qodo 7022b070 identified preflight/calibration and successive invocations competing for the same output root. | Playwright cleanup could erase retained evidence or the proposed reuse guard could reject preparation. Corrected native `playwright/` and `reports/` children, sibling preparation/calibration/reviews, and a fresh ID for every checkpoint/final/diagnostic invocation. Final acceptance uses its own complete invocation; previous attempts remain linked. Runtime enforcement remains T008 future work. |
| A03 P2, current workflow | `.specify/workflows/speckit/workflow.yml`; `.specify/workflows/workflow-registry.json`; `LOGIC_VERIFICATION.md`. Qodo 9aaac979: analyze went directly to implement. Installed Spec Kit engine supports an existing gate type, pauses noninteractive gates and aborts rejection. | Material analysis failures could be followed by automatic implementation. Added native review-analysis gate requiring resolution and ROADMAP admission, registry/workflow version 1.0.3. Native workflow info recognizes eight steps. No custom verdict framework or workflow launch. |
| A04 P2, current CI/dependencies | `mise.toml`, `mise.lock`, `.github/workflows/reproducibility.yml`. Qodo 07c6b196: checker used runner-default Python outside the lock. | Reproducibility excluded a required interpreter. Locked existing Python 3.12.15 with platform URLs/checksums and invoked CI through mise. Existing installed 3.12.15 executed local regressions; lock dry-run unchanged. No interpreter was installed. |
| A05 P2, current CI coverage | `.github/workflows/reproducibility.yml` push/pull_request paths. Qodo 1244b5ae: `model-selection/*.md` excluded nested tooling inventory. | Governance/dependency changes could bypass CI. Changed to `model-selection/**` and included Git byte policy and active agent adapters. |
| A06 P2, planned task contradiction | `specs/001-home-entry-fidelity/tasks.md` T008 and parallel-opportunities text. Qodo db244d62: eliminated invocation helpers/journal were still mandated later. | Implementers could recreate deleted ceremony. Removed stale helper/journal/output-journal references and retained native reporting, task dependencies and serial shared writes. All sixty task IDs and metadata/acceptance/dependency lines preserved. |
| A07 P2, current instruction/capability mismatch | `AGENTS.md` generated graph block; graph tool freshness/test-edge results. Qodo 798498df: automatic hooks claimed without repository hook evidence and vendor-specific mandatory guidance in tool-neutral entry point. | Stale or unavailable graph output could be treated as authoritative. Condensed to conditional graph-first narrowing, freshness checks, source verification and documented fallback. Tool-neutral canonical ownership remains intact. |
| A08 P2, CI assurance gap, mitigated not eliminated | `.github/workflows/reproducibility.yml`; `skills/reference-reconstruction/scripts/test-capture.mjs`, `test-settled-appearance.mjs`, `test-assets.mjs`. Qodo 965b384a and connected hosted logs show 29 tests, 24 pass, five skips. | Hosted green tooling checks cannot prove browser/font/media integration. CI step/summary now explicitly scope NOT_RUN inputs and distinguish tooling from website acceptance. Existing installed local browser/font/media integrations pass 41/41 with zero skips. A required hosted integration profile is future approved work, not claimed complete. |
| A09 P3, current documentation | `implementation-scope/pre-build-packet/evaluation.md` final rerun instruction; `verify.py` output handling. Qodo 7131a97e: claimed the default updates historical verification.json. | Readers could mistake historical evidence for a fresh pass. Corrected to stdout-only default and unique optional artifact output; preserved historical receipt. |
| A10 P3, cross-document architecture | `model-selection/workload-profile.md` PRODUCT revision/stack description; PRODUCT revision 4, ROADMAP and home plan. | Workload description still cited revision 3 and said the target stack was unspecified. Updated pointers and planned HTML/CSS/TypeScript/Vite/Vitest/Playwright description while preserving unadmitted delivery. |
| A11 P2, optional workstation integration, unresolved | `model-selection/eval-tooling/bootstrap-benchmark-tooling.ps1:113`; `inspect-constraints.txt`; historical `inspect-verification.json` and tooling inventory. Fresh `-VerifyOnly` fails dependency-snapshot equality. Installed isolated interpreter reports Python 3.12.15, Inspect AI 0.3.276, Inspect Evals missing and MCP missing. | Historical READY is not present availability. Installation repair is deferred; no selected production dependency requires this optional benchmark suite. Runtime registry points here for current evidence. |
| A12 P2, active tooling, repository-wide source review | `skills/reference-reconstruction/scripts/page-probe.js:64`; `settled-appearance.mjs` visualSample. Qodo fcca8d18; a real scrolled fixture reproduces screenshot clipping failure before the fix. Installed Playwright's screenshotter uses viewport-relative clips. | Removed double-applied scroll offsets. Regression proves settling and actual red region pixels after scrolling; original failed run retained. |
| A13 P1, asset clearance integrity, repository-wide source review | `skills/reference-reconstruction/scripts/assets.mjs` loadRun/assessAssets; `asset-policy.mjs` fields only checked unknown keys. Qodo 4c6da3c0; sealed temporary imported run/review with matching omitted identities produced no exception before the fix. | Require valid nonempty run package/contract/source IDs, run/review phase, review scope IDs and canonical persisted asset URL identities before clearance. Regression rejects each missing scope on an otherwise correctly sealed fixture. Byte sealing alone never proves scope. |
| A14 P2, media integration, repository-wide source review | `skills/reference-reconstruction/scripts/asset-discovery.mjs` HLS/DASH discovery; `asset-policy.mjs`; `asset-verify.mjs`; `references/asset-acquisition.md`. Qodo 09642bd1: generic-MIME segments were discovered without usable kind. | Manifest-context segment/init/part references now use media-segment and existing FFprobe verifies standalone audio/video streams. Regression acquires a genuine generated MPEG-TS dependency with generic MIME. TypeScript paths remain unclassified as video. Initialization-dependent fragments are not supported by the standalone decoder profile; FFprobe failures remain failed, preventing external override. No full fragmented playback/DRM claim. |
| A15 P2, Spec Kit setup, repository-wide source review | `.specify/scripts/powershell/setup-plan.ps1` missing-template and existing-plan branches. Qodo 64d625b3: missing template created an empty plan and exited successfully. | Fail with an actionable error without creating a plan; also reject existing empty plans without overwriting them. Isolated native script fixture checks missing, valid-copy, existing-preserved and empty-rejected paths. |
| A16 P2, historical benchmark evidence, repository-wide source review | `model-selection/benchmark-verification/probe-vista-scorer.py` output handling. Qodo cdf21296: unconditional write could replace existing historical receipt. | Resolve and reject existing/canonical receipt destinations before source lookup; write exclusively with mode x. Native CLI test verifies exit 2 and unchanged existing bytes before unavailable prerequisites. |
| A17 P2, optional tooling evidence, repository-wide source review | `model-selection/eval-tooling/verify-tooling.py`; `bootstrap-benchmark-tooling.ps1` default output directory. Qodo deb7a915: shared temp filename and unconditional write could replace receipts. | Refuse existing/canonical outputs, use native unique temporary directories and exclusive writes; bootstrap also uses unique defaults and preflights selected receipt paths. Guard checks pass; default-output tests stub package checks and do not certify the missing benchmark suite. |
| A18 P2, global instruction conflict, outside repository corrections | `C:/Users/kerol/.codex/AGENTS.md` Global Output Policy requires final output only DONE and prohibits progress. This task explicitly requests findings and a Qodo tool list; host developer instructions require progress and a substantive handoff. | The global policy can suppress requested evidence when read without instruction precedence. No duplicate repository rule or global edit was created. Proposed smallest change for owner approval: allow explicitly requested deliverables and required host communication; retain concise DONE only for simple completed actions. |
| A19 P2, regression found by final independent diff review | `skills/reference-reconstruction/scripts/asset-verify.mjs` media-segment stream filter; `test-assets.mjs`. Qodo aee3e1fe: valid HLS WebVTT segments were rejected because only audio/video streams were accepted. Native fixture reproduces failed verification before repair in `subtitles-before-fix.log`. | Accept native verified subtitle stream metadata for media-segment too; preserve narrower audio/video checks for their respective kinds. Real WebVTT regression uses manifest-context discovery plus FFprobe and leaves initialization-aware fragmented playback outside this profile. Full final review repeated after this repair. |
| A20 P1, regression found by full final independent diff review | `skills/reference-reconstruction/scripts/asset-verify.mjs` FFprobe error handling. Qodo 6c84a48f: a filename/box-prefix fallback downgraded corrupt initialization failures to unverified, which external receipts could override. Native `init-before-fix.log` reproduces the downgrade. | Removed the fallback entirely. Native FFprobe failure remains failed for every media kind; regression supplies a matching external PASS receipt for truncated init bytes and still receives BLOCKED. No custom fragment parser was added. Initialization-aware fragmented-media verification is a remaining optional capability gap, not a repaired playback claim. |

Rejected independent suggestions are not hidden or automatically implemented:

- Qodo 0874a6d7 claimed fragment-bearing verification receipt URLs fail lookup. Native acquisition
  persists canonical fragment-free asset URLs, and the existing receipt insertion strips fragments.
  A regression adds a fragment to the receipt URL against the acquired asset and still passes without
  changing receipt lookup. Noncanonical imported asset URLs are now explicitly rejected with A13.
  The reported native-run failure was not reproduced.
- Qodo 540eba42 claimed the v2 reference tree was missing. It was excluded from the root-baseline
  review upload and absent from that old base, but exists in the audited checkout and tracked HEAD.
  Native Git history dates its introduction to `a4e3c93e1915ffdb5c8d0ca3dafe9c471fb599ba`;
  all eleven current packet checks pass. This is a review-input limitation, not a repository defect.
  No evidence tree was added, gate weakened or digest rewritten to appease the finding.

The latest hardening already removed stale Beads/Cursor hooks, dead workstation wrappers, permanent
agent ownership, repeated qualification/retry receipts and the Node subprocess test wrapper. Git
history verifies those removals; restoring them would reintroduce duplicate mechanisms. The current
task/document leftovers above were the remaining concrete contradictions identified in that diff.

### Architecture, dependencies and mature replacements

The maintainable boundary is canonical product/roadmap/spec intent â†’ feature plan/tasks â†’ a future
independent `app/` package â†’ native engineering evidence. Constitution owns non-negotiable policy;
PRODUCT and ROADMAP own their separate product/decomposition domains; the two verification files
own logic versus runtime verification. Thin adapters consume those authorities. A generated adapter,
skill inventory, historical receipt or retrieval rank cannot introduce another authority.

| Mechanism | Existing replacement or retained dependency | Evidence-based decision |
| --- | --- | --- |
| Subprocess runner, retry/session journals, repeated routing receipts | Node test runner; Playwright projects, reports, traces, attachments and metadata; task/plan checkpoints; native approved runtime/worktrees | Keep native execution and one feature-level completeness/provenance validator. That validator retains obligations native reports do not establish. No new tracker, launcher or reviewer scheduler. |
| Byte-policy repair in custom hash checker | Git attributes and existing immutable manifest checker | Repair checkout representation rather than accepting normalized evidence. The checker still compares original bytes and refuses overwriting historical receipts. [Git attributes](https://git-scm.com/docs/gitattributes) document text/eol conversion. |
| Bespoke analysis approval protocol | Installed Spec Kit native gate | One gate in its owning workflow; no duplicate governance document. The integrations list is advisory/nonexhaustive in installed code, so missing Codex in that list was not treated as an execution defect. |
| Project toolchain bootstrap and hand-maintained runtime receipts | Existing mise platform lock and committed skill npm lock | Add required Python to the existing interface. [mise lock](https://mise.jdx.dev/dev-tools/mise-lock.html) supplies resolved versions/checksums. Root ignored npm tools remain provisional; future app must prove isolated clean-checkout resolution. |
| Planned browser wrappers and reused output roots | Native [Playwright configuration](https://playwright.dev/docs/test-configuration) and [reporters](https://playwright.dev/docs/test-reporters) | Use native projects/reporting under unique invocation IDs; thin feature input/result validation remains necessary. |
| Reconstruction capture/acquisition/package helpers | Existing Playwright/browser APIs plus exact skill parser dependencies in `skills/reference-reconstruction/package.json` and lock | Retain `capture.mjs`, `package.mjs`, `asset-policy.mjs`, `assets.mjs`, `asset-verify.mjs`: sealing, descendant readiness, bounded acquisition and rights/provenance policy are domain obligations ordinary screenshots do not establish. No evidence justifies replacing them wholesale. |
| ProductShape recovery helpers | Installed ProductShape 0.22.0 deterministic validate/recovery commands | The recorded custom-brief bridge fills an inspected CLI gap. Historical `continue.mjs` imports ignored `node_modules/.cache/prodshape-recovery-bridge.mjs`, so it is not a clean-checkout production entrypoint. Preserve as historical recovery; do not run it as verification. A future selected recovery requires a freshly reproducible dependency boundary. |
| Overlapping project/global skills | Existing canonical sources and vendor skill invocation | Advice overlap alone does not establish redundant functionality. Retain distinct installations/adapters; select only required skills. Figma/Blender/Babylon/Claw exposure is not product scope or live certification. |

Global Qodo and plugin copies of codebase-wisdom/review/review-resolver/setup report matching versions
(1.1.5/1.10.7/1.4.7/1.0.9). Their compared differences are distribution/embedded metadata and host
provenance flags, not competing project rules. The plugin selected by this task owns those invocations;
global get-rules supplies a separately available capability. No global skill uninstall/update is
justified by duplicate discovery labels alone. Installed skill sources are outside this repository.

No confirmed deployed-site defect or external dependency consumer was inferred from an absent app
or an empty search. Potential future fixture supply, browser qualification, calibration, app isolation
and clean package/build integrity are explicit blocked acceptance prerequisites in the existing
feature contract; they are not fabricated successful capabilities.

### Confirmed CI and available integration limits

[GitHub run 37911342897](https://github.com/koko-88/website_reconstruct/actions/runs/37911342897),
job 113756964637, is a push run at the audited HEAD, dated 2026-10-09 09:27 UTC. Locked-tool installation,
lock freshness, npm ci, parser import and tooling regressions passed; evidence verification exited 1.
Expected reference digest was `5df9ef1328726e4bd7a6f6284c1216c351997c97482b6e6c5b0eead2f28412f9`;
Linux checkout produced `ca7fae1f7ccbc2052008e7c4031f8fc4d3882c61630902894d5181a356514570`.
The fetched excerpt is `artifacts/production-audit/ci-failure-excerpt.json`.
The commit-workflow connector's PR-only query returned empty; the generic connected run endpoint
and job/log tools supplied the push-run evidence. Empty PR-only output was not treated as no CI run.

Qodo CLI 1.4.0 is installed and authenticates in the host context. Restricted-shell keychain failure
was resolved by the skill's exact read-only host-auth check, not by login or reinstallation.
Connected codebase listing/commit/file reads succeeded at pinned HEAD. Pull-request history stats
failed `MT-UPSTREAM-DOWN` (`context-retriever unreachable: ConnectError`), limiting independent
historical PR intelligence. Cross-repo relations returned an empty list; no cross-repo independence
is established. Rules searches returned no applicable rules after the bounded structured retry;
no invisible organizational standards were invented. Review-resolver was inspected for suitability
but not invoked because no existing PR review was the task.

Current session metadata exposed 940 tools when inventoried, not the historical 910. Availability
does not prove service reachability, paid-route permission or native hook freshness. Four agent slots
were exposed but execution stayed sequential and no reviewer agent was spawned. Creative tools,
external orchestrators and account integrations were not launched/certified. Benchmark dependency
repair, website runtime verification and hosted CI on these uncommitted edits remain NOT_RUN.

### Verification and remaining approval sequence

Executed evidence retained under `artifacts/production-audit/`:

- `logic-final.json`, `logic-after-corrections.json`, `logic-final-handoff.json`: all eleven packet checks PASS; all 481 original reference files retain the
  exact immutable digest. No reference file, receipt, PRODUCT, ROADMAP, constitution or feature
  acceptance requirement changed.
- `integration.log`: initial existing tooling integration, 41 tests PASS. `regressions-before-fix.log`
  retains the two reproduced failures; `integration-final.log` has 44 tests PASS, zero failures/skips,
  after the source repairs. After the subtitle/init safety repairs, `assets-after-media-safety-fix.log` verifies all eighteen affected asset tests with zero skips. Existing Chrome/Playwright, Arial, declared parsers, FFprobe/FFmpeg;
  native Node invocation, serial suites, 180-second bound. A test's initial pixel assertion sampled
  the blue child; it was corrected to sample the red region edge and the failed attempt retained.
  `integration-handoff.log` reruns the entire final source snapshot after both media repairs:
  44 PASS, zero fail/cancel/skip, approximately 36 seconds. This is tooling integration only.
- Native checkout unittest: two tests PASS under existing Python 3.12.15 and system 3.14.3;
  both `core.autocrlf=false/true` profiles restore the original bytes; newline corruption fails
  digest equivalence. This uses Git's filter engine, not a hosted Linux rerun.
- `mise lock --dry-run --json`: no changes; installed Spec Kit `workflow info speckit`: eight
  steps including the review-analysis gate; feature prerequisites succeed. Sixty unchecked task IDs
  and all sixty companion metadata/acceptance/dependency lines are unchanged. `git diff --check` passes.
- Optional benchmark VerifyOnly fails closed as A11 records; no repair or install was attempted.
- `receipt-guards.json` and `plan-setup-checks.json`: existing-receipt preservation, distinct default
  outputs and four native plan setup paths pass in temporary fixtures. Mocked package declarations
  in the unique-output test are explicitly synthetic, not installed capability evidence.

Smallest remaining coherent sequence for approval:

1. P1: integrate the reviewed byte-preserving changes through the normal authorized commit/PR path
   and run the existing hosted CI against that exact revision. The local fix does not certify a
   yet-unexecuted hosted run; keep failed run evidence.
2. P2: if hosted browser integration must gate tooling changes, approve a separately labeled job
   using the existing committed dependency boundary and an explicit browser/font/media profile.
   Do not expand workstation bootstrap or call skipped checks acceptance.
3. P2, only when benchmark work is selected: approve reconciliation of the existing Inspect snapshot
   or deliberately revise it, then run its native verification. Do not reinstall blindly.
   If initialization-dependent streaming acquisition is selected, qualify an initialization-aware
   native decoder profile with original byte bindings and corrupt/valid controls; current standalone
   FFprobe failures cannot be overridden to supply that missing capability.
4. Product delivery: review and advance ROADMAP explicitly, then execute existing R-001 tasks in
   `app/` with actual fixture supply, calibrated comparisons, native output configuration and
   independent implementation/visual review. Do not create another governance framework or infer
   website readiness from this tooling audit.

### Qodo skills and tools actually used

Applied skills: plugin `qodo:qodo-codebase-wisdom` 1.1.5 and `qodo:qodo-review` 1.10.7 from
`C:/Users/kerol/.codex/plugins/cache/openai-curated-remote/qodo/2.0.13/skills/`; global
`qodo-get-rules` 1.1.5 from `C:/Users/kerol/.agents/skills/qodo-get-rules/SKILL.md`.
Plugin `qodo:qodo-review-resolver` 1.4.7 was read to assess applicability, not executed. Setup,
manage-standards, PR mutation/resolution, login, installation and skill updates were not invoked.

Qodo CLI operations used (all via the existing absolute `qodo.cmd`, with matching provenance flags
on connected skill commands): `--version`; `read whoami --json`; `read tools` discovery for
`codebase`, `pull-request`, `cross-repo`, `rules`; `read codebase ls`, `get-commit`, `read-file`;
`read pull-request stats` (unavailable); `read cross-repo relations --shallow`; `read rules search`
with structured primary/cross-cutting searches and bounded broadened retry; `review --help`;
`review --base â€¦ --deep --async --json --context-file -`; full-source variant with `--full` and
pathspec exclusions; `review status <operation-id> --json`. Submission success is not review completion.

Other connected evidence tools used: code-review-graph `get_architecture_overview_tool`,
`list_communities_tool`, `detect_changes_tool`, `get_review_context_tool`, `query_graph_tool`,
`get_affected_flows_tool`; GitHub commit-workflow discovery, generic fetch, workflow run jobs and
workflow job logs. Native Git/source inspection and Node/Python/Spec Kit/mise checks verify their
results. Graph tools and GitHub are separate integrations, not Qodo tools.

## Creative Production integration, inspected 2026-10-12; finalized 2026-10-13

Scope: [CP specification](specs/creative-production/spec.md), [plan](specs/creative-production/plan.md)
and [tasks](specs/creative-production/tasks.md). Inspection base:
`7a6236880f2e7579ac4af534d67444821b4c0d8c`. Work is local/uncommitted. HBC delivery,
Reference Intelligence and frozen reconstruction evidence are outside this change.

### Decision

Creative Production is operational on this device for the tested profiles: five selectable source
packages, agent discovery/routing/skill adapters, maintained original browser instruments and the
immersive SHIFT reference under projects/. All 18 selected packages, 15 routed skills and seven
native entrypoints resolve; actual workflows below establish more than discovery. No required
local workflow is blocked. Independent review coverage remains incomplete; hosted CI and the
optional provider/runtime workflows below remain unverified. Future projects select their required engine peers and own their art,
assets, budgets and final visual acceptance.

The user selected [WebLoved](https://www.youtube.com/@WebLoved) as the visual ambition target.
First-party browser inspection included [assembled/close-up/exploded product states](https://www.youtube.com/shorts/vd8IE8Cl4Jc)
and [scroll-driven scene presentation](https://www.youtube.com/shorts/VwFlsB1dqRw).
The [authoring contract](skills/creative-production/references/authoring.md) requires a storyboard,
signature interaction, coherent typography/materials/light and actual browser visual review.
SHIFT implements original exploded glTF, a moving camera, shader particles, outlined type and
responsive/manual chapters. Neither a video nor functional tests prove channel-wide visual parity.

Workstation: Xeon E5-2697 v4 (18 cores/36 threads), approximately 32 GB RAM, NVIDIA Quadro P2000
with 5,120 MiB VRAM (nvidia-smi; WMI underreported memory), driver 582.78, Windows 10 Pro 19045.
Native Blender 5.2.2 LTS, KTX 4.4.2, glTF Transform 4.5.1, gltfpack 1.3.0 and FFmpeg/FFprobe
7.1.1 were exercised; Node 24.19.0/npm 11.17.0 ran checks. Inspection covered development tools
and relevant installation locations, without crawling unrelated private files/accounts.

React 19.3.0, Three 0.186.1, Fiber 9.8.1, Drei 10.7.9, react-three/postprocessing 3.2.0,
postprocessing 6.39.5, GSAP 3.15.0, Motion 12.43.0 and PixiJS 8.22.0 are selected in the
maintained consumer. Postprocessing constrains Three to <0.187. Provisioned tools and mature
skills were reused. Existing mise/Storybook edits and dirty attached worktrees remain intact.
Only missing ImageMagick was installed, under the user's explicit repair authorization:
7.1.2-33 from the existing Scoop manifest, checked installer SHA256
`e5f1e14f8520b3720e626185700489fe4267026611834d74fbf4cd598ffa0788`.
Original SVG -> 480x480 decoded WebP passed. Existing Codex processes need the installation
directory on PATH and its native module environment; a new process inherits the repaired user
environment. The failed first DLL lookup and successful configured run are retained.
No existing workstation capability was reinstalled; no paid generation, deployment, commit or push.

### Executed workflows

Artifacts are under `artifacts/creative-production/`; ignored native reports are local evidence.

| Capability | Result and practical boundary |
| --- | --- |
| Discovery/routing | Registry separates engine peers, native tools and MCP probes. discovery-final-verified.json resolves 18 packages/15 skills/seven native entrypoints; 481 creative/input tools are exposed, not individually certified. Session metadata contains 1,168 total tools, with 533 creative/review entries retained in mcp-inventory-final.json. |
| Agent access | Canonical creative-production skill and thin Codex/.agents, Claude, Cursor, Cline and OpenCode adapters. Existing UI UX Pro Max/GSAP/Pixi guidance reused. Skill format validates; actual design-system and motion/accessibility searches return results. |
| Engine selection | DOM-only scoped installation used two packages, with React and no Three/Pixi. Assets-only scoped installation used nine packages without React/Three/Pixi; its current 16 asset checks pass (final-assets-only-ownership-tests.log). The asset package has no renderer peer. KTX production explicitly selects Three-compatible decoder bytes or CREATIVE_BASIS_SOURCE_DIR. |
| GSAP/Motion | Scoped useGSAP cleanup, reversible ScrollTrigger and Motion transitions. Pause preserves pose. Standalone SHIFT resets public scroll restoration memory before trigger creation/resume; eight uninstrumented reduced-motion repetitions and the complete final suite pass. No per-frame React state. |
| Three/R3F/Drei | Original loaded GLB, live shader, material/orientation/orbit controls, optional bloom and KTX2. Eco disables/unchecks Bloom; High exposes the actual selection. The isolated High-without/with-bloom pixel check passes in all three profiles. Instance materials are disposed; loader geometry stays cached. Readiness covers delayed model replacement, selected texture loading, failures and lost context. |
| Immersive reference | /showcase.html consumes reusable SceneJourney: camera/material progression, exploded four-mesh sculpture, deterministic 1,200/2,800 shader points and optional bloom. Quality replaces/disposes owned geometry. Native/manual/reduced/pause/offscreen/loading-time loss pass. Manual visual review led to a text scrim and accurate static-view instructions. |
| PixiJS v8 | Private capped ticker, pointer/keyboard orientation, spread, resize, remount, partial-init rejection and context-loss cleanup. Rotation is centered. WebGL selected; WebGPU/Canvas untested. |
| Blender/glTF | Separate factory-startup headless exporter preserves the live scene. Maintained original .blend/raw GLB and dedup pipeline. Served GLB: 67,720 bytes, four meshes, 4,688 triangles, no required extensions. Native gltfpack -noq alternative: 90,252 bytes, one mesh, 4,688 triangles. |
| Images/texture assets | Original SVG -> WebP/AVIF 480/960/poster, hashes/attribution, 20-million-pixel decoded cap and 64 MiB streamed encoded-source cap. Hashes bind the captured image/texture bytes; media uses an owned input snapshot. File hashing streams: an independent 256 MiB fixture digest matched, with measured RSS growth 73,670,656 bytes (hash-stream-profile-verified.json); this sample is not a universal memory guarantee. KTX2 is mipmapped UASTC/Zstd, 22,966 bytes, with local hashed Basis JS/WASM and Apache-2.0 LICENSE/NOTICE. Real directory-link/source isolation and decoder-source separation checks pass. |
| Export failure preservation | All profiles stage outputs/provenance before publication. One small Node filesystem helper prepares all same-filesystem replacements/backups, renames each file and rolls back earlier replacements if a later rename fails; failed recovery retains backups and reports paths. Single local writer only: no multi-file crash transaction or concurrent-writer claim. Real blocked image destination, invalid optimized GLB, obstructed decoder destination, invalid media source and incompatible probe preserve prior served bytes/provenance. Model failure also preserves the original saved blend/raw GLB. Existing output links and colliding destinations are rejected. Static GLB inspection rejects empty/orphan geometry, malformed/out-of-range indices and nonfinite positions; this bounded inspector is not a full glTF specification validator. Intermediate encoder PNG is outside public and removed in finally. |
| Native verification | Portable routing/assets 19/19 (portable-handoff-final.log). Selected Blender/glTF/KTX 2/2 (native-ownership-corrected.log). Native media/browser 1/1 (media-metadata-final.log), including successful regeneration, failed-source/probe preservation and final Chrome playback. Selected native suites fail clearly if tools are missing and do not install or skip them. |
| Media | Original 321x181 FFV1 -> even 320x180 H.264/yuv420p, muted/faststart, FFprobe metadata/full decode and Chrome readyState 4/currentTime >0.1/error null. Width <=1280, duration <=30s, network protocols excluded. Inherited metadata/chapters are removed; bounded FFprobe fields and basename-only filenames avoid log truncation and builder-path disclosure. A source comment exceeding 16 kB verifies this correction. Audio mastering/streaming/DRM outside profile. |
| Browser/GPU review | Complete repaired-final/browser.json: 48 expected, zero unexpected/flaky/skipped, browser-repaired-final.log. The subsequent test-only stronger Bloom comparison passes 3/3 (bloom-isolated-final/browser.json); frontend source is unchanged from the full suite. Spector loaded instrument/SHIFT, captured five calls/two programs/no GL errors at Eco and returned shaders; fresh repaired-session WebGL2 context responds. Its duration field was not treated as GPU timing. |
| Performance | Actual ANGLE NVIDIA P2000/D3D11, native draw interception: instrument/SHIFT High+bloom 22 calls per sampled frame, approximately 59.9-60.7 sampled display FPS. Reduced profiles zero continuous draws. Short samples do not prove sustained throughput, physical mobile or whole-site Core Web Vitals. |
| Accessibility/responsive | Axe across disciplines/SHIFT, keyboard navigation/sliders, narrow/touch/reduced, no horizontal overflow, pause/live preference/offscreen/resize/fallback. GPU-only pose comparison isolates DOM; measured two pixels by one 8-bit level, bounded to <=10 pixels/<=1 level. Failures/traces retained. Background visibility is simulated; real background tabs, screen readers, physical devices and Safari/Firefox untested. |
| Bundle/reproducibility | TypeScript/Vite pass. Initial instrument JS about 158 kB gzip, CSS about 2.4 kB; Three 211.2 kB/spatial 105.5 kB gzip optional. Initial motion HTML does not preload engine/model/decoder. Fresh scoped lockfile npm ci installed 127 packages in about 50 seconds (final-clean-install.log); build passed. Current-source clean verification passes 19/19 (final-clean-handoff-check.log), separate from root provisioning. Earlier extraction stalls and the subsequent successful clean attempts are retained. |
| Preservation | Reconstruction 46/46, zero skips (reconstruction-full.log); unchanged initial ten-second media fixture timeout retained. Git diff confirms reference, reconstruction skill, constitution, PRODUCT, ROADMAP and LOGIC_VERIFICATION unchanged. Packet 11/11 PASS: 481 reference files/identical tree hash (logic-handoff-final.json), including the final pointer check. |
| CI | Authored/read-only ubuntu-24.04 workflow: scoped install/build/portable checks, probe or repair missing FFmpeg, installed official Chrome H.264 playback after browser dependencies, software Chromium rendering and pinned official upload-artifact v7.0.2. YAML validates. Hosted NOT_RUN: no push. Software GPU is not workstation performance certification. Runner/codec choice follows [official runner inventory](https://github.com/actions/runner-images/blob/main/images/ubuntu/Ubuntu2404-Readme.md) and [Playwright codec guidance](https://playwright.dev/docs/browsers#media-codecs). |

### Local integration repairs and optional boundaries

- Live Blender now responds: addon up-to-date, protocol 13 matches, Blender 5.2.2; scene inspection
  and read-only Python execution pass. Started the existing enabled auto-starting add-on, without
  preference changes or replacing a scene. Libraries/generators are off; telemetry remains false.
- Polypane now responds at loopback 5858, using its [documented startup flag](https://polypane.app/docs/mcp-server/).
  SHIFT renders ready in existing panes at 1280x800, 500x766 and 320x567 without horizontal overflow.
  Electron rejects Chrome Target.createTarget/createBrowserContext; guidance uses existing pane IDs.
  This is an API limitation, not an unrepairable disconnected endpoint.
- Chrome DevTools isolated page and screenshot pass. Both browser MCPs save to permitted OS-temp
  paths; authorized filesystem copy retains chrome-mcp-final.png/polypane-mcp-final.png. Their
  client-negotiated roots exclude the repository; path protections were preserved.
- tooling/creative/start-workstation.ps1 reuses listening Blender/Polypane endpoints and refuses
  to restart existing applications. Launch alone is not health certification. Re-probe each session.
- Figma authentication, Higgsfield 3D model catalog and Firecrawl public documentation retrieval
  respond. Optional inputs route through their installed skills. File authoring, provider generation,
  payment/entitlement expansion and publishing are unselected/NOT_RUN.
- All seven Babylon graph-list backends responded; current MCP package is 9.30.0 while the
  separately provisioned mise CLI is 9.28.0. No Babylon consumer was selected. Graph export/runtime
  rendering is untested and no engine is added to future projects by default. Live schemas/version
  must be re-probed when selecting one; these distinct tool installations do not change Three peers.
- Code-review graph was incrementally updated to inspection HEAD with no errors. Its tracked
  source scope does not certify the new untracked Creative Production files; source/tests/Qodo
  supply their assessment. No embedding/provider installation was requested.
- Future Next.js/server consumers need client boundaries and suitable transpilation/dynamic loading;
  only maintained Vite consumers are tested. Native computer UI control is disabled in this session;
  browser MCPs, CLI export and Playwright provide the verified paths.

tool-repair-health.json, discovery-final-verified.json, imagemagick-installed-manifest.json,
imagemagick-repair-install.log and imagemagick-path-repaired.log retain the repair evidence.
Original failed attempts remain alongside successful checks.

### Independent engineering review

The user approved the private Creative Production payload/destination after automatic approval
review rejected its initial submission. Existing authenticated Qodo CLI 1.4.0 was reused.
Issue/compliance reviewers ran at checkpoint/auto-final depth. Reviews repeatedly report
incomplete_input/coverage.complete=false; skills/spec/UI/persona/cross-repo reviewers were skipped.
Binary/large omissions are upload limits. This is independent issue review with explicit incomplete
coverage, not clean or comprehensive certification.

Retained operations and current-source dispositions:

- f1b00971-b1e4-4e7b-9f44-ef222cc2d8c3: partial Pixi initialization cleanup, GSAP paused pose
  and nested source-output checks fixed. Texture routing clarified. Missing GLB/KTX/WASM findings
  were uploader omissions; actual bytes/hashes/loading verified.
- 4e4107b7-3cfb-46d4-afa3-af3009ba7ea4: pivot, texture/media source isolation, model/lost-context
  readiness and Chrome alias fixed. Timer-leak claim rejected against clearTimeout on close/error
  and a real prompt-exit regression.
- 14520fee-216a-43dc-9637-d3004c0980b3: requested texture readiness, glTF CLI override and
  discipline hash navigation fixed with functional regressions.
- b77d42f6-0e1e-41ef-9620-98e1e05cd219: slider consistency, queued hash cancellation and pixel
  caps fixed. Missing-poster claim was binary omission; actual decode/provenance verified.
- 9f5e4457-446e-40c0-b926-718496bc4450: loading-time context listener and odd-size media fixed.
- d83bc155-6cb4-4901-85ba-ec63ac041d46: directory-link isolation and CI media coverage fixed.
  Independent minimal-install checks also exposed/fixed the optional Three peer leak.
- c2681fc4-7efd-4043-aa82-ab9076540e73: public intermediate PNG moved to checked OS-temp with
  finally cleanup; rejected encoder regression and actual texture regeneration pass.
- b2ada6d6-eeda-4a17-81e4-29e1cc7df625: media failure preservation and CI browser decoding fixed.
  Native source/probe failure, successful replacement and real playback checks verify it.
- 3f3768b0-ff69-4322-ac29-9478a8f559d3: image/model/texture failure publication confirmed and
  fixed together by validated staging and shared bounded publication; portable/native checks pass.
- aeb942ff-2da0-48c5-966e-bc98dc2717c0: colliding texture/decoder outputs and Bloom control
  truthfulness fixed; collision preservation and High/Eco browser controls pass.
- 38d01772-0d59-4b36-a06c-b8ef9e8b653b: media filename privacy, empty GLB acceptance and strict
  MP4/KTX2 suffixes fixed with portable/native regressions.
- aa149deb-2d13-43b1-8d3b-ae7f2341098a: streamed hashing and absolute regular-file discovery
  overrides fixed. Invalid overrides do not silently fall back; the 256 MiB hash sample passed.
- a6f1d31c-65ca-4563-a928-36481a754de3: index validation, existing output-link preservation,
  owned process-tree termination and exact captured source bindings fixed. Timeout regression
  verifies a descendant writer stops before return. POSIX uses an owned process group; Windows
  awaits taskkill and child close. If termination cannot be confirmed, staging is retained and
  its location reported; processes that escape the owned group are outside this tool contract.
- 0d7f4e64-e5e7-4764-91a9-004d7eef2d94: collected in qodo-ownership-collected.json. New finding
  63daf373-642f-4845-9804-c3651cd3b8d1 identified FFprobe JSON truncation on large inherited
  metadata. Final correction strips inherited tags/chapters and requests bounded probe fields;
  real >16 kB source metadata, full native decode and Chrome playback pass. This final correction
  and the stronger Bloom test were not subsequently submitted to Qodo.

Qodo's server ledger also returns historical out-of-scope HBC/reconstruction/governance findings
and older Creative Production records despite fixes. They were not remotely dismissed. Those
historical records do not authorize changing frozen contracts or expand this task; current-source
dispositions above and preserved evidence distinguish resolved issues, upload omissions and backlog.
All submitted operations were collected and their relevant current-source findings dispositioned.
The repeated review loop is closed for this local handoff. Incomplete independent coverage and
the final correction's absence of subsequent independent review remain explicit limitations;
no clean-review, hosted-CI, deployment or HBC delivery certification is claimed.

### Handoff

CP-T01 through CP-T07 are complete for the selected local capability scope. Future applications
belong under projects/ and route through tooling/creative/capabilities.json. Run
`npm run creative:dev` for the instrument and /showcase.html; the retained production preview
is at http://localhost:4173/showcase.html. Use creative:route before selecting engine peers,
creative:check for portable checks, creative:test for browser acceptance and the documented
creative:verify-assets/creative:verify-media commands when selecting native production.
The standalone maintained Blender exporter stages its own script/blend/raw outputs; arbitrary
exporters with relative imports or external files need an explicit source profile. Snapshotting
media needs temporary disk space for the full input. Original source, derived bytes, provenance,
failure traces, screenshots and verification logs remain available locally. Final git inspection
preserves unrelated provisioning/worktree changes; no commit, push or deployment was performed.

## Creative Production Skill Hardening, 2026-10-13

Scope: CP-H01 through CP-H05 in the existing specification/plan/tasks. This historical hardening inspection used the
attached C: worktree of the K: repository at its branch snapshot, with earlier dirty work preserved.
Its original-pipeline backlog describes that snapshot; the merge reconciliation below owns current status. This task changes authoring instructions, skill metadata/routing and review tooling;
it does not create a website, replace rendering engines, or implement autonomous self-refinement.

### Integrated capability and differential

The [canonical skill](skills/creative-production/SKILL.md) now loads only the relevant guidance:
[direction](skills/creative-production/references/direction.md),
[scene score and motion](skills/creative-production/references/story-motion.md),
[asset continuity](skills/creative-production/references/asset-continuity.md),
[specialist handoffs](skills/creative-production/references/composition.md), and
[visual/temporal review](skills/creative-production/references/visual-review.md).
The concise [source map](skills/creative-production/references/source-map.md) records adopted,
already-present and rejected capabilities against the exact supplied sources/pinned revisions.

Read the supplied WebLoved workflow's complete auto-caption transcript and representative visible
frames. Integrated image-grounded direction, consistent subjects, causal sequence, easing/landing,
receiving-surface shadows and precise feedback. Scroll Craft's feeling/uniqueness/device/verification
guidance and engine/harness were inspected: reuse the principles, not its coupled device runtime,
global fingerprint mandate, KIE provider or universal photographic/continuous-scroll style.
Reuse installed UI UX Pro Max/Frontend Design and GSAP/Pixi specialists. Current upstream UI UX
data differs from the working installed version; no blind update or broader provider suite install.
Project purpose, approved brand, truthful content and accessibility resolve conflicting advice.

Routing adds Frontend Design, GSAP timeline/utils, existing Sharp review support and direct guidance
pointers without adding dependencies/engines. `creative:discover -- --consumer projects/<name>`
resolves selected workspace-local peers and never executes their modules. Thin Codex/.agents,
Claude, Cursor and OpenCode descriptions now expose the richer trigger; Cline keeps its canonical
pointer. The refreshed app skill catalog reflects the updated repository adapter.

Read-only Higgsfield search/model constraints responded; ordinary model versus named preset
handoff is explicit. Its website is not a tool schema. Built-in imagegen transparency and the
exposed Canva cutout schema for an already-uploaded MEDIA are selected alternatives; no callable
Higgsfield background-removal tool was found. No generation, identity training, private-account
inventory, external asset upload or paid entitlement was exercised. Provider/input/spend approval
is explicit, and source rights/identity/alpha/contact anchors must be inspected after production.

### Fresh functional evidence

Evidence directory: `artifacts/creative-production/skill-hardening/` (ignored local artifacts).

| Check | Result and boundary |
| --- | --- |
| Reproducible provisioning | Missing current-worktree node_modules restored with the existing scoped root lockfile: 127 workbench/assets packages. Existing locked reconstruction tool package restored separately: 37 packages. No version/dependency change or workstation reinstall. Logs install.log/reference-install.log. |
| Official Skill Creator format | Canonical skill and all three skill-shaped adapters validate with the installed quick_validate.py. Main instruction body remains under 500 lines; specialist manuals are not copied. |
| Availability/routing | discovery-final.json: 19 selected modules/18 routed skills resolve, and 521 relevant exposed tool names including optional Canva. Resolution root is the selected workbench. Installed/exposed is not health/generation/runtime certification. |
| Portable integration | 32/32, zero failures/skips: portable-delivery-final.log. Includes existing 14 asset tests, five routing/discovery tests and thirteen capture-review tests. Source identities, hard links, actual filesystem case aliases, regular-file/byte/pixel bounds, semantic crop/state equality, alpha-only changes, intended holds, reverse and unchanged originals are checked. |
| Real browser review integration | 1/1: contact-sheet-complete-final.log. Ten real existing-SHIFT desktop/manual/reverse and mobile/reduced captures -> labeled decoded sheet/report with original hashes. Source build HTML hash and actual capture metadata retained. No new site. Captures under captures-final-handles-complete-20261013/; humanApproval remains pending. |
| Existing workbench | Build/TypeScript pass (build.log). Isolated complete browser suite 48/48, zero failures/skips (browser-isolated.log; skill-hardening-browser-isolated/browser.json). First full run was 47/48 with a reduced-motion resume failure; three isolated repetitions and the isolated full suite pass unchanged frontend source. The initial trace is retained; no root cause or permanent-fix claim. |
| Reconstruction preservation | Native existing regression 46/46, zero failures/skips (reconstruction-native.log). Initially scoped install yielded skipped coverage, then sandbox capture timed out; attempts retained. Explicit local Playwright/font/FFmpeg paths and approved host execution pass without source changes. |
| Sealed evidence/HBC | preservation.json: 11/11; 481 frozen files and identical tree hash. Git diff is empty for reference, reconstruction skill, constitution, PRODUCT, ROADMAP and LOGIC_VERIFICATION. source-preservation.json is a live cross-check against K:, not an initial immutable baseline; five pre-existing C: source files differ from live K: and were not overwritten by this task. |

Review tooling uses existing Playwright capture and Sharp, with a bounded manifest interface, no
new runtime/framework. It rejects source/output identity collisions, pipes/devices and linked destinations; validated file handles bind source reads, and exclusive output creation preserves earlier rounds. Alpha is compared over black/white backgrounds; hidden RGB does not fake progress.
Rendered state compares semantically; null is unknown. Suspected holds are triage, not a defect
verdict or aesthetic score. Intentional holds and mobile/reduced states still need human review.
Sharp's sandbox Fontconfig cache warnings were retained; captions render/decoding and inspected
sheets pass. No unrelated cache/preferences change was made. Mac, Linux/hosted CI and physical
phones are not newly certified by the Windows identity tests.

### Official paired skill evaluation

Three realistic planning prompts, each with a fresh old-snapshot and hardened-skill agent, were
serialized under repository execution policy. Skill Creator explicitly authorizes evaluation
agents. Outputs/transcripts/grades/timing live in ignored
`skills/creative-production-workspace/iteration-1/`; maintained prompts are in the skill's evals.json.

Inline grading follows the installed grader schema. Official aggregate_benchmark and generate_review
produced local-only `artifacts/creative-production/skill-hardening/skill-benchmark.md` and
`artifacts/creative-production/skill-hardening/skill-review.html`. These ignored outputs remain on
the originating workstation; a clean checkout does not contain them. They are historical execution
locators, not portable documentation links or required acceptance inputs. Maintained evaluation
prompts remain in `skills/creative-production/evals/evals.json`; human review is still pending.
Objective orchestration expectations: hardened 15/15; old 6/15. One run per case/configuration;
this is instruction coverage, not an aesthetic score, site output guarantee, trigger-accuracy
measurement or statistically reliable improvement estimate. Both versions preserve optional-engine,
brand and responsive basics. Human qualitative feedback and final creative approval remain pending.

Official aggregation defaults were corrected to the actual one run/configuration and with-skill-first
ordering. Missing executor token/tool counts are unavailable, not fabricated zero usage; timing is
parent-observed wall time including orchestration overhead. Engineering utility fixes continued
during/after the serialized draft evaluations; those functional fixes are verified independently,
not claimed as a new paired website-output experiment. No autonomous taste loop, description
optimizer/provider expansion or unrelated showcase was run. App opening of the static viewer
was queued; opening is not evidence the user reviewed or approved it.

### Original engineering findings at the hardening branch snapshot

Predecessor a6f1d31c-65ca-4563-a928-36481a754de3 was assessed from the retained K: result with
incomplete coverage. Current-task full-factory reviews confirm four original findings and expose
two additional unchanged-pipeline cases. None is silently marked resolved:

- Invalid GLB indices/positions can pass the small scene inspector; bounds/finite geometry remain
  unverified beyond the valid original model. Predecessor finding 6d068212-8fb5-4c26-b272-8199fb3518e3.
- Publication replaces existing destination links; link identity restoration is not guaranteed.
  397fad0b-7643-4798-8d0e-4ddb1cb15732.
- runTool rejects at timeout without confirmed process/tree termination before staging cleanup.
  3d15a12b-b9b2-4f60-bca8-f4bac265354c.
- Source path hashing and actual buffered/encoded bytes can differ if the source changes during
  production. 9e0a4aed-12f1-4ad8-99fd-5dd58d24c5a3.
- A successful Blender script producing no fresh outputs can reuse stale export files.
  c3ba62c6-ad55-430f-98a7-b032a35460b8.
- Source-file links can alias a derivative despite directory separation.
  e3aa8a22-f7bb-4b80-a36e-f3fd2d2a842a.

These remain CP-T06 backlog; the original asset pipeline was not modified by this skill-hardening
task. Its baseline is validated on immutable owned originals and ordinary destinations. The skill
now names those limitations and requires project-scoped repair/verification before selecting the
unverified edge cases. Original provider generation, rigs/animations, WebGPU, physical devices,
screen readers, Safari/Firefox and hosted CI remain unselected/untested as previously recorded.

### Independent hardening review and final disposition

Reused authenticated Qodo CLI 1.5.0 and the user's existing explicit Creative Production payload
authorization. Sandbox credential lookup failed; the exact read-only host retry succeeded.
No account/repository settings or review ledger statuses were changed. Independent issue/compliance
review ran at auto depth; skills/spec/UI/persona/cross-repo reviewers were skipped. Most complete
result envelopes still declare coverage.complete=false. This is assessed partial engineering
review, not comprehensive or clean certification.

| Operation | Current disposition |
| --- | --- |
| 4e72359f-4430-49ec-a66a-e0a7cc223f2e | Hard-linked output finding fixed with identity/link protection. Existing lockfile omission reconciled by actual scoped install and inclusion in later payload. Four original asset issues plus stale export/source link cases remain in the unchanged C: pipeline backlog. |
| f58663ca-7a60-4f38-b36d-e989056cd027 | Regular-file input, equivalent crop and consumer-local resolver findings fixed and tested. |
| 0ef0647b-1210-42f0-84f3-4874a272bbcc | Failed managed-agent transport; retained as failure. Earlier successful same-repo reviews do not imply a disconnected account. One bounded retry used the whole hardening scope. |
| 3ec54419-099d-4264-9c0a-00934f3db53c | Painted-state key order and alpha-only changes fixed using native semantic equality and compositing. The workspace-missing claim came from narrowed payload dependency omission; later payload includes the existing sources. Its coverage.complete=true does not include skipped specialist reviewers or later fixes. |
| 2bc1fd37-6c49-4b23-9fbb-b201e67c4c0d | Case-insensitive non-Windows source collision fixed with bigint device/inode identity, not OS-name assumptions. Actual filesystem alias/hard-link regressions pass; Mac execution is not claimed. |
| 093c4e26-51a3-4c7d-bdeb-54bf05fdc2f4 | Input pathname replacement/output link substitution fixed with validated FileHandle reads and exclusive wx creation. Controlled real-file replacement/link insertion tests preserve evidence. GLB/poster/KTX/WASM absence claims were binary upload omissions. |
| ce1314cc-fc26-4803-a93d-6ed292ce2d07 | Relative/empty-PATH resolution fixed without weakening strict absolute overrides; executable metadata is still not an execution certificate. |
| d5cb713c-8f57-428b-b31a-f44e66fc7646 | Latest collected review reports only the repeated binary/source omission (3598c66a-ffad-4792-b552-a609bc59ac81); actual untracked/not-ignored .blend/GLB/images/KTX/WASM exist and match provenance/loading/decoding checks. No new actionable hardening source finding. Coverage remains incomplete, so no clean-review claim. Stop the automatic loop on this repeated input limitation. |

Result envelopes/context/submissions are retained in the local evidence directory. Original
asset findings and older out-of-scope server ledger entries were not remotely dismissed. No
current-tool guard finding is silently accepted: each actionable one was corrected and functionally
verified. Latest evidence: 32/32 portable, actual review integration 1/1, existing isolated browser
48/48, native reconstruction 46/46 and packet 11/11. Final source remains uncommitted/unpushed.

Human qualitative skill-output feedback, subjective direction/final creative approval, provider
generation/alpha/identity acceptance and physical-device coverage remain pending or unselected.
The C: and live K: checkouts differ in five pre-existing package/workbench source files; their
current hashes/timestamps are a cross-check, not an immutable initial baseline or attribution of
changes. This task did not synchronize or overwrite those files. No new site/engine/vendor,
commit/push/publication, or deferred autonomous self-refinement system was introduced.


## Creative Production merge reconciliation, 2026-10-13

Current merge: main 84dd500fe44d2226a733863c9b41583688033add and Skill Hardening
945d53dacaf0063705d406390174595f504939a9, base 7a6236880f2e7579ac4af534d67444821b4c0d8c.
Twenty-one conflicts were inspected against both index stages; original versions/markers and
per-file semantic decisions are retained under artifacts/creative-production/merge-84dd500-945d53d/.
The native graph predates both parents (built at base); change-frequency analysis timed out.
It narrowed inspection but does not certify current source. Native diffs/source/tests are authoritative.

Main's later asset fixes and stronger regression coverage are retained: streamed raster byte caps,
finite/in-range triangle inspection, output-link refusal, owned-tree shutdown before cleanup,
exact captured-byte provenance, fresh staged Blender source and large-metadata-safe media probing.
The hardening branch's richer original-art direction, storyboard/causal motion, asset continuity,
provider boundaries, mobile composition, temporal contact sheets and human approval distinctions
are integrated with original native/runtime references and agent adapters. Consumer-local discovery,
relative/empty PATH resolution, optional Canva metadata and all existing engine boundaries remain.
Root dependencies and lockfile are unchanged; scripts include both implementations' checks.

Historical hardening claims of six open original-pipeline findings are not current evidence.
Main resolves geometry validation, destination-link replacement, timeout cleanup, source-byte hash
binding and stale Blender exports with corresponding regressions. Source-file aliases to derived
outputs need current review/disposition; ordinary owned sources remain the tested production profile.
Paired hardening prompt evaluations are preserved as historical planning evidence, not rerun here
or treated as merged-site aesthetic certification. Human qualitative approval remains pending.

Fresh evidence directory: artifacts/creative-production/merge-84dd500-945d53d/.

| Integrated check | Result |
| --- | --- |
| Build / TypeScript | PASS, build.log. Workbench/engine source and dependencies are unchanged from main; lockfile byte-identical to both parents. |
| Union portable checks | 34/34, zero skips: 16 original asset, five composed routing/discovery and thirteen new review checks; portable.log. |
| Complete browser suite | 48/48, zero unexpected/flaky/skipped; browser.log and browser/browser.json. Includes unchanged High Bloom comparison, lifecycle, failures, desktop/touch/reduced and reverse/interruption behavior. |
| Native Blender/glTF/KTX | 2/2, zero skips; native-assets.log, preserving both source blend/raw and serving model/texture/provenance on failed publication. |
| Native media / Chrome | 1/1, zero skips; native-media.log. Large inherited metadata, native full decode and actual Chrome H.264 playback (320x180, readyState 4, time 0.542103, no error). |
| Browser-to-contact-sheet | 1/1, ten actual SHIFT desktop/manual/reverse/mobile/reduced captures, no page errors; review-browser.log. Decoded labeled sheet inspected; humanApproval remains pending. Captures are under skill-hardening/captures-merge-84dd500-945d53d/. |
| Reconstruction | 46/46, zero skips; reconstruction-final.log. Initial wrong package-entry configuration failed and remains in reconstruction.log; source-confirmed package-directory configuration passes unchanged reconstruction code. |
| Skill format | Canonical and three skill-shaped adapters pass the existing official quick_validate.py. Existing native references and Cline canonical pointer remain. |
| Discovery | 19 modules, 18 routed skills and seven native entrypoints resolve; discovery-verified.json. The first ImageMagick override was incorrect and retained in discovery.json; the existing recorded/versioned entrypoint was verified and used. No installation or capability health claim from metadata. |
| Historical evidence | 175 original hardening artifact/evaluation files, 8,887,559 bytes, copied/matched by SHA256 from the verified incoming C: worktree without changing it; hardening-evidence-preserved.json. Restores actual benchmark/viewer links. Failed first protected-path copy was retried under authorized host execution; no evidence invented or overwritten. |
| Preservation / pointers | Final packet report preservation-final.json: 11/11 PASS, 481 sealed reference files/identical tree hash. Frozen evidence, reference-reconstruction, constitution, PRODUCT, ROADMAP, LOGIC_VERIFICATION, mise and root lock unchanged against the merge parents. Original missing-artifact link failure is retained in preservation.json. |

Requested Qodo plugin review used the existing authenticated CLI 1.5.0, auto final depth and the
verified pushed merge base, covering the full intended Creative Production/hardening scope.
Operation 43fb1d91-31b2-4fab-8800-aae9ff2ce5da was collected in qodo-collected.log.
Issue/compliance reviewers ran; skills/spec/UI/persona/cross-repo were skipped. The envelope says
incomplete_input and coverage.complete=false, and binary inputs were excluded during submission.
The initial malformed local context was rejected before submission; corrected self-contained
context/submission are retained. No extra review was submitted to chase complete coverage.

Two supported CI coverage findings remain explicitly open:

- 0a0a82aa-1918-4668-a1b4-6bff517bd114: the existing hosted workflow does not select/provision
  Blender/Toktx and run creative:verify-assets. Both native checks pass locally; hosted coverage
  requires a selected, reproducible native-tool runner profile. This merge preserves existing CI.
- 34b09d4c-475c-4c16-8700-e7572460b567: the hosted workflow does not run the added
  creative:verify-review against a running preview. Its actual local integration passes; hosted
  wiring remains follow-up work. No hosted CI run occurred, and neither finding was dismissed.

No source-file-alias guarantee is inferred from absent new findings: owned originals and ordinary
unlinked destinations are the tested native profile. Full hostile/concurrent filesystem safety,
physical devices, Safari/Firefox, provider jobs and subjective human quality approval remain
outside this merge's certification. No merge/runtime failure remains in the exercised profiles;
partial independent review and the two hosted coverage gaps are not a clean-review certificate.

All twenty-one conflict resolutions are verified and staged. The two current-guidance crosswalk
corrections are staged and original automatic merge additions remain. No unmerged index entries
or conflict markers remain; the staged whitespace check passes. Final Git status/index/parent checks are retained in final-state.json.
Leave MERGE_HEAD intact and HEAD at main 84dd500 for the user's manual merge commit/push.
No commit, push, merge abort, history reset, worktree deletion or unrelated implementation.

## Factory architecture and agent execution hardening, 2026-10-13

Current revision: main `7c4aacea81b3636f28eb84c05c77d1cd53bd94af`, sequential, uncommitted/unpushed.
This is current status; earlier merge receipts remain historical. No HBC scope/gates, frozen bytes,
provider jobs, installations or accounts changed. Native local evidence is under
`artifacts/factory-hardening/`; these ignored paths are execution locators, not portable links.

Architecture: classify all 1,012 base index entries; after removing five accidental gitlinks the
current 1,007-entry manifest records file hashes, duplicate groups and all six workspace consumers
in `architecture.json`. This is structural coverage, not independent line-by-line certification.
The graph is stale (84dd500 versus 7c4aacea); source/tests/Git resolve conclusions. Keep skills for
lane orchestration/evidence, packages for reusable source, projects for consumers and existing
creative tooling for routing/review/native CI. Keep canonical owners, sealed reference, skill-hardening
history and ProductShape recovery. Duplicate adapters serve distinct native discovery paths;
recovery candidates and before/after copies preserve provenance. No cosmetic relocation, new
framework/control plane/intelligence app or additional governance document. Reference Intelligence
uses current source/repository/document/browser/research capabilities with attribution.

Policy: AGENTS/constitution require task-relevant verification, maintained mechanisms, attributable
research and explicit uncertainty; material gaps stop only dependent actions. Installed, exposed,
connected, operational and verified are distinct. Native Cursor/Cline rules join Codex/OpenCode/
Claude entry points; eight entry adapters and every installed manifest path validate. Discovery
filters requested profiles, rejects unknown/malformed options and supplied tool metadata, and
refreshes explicitly selected discovery snapshots (fresh paths retain historical probes). All-profile discovery remains an explicit diagnostic, not certification.

Removed ceremony: user-deleted generated `all_skills(global & project)` inventories and the obsolete
`debug-storybook.log`; regeneration is ignored. Five `.worktrees/*` entries were removed from the
index only and ignored; before/after registered-worktree lists match. Local files, registrations,
branches and user work remain. Index removals are staged; no commit, push or history reset.

Actual [Creative run 38367706408](https://github.com/koko-88/website_reconstruct/actions/runs/38367706408)
(job 115196717364) passed install/check/build/media then failed four forced-SwiftShader FPS assertions:
7.4115, 2.4914, 14.4120, 6.8133 versus >15. Portable tests retain readiness/rendering, <40 calls/frame,
actual draw activity, reduced/idle/hidden lifecycle, interaction/accessibility/visual/failure behavior.
Renderer/viewport/timing attachments distinguish diagnostics from hardware acceptance. Separate
hardware tests retain >15 FPS/<40 calls, reject forced/software/masked/unclassified renderers and
remain in default local acceptance. Hosted CI selects portable and reports hardware NOT_RUN.
No thresholds/retries weakened. [Playwright profiles](https://playwright.dev/docs/test-projects)
provide the existing execution mechanism, without inventing GPU runner infrastructure.

Actual [Reproducibility run 38367706295](https://github.com/koko-88/website_reconstruct/actions/runs/38367706295)
(job 115196716998) passed locks/regressions then failed exactly two ignored Skill Creator links.
Genuine local reports are now explicit historical local-only locators; tracked prompts remain.
No fabricated artifacts, removed evidence or checker exception. A new native clean-checkout
regression follows current docs without ignored workstation outputs; the packet checker is unchanged.

Hosted native assets use official [Blender 5.2.2 SHA256](https://download.blender.org/release/Blender5.2/blender-5.2.2.sha256)
and [KTX 4.4.2](https://github.com/KhronosGroup/KTX-Software/releases/tag/v4.4.2), pinned in
`tooling/creative/native-tools.lock.json`; bounded Bash downloads verify before extraction in runner
temp. Existing locked mise glTF Transform 4.5.1 and real export/preservation tests are reused.
Browser dependencies precede native verification; Bash pipefail propagates failures and logs are
uploaded. No Docker or live Blender scene mutation; existing Windows paths/workflows remain.
Cross-platform compressed bytes are not claimed identical. Real browser contact-sheet integration
runs inside Playwright's managed preview, propagates software flags, retains fresh ten-frame desktop/
mobile/reduced/manual/reverse captures and sheets, and keeps human approval pending. Two duplicate
wrapper instances are skipped because that one integration performs both viewport variants internally.

| Local verification | Result / boundary |
| --- | --- |
| Portable Node / production build | 38/38 after review fixes, zero skips; TypeScript/Vite pass |
| Blender/glTF/KTX2 / native media+Chrome | 2/2 and 1/1, zero skips; installed Blender 5.2.2, KTX 4.4.2, glTF Transform 4.5.1 and FFmpeg/FFprobe 7.1.1 |
| Reconstruction | 45/46 initially, one missing-font-input skip; omitted font separately 1/1 with existing sealed display.ttf. All 46 cases exercised, not one zero-skip invocation |
| Packet / clean checkout | 11/11 preserving 481 reference files; 3/3 checkout tests, repeated with locked Python 3.12.15 |
| Mise / npm lock integrity | Actual mise lock followed by Git diff: no drift. Dry-run alone is not equality proof |
| Instructions / workflow configuration | Eight adapters, all manifest paths, two YAML workflows, Bash syntax and changed JS syntax pass; actionlint/Linux execution NOT_RUN locally |
| Portable browser | Fresh corrected run 49 pass, two intentional duplicate-wrapper skips, zero failures; artifacts/creative-production/factory-portable-final |
| Hardware browser | 4/4 active desktop/emulated-touch cases pass; two reduced-motion FPS cases intentionally skip. Observed ANGLE NVIDIA Quadro P2000; unchanged budgets pass. Not physical mobile |

First portable attempt remains retained: 47 pass, two failures, two duplicate skips. Its contact-sheet
child passed but the wrapper assumed TAP formatting; repaired using native exit status and explicit
reporter. Chrome initially exited during launch with no confirmed root cause. No invented repair or
retry setting; fresh run passes. Failure evidence remains in factory-portable and the local logs.

Independent review: authenticated Qodo 1.6.0 read the exact published workflow successfully.
Initial automatic approval rejection prevented local-diff transmission; the user then explicitly
authorized the intended diff/context to sdk.qodo.ai. The first context had unsupported local-path
refs and was rejected before submission; corrected self-contained context was accepted. Final auto
operation `fd0fad93-90a5-4daf-9b04-011d0f2fbede`, review `833c04d6-ad39-4a3c-b680-535f8459ebf0`,
covered the full intended diff plus nine new files; ignored artifacts and the deleted binary inventory
were excluded. Native result: qodo-result.json. Issue/compliance ran; skills/spec/UI/persona/cross-repo
and safety net did not. `coverage.complete=false`, `analysis.reason=incomplete_input`; do not claim
comprehensive independent certification. Forty-six still-open records refer to historical revisions;
retain the native ledger and prior canonical dispositions, not fabricated service closure.

Two new supported findings were repaired: `269f20b5` (failed child transcript lost before attachment)
now catches/attaches stdout/stderr before rethrowing the same native error; a deliberately invalid
review-run ID proves both fatal failure and retained TAP diagnostics (factory-review-negative).
`03a3cb92` (undocumented discovery refresh regression) restores the prior explicitly selected output
refresh, documents fresh paths for historical probes and passes a stale-to-current profile regression.
Discovery snapshots and exclusive capture/review evidence have different lifetimes. Portable checks
now pass 38/38. The second auto operation `95e66ed8-14a5-4349-8fa1-898e37f9f2a0` collected two additional
supported issues: `80e26d2e` (default-run capture ownership) and `f9034c25` (UTF-8 punctuation).
Capture output now derives from native project outputDir, and the parent-generated run identity is
propagated through config reloads to workers/child browsers; a default-ID real run verifies captures,
contact sheet and browser report share one owner. The first ownership probe exposed parent/worker
timestamp drift and is retained, rather than treated as successful acceptance. UTF-8 punctuation
is restored without unrelated historical evidence edits. Hosted build metadata now records a supplied
GITHUB_SHA or explicit null rather than labeling every build uncommitted local. Actual positive
integration after the corrections passes 1/1; negative child-transcript control remains verified.
Second coverage remains partial; native ledger records 47 still-open and one resolved record.
Final auto operation `4b8ac859-639a-446a-b94f-f3d31cf61f1b` is collected in
qodo-handoff-result.json: zero current findings, two detected resolved records, and 47 retained
still-open ledger records. Coverage remains incomplete_input/complete=false; issue/compliance ran,
five other dimensions and safety net did not. The retained current-base `269f20b5` child-output record
is not falsely presented as service-closed: current source attaches diagnostics before rethrowing,
and the negative control proves retained TAP failure output; this is an engineering disposition, not a ledger mutation.
Historical CI records also remain in that ledger; revised workflow wiring/local integration is
verified, while hosted confirmation is still NOT_RUN. No unchanged review was purchased to chase
complete coverage or empty history. Four new supported review findings were addressed in code and
verified; partial independent review cannot certify the entire factory or subjective quality.

Modified-commit hosted confirmation remains NOT_RUN until the user commits/pushes and both workflows
actually succeed. No hosted-green claim. Physical mobile, Safari/Firefox, target-device calibration,
subjective WebLoved parity, optional MCP/provider jobs and human direction/final quality approval
remain unverified. Initial direct retrieval failed; subsequent browser inspection reached the supplied WebLoved
channel and observed actual product-explosion and editorial Shorts progression. The supplied factory
transcript and those first-party observations are mapped into the existing source-map. They reinforce
subject/type/asset/story continuity and reuse, not visual parity, hidden implementation or production
performance certification. The video's
automatic agent/merge loop was not adopted: existing bounded acceptance/review/permission contracts
already serve this factory. No additional agents were launched.

Final handoff: CP-F01..06 implemented and locally verified; the completion-only documentation
updates follow the reviewed code snapshot. Default-ID parent/worker/capture/report ownership is
verified under `artifacts/creative-production/2026-10-13T10-02-26-003Z/`; positive review passes 1/1
and the retained negative control proves failure transcript attachment. UTF-8 headings match the
original punctuation. Source packages/assets, npm/mise locks, HBC owners/gates, sealed reference,
skill-hardening and all worktree registrations remain preserved. Native logs, reports and captures
are retained; temporary editing scripts and the inspected download archive were removed. No new
ceremony document, commit, push, deployment, account change or external orchestrator.
Next external acceptance: after the user's commit/push, inspect both modified workflow executions;
retain physical-device/subjective approval boundaries until actually exercised.

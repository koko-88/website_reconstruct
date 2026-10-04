# Reference reconstruction v2 audit and implementation record

Requested phase: harden the reusable skill, validate it and explain the migration. No reference website reconstruction, target UI, live reference recapture or deployment was performed. The final conflicting instruction was clarified: preserve frozen v1 evidence.

## Audited inputs and responsibilities

Read the installed user-scoped skill at `C:/Users/kerol/.agents/skills/reference-reconstruction`, all nine original resources, its UI metadata, and the frozen Haunted Boulder City contract, manifest, provenance, capture conditions, source/runtime records and helper code. Created a read-only hash baseline before edits. Original skill resources are backed up in [original-reference-reconstruction/reference-reconstruction](original-reference-reconstruction/reference-reconstruction/SKILL.md). The original skill matches all six hashes recorded by frozen E-093.

The frozen package's existing successful **evidence-package validation** and **BLOCKED implementation gate** are distinct recorded results. Its U-01 and U-02 and its capture precedence remain exactly as written. This audit neither reassesses nor upgrades that gate. No frozen helper was executed: its verifier writes manifests, and capture helpers can overwrite named files.

Inspected the installed skills catalog and responsibilities of skill-creator, frontend-ui-engineering, browser-testing-with-devtools, ui-ux-pro-max, apple-design, verification-before-completion, and the UI UX Designer color/type, layout, component, motion, accessibility, design-system and design-to-code skills. These own general design generation/heuristics, frontend implementation, accessibility remediation or application testing. Some recommend new palettes/scales/timing or inspiration-led reinterpretation. Those recommendations cannot substitute for measured reference values in an exact reconstruction task. v2 does not reproduce their design guidance or modify their files. Reference defects are observations; later target corrections are separate deviations. References remain descriptive: geometry, computed/declarative typography, assets, responsive transitions and state/motion evidence.

## Gaps and proposed v2 structure

The audit found that the original skill already had evidence-linked observations, source precedence, progressive references and a conservative gate. Its principal gaps were:

| Gap | Why it mattered | v2 treatment |
| --- | --- | --- |
| Fidelity decisions deferred until the gate | Exact, adaptable and replacement obligations were ambiguous during inspection | Five-class Fidelity / Scope Contract before discovery, with provisional/pending boundaries |
| Generic coverage/environment tables; no mandatory renderer/map reports | Agents could miss unique state coverage or distinctive non-DOM effects | Four named mandatory outputs, including static-only/unavailable outcomes |
| One combined implementation gate | Integrity, fidelity, target adaptation and reuse uncertainty were conflated | Four independent scoped gates and explicit derived clearance |
| Playwright reserved for later acceptance | Dry run needed reusable pre-build capture infrastructure | Shared tool-neutral probe and declarative optional Playwright raw-capture adapter |
| Operational repairs remained in site-specific helpers | Repeat runs could reproduce save/wait/transfer failures | Reusable scripts, finite budgets, exclusive outputs, phase labels and provenance |
| Frozen-v1 migration was implicit | A new workflow could retrospectively overwrite or reclear an old package | Immutable originals, sidecar/new revisions and explicit new decisions only |

Recommended and implemented structure: concise `SKILL.md`; focused contract, inspection, routing, capture, plan, gate, handoff and portability references; copyable evidence/contract/acceptance/adaptation templates; five maintained scripts. Keep the skill name, user scope and invocation behavior. Workflow version is 2.0.0; new capture/manifest schema is 2. v1 remains v1.

## Capture architecture comparison

| Alternative | Strength | Cost/limit | Decision |
| --- | --- | --- | --- |
| Existing Chrome DevTools MCP | Live discovery, actual current page/session, styles/network/focus capabilities | Host-specific schemas/save roots and artifact transport | Preferred discovery; shared probe reusable when the schema supports it |
| Polypane MCP | Useful simultaneous responsive comparisons | Pane manager owns viewport; synchronization does not prove equal state | Optional comparison where it fills an actual gap |
| Supplied SingleFile/static artifacts | Designated historical source and offline inspection without new access | Rendered behavior/fonts/lazy content/services may be missing | First choice for designated archives; limits explicit |
| Maintained raw CDP runner | Precise Chromium control with few dependencies | Would require maintaining browser target, transport, lifecycle, event and input logic; weaker portability | Do not generalize the one-off v1 CDP helpers into a second framework |
| Playwright adapter plus shared probe | Maintained isolated contexts, trusted input, navigation and local binary capture with deadlines | Requires installed module and compatible browser; headless/session/cache/GPU differences | Chosen optional repeatable capture adapter, selected only for a documented gap |

This is an implementation judgment following comparison, not a requirement to run every tool. Playwright's official documentation distinguishes native connections from its lower-fidelity CDP attachment; the adapter launches its own contexts and does not attach to Polypane or a personal profile. [Playwright BrowserType](https://playwright.dev/docs/api/class-browsertype)

Routing used for the main-frame guard disables HTTP cache, so the runner records that capture condition and directs cache-sensitive states to a justified alternate environment. [Playwright BrowserContext routing](https://playwright.dev/docs/api/class-browsercontext#browser-context-route) Animations and caret retain their original behavior during PNG capture. [Playwright screenshots](https://playwright.dev/docs/api/class-page#page-screenshot)

## Exact file changes and reasons

All nine existing resources were updated; eleven were added. No existing resource was deleted.

| File relative to skill | Change and reason |
| --- | --- |
| SKILL.md | v2 version/discovery description; responsibilities, contract-first routing, mandatory outputs, separate gates and immutable evidence |
| agents/openai.yaml | Short description now describes inspection/readiness; existing display name and implicit invocation preserved, no dependency/policy addition |
| assets/reference-evidence-package.md | Schema 2, contract/provenance fields, planned/inspected Environment Matrix, State & Route matrix, renderer/public-artifact reports and separate gate table |
| assets/adaptation-contract.md | Contract/replacement decisions and adaptation-readiness inputs; target changes kept separate |
| assets/acceptance-plan.md | Contract criteria, gate clearance and required-report links; planned versus executed results retained |
| references/inspection.md | Bounded readiness, required non-DOM/public-source investigation and new-revision freeze semantics; descriptive extraction retained; compact static mode avoids repetitive optional tables |
| references/tool-selection.md | Capability discovery, distinct MCP/Polypane/static/runner roles, evidence-gap escalation and explicit stop/retry rules |
| references/completeness-gate.md | Four gates, dependency clearance, obligation-relative unknowns and honest evidence-only completion |
| references/implementation-handoff.md | Four gate results and mandatory report/matrix handoff; raw capture separated from future target acceptance |
| assets/fidelity-scope-contract.md (new) | Copyable five-class contract with decision authority, acceptance criteria and reopen triggers |
| assets/capture-plan.example.json (new) | Concrete portable declarative plan example; selectors are data, localhost is an example only |
| references/fidelity-contract.md (new) | Exact/adaptable/replacement/excluded/allowed-unknown decisions before inspection |
| references/capture.md (new) | Save-root preflight, safe transfers, finite readiness/sweeps, safe evaluation and per-artifact provenance |
| references/capture-plan.md (new) | Architecture rationale, actual CLI/schema/defaults/budgets, limitations and helper validation |
| references/migration-portability.md (new) | Immutable v1, staged replacement/rollback, relative resources and cross-agent deployment boundaries |
| scripts/page-probe.js (new) | Standalone bounded function: environment, computed geometry/style/state, visible image readiness, DOM rendering surfaces and public references |
| scripts/capture.mjs (new) | Validated data plans, fresh contexts, bounded checkpoints/actions/sweeps, local PNG/JSON writes, actual phases and provenance; no fidelity auto-pass |
| scripts/package.mjs (new) | Read-only snapshots/verification, exclusive sealing, hashes/closure, JSON/image-structure/local-link checks |
| scripts/source-report.mjs (new) | Bounded local public-source/map parsing, hashes and case-insensitive text signals without fetch/execution/reuse inference; explicit empty-mapping/file-field diagnostics and helper hash |
| scripts/test-capture.mjs (new) | Meaningful unit and local synthetic-browser checks, isolated temporary outputs |

The complete byte/hash change inventory is in [validation.json](validation.json); the [exact patch](reference-reconstruction-v2.patch) records all edits/additions. Backups and validation fixtures are outside the reusable skill and frozen evidence.

## v1 operational failures addressed

Frozen G-02 through G-07 identify the problems; they remain unchanged in the original package.

- MCP save-root denial: distinguish agent write access from tool workspace root; one diagnostic/remedy, verified returned/local bytes, no trust/root reconfiguration workaround.
- Lazy-image stalls: visible-image selection, concurrent decode under one shared deadline, bounded scroll sweeps, pending/truncated outcomes; offscreen lazy images never gate the top capture.
- Transient/settled confusion: separate requested/actual phase, normal/reduced/fresh reset, performance time origin, screenshot start/end and post-capture readiness/geometry check. Unsettled evidence cannot clear settled appearance.
- Large transfers: binary local files/stdin/bounded chunks with whole-file hashes; no base64 command arguments or oversized HTML/payload dumps; pixel/source/record limits and explicit omissions.
- Malformed evaluation: complete syntax-checked standalone function, schema discovery, selectors/options passed as data, bounded JSON return; no implicit task-local function state or arbitrary plan script.
- Provenance: source/contract/case/environment IDs, saved plan/hash, runner/probe hashes, public URL/query/hash recipes, actual browser/OS/viewport/DPR/scroll/input/preferences, readiness and modifications.

## Validation and practical limits

The skill-creator quick validator passes. All staged relative links/resources resolve. The preserved original skill matches frozen E-093. Read-only checks confirm all 172 frozen files still match their before-edit hashes; all 169 entries in the original manifest still match. Verification includes 39 JSON files, 119 image structures and 202 local links; no frozen metadata was rewritten.

Ten helper tests pass, including a real local synthetic-browser run: unsafe/malformed plans, standalone probe syntax, finite waits, missing geometry/failed decode, overwrite refusal, corruption/unlisted/duplicate/unsafe manifests, malformed JSON/truncated image/missing link, static map inspection without execution, offscreen lazy-image exclusion, transient/settled distinctions, reversible menu replay, mobile/reduced-motion provenance, readiness timeout, oversized full-page refusal, original PNG bytes and sealed-run verification. Tests exercise the mechanism, not a reconstruction or new Haunted Boulder City inspection.

Test environment: Windows, bundled Node 24.19.0 and Playwright 1.62.1, installed Chrome channel, fresh headless secured browser. The bundled Playwright Chromium path did not match an installed binary, so tests explicitly selected the installed Chrome channel. The shell sandbox caused a startup hang; the same local fixture tests passed outside that shell restriction without disabling browser security. Only verified stalled test Node processes were stopped. OS startup/shutdown failure remains a host-level limitation; capture deadlines cannot guarantee control of a process the OS refuses to manage. The frontmatter validator used existing Python 3.14 with PyYAML; bundled Python lacked PyYAML. No packages were installed. [Final installed-skill test output](test-results.log) records 10 passed, zero skipped/failed; [validation.json](validation.json) records installed/staged hash equality and frozen-file checks.

Independent forward test completed: a separate agent used the skill on a sparse synthetic archive, without live access or executing its source. Its [evidence package](forward-test/reference-evidence.md), [handoff](forward-test/handoff.md) and [usability observations](forward-test/workflow-usability.md) contain all mandatory outputs, a five-class contract, preserved source copies, scoped unknowns and four separate gates. Integrity PASS, fidelity/reuse BLOCKED and adaptation NOT REQUIRED correctly distinguish finished inspection from missing downstream readiness. The contact-link replacement was treated as already authorized; missing provider interiors were bounded, while missing exact host/canvas/runtime evidence stayed blocking. The sealed packet has 16 inventoried files; independent byte/link/ID checks and three source/copy hash matches pass. [Root replay verification](forward-test-verification.json) is outside the sealed output.

Reviewed findings produced narrow improvements: case-insensitive signal diagnostics now retain a lower-case worker comment as text evidence; map summaries expose missing file/mappings and empty mappings; CLI source reports record the helper hash. [Source-report regression output](source-report-regression.json) verifies the fixture without changing its earlier report. The static-only path permits compact optional tables while retaining every mandatory output/gate, and runtime discovery is documented for a missing PATH entry. The agent's “bytes only” observation concerns its acquisition-time helper; the final verifier already checks JSON/image structure/local links, while semantic/ID review appropriately remains manual. Original independent observations and helper snapshots remain preserved in their sealed package.

## Installation, migration and external setup

Stage/review path: [skills/reference-reconstruction](../skills/reference-reconstruction/SKILL.md). Installed destination remains `C:/Users/kerol/.agents/skills/reference-reconstruction`; all 20 validated resources have replaced only that skill. Installed/staged hashes and the installed quick validator pass. No browser/MCP/agent configuration is changed. A new chat/reload may be needed to rediscover changed skill metadata.

Other agents: copy the skill folder into the host's supported user-skill location and preserve relative resources. `agents/openai.yaml` is Codex-specific optional metadata; core workflow uses Markdown/JSON/Node and discovered browser capabilities. No Cursor global configuration is installed automatically.

External prerequisites depend on the requested inspection:

- No browser dependency for static artifact/map inspection, contract/report templates or Node package verification.
- Automated live captures need Node 20+, an installed Playwright module and a compatible installed Chromium/Chrome/Edge binary, URL access and a writable new revision. This machine's integration path uses the existing module plus Chrome; the default bundled Chromium needs a matching binary before that default path can run.
- Live discovery needs a working authorized Chrome DevTools MCP target. The available server currently reported a profile already in use during capability enumeration; v2 does not alter that server/profile. Polypane is optional and requires its app/debugging integration only when a pane comparison gap warrants it.
- GPU/codec/worker effects, cross-origin interiors, authenticated/test fixtures, physical devices and AT may require owner-supplied evidence or additional authorized tooling. Their absence is scoped unknown, not false negative or automatic global blocker.
- Site-specific source/asset permissions, replacement choices, reference-version authority and real target data remain per-project decisions. Skill validation does not supply these for arbitrary sites.

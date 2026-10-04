# VISTA validity audit

Audit date: **2026-10-04**. Workload: [WP-HBC-01 revision 1](../workload-profile.md). Final classification: **SUPPORTING BENCHMARK**. Validity confidence: **MEDIUM**. Audit status: **CLOSED**.

VISTA supplies a useful, narrow signal about constructing multi-page interfaces from visual specifications and making elementary DOM interactions work. Its score is a heuristic agent-system measurement. It does not certify faithful appearance, correct business behavior, reliable verification, or the motion/accessibility obligations of this repository. Published rankings must retain model, harness, configuration, task coverage and evaluator revision. They cannot establish a clean model ranking for WP-HBC-01.

Under the Inspect Evals review terminology, the outcome is **Significant Validity Issues for claims of full functional correctness or faithful visual reconstruction**. The supporting classification preserves the narrower measured construct; it does not endorse those broader claims. Confidence is medium because source and arithmetic findings are strong, while browser execution, human ground truth, historical evaluation environments and most result manifests remain unverified.

## Source and revision manifest

Only **VISTA: An End-to-End Benchmark for Visual Spec-to-Web-App Coding Agents**, arXiv **2605.26144**, and its author-linked sources are covered. No other VISTA project is included.

| Source | Pinned identity / observation | Limits |
| --- | --- | --- |
| [Paper](https://arxiv.org/abs/2605.26144v3), [HTML](https://arxiv.org/html/2605.26144v3) | **v3, submitted 2026-06-22 18:12:46 UTC**. v1: May 22; v2: June 11. HTML SHA-256 `0f042f871bb748e463659b81403ea768ee60a983330951fcb338f7aefae4e992` | Historical paper results precede the current navigation criterion. No claim that its experiments used today's evaluator |
| [Requested primary repository](https://github.com/kaboider/VISTA_Bench/tree/dce2756fdeca450310af91034e78bd57203a001a) | **`dce2756fdeca450310af91034e78bd57203a001a`**, commit timestamp **2026-09-23T07:40:37Z**; recursive tree was not truncated | Current checkout identity, not a separately named benchmark release. No benchmark release/version manifest found |
| [Evaluator](https://github.com/kaboider/VISTA_Bench/blob/dce2756fdeca450310af91034e78bd57203a001a/tasks/tools/eval_run.py) | Same repository SHA; scorer SHA-256 **`70cc6e3a5a037c2c1a2ef5759751e4bec8959b6b655dd2528a6f874bc6df6c70`** | File history in this repository identifies September 3 commit `2d3e74a7867bda8ab8dd7b1b11a7dd487b92701b` importing/updating source. Embedded July 28 change notes are not an independent historical run manifest |
| [Official project link](https://kaboider.github.io/VIS_APP/) → [current leaderboard](https://vista-benchmark.org/) | arXiv links the former; it redirects to the latter. The pinned repository README independently links the current domain. Retrieved October 4; HTML SHA-256 **`79c42c34220b8e14740256ee40c6b82083d3b5771edc1c3781d851379593d245`** | Mutable page; retrieval date is not a score/run/update date. No page-wide immutable evaluation revision or published update timestamp identified |
| [Author-linked dataset](https://huggingface.co/datasets/JunJiaGuo/VIS-APP-Bench/tree/78f40c56275966d3ae59d91755e52aa4492f045e) | HF revision **`78f40c56275966d3ae59d91755e52aa4492f045e`**, last modified **2026-07-07T21:20:53Z**; public metadata, automatic access gate | Pinned README accessible; `samples.jsonl` and `tasks.jsonl` return an authentication/access restriction anonymously. No account/credentials were configured. Current runner reads GitHub task folders, not this HF revision; equality is unproven |
| [Inspect Evals validity methodology](https://github.com/UKGovernmentBEIS/inspect_evals/blob/v0.23.0/.claude/skills/eval-validity-review/SKILL.md) | Official **v0.23.0** source; SHA-256 `a94698c3a88ccbddeca1fa6feae4379b1a52fc1ff72f0cb94fb7edcf76a43aa2` | Repository-level review skill is absent from the installed wheel. It was read from the matching official release, with no installation. Its output-directory convention is adapted to the user's requested artifact |
| [Local tooling inventory](../eval-tooling/tooling-inventory.md), [existing Inspect receipt](../eval-tooling/inspect-verification.json) | Inspect AI **0.3.276**, Inspect Evals **0.23.0**, isolated CPython **3.12.15** | VISTA is not an installed Inspect Evals task. Inspect supplies local scorer composition and the review method, not a VISTA validity certificate |

[Audit receipt](vista-audit-receipt.json) records downloaded source-file hashes, exact dataset counts, deterministic controls and published-result arithmetic. Source/annotations and published result files were read in a temporary directory; none were copied into repository datasets. No framework installations, model inference, provider calls, CLIP embedding inference, benchmark execution, Docker startup, browser runs or upstream patches occurred.

## Review framework and claims inventory

The official Inspect methodology's phases were applied: context/affordances, claims coherence, name validity, dataset solvability and failure, scoring against actual ground truth, and limitations. Environment, leakage, reproducibility and result comparability extend those checks for this workload. This is an independent source review, not an upstream Inspect review artifact.

`VERIFIED` below means demonstrated by source/metadata or deterministic controls. It does not mean a model run was independently reproduced. Severity concerns the broader claim's validity.

| Claim | Primary locator | Finding | Severity / disposition |
| --- | --- | --- | --- |
| Ten apps, 128 pages, 458 visual anchors | Canonical task manifests, `*_anchors.json`; paper Table 2 | **VERIFIED**; these are three different units, not conflicting counts | None |
| 3,253 interaction annotations | Canonical `interaction/*_human_interaction_annotation.json` | **VERIFIED** across 126 annotated pages; two music pages have no interaction/anchor entries | None; do not equate pages with annotated pages |
| Headline denominator is the 458 visual anchors | README shorthand / leaderboard pipeline | **CONTRADICTED** as a literal denominator: current source labels **2,049 interactions critical**, 1,049 bonus and 155 skipped. Visual anchors assist matching | High if used to describe sampling/weighting |
| C4 supplies screenshots and pruned Figma structure with free stack | `agent_system_promt_c4.md`; C4 task tree | **VERIFIED**, plus semantic descriptions and explicit inline testid contract | None |
| All required behavior is provided by executable reference applications | Dataset/card, prompts, annotation fields | **NOT ESTABLISHED**: reference is design artifacts and inferred/manual intent, not executable golden apps or endpoint/output fixtures | Medium |
| Full-stack implementation is required | C4 prompt constraints | **VERIFIED as a requirement**: Docker, DB/seed/persistence, auth if relevant, API docs; external services may use demo mode | None for requirement; high if mistaken for tested backend correctness |
| Combined literally equals L × B | README; `eval_run.py:2482–2509` | **VERIFIED per interaction**; app score is **mean of products**, not product of mean L and mean B. Published main equation has the correct paired aggregation | Medium wording ambiguity |
| Localization proves the correct control is in the reference position | `pick_best`, `find_anchors_from_anchor_json`, main anchor short-circuit | **QUALIFY**: geometric matching need not check identity; semantic/testid anchors receive tier 1 regardless of displacement; affine alignment forgives global changes | High for exact-layout claims |
| Wrong or broken behavior receives zero | `check_generic_click`, `run_behavior_check` | **CONTRADICTED in general**: a no-op generic click earns **B=0.5**, including some critical music/upload/OAuth actions | High |
| Current navigation checks the corresponding destination/content | `check_navigate` | **QUALIFY**: checks before/after word-set change and home heuristics, not expected destination semantics. Wrong/empty destination controls pass | High |
| Backend/database updates are verified when required | Paper evaluation description; current behavior dispatch | **UNSUPPORTED by current probes**: no domain-specific persistence/API outcome assertions; auth can be mocked | High for full-stack correctness |
| Every failed build scores zero in the ten-app mean | Leaderboard note; `eval_all_runs.sh`; analyzer | **NOT UNIVERSAL**: script writes FAIL with blank score; analyzer omits missing results; three live rows explicitly exclude failed app builds | High comparability issue |
| CLIP demonstrates precise visual fidelity | `clip_eval.py`; paper limitations | **QUALIFY**: semantic image cosine, separate from S; missing screenshots omitted from mean, viewport/auth differ from DOM evaluation | High if treated as pixel/typography fidelity |
| Navigation update improved human agreement to 88% | `eval_run.py:1747–1771` change comment | **SOURCE-REPORTED, not independently verified**: claims 24 anchors, three raters, 92% agreement, kappa 0.68 versus old 0.50/-0.20; referenced rebuttal audit data/script absent from pinned tree | Medium; small selected audit is not universal calibration |
| Clean-room generation prevents benchmark leakage | `run_eval.sh:172–298`, `639–650` | **PARTIAL mechanism**: separate roots, mask/self-test, delayed anchors. Historical runs lack the new metadata; network/public source and Docker access remain | High if asserted retroactively or as complete isolation |
| Latest leaderboard isolates model capability | Leaderboard harness/effort columns; runner dispatch | **CONTRADICTED as a clean model comparison**: model × harness × configuration × time/environment; effort ladders differ | High |
| Grok 4.6 mean/SD can be checked from published artifacts | Pinned `trajectories/_runs_cursor_grok4.6_high_3x/*/eval_result.json` | **VERIFIED arithmetic** for 30 app artifacts; details below | None for arithmetic; no independent outcome rescore |
| Public Figma provenance guarantees zero contamination | HF card, manifests; paper limitations | **UNSUPPORTED**: public community designs, public task/code/trajectory answers and unknown training cutoffs | High for zero-shot/contamination-free claims |
| VISTA covers this project's responsiveness, motion and accessibility | Current evaluator, annotation types | **UNSUPPORTED**; no explicit acceptance suites for those obligations | High workload transfer issue |

## Dataset and task audit

### Scale and domains

Counts below were calculated from all ten canonical manifests, all anchor JSON files and all **126** interaction annotation files at the pinned SHA. All page-manifest counts also agree with the canonical PNG inventory in the Git tree. No duplicate annotation IDs within a page were found.

| Application | Pages | Visual anchors | Interaction annotations | Annotated pages | Critical interactions |
| --- | ---: | ---: | ---: | ---: | ---: |
| Newsletter | 9 | 31 | 133 | 9 | 90 |
| Real estate | 14 | 64 | 449 | 14 | 270 |
| Job board | 19 | 74 | 537 | 19 | 348 |
| Forum | 5 | 17 | 90 | 5 | 35 |
| Travel booking | 8 | 29 | 184 | 8 | 122 |
| Chat | 10 | 33 | 184 | 10 | 75 |
| Cloud storage | 33 | 117 | 978 | 33 | 710 |
| E-commerce | 7 | 28 | 214 | 7 | 75 |
| Project management | 10 | 29 | 127 | 10 | 75 |
| Music streaming | 13 | 36 | 357 | 11 | 249 |
| **Total** | **128** | **458** | **3,253** | **126** | **2,049** |

Music onboarding and login-success pages are present in the page set but absent from its interaction/anchor sets. That does not contradict 128 total pages. Raw types are 1,252 navigation, 272 input, 211 toggle, 1,516 click, one scroll and one other annotation. The lone scroll annotation is bonus and has no scroll-specific behavior dispatch; it is not evidence of tested animation/scroll mechanics.

The 458 anchors are an alignment/identification subset. The headline critical denominator is drawn from the larger interaction collection. Pages containing many repeated navigation items influence the within-app score more than sparse pages; ten apps then receive equal macro weight if all are included. A forum critical interaction has approximately 20 times the app-macro influence of one cloud-storage critical interaction, because their denominators are 35 and 710.

### Input conditions and actual agent information

Verified against the condition directories, descriptions, system prompts and runner staging at the pinned SHA:

| Condition | Agent-visible input | Stack / starting point |
| --- | --- | --- |
| C0 | Semantic text description / inline testid markers; no visual page files | Free stack |
| C1 | Text + page PNGs | Three task-specific fixed stack picks A/B/C; scaffold instructions, optional preload |
| C2 | Text + PNGs | Free stack; no prescribed scaffold |
| C3 | Text + PNGs + `*_structure-only.json` | Task-specific pick A fixed; optional preload |
| C4 | Text + PNGs + `*_structure-only.json`; strict literal `data-testid` markers on specified controls | Free stack and bootstrap method |

For C4 the screenshot has precedence for layout/type/color; JSON supplies hierarchy/bounds and description supplies semantic intent/testids. All three are required reading by prompt. This is richer, more instrumented input than an image alone. Private interaction annotations/anchor mappings are evaluation-side inputs in the current default isolated staging path. They are public elsewhere, so “withheld from the staged input” is not the same as “secret benchmark.”

Actual C1 A/B/C prescriptions are: newsletter Astro / Eleventy / Next.js; real estate Next.js / Nuxt 3 / Astro with islands; job board Next.js / Remix / T3; forum SvelteKit / Django+HTMX / T3; travel Astro+Tailwind / Next.js / Eleventy+Alpine; chat SvelteKit+Supabase Realtime / Phoenix LiveView / Next.js+Socket.IO; cloud storage Next.js / Refine / Vite+React+React Admin; e-commerce Next.js+Stripe / Next.js Commerce / Astro+Snipcart; project management Vite+React+TS / Next.js / SvelteKit; music Vite+React+TS / Next.js / Nuxt 3. These are explicit source prescriptions, not an endorsement of those stacks. The paper attributes stack proposals to an LLM.

### Solvability, ground truth, provenance and leakage

The practical success path exists: inspect provided descriptions/images/structure, create a chosen/scaffolded stack, implement pages and controls, seed demo data/account, provide Compose and page URL mapping, build/launch, inspect and repair. Missing paid-service credentials need not prevent a demo flow: the prompt explicitly permits labeled demo mode for placeholder third-party keys. Generic scaffolds, shell/file/package access and container deployment are appropriate affordances for construction tasks. Failure is possible through missing pages/elements, missing Compose, failed builds, misplaced controls and unsuccessful behavior.

However, screenshots and Figma trees do not uniquely specify all workflows, API semantics, validation, persistence, external destinations or timing. The prompt instructs the agent to choose a reasonable interpretation for ambiguity. Evaluation-side annotations make additional behavioral assumptions. **142 annotation reasoning strings contain “likely”, “implied” or “probably”**; this is a concrete indication of inferred intent, not proof of fabricated annotation. For example, newsletter home annotation 2 infers a subscription confirmation behavior while its curated anchor uses the testid `home`. Such mappings deserve human review before treating individual outcomes as authoritative correctness. No runnable golden app, exhaustive reference outcomes, per-domain database assertions or complete adjudication record was identified. It is possible to build a reasonable app and fail a heuristic interpretation, or satisfy the heuristic without the intended app behavior.

The HF card describes public Figma community files. Canonical manifests record Figma file keys/node IDs and filename mappings, making that provenance partly traceable. The audit did not retrieve original Figma files or inspect every rendered image/design right. HF declares **Apache-2.0**; the GitHub tree contains **no LICENSE file**. A dataset-card declaration does not establish the permissions chain for every community design, screenshot, embedded brand/image or repository code asset. Reuse clearance is therefore unresolved, although public metadata/source inspection was possible.

HF index downloads were gated, but the requested GitHub source exposes task manifests, prompts, annotations, PNG/structure paths and many answer trajectories. No gated-content bypass was attempted. Raw PNGs/full structure trees were not downloaded; counts came from the pinned tree and annotation metadata. HF and GitHub snapshots must not be silently treated as identical.

Avoiding crawled production HTML reduces one contamination route; it does not establish training-data exclusion. Public community designs, recurring UI patterns, task descriptions, scorer code and generated answer trajectories all allow exposure. No private held-out test set, training-cutoff proof or contamination study was identified. Current staging helps prevent accidental local answer access; it cannot prove historical agents did not inspect public answers or familiar designs.

## Scorer audit

Primary implementations: [DOM/behavior evaluator](https://github.com/kaboider/VISTA_Bench/blob/dce2756fdeca450310af91034e78bd57203a001a/tasks/tools/eval_run.py), [page matcher](https://github.com/kaboider/VISTA_Bench/blob/dce2756fdeca450310af91034e78bd57203a001a/tasks/tools/match_pages.py), [CLIP evaluator](https://github.com/kaboider/VISTA_Bench/blob/dce2756fdeca450310af91034e78bd57203a001a/tasks/tools/clip_eval.py), [batch scorer](https://github.com/kaboider/VISTA_Bench/blob/dce2756fdeca450310af91034e78bd57203a001a/tasks/eval_all_runs.sh), [aggregation analyzer](https://github.com/kaboider/VISTA_Bench/blob/dce2756fdeca450310af91034e78bd57203a001a/tasks/tools/analyze_eval_results.py).

### Localization and page matching

`candidate_selector` chooses type-appropriate controls; `collect_candidates` takes up to 600 nonzero-size elements, ignoring `display:none` and `visibility:hidden`. It does not exclude zero opacity, off-screen page coordinates or all occlusion cases. Generic div/canvas controls lacking the expected selectors can be missed. Candidate geometry is page-absolute.

`pick_best` uses the following fallback ladder; its “score” return is IoU/distance/text similarity, which is subsequently converted to discrete L:

| Match tier | Threshold | L |
| --- | --- | ---: |
| 1 | IoU ≥ 0.30 | 1.00 |
| 2 | IoU ≥ 0.10 | 0.60 |
| 3 | Center distance ≤ 150 CSS px | 0.30 |
| 4 | Center distance ≤ 600 CSS px | 0.15 |
| 5 | Annotation-reasoning word overlap ≥ 0.30, without a position limit | 0.10 |
| Miss | No candidate satisfies any tier | 0.00 |

The final fallback is literal word overlap against text/ARIA label/href/placeholder/name, not an embedding or semantic model. Earlier tiers primarily select geometry, so an unrelated control in the expected box can earn full L.

Alignment gathers href, subtype, semantic-text, inline-tag and curated testid matches, including inferred siblings. `fit_affine` estimates independent x/y scale and translation; permissible scale ranges are `0.2 < sx < 5` and `0.05 < sy < 5`. `pick_best_transform` tries all anchors, identity, single-anchor translations, leave-one-out subsets and pairs; it selects the transform maximizing non-anchor hit weights **T1=3, T2=2, T3=1**. These are transform-selection weights, not final anchor weights. This optimization deliberately tolerates global movement/scaling and can inflate apparent fidelity against strict reference geometry.

Most importantly, semantic/curated anchors bypass ordinary geometric scoring in the main loop (`eval_run.py:2371–2401`): **tier 1 is assigned and the target box is replaced with the rendered box**. A control with the right testid far from the reference can receive L=1. Curated testid visibility checks only positive bounds, weaker than the normal CSS visibility checks. Repeated testids prefer unused nearest DOM elements, but fall back to reuse when exhausted; general candidate matching has no global one-to-one constraint.

Page resolution prioritizes the generated README page table, DOM page-signature assignment, explicit override, source routes, guessed paths and crawled links. The matcher uses IDF-weighted testids, heading/URL keywords and page cues. Any positive score can assign a page; URL-slug overlap is a fallback. Assignments are independent rather than a bijection, so multiple mockups may map to the same implementation page. Redirect/catch-all heuristics reduce some home/404 traps, but neither a reachable guessed URL nor a positive signature guarantees the intended page. `resolve_url` returns explicit overrides directly. Dynamic routes are instantiated using representative values, which can miss a valid implementation requiring another record.

### Behavior probes and their validity

| Annotation | Actual probe | Correctness boundary / failure mode |
| --- | --- | --- |
| Navigate | Click, wait, compare visible body word sets (first 6,000 characters); fail Jaccard ≥0.90, apply home-return heuristics, otherwise B=1 | Does not validate the expected destination. Wrong/error/empty page may pass. Correct transitions retaining the same word set can fail; word order/count changes are invisible |
| Input | Programmatically focus/set value or select option; dispatch input/change; compare DOM value with `test-value-42` | Measures acceptance by DOM, not committed state, validation, search, form submission or persistence. Selects usually get partial 0.5 because their option differs from the test string; file/numeric/custom inputs can fail a reasonable implementation |
| Toggle | Compare class/ARIA/checked/root-class snapshots around one click | A cosmetic/unrelated class change suffices. No reversible sequence, exclusive FAQ rule or lifecycle assertion |
| External click | Accept href starting `http` or containing `://` | No actual navigation or expected-host verification; even an absolute same-origin URL passes. The nested relative-path partial-credit branch is unreachable under its outer condition |
| Popout | Count `[role=dialog]` and `[aria-expanded=true]` before/after | No visibility, identity, content, focus, Escape, close/reopen or inertness test. Adding a hidden/unrelated dialog can pass |
| Other click, including music/play/volume/next/previous, upload and social OAuth | URL change B=1; outerHTML-length change >50 B=0.7; otherwise **B=0.5** if click helper returns success | Domain-specific outcomes are deferred in comments, yet these subtypes are **critical**. No-op behavior receives meaningful headline credit |
| Scroll / other unknown type | Unknown dispatch returns B=0 | The two such annotations are bonus; no tested scroll-driven behavior |

Clicks commonly use DOM `.click()` on a closest clickable element after scrolling, with mouse fallback. This is not a trusted pointer/keyboard/touch sequence and does not prove accessibility or gesture behavior. `click_safely` can report success even if an application handler has an asynchronous error. Brief fixed waits can reject slow valid updates or credit intermediate states. Annotation reset navigates back **only when the URL differs**; same-URL state mutations can carry into subsequent probes. Candidate caches and bounds can become stale after state/layout changes.

Authentication tries API and UI login using the prescribed seeded account, then injects fake tokens/cookies/user storage and mocks common auth-validation endpoints. `auth_bypass_used` is reported. This enables UI-shell measurement for an app with broken auth/backend; it prevents a high score from certifying actual authentication or end-to-end backend correctness. In the 30 inspected Grok result artifacts the flag is false; that positive fact cannot be generalized to other rows.

### Aggregation, exclusions and failures

`annotation_tier` marks navigation/input/toggle and named functional click subtypes critical. `click_dead`/noninteractable annotations are skipped; unknown navigation clicks and unsupported types can be bonus. Critical annotations have equal weight within their app, irrespective of semantic importance. Bonus results are retained for inspection but omitted from S.

For each app, **S = Σ(LᵢBᵢ)/Ncritical**. Mean L and B are reported separately. With pairs `(1,0)` and `(0,1)`, S=0 while mean(L)×mean(B)=0.25. The implementation preserves pairing and rounds app summaries to three decimals. App S is not a weighted blend with CLIP. The claimed ten-app leaderboard is an equal app mean; repeated complete batches can then be averaged. The script/analyzer does not enforce an immutable ten-app roster for every aggregate.

Unmatched elements and unresolved pages generate zeros for affected critical annotations. A reachable server with an HTTP error is treated as up, after which page heuristics operate. An unreachable server exits before producing fresh results. A hard Compose/build failure can skip evaluation; `eval_all_runs.sh` then records **FAIL and an empty score**, not an explicit numeric zero. Existing result JSON can be reused, and after a failed forced rescore an old result file can still be read. `analyze_eval_results.collect` omits missing/empty results, its mean drops nonnumeric values, and it may deduplicate to the latest task run. These paths require an explicit failure/selection policy above the scorer.

The live page says failures count as zero but separately declares that Opus 5 (9/10), Sonnet 4.6 (8/10) and Muse-Spark-1.1 (8/10) exclude failed builds due to environment drift. Those are different estimands from the full ten-app average. The page also excludes an archived zero-score Grok attempt in favor of a valid rerun. That is a disclosed selection decision; the 30 included artifacts do not establish that excluded attempts were exogenous failures. Their treatment must remain attached to the claim.

### Visual score

`clip_eval.py` computes cosine similarity of normalized image embeddings, default local **OpenCLIP ViT-B-32, pretrained `openai`**. It also permits other CLIP variants and remote Replicate/HF/Vertex backends; Vertex's multimodal embedding is not an interchangeable CLIP measurement. Rotating backends can mix representations. Backend, weights/revision, preprocessing and screenshot recipe must be fixed for comparisons. No embedding backend was executed here.

CLIP is separate from Combined. The screenshot routine uses a fixed **1440×900** headless Chromium context and full-page capture, whereas DOM evaluation uses each annotation's Figma width and height 900. The CLIP context does not reuse DOM evaluator auth state/mocks, so login/redirect views may be captured for protected pages. Missing captures remain null and are excluded from the visual average; an embedding failure aborts writing the run JSON. Existing screenshots/scores can be reused without an immutable source/backend fingerprint. Resizing/cropping in the model's preprocessing weakens sensitivity to exact long-page geometry, typography and control placement. This is a coarse resemblance proxy, not pixel acceptance or a guarantee that all pages were visually compared.

### Deterministic local verification

[Probe source](probe-vista-scorer.py) reads the pinned scorer with a SHA-256 guard and executes only explicitly selected AST functions/constants. It never imports the full VISTA module, calls `main`, opens a browser, starts Compose or invokes a model. Controlled fake page responses exercise the actual decision logic. The existing Inspect scorer API is called directly on synthetic metadata, without creating a model or running an Inspect eval.

**16 controls pass**, including missing-element/navigation-no-op negatives, exact distance boundary, wrong-label overlap, far text match, displaced curated testid, generic no-op, wrong/empty navigation, cosmetic toggle, absolute internal “external” link, hidden-dialog count, tier membership and paired aggregation. These demonstrate decision-logic failure modes, not their real-browser prevalence. Synthetic DOM behavior is not claimed as a browser rescore.

The probe also independently recalculates all 30 available Grok per-anchor results. Each reported app S agrees with its critical mean of products when rounded. The included results contain **104 positive-scoring critical interactions whose note says “no observable effect (but no error)”**. This is direct evidence that the no-op-credit mechanism affected published artifacts, rather than merely a hypothetical edge case.

To reproduce these offline checks from any Windows checkout, resolve `uv tool dir`, use `inspect-ai\Scripts\python.exe`, and run:

```powershell
$toolRoot = & uv tool dir
$inspectPython = Join-Path $toolRoot 'inspect-ai\Scripts\python.exe'
& $inspectPython .\model-selection\benchmark-verification\probe-vista-scorer.py `
  --source-root '<temporary source directory at the pinned SHA>' `
  --output '<temporary receipt.json>'
```

The source directory needs canonical task manifests/anchors/interaction JSON and the scorer. Published arithmetic is checked additionally when the 30 pinned `trajectories/_runs_cursor_grok4.6_high_3x/*/eval_result.json` and summary files are present. The script downloads nothing and refuses a different scorer hash. The source manifest in the receipt allows byte comparison; temporary source paths are not configuration embedded in the repository.

## Environment and harness audit

The base runner is Bash, using `python3`, rsync, Unix paths/process utilities and Docker Compose. Agent tools run on the host; **Compose contains the generated app, not the whole agent**. A default single-host run exposes frontend **38000** and backend **38001**, adjustable by environment variables. Header comments mentioning older 30000 ports are not current runtime defaults. Generated Compose/images/dependencies are chosen by the agent. Healthchecks, DB seeding, startup and README are requirements, not a centrally pinned reference environment.

The current default isolation wrapper creates separate temporary harness/agent roots, masks the source root using macOS `sandbox-exec` or Linux bubblewrap, self-tests that private source reads fail, and stages anchors only after agent exit. It fails closed unless explicitly allowed unsandboxed. It does not limit network by default or freeze package registries. Broad host filesystem/Docker access means the mask is not a demonstrated security sandbox against deliberate escape; Docker-daemon access may expose host paths. This is a source-based limitation, not an attempted escape. The nonisolated opt-out can stage anchors before generation. No historical row has been shown to use the current default enforcement or delayed staging.

Native Windows is **not execution-validated**. The wrapper's enforcement branches target macOS/Linux, and the installed machine's Linux Docker engine was unavailable in the tooling receipt. Windows source inspection and the offline Python/Inspect probe worked; no WSL/Docker/security changes were made. The broad default Docker teardown can stop/remove other containers on its daemon, another reason the upstream runner was not used as an audit smoke test.

DOM/browser defaults: installed Playwright headless Chromium; annotation Figma width per page, fixed height 900; discovery/auth largely 1440×900; HTTPS errors sometimes ignored. Reference widths are 1440, 1441, 1600, 1867, 1920 and 2200 across **different pages**, not a systematic responsive test of the same page. Browser version, device scale, locale, timezone, font installation and media/network state are not immutable global settings. Browser checks have individual timeouts and short sleeps. There is no controlled network failure/recovery or device/preference matrix.

Batch startup defaults are Compose **300 seconds**, additional HTTP wait **90 seconds**, evaluator **900 seconds**. A down frontend gets one restart. If `timeout`/`gtimeout` is unavailable, the wrapper runs without that bound. Cursor's actual default idle watchdog is **600 seconds**, hard cap **45 minutes**; README says 180 seconds, so source wins. Copilot/Kimi also have 45-minute defaults; CAMEL defaults to 3,600 seconds. The Codex branch has no equivalent common hard cap in its invocation. No common token/cost budget or repeat/seed policy is enforced across harnesses.

Codex is actually present: `run_eval_codex.sh` delegates to `run_eval.sh --cli codex`; the latter calls `codex exec --model ... --cd ... --dangerously-bypass-approvals-and-sandbox --skip-git-repo-check --json -o ...`. Its system prompt is prepended to the user message; Claude receives system/user inputs through a different CLI path. This is a materially different prompt/tool/permission interface. Explicit `*_BIN` variables permit pinned harness binaries. `meta.json` records CLI/version/bin, model, task/variant, preload, skill, ports, timestamp and paths; it **does not comprehensively record reasoning/config, image digests, dependency/browser versions, dataset/source SHA, budgets or seeds**. Codex reasoning can depend on ambient CLI configuration; it is not set explicitly by the shown runner branch. CAMEL explicitly passes reasoning effort/topology, and other harnesses have their own defaults.

Conclusion: VISTA compares **MODEL × HARNESS × CONFIG × ENVIRONMENT**, with different scaffold/skill/prompt/budget affordances. Holding the benchmark name and condition fixed does not isolate the model. Same-model/different-harness observations are useful system comparisons only when evaluator, app roster, budgets, retries and inputs also match.

## Reproducibility audit

**Published-score reproducibility: LOW overall.** Source inspection and one archived row's arithmetic are highly reproducible; fresh end-to-end recreation of the published scores is not established. Availability of runners and trajectories is meaningful but insufficient.

| Item | Evidence | Reproducibility assessment |
| --- | --- | --- |
| Benchmark code | Audit pins a Git SHA | HIGH for this audit; most scored rows lack their historical SHA |
| Dataset | Audit pins Git input bytes and HF metadata revision | MEDIUM for Git artifacts; HF indexes gated and HF/Git equality unknown |
| Harness | Binary override and version recording exist; page names versions | MEDIUM capability; immutable binaries/hash/run binding absent for most results |
| Model | Explicit CLI model / some trajectory summaries | LOW–MEDIUM; many labels/aliases, no immutable provider snapshot |
| Reasoning / configuration | Live page effort labels; CAMEL summaries; ambient config elsewhere | LOW; labels are different ladders and full runtime config is absent |
| Prompts / images | Pinned current condition inputs and saved runtime-prompt design | MEDIUM for current setup; historical per-run prompt/image hashes unavailable |
| Docker images | Generated Compose; mutable tags/scaffolding permitted | LOW; no complete image-digest archive binding each published score |
| Dependencies | Agent chooses/install bootstraps including `@latest` | LOW; some scaffold packages exist, no central historical lock graph |
| Browser / rendering environment | Playwright/Chromium assumed | LOW; exact browser/OS/fonts/device/environment matrix unpinned |
| Retry / selection policy | restart, skip-existing/latest, reruns/refine, page exclusions | LOW; not uniform preregistered attempt inclusion; valid-rerun replacement disclosed |
| Timeout / budget | Several current per-harness bounds, no uniform token budget | LOW for historical and cross-harness equivalence |
| Number of runs | Two live rows specify 3 complete batches; Kimi specifies 1 | MEDIUM for those rows; generally not explicitly documented per row |
| Seeds / nondeterminism | No common seeded protocol found | LOW; no basis to call independent sampled attempts fully reproducible |
| Scorer / uncertainty version | July 28 navigation change, current mean/SD convention | LOW historical binding; analyzer uses population SD while live page says sample SD |
| Archived arithmetic | Thirty Grok per-anchor outputs and summaries | HIGH for included-artifact arithmetic, not outcome validity or excluded attempts |

No third party should expect an identical leaderboard value merely by using the current main branch, a matching model label and an installed CLI. A score requires a complete run manifest and attempt-inclusion policy. No additional setup or inference is authorized by this audit.

## Published results and comparability

### Interpretation rules

**VERIFIED** = independently checked archived arithmetic for the stated included artifacts, not independent model/browser execution. **SUPPORTING** = source-backed system result with useful configuration/replication information but unreproduced outcome/arithmetic. **WEAK** = reported result missing material version/repeat/provenance information or relying on broad proxies. **NOT COMPARABLE** = task roster/exclusion differs from full ten-app rows, or an asserted clean-model comparison changes harness/config/evaluator. No model is selected and missing entries imply nothing about performance.

For every live row below: condition is **C4**, intended aggregation is equal app mean, and page retrieval is **2026-10-04**. **NR** means not reported/bound to that score. Except where stated, repeats, uncertainty/CI, exact run date, historical code/dataset/evaluator SHA, image/dependency/browser versions and an immutable provider model identifier are **NR**. Harness version is the page's declaration, not independently verified against a per-run binary. The table preserves exact displayed model labels; a label is not automatically an API slug. Repeated archive directories are not silently counted as the repetitions used by the page.

| Displayed model / available identifier | Harness as published | Effort | Apps | Complete batches explicitly specified | Combined / uncertainty | Classification |
| --- | --- | --- | ---: | --- | --- | --- |
| Grok 4.6; summary `Cursor Grok 4.6 High` | cursor-agent 2026.08.11 | High | 10 | 3 (30 included task runs) | **0.552 ± 0.022 SD** | **VERIFIED arithmetic**; supporting system signal |
| GPT-5.6-sol; summary slug `gpt-5.6-sol` | CAMEL 0.2.90, Single | High | 10 | 3 (30 task summaries) | **0.538 ± 0.016 SD** | **SUPPORTING**, score artifacts absent |
| Fable-5; immutable identifier NR | claude code 2.1.152 | High | 10 claimed | NR | 0.533; CI NR | **WEAK** |
| Grok 4.5; immutable identifier NR | cursor-agent 2026.07.01 | Med | 10 claimed | NR | 0.517; CI NR | **WEAK** |
| GPT-5.6-sol; immutable snapshot NR | codex 0.144, high | High | 10 claimed | NR | 0.507; CI NR | **WEAK** |
| Opus 4.7; immutable identifier NR | claude code 2.1.152 | High | 10 claimed | NR | 0.504; CI NR | **WEAK** |
| Opus 5; immutable identifier NR | claude code 2.1.219 | High | **9** | NR | 0.490; CI NR | **NOT COMPARABLE** with ten-app means |
| Opus 4.8; immutable identifier NR | claude code 2.1.215 | High | 10 claimed | NR | 0.484; CI NR | **WEAK** |
| DeepSeek-V4-Flash; immutable identifier NR | dsh 0.1.0-rc.6 | NR | 10 claimed | NR | 0.484; CI NR | **WEAK** |
| DeepSeek-V4-Pro; immutable identifier NR | dsh 0.1.0-rc.6 | NR | 10 claimed | NR | 0.462; CI NR | **WEAK** |
| Composer 2.5; immutable identifier NR | cursor-agent 2026.06.15 | Default / ladder NR | 10 claimed | NR | 0.448; CI NR | **WEAK** |
| Sonnet 4.6; immutable identifier NR | claude code 2.1.152 | High | **8** | NR | 0.446; CI NR | **NOT COMPARABLE** with ten-app means |
| Kimi K3; immutable identifier NR | kimi-code 0.26.0 | NR | 10 claimed | **1** | 0.440; CI NR | **WEAK**, explicitly one batch |
| GLM-5.2; immutable identifier NR | claude code 2.1.152, z.ai | Max | 10 claimed | NR | 0.438; CI NR | **WEAK** |
| GPT-5.5; immutable snapshot NR | codex 0.144.6, high | High | 10 claimed | NR | 0.413; CI NR | **WEAK** |
| Muse-Spark-1.2-contributor; immutable snapshot NR | claude code 2.1.205, api.meta.ai | NR | 10 claimed | NR | 0.409; CI NR | **WEAK** |
| GPT-5.6-terra; immutable snapshot NR | codex 0.144.6, med | Med | 10 claimed | NR | 0.385; CI NR | **WEAK** |
| Muse-Spark-1.1; immutable snapshot NR | claude code 2.1.205, api.meta.ai | NR | **8** | NR | 0.384; CI NR | **NOT COMPARABLE** with ten-app means |
| GPT-5.4-mini; immutable snapshot NR | codex 0.134 | Med | 10 claimed | NR | 0.358; CI NR | **WEAK** |
| GPT-5.6-luna; immutable snapshot NR | CAMEL Workforce; exact version NR | Med | 10 claimed | NR | 0.357; CI NR | **WEAK** |
| MAI-Code-1-Flash; immutable identifier NR | copilot 1.0.68 | NR | 10 claimed | NR | 0.326; CI NR | **WEAK** |

**Every cross-harness/config comparison in that table is NOT COMPARABLE as clean model evidence**, including GPT-5.6-sol/CAMEL versus GPT-5.6-sol/Codex. Differences may concern an operational agent system, not isolated model ability. No published confidence interval is shown; ± SD over three batch means is not a CI, and the 30 tasks are not 30 independent app designs. Anchors/pages are nested within ten apps. Small score gaps cannot establish a statistically reliable ranking without paired task data and a justified uncertainty analysis.

Grok's pinned artifact group has three complete ten-app sets. Recomputing critical interaction products gives batch means **0.5670933544, 0.5629199973, 0.5273243562**; mean **0.5524459026**, sample SD **0.0218557384**, which round to the displayed row. Using already rounded app summaries instead gives mean 0.5525333; retain the unrounded pairing for replication. Observed trajectory timestamps span **2026-08-13T08:10:26.612Z through 2026-08-14T00:49:48.860Z**. This verifies included-artifact arithmetic and those timestamp observations, not deployed browser outcomes, provider identity or the justification for replacing the archived zero attempt.

CAMEL's 30 summaries expose slug `gpt-5.6-sol`, effort `high`, topology `single` and run identifiers containing August 12 timestamps. They do not include per-anchor score artifacts in this tree, so its mean/SD cannot be independently recalculated here. Three summaries flag a JSON parsing error while retaining a generated Compose artifact; this does not by itself prove a zero/failure score, but it requires an outcome/inclusion explanation. Its exact provider snapshot and scored-run manifest remain unknown.

Token/cost/time values are ancillary **WEAK efficiency claims**, not correctness evidence. The page uses different cached-token conventions and some older trajectory groups than the scored harness. It declares Grok cost a theoretical estimate using another model's pricing, Grok 4.5 cost a dashboard amount that cannot be reconstructed from trajectory pricing, and CAMEL cost an estimate with cache-write premium. Those cannot be treated as audited observed bills or equal-budget comparisons. No price verification or paid call was performed.

### Historical paper results: separate score regime

The paper's v3 results must remain separate from the current content-based leaderboard. The scorer's July 28 note explicitly says paper behavior numbers were **not recomputed**. Numerical improvement from a paper value to a live value is therefore not demonstrated model/harness improvement.

Paper Table 3 reports the following pooled model rows. Exact immutable model identifiers, harness builds, reasoning levels, run dates, actual completed-run counts and CIs are not bound to these rows in the published table. Conditions C0–C4 are pooled; C1 has three different stack picks, not three independent repeat batches.

| Paper model label | Harness family stated | Loc | Behavior | Combined | Combined median | CLIP | Status |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| GPT-5.4 | Codex | 0.543 | 0.330 | 0.251 | 0.229 | 0.818 | **WEAK**, historical pooled agent-system result |
| GPT-5.5 | Codex | 0.602 | 0.283 | 0.223 | 0.227 | 0.853 | **WEAK**, historical pooled agent-system result |
| Opus | Claude Code | 0.595 | 0.336 | 0.261 | 0.250 | 0.764 | **WEAK**, exact model version ambiguous |
| Sonnet | Claude Code | 0.505 | 0.313 | 0.233 | 0.234 | 0.715 | **WEAK**, exact model version ambiguous |

Historical C4 scores in paper Appendix D/Table 7 are also **WEAK**, and **NOT COMPARABLE** with the current score regime: Claude fable-5 **0.274**; Claude Opus 4.8 **0.263**; Claude Sonnet 4.6 **0.248**; Claude Opus 4.7 **0.246**; Cursor Composer 2.5 **0.212**; GPT-5.5 **0.205**; GPT-5.4-mini **0.194**; GPT-5.4 **0.190**; Claude Haiku 4.5 **0.105**. C4 is stated, but exact harness builds/config, complete score-run counts/date and uncertainty are not supplied in that table. Todo-event counts and “runs with todo” are not score replicate counts. Its missing rank 9 is not filled by inference. Family associations (Claude Code, Cursor, Codex) do not supply historical build versions.

Historical condition/pick aggregates, preserved as **WEAK methodology evidence**, are Combined C0 **0.242**, C1 **0.229**, C2 **0.264**, C3 **0.236**, C4 **0.261**; C1 picks A **0.240**, B **0.212**, C **0.236**. These pool multiple models/tasks and lack complete manifests/uncertainty. C0→C1 changes both visual input and stack constraint; C2→C3 likewise changes structure and stack. Such comparisons are not clean evidence of the causal benefit of screenshots/Figma alone. The historical website harness-trend chart exposes versions/dated release labels and plotted geometry but no exact numeric series/run manifest; no values were estimated from SVG pixels or transferred into model evidence. Its directional statements are **WEAK** historical system observations.

Paper editing-style results (Surgical/Strict: GPT-5.5 **33.6/9.0**, GPT-5.4 **30.4/7.8**, Sonnet **28.1/4.7**, Opus **22.4/2.7**) and reported correlations with Combined (**−0.145 / −0.078**) are **WEAK process observations**. Harness edit affordances and normalized mutation counting affect them. Neither surgical editing, TodoWrite frequency nor a verification-command label proves sound reasoning, causal improvement, real recovery or trustworthy acceptance. Their source-reported relationships may describe traces but cannot rank models for ED-01/05/06 independently of harness and outcome validity.

## Mapping to ED-01 through ED-08

These classifications concern VISTA as evidence for **WP-HBC-01**, not the general possibility of implementing missing tests in Inspect. No dimension earns PRIMARY SIGNAL from the reviewed protocol.

| Dimension | Classification | What is actually supported | Explicit gap |
| --- | --- | --- | --- |
| **ED-01 Evidence/repository reasoning and continuity** | **WEAK PROXY** | Multi-page construction, reading design/text/structure, code-edit traces | Lightweight greenfield scaffolds/free stack; no source-authority conflict, historical/current evidence reconciliation, cold re-entry or sustained acceptance-contract retention |
| **ED-02 Frontend construction and visual fidelity** | **SUPPORTING SIGNAL** | Interfaces built from screenshots/Figma/text; coarse image resemblance, DOM presence/alignment and elementary interaction outcomes | L can forgive/short-circuit geometry; CLIP cannot validate type/crop/spacing; no HBC layer/mask/measured-layout obligations or revealed-state pixel acceptance |
| **ED-03 Responsive/environment fidelity** | **NOT MEASURED** | Different mockups have different reference widths | No same-page viewport sweep, boundary widths, short-height/tablet landscape, viewport-vs-client distinction, touch or device-scale equivalence |
| **ED-04 Temporal/scroll/state fidelity** | **WEAK PROXY** | Single toggles/popouts/navigation exercise elementary state change | No scroll-driven timing, pinned chapter travel, video scrubbing/seeks, reverse/interruption, close/reopen races, serialization or temporal ground-truth trajectories |
| **ED-05 Browser/tool execution and recovery** | **WEAK PROXY** | End-to-end app deployability and recorded build/tool actions provide indirect execution evidence | Browser use/recovery by the agent not required or separately scored; evaluator browser actions are not agent capability. No controlled failure injection, AX/media/input parity or browser recovery assertions |
| **ED-06 Debugging/trustworthy verification** | **WEAK PROXY** | Final generated artifacts can fail and command traces can show attempts to repair | No scorer checking root-cause accuracy, truthful acceptance reporting, hidden-descendant traps, self-baseline abuse or deliberate negative controls in agent verification |
| **ED-07 Accessibility/preferences** | **NOT MEASURED** | ARIA attributes are read as matching/state cues | No keyboard Enter/Space, focus return/trap, inert/expanded consistency, AX semantics, reduced-motion fresh/switched states or touch cancellation suite |
| **ED-08 Robustness/adaptation** | **NOT MEASURED** | Variation across app domains/stacks is generalization context | No prescribed resize/font/content substitution, lifecycle cancellation, visibility/media races or repeated adaptation stress fixtures |

Visual fidelity and basic functional frontend behavior are **partly measured**, with the scorer caveats above. Repo reasoning, temporal state, browser/tool recovery and trustworthy verification have only incidental/process proxies. Responsive layouts/multiple widths of the same page, scroll animation, reversal/interruption, reduced motion, touch, focus/accessibility, long-horizon evidence continuity and adaptation robustness have no explicit acceptance measurement. Multi-page app count, long generation duration, ARIA use and a video/music button are not substitutes for those tests.

## Limitations, unresolved questions and admissible claims

Name validity: “Visual Spec-to-Web-App” accurately names the construction task. “End-to-end” is reasonable for producing and launching an app but oversells verified functional completeness if read as an outcome guarantee. Construct validity is narrowed by heuristics, supplied testids, forgiving alignment, authentication rescue and incomplete domain outcomes. Human reference intent and automatic probes require calibration; source comments alone do not establish that calibration for every annotation/domain.

Unresolved primary-source requirements before stronger result/ranking claims: full historical and live score manifests binding model snapshot/harness/effort/prompt/source/dataset/scorer/dependencies/browser; per-app scores and excluded-attempt reasons for rows beyond Grok; exact completeness/repeat counts; released human navigation-audit examples/ratings and broader calibration; reference-intent adjudication for inferred/ambiguous annotations; original Figma asset permissions chain; HF/Git snapshot equality; recorded auth-bypass and attempt-selection status for all rows; identical app roster and stable build artifacts; model training/benchmark exposure evidence. These are **limits on admissible claims**, not reasons to leave this conservative audit open.

**Allowed now:** cite the verified dataset/input structure and current scorer mechanisms; describe VISTA as supporting evidence for agent-system visual-spec construction/basic DOM behavior; quote a published result only with its label/harness/config/condition/coverage and status; state that Grok's included-artifact arithmetic reproduces 0.552 ± 0.022 sample SD; use the annotation/alignment/per-interaction-report pattern as a methodology reference; identify specific scorer/failure/comparability risks demonstrated here.

**Reject or qualify:** clean model-only ranking; current-versus-paper progress claims; confidence intervals/significance inferred from SD; full correctness/working-backend/auth claims; precision visual fidelity from CLIP or L alone; “all failures are zero” across every aggregate; incomplete-roster comparisons; complete/no-leakage/zero-shot claims; cost as an observed bill where estimated; causal superiority of a planning/edit style; any claim of measured HBC responsive, motion, preference, accessibility, continuity or adaptation acceptance. No candidate-model choice follows from this audit.

Final decision: **SUPPORTING BENCHMARK, MEDIUM confidence, CLOSED**. This admits a bounded external agent-system signal and methodology, with substantial correctness and comparability qualifications. It does not finalize benchmark-evidence.md or clear the full Benchmark Verification Gate. Only this audit, its offline probe and receipt were added; benchmark-evidence.md, candidate-models.md and reference evidence were not edited. No commit or push was performed.

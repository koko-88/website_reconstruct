# Benchmark Verification Tooling Inventory

Checked 2026-10-04 (Africa/Cairo), against [WP-HBC-01 revision 1](../workload-profile.md). **Benchmark Verification Tooling Gate: PARTIAL.** Inspect AI and Inspect Evals are ready for offline inspection and custom evaluation development. AgentCompass installs and exposes useful harness/analyzer components, but full benchmark discovery fails on native Windows. No external benchmark result or candidate-model score was reproduced.

## Machine, installation and scope

Windows 10 Pro 22H2, x86_64, build 19045. `uv 0.12.22` was already installed. Elevated read-only inspection found Python 3.14.3 (system/default), 3.13.2, 3.11.0, 3.10.6 and 3.9.13. The Python launcher initially exposed only 3.14; `uv python list --only-installed` found the others. No pipx, Conda, Poetry, PDM or Hatch command was on PATH. Docker CLI and WSL 2 were present; Docker's Linux-engine pipe was absent and the default WSL distribution was `docker-desktop`. No general-purpose Linux distribution was established by these checks. See [machine receipt](machine-inspection.json).

Installed **uv-managed CPython 3.12.15**, then used two user-level `uv tool` virtual environments. Inspect AI, Inspect Evals and the optional MCP SDK share one compatible environment; AgentCompass has its own dependency graph. System Python was not modified. This combines uv's supported global tool mechanism with upstream PyPI installation guidance. Neither development checkouts nor all optional benchmark extras were installed. The environments contain 111 and 154 distributions respectively; both pass `uv pip check`.

Exact top-level releases were checked against official PyPI metadata before installation. [Release metadata](release-metadata.json) records Python requirements, official links, published files, release dates, yanked flags and SHA-256 hashes. AgentCompass's installation page still says source installation is required, while its official README and September 30 release announce PyPI 1.0.0; the published release was used. These were the current non-prerelease releases on the inspection date, not a claim about future availability.

Tool roots and launchers are resolved through `uv tool dir` and `uv tool dir --bin`. On this machine they resolve beneath `%APPDATA%\uv\tools` and `%USERPROFILE%\.local\bin`. **`inspect` initially selected IntelliJ's launcher.** The existing uv bin entry was moved to the front of the user's PATH, preserving other entries. Machine PATH and security settings were not changed. A shell using the persisted machine/user PATH now resolves both commands to uv's `.exe` launchers. Already-open applications may retain the earlier PATH until refreshed; the bootstrap's `-AddUserPath` also refreshes its own process.

Downloads required a longer supported `UV_HTTP_TIMEOUT=300`; the bootstrap restores the previous value afterward. Initial restricted-shell cache access failed; installations and verification succeeded in the authorized user context. An independently downloaded official Inspect wheel matched its PyPI SHA-256; normal uv package installation completed. No dependency exclusions, upstream patches or unofficial compatibility shims were used.

The only evaluation used two synthetic local controls: an expected pass and an expected fail. `Model.generate` was replaced with a raising guard during that smoke check. External socket connections were blocked in the Python verifier, with loopback allowed for Windows asyncio IPC. A local stdio MCP echo tool was exercised. No provider/model generation, real agent execution, benchmark dataset downloads, large suites, paid services, router changes, commits or pushes occurred. Packaged task/source assets arrived as normal dependencies; none were copied into repository datasets. Reference evidence and `benchmark-evidence.md` were unchanged.

## Installation records

| Tool | Exact installed version | Official source | Runtime / mechanism | Isolation / global access | Status |
| --- | --- | --- | --- | --- | --- |
| Inspect AI | **0.3.276** | [UK AI Security Institute / Meridian Labs](https://github.com/UKGovernmentBEIS/inspect_ai), [documentation](https://inspect.aisi.org.uk/), [PyPI](https://pypi.org/project/inspect-ai/0.3.276/) | CPython 3.12.15; `uv tool install --python 3.12.15 --with inspect-evals==0.23.0 --with mcp inspect-ai==0.3.276` | Dedicated uv tool venv; global `inspect`; MCP SDK 2.3.0 | **READY**, for the verified tooling scope |
| Inspect Evals | **0.23.0** | [official collection](https://github.com/UKGovernmentBEIS/inspect_evals), [documentation](https://ukgovernmentbeis.github.io/inspect_evals/), [PyPI](https://pypi.org/project/inspect-evals/0.23.0/) | Same CPython 3.12.15 environment as Inspect AI; installed through `--with` | Importable by that environment's Python; task functions supplied to global Inspect CLI. It has no separate required CLI | **READY**, for registry/source inspection; optional task execution prerequisites remain |
| AgentCompass | **1.0.0** | [OpenCompass source](https://github.com/open-compass/AgentCompass/tree/v1.0.0), [installation guidance](https://agent-compass.mintlify.app/en/get_started/installation), [PyPI](https://pypi.org/project/agentcompass/1.0.0/) | CPython 3.12.15; `uv tool install --python 3.12.15 --constraints agentcompass-constraints.txt agentcompass==1.0.0` | Separate uv tool venv; global `agentcompass` | **PARTIAL**; full benchmark discovery and native Windows execution blocked |

READY does not certify model performance, sandbox readiness or scientific validity. Base package installation intentionally excludes optional SWE-bench, desktop-VM and other benchmark extras. Installing SDK dependencies does not configure or subscribe to their services.

## Verified commands and smoke results

See [CLI receipt](cli-verification.json), [Inspect receipt](inspect-verification.json) and [AgentCompass receipt](agentcompass-verification.json). Receipts include exact installed versions, inventory data and source hashes. Absolute launcher paths in the CLI receipt are machine observations, not bootstrap configuration.

| Check | Result |
| --- | --- |
| `inspect --version`, `inspect --help` | Exit 0; 0.3.276; resolves to the uv launcher |
| `inspect list tasks --help`, `inspect log --help`, `inspect trace --help`, `inspect view --help` | Exit 0; discovery, log query, trace and viewer commands exposed |
| `verify-tooling.py inspect`, using Inspect environment Python | READY; custom filesystem task discovery, custom solver, local tool, positive/negative deterministic scorer controls, local MCP stdio calls and `.eval` log write/read pass; zero model generation |
| `import inspect_evals._registry` plus runtime registry query | PASS; **250 registered task functions**, **129 `eval.yaml` families and 239 declared task entries**, distinct counts |
| `uv pip check --python <each tool environment Python>` | All installed packages compatible: 111 Inspect environment, 154 AgentCompass environment |
| `agentcompass --version`, `agentcompass --help` | Exit 0; 1.0.0; globally resolved uv launcher |
| `agentcompass list harness`, `agentcompass list env`, `agentcompass list analyzer` | Exit 0; actual runtime discovery of 12 harnesses, 10 environments and 25 analyzers |
| `agentcompass list benchmark`, `agentcompass list dump`, `load_builtin_components()` | Fail with `ModuleNotFoundError: No module named 'fcntl'` |
| `verify-tooling.py agentcompass` | PARTIAL receipt; confirms blocker, working selective runtime registries, shipped source inventory and synthetic trajectory analysis |
| Synthetic `EmptyContentAnalyzer` plus trajectory serialization | PASS; reasoning-only step identified as a bad case, score 1.0; ACTF_v1.0 trajectory serialized |
| Bootstrap verification-only mode and installation rerun | PASS from another working directory; matching full dependency graphs skip installation; known AgentCompass limitation is surfaced explicitly |

The Inspect viewer's CLI was checked, and logs were read through its public API. A graphical browser session was not exercised. Agent bridging, actual coding agents, remote MCP transports, Docker/VM provisioning, retry scheduling and resumed benchmark execution were not run.

## Inspect AI capability result

The installed APIs expose `Task`, `Sample`, `MemoryDataset`, task registration/discovery, solvers, tools, deterministic/custom scorers and version/metadata fields. The smoke check demonstrates local dataset/solver/scorer composition, pass and fail controls, trace events and log round-trip. This provides infrastructure for custom ED-specific checks; no website-specific acceptance task has been authored.

`react`, `agent_bridge` and `sandbox_agent_bridge` import successfully; their signatures are recorded. The installed stdio MCP APIs plus MCP 2.3.0 successfully discovered and called a local tool. This verifies tool plumbing without agent/model generation. [MCP guidance](https://inspect.aisi.org.uk/tools-mcp.html) describes additional transports; their operational behavior remains untested here.

[Agent Bridge](https://inspect.aisi.org.uk/agent-bridge.html) provides in-process and sandbox integration for external agents, including coding CLIs. Inspect can route their requests through its evaluation model provider and retain transcripts. Codex integration requires an agent/harness and sandbox setup beyond the installed core bridge; no separate coding-agent package was installed or executed. Do not equate bridge import success with a working Codex benchmark run.

Independently verifiable now: task declarations, local sample fields, scorer behavior on synthetic controls, metadata, source/version correspondence and emitted logs. With authorized inputs later, custom scorers can inspect DOM/AX, images, state transitions and artifact integrity. Those measurements and calibrated tolerances must be implemented explicitly; Inspect supplies no turnkey HBC visual/motion/accessibility scorer. It cannot establish contamination freedom, judge validity, published leaderboard correctness or target acceptance from installation alone.

Windows observation: `list_eval_logs()` returned a name with its drive omitted for the temporary log directory. Passing the actual native absolute `.eval` path to `read_eval_log()` worked. The verifier records this observation and uses normal filesystem paths; upstream code was not patched. Filesystem task discovery uses relative globs with `root_dir`, as required by the API. The stopped Docker engine prevents a sandbox smoke test.

## Inspect Evals capability result

The actual installed `_registry.py` imports successfully. Inventory was built from that source and all 129 shipped `eval.yaml` files, rather than documentation titles. Runtime registry queries identify 250 task functions. All 239 YAML task entries resolve in that registry; the additional 11 functions are ten `gdm_sp*_milestones` functions and `paperbench_score`. This explains why runtime task count exceeds metadata task count without inventing 11 additional benchmark families. Relevant sources were hashed and their function/class locations recorded. No benchmark task factory was invoked to fetch data.

| Installed family / task | Declared evaluation version | Relevant evidence / limits |
| --- | --- | --- |
| `swe_bench`, `swe_bench_verified_mini` | 5-C | Issue → patch tasks; dataset maps problem statement, instance ID, base commit, test patch, FAIL_TO_PASS and PASS_TO_PASS. Default solver supplies coding tools; scorer delegates grading to SWE-bench and uses per-sample sandbox images. Optional `swebench`/Docker dependencies and dataset are absent |
| `swe_lancer` | 1-B | Software engineering task/scorer/environment source available; supports coding-capability investigation, not automatically visual reconstruction |
| `humaneval`, `mbpp`, `apps`, `bigcodebench`, `class_eval`, `ds1000` | 2-A, 4-A, 3-B, 3-B, 3-C, 3-B | Function/program/class/data-science execution-test definitions; partial ED-06/08 evidence, weaker than frontend/state fidelity |
| `infinite_bench_code_debug`, `infinite_bench_code_run`, retrieval/dialog tasks; `niah` | 3-A / 3-A | Long-input/retrieval and code reasoning probes; do not establish durable cross-turn repository continuity |
| `mind2web` | 3-A | Installed solver consumes offline webpage/action data; scorer parses element/action/value answers. **Not a live reconstructed-site browser acceptance test** |
| `osworld`, `osworld_small` | 5-A | Computer-interaction task definition, dedicated scorer and Docker sandbox configured; desktop workload/VM prerequisites, not website construction |
| `assistant_bench_web_browser`, other AssistantBench variants; `gaia` variants | 5-B / 3-B | Browser/search/tool task definitions useful for ED-05; optional assets/services and task-specific constraints remain |
| `agent_bench_os`, `agentdojo`, `bfcl` | 4-B, 2-A, 7-B | OS/tool selection and function-calling capability probes; source inspection needed for exact split/version and tool affordances |
| `tau2_airline`, `tau2_banking`, `tau2_retail`, `tau2_telecom` | 3-A | Stateful conversational/tool workflows; only indirect ED-04 signal, not scroll/media/animation races |
| `scbench` | 2-A | **Single-cell RNA-seq analysis**, not a software continuity benchmark; excluded from frontend-relevant recommendations |

Metadata separates comparability and interface versions (`5-C`, for example). The [official versioning ADR](https://github.com/UKGovernmentBEIS/inspect_evals/blob/v0.23.0/adr/0002-versioning-metadata.md) specifies explicit passing into `Task.version` and metadata. Package version, task version and dataset revision are distinct identifiers. Installed SWE-bench defaults to a pinned dataset revision but its default environment image template uses `:latest`; a future replication must capture immutable image digests.

The official repository includes [validity-review methodology](https://github.com/UKGovernmentBEIS/inspect_evals/blob/v0.23.0/.claude/skills/eval-validity-review/SKILL.md), quality-review workflows and [review/validity artifacts](https://github.com/UKGovernmentBEIS/inspect_evals/tree/v0.23.0/agent_artefacts). The reviewed methodology examines claims coherence, naming, sample solvability/failure and ground-truth scoring. Review artifacts were located for selected evaluations, not audited comprehensively. Their existence is not a blanket validity certificate or a review of the eight external families below.

Independently verifiable now: registered definitions, metadata versions, dataset transformation code, scorer logic, configured tools, sandbox/network settings and provenance declarations. Actual downloaded sample quality, container behavior, reward-hacking resistance, scientific comparability and model scores remain unverified. Inspect Evals is a library on Inspect AI, not another independent execution/auditing engine.

## AgentCompass capability and compatibility result

Release 1.0.0 requires Python >=3.12 and is still classified **Beta** in package metadata. Its `uvloop` dependency is correctly excluded on Windows; dependency resolution and CLI/import health succeed on CPython 3.12.15. This does not remove the separate Unix-only import defect.

Full discovery imports `agentcompass.benchmarks`, whose `__init__.py` imports Frontier Engineering. `benchmarks/frontier_engineering/frontier_engineering.py:6` imports `fcntl` without a platform guard, and lines 1238/1242 use `flock`. Native Windows has no standard-library `fcntl`. Benchmark listing and full component loading therefore fail before all components are registered. No shim, source patch, dependency suppression or fake module was applied.

Separate, officially exposed harness/environment/analyzer discovery works. Actual harnesses: `claude_code`, `codex`, `mini_swe_agent`, `naive_search_agent`, `openai_chat`, `openclaw`, `openevolve`, `openhands`, `qwen3vl_gui`, `researchharness`, `scicode_tool_use`, `terminus2`. Codex is present in the runtime harness registry and installed source, not merely a documentation title. Its implementation configures a provider/session and normalizes CLI JSON events. It was not executed. The default install command `npm install -g @openai/codex` is unpinned; future reproducible runs must supply a pinned/preinstalled harness version.

The verifier finds **34 benchmark registration declarations, 45 recipe declarations, 12 harness declarations, 10 environment declarations and 25 analyzer declarations** in shipped source. The 34 benchmarks are a **static inventory**, not a successfully loaded full runtime registry:

`brainarena`, `browsecomp`, `browsecomp_zh`, `deepresearch_bench`, `deepsearchqa`, `deepswe`, `frontier_engineering`, `frontier_swe`, `frontierscience`, `gaia`, `gdpval_ac`, `hle`, `hle_verified`, `osworld`, `pinchbench`, `researchclawbench`, `scicode`, `screenspot`, `sealqa`, `sgi_deep_research`, `skillsbench`, `special_pattern_check`, `swe_marathon`, `swebench_multilingual`, `swebench_pro`, `swebench_pro_verified`, `swebench_verified`, `taubench`, `terminal_bench_2`, `terminal_bench_2_1`, `terminal_bench_2_verified`, `widesearch`, `wildclawbench`, `xbench_deepsearch`.

Coding/terminal entries potentially support ED-01/05/06/08; OSWorld/ScreenSpot provide interaction/grounding proxies. TauBench is a stateful tool-workflow proxy. None directly establishes HBC responsive fidelity, motion mechanics, accessibility or adaptation quality. The registry is not a promise that every Model × Harness × Benchmark combination works: supported recipes, protocols, tools, resources and environment constraints must be compatible.

The installed runtime implements orchestration plans, persistence, retry classification and checkpoint reuse. `runtime/checkpoint.py` defines `agentcompass.evaluation_checkpoint.v4`, clean-completion checks, task identity, artifact manifests and driver-input fingerprints; changed/incomplete artifacts cannot simply count as reusable completed attempts. These are source-verified mechanisms, not a tested crash/resume cycle. ACTF_v1.0 trajectory models and the synthetic deterministic analyzer/serialization check work. Some qualitative and hack-detection analyzers can invoke LLM judges; none were run. Deterministic analysis can flag symptoms but cannot certify task validity.

Official [Windows environment guidance](https://agent-compass.mintlify.app/en/get_started/installation) excludes native Windows host-process and local Docker benchmark execution, including Docker Desktop. Supported local execution requires Linux/WSL; Windows cloud backends require their own credentials/services. Those backends were not configured under this phase's constraints. Registering `docker` or `host_process` does not prove Windows support. Host-process execution is not sandbox isolation; uv isolates dependencies, not an agent's filesystem access. No Docker images, cloud sandboxes, OS settings or new WSL distribution were provisioned.

## Mapping to ED-01 through ED-08

This is a capability mapping, not task-equivalence evidence. Inspect AI can host custom checks for all eight dimensions; those checks still need authorized fixtures, tool adapters and calibrated acceptance rules.

| Dimension | Inspect AI role | Inspect Evals available proxy | AgentCompass available/potential role | Coverage gap |
| --- | --- | --- | --- | --- |
| ED-01 Evidence/repository reasoning and continuity | Custom multi-file retrieval/authority checks and versioned logs | SWE-bench; InfiniteBench/NIAH retrieval | Codex and repository-task source declarations | No built-in COR-01/COR-03/E2-013 authority or cold re-entry test |
| ED-02 Frontend/visual fidelity | Custom image/DOM/geometry scorers | Coding tasks; no named visual website reconstruction family | Coding harness plus future custom benchmark | No installed calibrated HBC visual/type/crop scorer |
| ED-03 Responsive/environment reasoning | Parameterized viewport/input/preference fixtures | Desktop/browser proxies only | Environment plans/configuration inspection | No built-in inclusive breakpoint/touch/reduced matrix |
| ED-04 Temporal/scroll/state correctness | Custom action sequences and deterministic state assertions | Tau2/AgentDojo offer different stateful workflows | TauBench declaration and trajectory framework | No equivalent scrubbed video, rapid reversal or delayed-hide scorer |
| ED-05 Browser/tool execution and recovery | Tools/MCP/bridges and event logs | Mind2Web, AssistantBench, GAIA, OSWorld; distinguish offline versus live | Runtime harness discovery, deterministic analyzers; OSWorld/ScreenSpot declarations | Actual browser agent/sandbox execution untested |
| ED-06 Debugging/trustworthy verification | Pass/fail scorer controls, log audit, separate score definitions | SWE-bench and code-debug/task test sources; validity-review method | Deterministic trajectory analysis; retry/checkpoint source | No reproduced hidden-descendant/readiness failure or target acceptance |
| ED-07 Accessible operability/preferences | Custom keyboard/focus/inert/AX and motion-preference checks | No dedicated task-equivalent evaluation identified | No dedicated equivalent identified | Requires repository-specific semantics and branch assertions |
| ED-08 Robustness/adaptation | Custom resize/content/lifecycle/stress checks | SWE-bench, SWE-Lancer and code-test proxies | Coding harnesses and coding/terminal declarations | No current target content/action contract or calibrated stress suite |

No benchmark average may hide a critical failure in one dimension. The workload's asset/adaptation gates and uncalibrated raster tolerances remain unchanged.

## External benchmark family classification

**Direct support** means an identified implementation/registry entry for the exact family, with matching version/protocol still required. **Indirect** means an execution/audit substrate or a different capability proxy. **Methodology only** means useful review/design guidance. **Unsupported** means no direct shipped adapter was identified; it does not establish that future integration is impossible. None of these eight families was executed.

| Family / primary source | Direct support in these installed releases | Contribution / classification | Independent replication and quality inspection |
| --- | --- | --- | --- |
| [Arena WebDev / Image-to-WebDev](https://arena.ai/leaderboard?category=webdev) | None identified | Inspect AI indirect for local artifacts; Inspect Evals methodology; AgentCompass indirect coding harness | Published preference ratings/vote population cannot be recreated by installing tools. Requires exact category, sampling, ballots and rating protocol. Released data could be inspected separately; local image-to-web tasks would be a new evaluation |
| [VISTA](https://vista-benchmark.org/) / [paper](https://arxiv.org/abs/2605.26144) | None identified | Inspect AI indirect custom evaluation/logging; Evals review methodology; AgentCompass indirect harness | Conditional: verify official data, UI anchors, localization/behavior scorer and environment, pin revisions and port/test an adapter. No adapter or scorer parity established. Do not substitute the unrelated VISTA-Bench multimodal-understanding project |
| [SWE-rebench](https://swe-rebench.com/) / [paper](https://arxiv.org/abs/2505.20411) | None identified; SWE-bench is a different family | Inspect AI/Evals issue→patch machinery is indirect; AgentCompass SWE-family declarations indirect | Conditional on exact release, issue/test schema, environment images and scorer parity. Freshness/decontamination and published runs still require author data/protocol. A generic SWE-bench dataset parameter is not proof of compatibility |
| [Artificial Analysis Coding Agent Index methodology](https://artificialanalysis.ai/methodology/coding-agents-benchmarking/) | No exact index adapter | AgentCompass has a `deepswe` family declaration; installed terminal families are 2/2.1, not the current index's version. Inspect AI indirect audit substrate; Evals methodology | Current published v1.5 names DeepSWE v1.1, Terminal-Bench 4.0 and SWE-Atlas-QnA. Family overlap does not reproduce those versions, aggregation, retries, budgets or adjudication. Requires primary-source version/protocol and attempt artifacts |
| [Vision2Web](https://github.com/zai-org/Vision2Web) | None identified | Inspect AI indirect; Evals methodology; AgentCompass coding harness indirect | Conditional adapter using official dataset/evaluation code; task/scorer/environment quality can be reviewed once obtained. Official repository has its own inference/evaluation workflows; these tools do not reproduce them automatically |
| [WebCompass](https://github.com/NJU-LINK/WebCompass) | None identified | Inspect AI indirect; Evals methodology; AgentCompass harness indirect | Conditional on official modality/task categories, scorer and environment. **WebCompass is not AgentCompass.** Porting would require parity controls, not renaming a registry entry |
| [IWR-Bench](https://github.com/SIGMME/IWR-Bench) / [paper](https://arxiv.org/abs/2509.24709) | None identified | Inspect AI indirect temporal/visual task substrate; Evals methodology; AgentCompass coding harness indirect | Conditional video/interaction/scorer integration. Resolve official repository identity/redirect and release, obtain replay environment, inspect scorer validity. A screenshot test cannot substitute for interaction-video reconstruction |
| [WebsiteBench](https://website-bench.com/) / [protocol](https://website-bench.com/methodology) | None identified | Methodology for bounded exploration, reconstruction and multimodal auditing; Inspect AI could host custom checks | Primary page currently separates active dataset construction from agent experiments not started. Verify authoritative project/revision and release maturity before replication claims. Do not confuse it with the unrelated website-performance package |

These classifications were checked against Inspect Evals' installed imports/YAML inventory and AgentCompass's shipped registration declarations. AgentCompass's full-runtime failure bounds negative operational claims. Independent validation **now** concerns package/task/scorer/environment declarations, review availability and synthetic tooling behavior. **No existing numerical claim for the eight external families is newly independently validated.** Full sample quality, benchmark reproducibility and every external score remain dependent on primary sources and/or later authorized replication. Review methodology can be applied to other projects, but their adapters, datasets and findings do not arrive with this installation.

## Responsibility matrix and redundancy

| Responsibility | Best suited tool(s) | Role / limit |
| --- | --- | --- |
| Benchmark validity inspection | Inspect Evals methodology + human/source review | Claims, construct, sample and scorer review; no automatic validity guarantee |
| Dataset inspection | Inspect AI + Inspect Evals definitions | Sample schemas and transformations; actual external samples still required |
| Scorer inspection | Inspect AI + Inspect Evals source | Custom/deterministic scorer controls and implementation audit |
| Task/environment inspection | Inspect Evals for its tasks; AgentCompass for compatible recipes | Inspect task/sandbox declarations versus composed runtime plans; execution prerequisites separate |
| Agent trajectory inspection | Inspect AI; AgentCompass optional | Inspect logs/trace/query/view; ACTF analyzers verified on synthetic data |
| Coding-agent benchmark execution | Inspect AI + relevant Inspect Evals task | Prefer this existing pair; optional dependencies/sandbox required. AgentCompass is an alternative on a supported platform |
| External-agent evaluation | Inspect AI bridges; AgentCompass harnesses optional | Core bridges versus packaged harness integrations; no agent run established |
| Benchmark replication | Inspect AI custom adapter; Evals only for represented tasks | Exact data/scorer/environment/protocol parity required; none of the eight automatically replicated |
| Model × Harness comparison | AgentCompass architecture, conditional | Explicit component composition and recipes; currently blocked full benchmark discovery on Windows |
| Reproducibility | Inspect AI/Evals + bootstrap pins; AgentCompass conditional | Task versions, data revisions, logs/checkpoints; pin model/harness/image/protocol/budgets as well |
| Evaluation review/auditing | Inspect Evals review method + Inspect AI logs | Source review with inspectable traces; AgentCompass deterministic analyzers can supplement |

Inspect Evals **depends on and complements Inspect AI**; it is not a competing runner. AgentCompass substantially duplicates execution orchestration, coding-agent integration, trajectories, retries and sandbox planning. Its distinguishing benefit is explicit benchmark/harness/model composition and packaged harnesses/recipes. Keep Inspect AI + Evals as the primary reusable pair. AgentCompass is optional rather than a mandatory permanent stage, and its present Windows limitations do not justify invasive fixes or paid services.

## Reusable bootstrap and reproducibility limits

[bootstrap-benchmark-tooling.ps1](bootstrap-benchmark-tooling.ps1) is compatible with Windows PowerShell 5.1+ and can be copied with this directory into future repositories. It requires an existing uv installation, selects managed Python 3.12.15, installs the exact releases in separate tool environments and constrains every dependency using the installed snapshots. It checks process exit codes, dependencies, versions, offline smoke results and launcher identity. It reports the known AgentCompass PARTIAL condition explicitly.

```powershell
# Install or safely rerun; the switch fixes missing/shadowed user launchers.
& .\model-selection\eval-tooling\bootstrap-benchmark-tooling.ps1 -AddUserPath

# Verify installed tooling without installing packages.
& .\model-selection\eval-tooling\bootstrap-benchmark-tooling.ps1 -VerifyOnly -AddUserPath
```

No virtualenv activation, execution-policy change, administrator Python installation, provider credentials, `.env`, model endpoint or new account is required. Output goes to a temporary evidence directory by default; `-EvidenceDirectory` selects another location. User-level uv cache/runtime/tool writes require normal access to that user's profile. Native sandbox restrictions may require authorization for those writes. If uv is missing, the script stops with its official installation link instead of downloading/executing an installer. Runtime and every installed distribution are checked against the snapshots before installation, so matching environments are left in place. This avoids an observed uv 0.12.22 interpreter-matching issue that unnecessarily recreated the otherwise compatible Inspect environment on repeated direct `uv tool install` calls. A differing graph is reconciled; verification-only mode reports the difference. Keep future task-specific extras in a separate task environment or deliberately revise these base snapshots.

[inspect-constraints.txt](inspect-constraints.txt) and [agentcompass-constraints.txt](agentcompass-constraints.txt) are exact Windows/Python 3.12 dependency snapshots, with no local wheel paths or editable projects. [verify-tooling.py](verify-tooling.py) is the reusable offline verifier, not a workload benchmark. Use the target environment's Python; system Python intentionally cannot import its packages by default.

The snapshots pin versions rather than enforcing every transitive wheel's hash. Top-level release hashes are retained in the metadata receipt. This is repeatable dependency resolution on the selected platform, not bit-for-bit reproduction of a future model evaluation. Benchmark runs must separately record data revisions and splits, selected cases, scorer code, immutable image digests, harness binaries/configuration, model identifier, protocol, tool permissions, seed/attempt policy, limits and all failures. Floating image tags and unpinned Codex installation defaults need resolution before execution. No repeatability or contamination claim follows from package installation alone.

## Gate decision and next action

**PARTIAL**, rather than BLOCKED: the primary Inspect pair is installed, globally accessible and operational for the allowed offline verification scope; AgentCompass provides usable CLI/harness/analyzer inspection but its benchmark registry is blocked on native Windows. No target acceptance or benchmark-evidence-finalization gate is cleared. AgentCompass runtime execution also lacks an allowed supported local environment here.

**Single next justified action:** perform a bounded primary-source validity audit of **VISTA's dataset, scorer and environment**, including exact revision and replication prerequisites, mapping its actual measurements to ED-02/05/06 before any claims enter `benchmark-evidence.md`. This is justified by its visual-spec-to-web-app scope; it does not select a model, authorize a model run or require AgentCompass to remain in use.

Created files are confined to `model-selection/eval-tooling/`: this inventory, bootstrap, offline verifier, two dependency snapshots, release/machine receipts, Inspect/AgentCompass/CLI verification receipts and [final validation receipt](validation.json). `benchmark-evidence.md` remains empty with SHA-256 `E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855`. No candidate-model, routing or reference artifact was edited.

# Benchmark evidence — WP-HBC-01

Status: **Stage 1 external-evidence filter refreshed for cross-agent orchestration and routing-policy design.**  
Research snapshot: **2026-10-05**.  
Canonical workload: [workload-profile.md](workload-profile.md).  
Deep benchmark audit already completed where it materially mattered: [VISTA validity audit](benchmark-verification/vista-validity-audit.md).

## Purpose

This file is a decision-oriented external evidence snapshot for the Haunted Boulder City reconstruction workload. It is not a forensic audit of every public benchmark and it is not a champion decision.

External evidence is used to:
1. reduce the model field;
2. identify distinct strengths relevant to WP-HBC-01;
3. seed the routing policy;
4. expose capability gaps that must later be validated on project-specific tasks.

The project workload and fidelity contract remain authoritative. Public benchmark results do not override repository evidence or acceptance obligations.

## Current decision-driving evidence

| Evidence source | Relevance to WP-HBC-01 | Current useful signal | Weight |
| --- | --- | --- | --- |
| [Arena WebDev — Overall](https://arena.ai/leaderboard/code/webdev/overall) | Agentic web implementation, multi-step reasoning and tool use | 2026-10-01: Claude Opus 5.5 Max **#1 / 1815**; GPT-6 Astra Max **#2 / 1788**; Claude Sonnet 5.5 xHigh **#3 / 1786**; GPT-6.1 Sol Max **#4 / 1758** | **High supporting signal** |
| [Arena Image-to-WebDev](https://arena.ai/leaderboard/code/image-to-webdev?rankBy=models) | Screenshot/image-to-website reconstruction | 2026-09-13: GPT-6 Astra Max **#1 / 1733**. Qwen3.8-Max-0902 **#5 / 1639**. GLM-5.3-Flash **#10 / 1588** | **High visual reconstruction signal** |
| [Arena WebDev — Fullstack](https://arena.ai/leaderboard/code/webdev/fullstack) | End-to-end web implementation and tool use | 2026-10-01: GPT-6 Astra Max **#1 / 1752**; Claude Opus 5.5 Max **#2 / 1736** | **Supporting cross-check** |
| [SWE-rebench](https://swe-rebench.com/) | Repository implementation, debugging and test discipline | Existing project research: GPT-5.6 Sol under Codex methodology reached **62.3% Result@1**, about **0.6M tokens/task** | **High engineering signal for GPT-5.6 Sol** |
| [VISTA](https://vista-benchmark.org/) | Visual-spec to runnable web app and elementary DOM behavior | Local audit classifies VISTA **SUPPORTING, MEDIUM confidence**. GPT-5.6 Sol/Codex 0.507 remains **WEAK** isolated-model evidence because harness/config effects are material | **Bounded supporting signal** |
| [Arena Agent signals](https://arena.ai/leaderboard/agent/chat?rankBy=labs) | Tool reliability, task completion, steerability and recovery | Current signal keeps Claude Sonnet 5.5 and GPT-6 Astra among the strongest agentic systems, but this is not a project-specific fidelity measure | **Supporting agentic signal** |

## Benchmark families retained as methodology/watch signals

- **Vision2Web** — useful for responsive and interactive frontend coverage; current result coverage is not sufficient to decide the present frontier pool.
- **IWR-Bench** — highly relevant methodology for interaction reconstruction and action-sequence fidelity; published model results are older than the present frontier set.
- **WebsiteBench** — conceptually close to browser exploration → clone → journey/interaction validation; current model-result coverage is not sufficient for ranking.
- **WebCompass** — useful generation/edit/repair methodology, but not a primary current ranking source for this decision.
- **Aider benchmark** — generic coding/editing signal; weaker fit than the web/repository evidence above for this project.

## Project-specific gaps public benchmarks do not settle

The following remain internal-eval concerns regardless of public rank:

- story forward/reverse state continuity;
- interrupted animation and rearm behavior;
- scroll-driven state machines and serialized video seeking;
- loader/menu/modal lifecycle timing and interruption;
- reduced-motion switching and touch/coarse-pointer branches;
- exact typography/geometry/crop relationships against repository evidence;
- evidence authority and source-precedence discipline;
- no destructive simplification;
- browser/MCP recovery inside the selected execution runtime;
- adaptation quality under FC-TARGET-DESIGN-01.

These map directly to W-01..W-13 and the TF/M obligations in the repository.

## Comparability rules

Public numbers are evidence about **model + configuration/effort + harness + benchmark revision**, not a model in isolation.

For later project-specific evaluation:
1. pin repo SHA, specification/task revision, evidence package and acceptance criteria;
2. record the exact execution engine/harness, model, effort and tool permissions;
3. compare model variants under the same execution conditions when the question is model quality;
4. when comparing complete agent systems, label the result as an agent-system result rather than isolated model evidence;
5. do not infer a missing result from a nearby model or another harness;
6. quality gates precede cost/latency optimization for critical work.

## Routing implication

The evidence supports a **multi-pool routing policy**, not one global model.

- Frontier planning/reasoning and repo-wide work need the strongest general engineering candidates.
- Visual/reference/motion work needs the strongest web/fidelity candidates.
- Review must be independent from the author on critical work.
- Lower-risk mechanical work can use cheaper/local candidates.
- Model identity must remain explicit for critical routes; opaque Auto routing is not considered reproducible unless the resolved model/configuration is captured.

The candidate pool is recorded in [candidate-models.md](candidate-models.md), and the project routing rules are recorded in [routing-policy.md](routing-policy.md).

# Benchmark evidence — WP-HBC-01

Status: **Stage 1 external-evidence filter complete enough to produce the model shortlist.**
Research snapshot: **2026-10-05**.
Canonical workload: [workload-profile.md](workload-profile.md).
Deep benchmark audit performed only where already justified: [VISTA validity audit](benchmark-verification/vista-validity-audit.md).

## Purpose

This file is a decision-oriented external evidence snapshot for the Haunted Boulder City reconstruction workload. It is **not** a forensic validity audit of every public benchmark.

External benchmarks are used only to reduce the model set before project-specific evaluation. The project workload remains authoritative. Public scores do not replace the later fixed-Codex evaluation on representative HBC work.

The shortlist is also constrained by the current project operating boundary: keep **Codex as the fixed harness** and do **not** introduce new paid APIs or subscriptions just to include another leaderboard model. A model outside that execution/access boundary can remain research evidence without becoming a runnable candidate.

The workload is especially sensitive to evidence-grounded repository reasoning, advanced frontend construction, visual fidelity, responsive behavior, motion and temporal state, scroll-driven behavior, browser/tool execution, debugging discipline, accessibility/reduced-motion/touch behavior, avoiding destructive simplification, and maintainable adaptation.

## Evidence used for shortlist selection

| Evidence source | Contribution to WP-HBC-01 | Snapshot / useful result | Decision weight |
| --- | --- | --- | --- |
| [Arena WebDev — Overall](https://arena.ai/leaderboard/code/webdev/overall) | Front-end/web implementation with agentic coding workflows | 2026-10-01: GPT-6 Astra Max **#2, 1788**; GPT-6.1 Sol Max **#4, 1758**; GPT-6 Sol Max **#8, 1689** | **High supporting signal** |
| [Arena WebDev — Reference-Based Design](https://arena.ai/leaderboard/code/webdev/reference-based-design) | Reference-driven web reconstruction | 2026-10-01: GPT-6 Astra Max **#3, 1823**; GPT-6.1 Sol Max **#5, 1801**; GPT-5.6 Sol xHigh with Codex harness **#15, 1656** | **High supporting signal** |
| [Arena Image-to-WebDev](https://arena.ai/leaderboard/code/image-to-webdev?rankBy=models) | Screenshot/image-to-website reconstruction | 2026-09-13: GPT-6 Astra Max **#1, 1733**; GPT-5.6 Sol xHigh with Codex harness **#8, 1604** | **High supporting signal** |
| [SWE-rebench](https://swe-rebench.com/) | Repository implementation, debugging, testing and harness-aware engineering | June–July 2026: GPT-5.6 Sol medium under Codex methodology **62.3% Result@1**, about **0.6M tokens/task** | **High engineering signal** |
| [Artificial Analysis Coding Agent Index](https://artificialanalysis.ai/agents/coding-agents/) and [methodology](https://artificialanalysis.ai/methodology/coding-agents-benchmarking) | Independent coding-agent/terminal/reliability cross-check | Current comparison: GPT-6 Astra Max Intelligence **53**, Terminal-Bench 4.0 **59%**; GPT-6.1 Sol Max **52**, Terminal-Bench 4.0 **56%** | **Supporting cross-check** |
| [VISTA](https://vista-benchmark.org/) | Visual-spec to web-app construction and elementary DOM behavior | Local audit: **SUPPORTING BENCHMARK, MEDIUM confidence**. GPT-5.6 Sol/Codex 0.507 is **WEAK** model evidence; GPT-5.6 Sol/CAMEL 0.538 ± 0.016 SD is **SUPPORTING**, but cross-harness comparison is not clean model evidence | **Bounded supporting signal** |

## VISTA qualification retained from the local audit

The VISTA audit is the only deep benchmark validity audit performed in this gate. Its result changes how the leaderboard can be used:

- VISTA is **supporting**, not a primary ranking source for this project.
- Its strongest relevance is visual/frontend construction.
- It does **not** establish exact visual fidelity, responsive behavior, HBC-style motion/state correctness, accessibility, touch behavior or long-horizon repository continuity.
- The current scorer permits false-positive paths, including no-op credit and permissive matching.
- Model-only ranking claims are unsafe when harness/configuration/evaluator revisions differ.
- VISTA may support a shortlist decision but cannot decide the winner.

See [vista-validity-audit.md](benchmark-verification/vista-validity-audit.md) for the full evidence.

## Additional benchmark families reviewed but not used as primary shortlist drivers

| Benchmark family | Use in this gate | Reason |
| --- | --- | --- |
| Vision2Web | Methodology / coverage reference | Strong responsive and functional task design, but current result coverage was insufficient for the present shortlist |
| WebCompass | Supporting methodology reference | Relevant web generation/edit/repair lifecycle, but published model coverage is not the cleanest match for the current candidates |
| IWR-Bench | Interaction-reconstruction reference | Highly relevant to interaction/video-driven reconstruction, but available published model results are older than the current shortlist |
| WebsiteBench | Methodology reference | Conceptually close to browser exploration → clone → interaction/journey validation, but not a usable current model-ranking source |
| Aider benchmark | Secondary coding-editing reference | Present in the original plan, but stronger current web/repository signals above make it unnecessary for reducing this shortlist |

## Workload-to-evidence mapping

| Workload area | Best external evidence currently available | Remaining project-specific gap |
| --- | --- | --- |
| Visual/reference frontend fidelity | Arena Reference-Based Design, Image-to-WebDev, bounded VISTA | Pixel/typography/crop fidelity against HBC evidence |
| Advanced frontend implementation | Arena WebDev, VISTA | Layered scenes, sticky stories, scrubbed media and lifecycle correctness |
| Repository reasoning / debugging | SWE-rebench, Artificial Analysis | Correct use of this repository's evidence precedence and corrections |
| Browser/tool execution | Arena agentic workflows, Artificial Analysis, VISTA harness evidence | Actual browser/MCP/tool recovery under our Codex setup |
| Motion / temporal / scroll state | IWR-Bench as methodology support | Major gap: reversal, interruption, rearm, scroll travel, seek serialization and menu timing |
| Responsive / breakpoint behavior | Vision2Web methodology support | Major gap: project-specific 760/1100/1800 boundaries and short-height cases |
| Accessibility / reduced motion / touch | No strong public ranking signal used here | Must be evaluated internally |
| Adaptation / no destructive simplification | No clean public ranking signal | Must be evaluated internally |

## Comparability rules carried forward

Public numbers are evidence about a **model + effort/config + harness + benchmark revision**, not a model in isolation.

For later project-specific comparison:

1. Keep **Codex fixed** as the execution harness.
2. Keep repository commit, evidence package, permissions, tools, task prompt and acceptance criteria fixed.
3. Change only the candidate model/configuration being compared.
4. Apply project quality gates before cost/latency/token efficiency.
5. Do not infer a missing result for a model from a nearby model or another harness.\n6. Before any project-specific comparison, verify that each candidate is actually exposed to the current Codex client/account. Arena labels such as `Max` are leaderboard configurations, not assumed Codex model slugs; map them only to an actually selectable model + reasoning setting.

## Stage 1 conclusion

The external evidence is sufficient to reduce the field without spending more credits on benchmark auditing.

The shortlist is recorded in [candidate-models.md](candidate-models.md). No champion is selected here, and no router decision is made here.

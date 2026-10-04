# Candidate models — WP-HBC-01

Status: **Candidate pool refreshed for routing-policy design. No champion selected.**  
Date: **2026-10-05**.  
Evidence source: [benchmark-evidence.md](benchmark-evidence.md).  
Workload authority: [workload-profile.md](workload-profile.md).

## Selection rule

The pool is intentionally broader than a single-model bakeoff because the project now targets a multi-agent orchestration layer.

A model stays in the pool only if it adds a distinct value for at least one project lane: frontier planning/reasoning, visual/reference implementation, repo/tool debugging, independent review, or lower-cost/local support.

Leaderboard labels such as **Max** and **xHigh** describe published configurations. Runtime configuration must be mapped to the exact model + effort actually exposed by the chosen CLI/agent and must be logged.

## Critical candidate pool

| Candidate family | Why it remains | Current external signal | Intended routing value |
| --- | --- | --- | --- |
| **Claude Opus 5.5** | Strongest current general WebDev signal and strong fit for ambiguous long-horizon planning/review | Arena WebDev Overall 2026-10-01: **#1 / 1815** | Planning, architecture/evidence synthesis, difficult cross-cutting implementation, independent review |
| **GPT-6 Astra** | Strongest direct image/reference reconstruction signal in the current evidence | Arena WebDev Overall **#2 / 1788**; Image-to-WebDev **#1 / 1733**; WebDev Fullstack **#1 / 1752** | Visual/reference fidelity, frontend/motion implementation, visual recovery/escalation |
| **Claude Sonnet 5.5** | Near-frontier WebDev quality with a better efficiency profile than the heaviest frontier options | Arena WebDev Overall xHigh **#3 / 1786** | Constrained implementation, iterative frontend work, review, medium-cost critical work |
| **GPT-6.1 Sol** | Strong frontier engineering candidate with current WebDev evidence | Arena WebDev Overall Max **#4 / 1758** | Repo-scale engineering, architecture, debugging/tool-heavy implementation |
| **GPT-5.6 Sol** | Direct project-relevant Codex/repository evidence remains unusually useful even though newer models lead current WebDev | SWE-rebench direct Codex methodology **62.3% Result@1**; local VISTA audit retains direct Codex evidence with caveats | Debugging, verification-oriented engineering, independent review, comparison anchor |
| **GLM 5.3** | Distinct lower-cost/open-model family available to the user and relevant enough to remain a challenger | Arena family evidence places GLM-5.3 in current WebDev; GLM-5.3-Flash is **#10 / 1588** on Image-to-WebDev | Lower-cost support, bounded implementation, secondary review; critical promotion requires internal evidence |

## Support-only local worker

**Qwen3.8-27B local** remains available for low-risk/support work where local execution is valuable.

Public Qwen3.8 family results are useful only as family-level context; they are **not** assumed to equal the user's exact local quantization/runtime. It is not authorized as the sole owner of a critical HBC obligation until internal evaluation proves that route.

## Not promoted into the current pool

- **Claude Fable 5.1** has strong public web results, but overlaps materially with Opus/Sonnet while adding another heavy route.
- **GPT-6 Sol** overlaps with GPT-6.1 Sol/Astra without adding enough distinct project evidence.
- **Muse, Grok, Gemini, Kimi, Composer and other current leaderboard models** may be useful later, but there is no present project-specific reason to expand the critical pool further.
- **Cursor Auto** is not a model candidate. It is an opaque selection mechanism and belongs to runtime routing, not candidate identity.

## Access boundary

The routing policy should prefer models already reachable through the user's existing subscriptions, installed CLIs, Cursor, OpenCode, or local runtime.

No route may silently introduce a new paid API/subscription. If a logical candidate is unavailable in the selected execution engine, use the next eligible candidate from the same lane and record the fallback.

## Gate outcome

The **critical routing pool** carried forward is:

1. Claude Opus 5.5
2. GPT-6 Astra
3. Claude Sonnet 5.5
4. GPT-6.1 Sol
5. GPT-5.6 Sol
6. GLM 5.3

The **support-only local worker** is Qwen3.8-27B local.

This file does not choose a champion and does not bind tasks directly to models. Concrete assignment is governed by [routing-policy.md](routing-policy.md) after task/spec metadata exists.

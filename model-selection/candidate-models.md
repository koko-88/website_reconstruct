# Candidate models — WP-HBC-01

Status: **Historical advisory research; no execution allowlist or champion selected.**
Date: **2026-10-05**.  
Evidence source: [benchmark-evidence.md](benchmark-evidence.md).  
Workload authority: [workload-profile.md](workload-profile.md).

## Selection rule

These dated capability comparisons support optional runtime selection. They do not require multi-agent execution, select the environment or limit the user to a vendor/model pool.

A model stays in the pool only if it adds a distinct value for at least one project lane: frontier planning/reasoning, visual/reference implementation, repo/tool debugging, independent review, or lower-cost/local support.

Leaderboard labels such as **Max** and **xHigh** describe published configurations. Runtime configuration must be mapped to the exact model + effort actually exposed by the chosen CLI/agent and must be logged.

## Critical candidate pool

The following families were research candidates at the assessment date. Their published signals do not establish current runtime availability or feature acceptance. [RP-HBC-01](routing-policy.md) governs authorized execution and [RR-HBC-01](runtime-route-registry.md) records capabilities; neither requires blanket benchmark qualification for direct work.

| Candidate family | Why it remains | Current external signal | Intended routing value |
| --- | --- | --- | --- |
| **Claude Opus 5.5** | Strongest current general WebDev signal and strong fit for ambiguous long-horizon planning/review | Arena WebDev Overall 2026-10-01: **#1 / 1815** | Planning, architecture/evidence synthesis, difficult cross-cutting implementation, independent review |
| **GPT-6 Astra** | Strongest direct image/reference reconstruction signal in the current evidence | Arena WebDev Overall **#2 / 1788**; Image-to-WebDev **#1 / 1733**; WebDev Fullstack **#1 / 1752** | Visual/reference fidelity, frontend/motion implementation, visual recovery/escalation |
| **Claude Sonnet 5.5** | Near-frontier WebDev quality with a better efficiency profile than the heaviest frontier options | Arena WebDev Overall xHigh **#3 / 1786** | Constrained implementation, iterative frontend work, review, medium-cost critical work |
| **GPT-6.1 Sol** | Strong frontier engineering candidate with current WebDev evidence | Arena WebDev Overall Max **#4 / 1758** | Repo-scale engineering, architecture, debugging/tool-heavy implementation |
| **GPT-5.6 Sol** | Direct project-relevant Codex/repository evidence remains unusually useful even though newer models lead current WebDev | SWE-rebench direct Codex methodology **62.3% Result@1**; local VISTA audit retains direct Codex evidence with caveats | Debugging, verification-oriented engineering, independent review, comparison anchor |
## Challenger / support pool

**GLM 5.3** remains a challenger for lower-cost support, bounded implementation and secondary review. Its capability evidence was weaker at the assessment date; this is advisory research, not a current execution prohibition.

## Support-only local worker

**Qwen3.8-27B local** remains available for low-risk/support work where local execution is valuable.

Public Qwen3.8 family results are useful only as family-level context; they are **not** assumed to equal the user's exact local quantization/runtime. Evaluate its actual capabilities against the selected task and acceptance rather than inferring them from family rankings.

## Not promoted into the current pool

- **Claude Fable 5.1** has strong public web results, but overlaps materially with Opus/Sonnet while adding another heavy route.
- **GPT-6 Sol** overlaps with GPT-6.1 Sol/Astra without adding enough distinct project evidence.
- **Muse, Grok, Gemini, Kimi, Composer and other current leaderboard models** may be useful later, but there is no present project-specific reason to expand the critical pool further.
- **Cursor Auto** is not a model candidate. It is an opaque selection mechanism and belongs to runtime routing, not candidate identity.

## Access boundary

The routing policy should prefer models already reachable through the user's existing subscriptions, installed CLIs, Cursor, OpenCode, or local runtime.

No route may silently introduce a new paid API/subscription. If an option is unavailable, preserve the approved execution configuration and follow RP recovery; ask before changing environment or authorization.

## Gate outcome

The **critical routing pool** carried forward is:

1. Claude Opus 5.5
2. GPT-6 Astra
3. Claude Sonnet 5.5
4. GPT-6.1 Sol
5. GPT-5.6 Sol
The **challenger/support candidate** is GLM 5.3.

The **support-only local worker** is Qwen3.8-27B local.

This file does not choose a champion and does not bind tasks directly to models. Concrete assignment is governed by [routing-policy.md](routing-policy.md) after task/spec metadata exists.

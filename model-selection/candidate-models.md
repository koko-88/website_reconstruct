# Candidate models — WP-HBC-01

Status: **Stage 1 shortlist selected from external evidence. No champion selected.**
Date: **2026-10-05**.
Evidence source: [benchmark-evidence.md](benchmark-evidence.md).
Workload authority: [workload-profile.md](workload-profile.md).

## Selection rule

Keep the shortlist deliberately small to avoid unnecessary evaluation cost. A candidate must add distinct evidence value for the actual HBC workload, not merely rank well on generic coding.

The later comparison will use **Codex as the fixed execution harness** with the same repository revision, evidence, tools, permissions, task prompt and acceptance criteria. Only the model/configuration should change.

A candidate that is not actually selectable in the fixed Codex environment at evaluation time is marked **not runnable** rather than silently switching to another coding agent.

## Shortlist

| Candidate | Why it remains | External evidence relevant to this workload | Main uncertainty before project-specific evaluation |
| --- | --- | --- | --- |
| **GPT-6 Astra Max** | Strongest current visual/reference-web candidate | Arena WebDev Overall **#2 / 1788**; Reference-Based Design **#1 / 1827**; Image-to-WebDev **#1 / 1733**. Artificial Analysis reports Intelligence **53** and Terminal-Bench 4.0 **59%** | Strong public signal, but no clean HBC-specific evidence for motion/state/reversal/accessibility; higher reported cost than Sol variants |
| **GPT-6.1 Sol Max** | Strong current engineering candidate with materially better reported efficiency than Astra | Arena WebDev Overall **#4 / 1758**. Artificial Analysis reports Intelligence **52** and Terminal-Bench 4.0 **56%**, with much lower reported cost than Astra Max | Current Image-to-WebDev snapshot does not provide equivalent direct evidence; must prove visual/motion fidelity on our workload |
| **GPT-5.6 Sol** | Most direct Codex-specific evidence across repository-engineering and web reconstruction sources | SWE-rebench under Codex methodology: **62.3% Result@1**, ~**0.6M tokens/task** at medium effort. Arena Image-to-WebDev xHigh/Codex **#8 / 1604**; Reference-Based Design **#10 / 1651**. VISTA has direct Codex evidence, but the local audit classifies the 0.507 result as **WEAK** model evidence | Newer models lead current web leaderboards; this candidate remains because its Codex-specific evidence is unusually direct and useful for comparison |

## Not shortlisted now

- **GPT-6 Sol Max**: strong current WebDev result, but it does not add enough distinct evidence beyond GPT-6.1 Sol and GPT-6 Astra to justify a fourth run at this stage.
- Other frontier/open models may score well on individual leaderboards, but expanding the field conflicts with the purpose of this gate: reduce evaluation cost before project-specific work.
- Vision2Web, WebCompass, IWR-Bench and WebsiteBench do not currently justify adding another model solely from their published results.

## What this shortlist does not claim

- It does not rank the three candidates for HBC.
- It does not claim that public benchmark rank transfers directly to HBC motion, temporal state, accessibility or evidence adherence.
- It does not select reasoning effort yet unless the actual Codex configuration requires it for a runnable comparison.
- It does not decide static versus dynamic routing.
- It does not authorize a full-site multi-model build.

## Gate outcome

**Candidate shortlist: CLOSED for Stage 1 unless availability changes materially.**

Candidates carried forward:

1. **GPT-6 Astra Max**
2. **GPT-6.1 Sol Max**
3. **GPT-5.6 Sol**

The next Model Selection & Routing Gate activity is **ready-made router selection / routing policy design**, using this shortlist and the project workload. Project-specific model evaluation remains a later validation step, not a reason to delay the routing decision.

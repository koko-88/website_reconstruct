# Routing policy — RP-HBC-01

Status: **ACTIVE-PROVISIONAL — lane architecture approved; per-task assignments and preference order remain subject to project-specific evaluation.**  
Revision: **1**  
Date: **2026-10-05**  
Applies to: **WP-HBC-01 / FC-TARGET-DESIGN-01**

## Purpose

This policy converts the project workload and candidate evidence into a reproducible routing layer for later multi-agent execution.

It intentionally sits **above concrete Spec Kit tasks**:

```text
project workload + fidelity contract + benchmark evidence
                        ↓
                 routing policy
                        ↓
                Spec Kit task set
                        ↓
          runtime task classification
                        ↓
          agent/model/worktree assignment
                        ↓
             review + verification + CI
```

The policy defines **which kinds of work may go to which candidate pools and which gates apply**. It does not pre-assign every W-ID to one model and it does not replace task decomposition.

## Authority and precedence

Routing never overrides project truth. Use this precedence:

1. [FC-TARGET-DESIGN-01](../implementation-scope/fidelity-scope-contract.md)
2. [AR-HBC-01 authority reconciliation](../implementation-scope/authority-reconciliation.md)
3. [pre-build evidence packet](../implementation-scope/pre-build-packet/README.md) and its corrections/authority crosswalk
4. [WP-HBC-01 workload profile](workload-profile.md)
5. concrete Spec Kit specification/plan/task revision once generated
6. [benchmark evidence](benchmark-evidence.md)
7. [candidate pool](candidate-models.md)
8. this routing policy's preference ordering

If a route conflicts with evidence authority, scope, asset/reuse gates, or acceptance obligations, the route loses.

## Core production rules

1. **Route tasks, not workload IDs.** W-01..W-13 are capability requirements and tags; they are not executable tasks.
2. **Critical quality first.** For Critical obligations, model capability and verification come before cost/latency.
3. **No opaque critical routing.** A critical task must record the resolved model, effort/configuration and execution engine. Cursor Auto or any other opaque auto-selector is allowed only when the resolved route is captured; otherwise it is support-only.
4. **Independent critical review.** A critical code change must be reviewed by a different model family from the author when a viable alternative exists.
5. **Machine verification outranks self-report.** An agent saying "done" is not acceptance. Repository tests/browser checks/acceptance contracts/CI decide completion.
6. **Shared repo, isolated writes.** Concurrent write tasks use isolated branches/worktrees. Agents do not concurrently mutate the same working tree.
7. **Bounded retries and explicit escalation.** Repeated failure changes the route; it does not create an unbounded same-agent loop.
8. **No silent provider expansion.** The runtime may use only approved existing access paths unless the user explicitly approves a new paid provider/API.
9. **Specs stay portable.** Spec Kit artifacts should describe the work and acceptance, not hard-code a vendor/model unless a genuine capability constraint requires it.
10. **Critical execution requires qualification.** Inclusion in a candidate pool or public benchmark rank does not authorize a model/harness route for Critical work. A Critical task may execute only on a route marked **QUALIFIED** for its dominant lane in [RR-HBC-01](runtime-route-registry.md).

## Route qualification lifecycle

Every model + engine + effort/tool configuration moves through an explicit lifecycle:

1. **CANDIDATE** — research evidence is sufficient to keep the route under consideration; no Critical execution authority.
2. **EVALUATION-PERMITTED** — the exact runtime path is runnable enough for bounded project-specific qualification work; outputs may not be integrated as Critical production work solely on this status.
3. **QUALIFIED** — a pinned model/engine/configuration has passed representative project-specific checks for one or more named lanes. Qualification is lane-scoped, not global.
4. **SUSPENDED** — a previously qualified route is temporarily ineligible because of availability, configuration drift, repeated failures or contradictory evidence.

A qualification receipt must record at minimum: route identifier; engine/harness; exact model and effort/configuration; tool/permission envelope; repo/spec revision; representative task(s); lane(s) covered; acceptance checks and per-check outcomes; date; and any limitations. **Critical acceptance failures are not averaged away.**

Before concrete Spec Kit tasks exist, routes may remain CANDIDATE. Once representative tasks exist, qualification runs are prerequisites to autonomous Critical execution, not prerequisites to specification/planning.

## Task routing envelope

Once Spec Kit creates concrete tasks, each routable task should expose or allow the orchestrator to derive:

- **task_id / spec revision**
- **workload_refs:** relevant W-01..W-13
- **criticality:** Critical or Secondary
- **dominant capability:** planning/evidence, fidelity-motion, repo-engineering, review-verification, support-mechanical
- **change scope:** read-only, local, multi-file, repo-wide
- **risk flags:** visual, motion/stateful, responsive, accessibility, evidence-sensitive, browser/tool-heavy, destructive-simplification risk
- **acceptance refs:** TF/M/AC/test/browser checks that must pass

These attributes determine the lane. Model names stay in this policy rather than in every task.

## Routing lanes

### L1 — Architecture, planning, evidence and long-horizon reasoning

**Typical triggers**
- W-01, W-02, W-10, W-12, W-13
- repo-wide planning or dependency reasoning
- conflicting/ambiguous evidence
- scope/adaptation decisions
- tasks whose wrong decomposition would cause large rework

**Preferred candidate pool**
1. **Claude Opus 5.5**
2. **GPT-6.1 Sol**
3. **Claude Sonnet 5.5** for bounded/constrained planning

**Rules**
- L1 may be read-only planning before an implementation lane executes.
- A model in the support-only pool may gather information but may not approve a critical scope/evidence decision.
- A scope/evidence conflict that cannot be resolved from repository authority triggers a human gate rather than implementation.

### L2 — Visual fidelity, frontend, motion and stateful interaction

**Typical triggers**
- W-03, W-04, W-05, W-06, W-07, W-11
- TF-01..TF-05
- M-01..M-12 mechanics
- screenshot/reference reconstruction, typography, breakpoint behavior, scroll state, animation interruption/reversal, reduced-motion/touch branches

**Preferred candidate pool**
1. **GPT-6 Astra**
2. **Claude Opus 5.5**
3. **Claude Sonnet 5.5**
4. **GPT-6.1 Sol** when the task is equally repo/engineering-heavy

**Selection guidance**
- Prefer **GPT-6 Astra** when the dominant uncertainty is visual/reference reconstruction or frontend fidelity.
- Prefer **Claude Opus 5.5** when fidelity is coupled to high ambiguity, broad coordination or difficult state reasoning.
- Prefer **Claude Sonnet 5.5** for bounded iterative frontend work after the architecture/behavior contract is already clear.
- Critical L2 changes always require L4 review plus machine/browser acceptance.

### L3 — Repository engineering, tooling, debugging and recovery

**Typical triggers**
- W-01, W-08, W-09, W-10, W-13
- multi-file defects
- browser/MCP/tool execution and recovery
- build/test failures
- integration and maintainability work whose dominant risk is engineering correctness rather than visual interpretation

**Preferred candidate pool**
1. **GPT-6.1 Sol**
2. **Claude Opus 5.5**
3. **GPT-5.6 Sol**
4. **Claude Sonnet 5.5**

**Selection guidance**
- Prefer **GPT-6.1 Sol** for repo-wide implementation/debugging and tool-heavy engineering.
- Prefer **GPT-5.6 Sol** when direct Codex/repository evidence is useful or as an independent engineering reviewer.
- Escalate to Opus when repeated debugging reveals requirement/evidence ambiguity rather than a local defect.

### L4 — Independent review and verification

L4 is cross-cutting and is added to every **Critical** implementation route.

**Reviewer rule**
- If the author is an OpenAI-family model, prefer a Claude-family reviewer.
- If the author is a Claude-family model, prefer GPT-6.1 Sol or GPT-5.6 Sol; use GPT-6 Astra when visual fidelity is the dominant review risk.
- If the author is GLM/Qwen/local, use a frontier candidate from the task's dominant lane.

**Reviewer responsibilities**
- inspect the diff against specification/evidence authority;
- look for destructive simplification and missing states;
- challenge unsupported claims;
- check acceptance coverage;
- never replace deterministic verification with opinion.

The reviewer is advisory until machine/browser/CI checks pass.

### L5 — Support, mechanical and low-risk bounded work

**Typical triggers**
- Secondary obligations
- repetitive edits
- deterministic test scaffolding
- low-ambiguity documentation/transforms
- bounded code changes with strong automated acceptance

**Preferred candidate pool**
1. **Claude Sonnet 5.5**
2. **GLM 5.3**
3. **Qwen3.8-27B local**
4. **GPT-5.6 Sol** when available and economical in the chosen execution path

**Restrictions**
- L5 may not be the sole owner of a Critical visual/motion/evidence decision.
- A support model may implement a bounded critical subtask only when L1/L2/L3 has already fixed the design and L4 + machine acceptance are mandatory.
- The local Qwen route remains support-only until internal project evaluation promotes it.

## Mixed-task composition

A task can pass through more than one lane.

Use this order for high-risk mixed tasks:

```text
L1 plan/evidence resolution
        ↓
dominant execution lane (L2 or L3)
        ↓
L4 independent review
        ↓
machine/browser acceptance
        ↓
integration/CI
```

Examples:

- A repo-wide scroll-story reconstruction with unclear state relationships: **L1 → L2 → L4**.
- A browser/MCP failure preventing visual validation: **L3 → L4**, then return to L2 only if the implementation itself needs fidelity repair.
- A deterministic unit-test expansion after accepted behavior is fixed: **L5**, with normal repository checks.

## Escalation and fallback

### Verification failure

Each routable task carries cumulative execution counters that survive model switches, lane switches, process restarts and resume:

- **max_attempts_total:** default **4** author execution attempts across all model families;
- **max_family_switches:** default **2** switches between model families;
- **repair_per_author_attempt:** at most **1** repair pass for a clear local defect before escalation;
- **execution_deadline:** must be declared by the task/orchestrator before autonomous Critical execution. A missing deadline blocks Critical execution rather than implying an unlimited run.

Flow:

1. First implementation failure caused by a clear local defect: allow one repair pass by the current author, consuming the same task budget.
2. Repeated failure of the same acceptance class, or a failed repair: switch to a different **QUALIFIED** model family in the same dominant lane if the cumulative counters permit it.
3. If the failure indicates unclear requirements/evidence: stop coding and route to **L1**; the original task counters remain attached to the task.
4. If a critical reviewer and author still disagree after one response cycle: trigger a **human gate**.
5. If **max_attempts_total**, **max_family_switches**, or the execution deadline is exhausted, terminate autonomous execution as **BLOCKED_EXECUTION** and require a human decision. Changing model, lane, process or worktree never resets these counters.

### Availability fallback

If the preferred model is unavailable:
- select the next eligible candidate in the same lane;
- preserve criticality and reviewer requirements;
- record the fallback reason;
- do not silently switch to Auto or introduce a new paid provider.

### Visual/motion failure

A failed critical visual/motion acceptance must return to **L2**. Do not downgrade the repair to a support-only model solely to save cost.

## Git and concurrency policy

- GitHub is the shared source of truth.
- Every concurrent **write** assignment gets an isolated worktree/branch rooted at the same approved base SHA.
- Read-only planners/reviewers may inspect the same pinned repository snapshot.
- No agent pushes directly to protected `main`.
- Integration happens only after required review and acceptance checks.
- Parallel tasks must not modify overlapping ownership surfaces unless the orchestrator serializes them or explicitly creates an integration task.

## Reproducibility receipt

The orchestration layer selected later must be able to record at minimum:

- task ID and spec revision;
- base repo SHA;
- workload refs / routing attributes;
- chosen lane(s);
- execution engine/agent;
- exact model and effort/configuration;
- branch/worktree;
- author and reviewer identities;
- route/fallback/escalation reason;
- acceptance contract/check identifiers;
- verification result;
- final integrated SHA/PR when applicable.

If the runtime cannot expose enough information to reconstruct why a critical route happened, it is not suitable as the sole production control plane.

## Spec Kit integration

This policy is intentionally created **before** Spec Kit task materialization.

Spec Kit should later produce portable specification/plan/tasks. The generated tasks should carry enough semantic information to derive the routing envelope, but should avoid embedding vendor/model choices.

The orchestrator then evaluates each concrete task against RP-HBC-01 and binds it to an agent/model/worktree at runtime.

That separation lets the project change orchestrators or model providers without rewriting the specification.

## Orchestration runtime decision

**Claw Orchestrator is the selected execution runtime for this project.** The current operator surface is Codex with the Claw MCP integration; OpenClaw may remain installed as an optional future host/gateway, but it is not the active production control plane for this project unless a later explicit decision changes that.

The authoritative runtime capability and route-readiness record is [RR-HBC-01](runtime-route-registry.md). Paperclip and other orchestrators are no longer active candidates for the first implementation path; re-evaluate only if Claw fails a required capability or materially changes.

## Orchestration-runtime requirements derived from this policy

The selected runtime must support, natively or through a thin configuration layer:

- per-role/per-task model and engine selection;
- explicit resolved model identity for critical routes;
- isolated worktrees/branches;
- bounded retry/repair loops;
- independent reviewer assignment;
- deterministic verifier/acceptance gates outside agent self-report;
- durable route/run logs;
- human gates;
- restart/resume without silently rerunning already accepted work.

These requirements are now **acceptance requirements for the Claw configuration**, not a generic orchestrator bakeoff. Failure of a required capability reopens the runtime decision; otherwise do not re-run tool selection.

## Re-evaluation triggers

Reopen model preference order when one of these occurs:

- material new benchmark evidence for a candidate;
- a candidate becomes unavailable or materially changes;
- internal Shadow Eval/micro-bakeoff contradicts the external evidence;
- repeated production failures cluster in one lane;
- the workload/fidelity contract changes materially;
- the orchestration runtime changes in a way that alters tool access, permissions or model behavior.

Do **not** reopen the lane architecture merely because a leaderboard rank moves a few places.

## Current decision

RP-HBC-01 is ready to guide Spec Kit and orchestration design.

The lane architecture is the decision. Exact per-task routing starts only after concrete tasks/specifications exist, and the initial preference order remains provisional until project-specific evaluation validates it.

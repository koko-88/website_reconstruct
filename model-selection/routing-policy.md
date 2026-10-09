# Execution and routing policy — RP-HBC-01

Status: **ACTIVE** | Revision: **4** | Date: **2026-10-09** (Africa/Cairo)

This policy owns execution selection, routing and recovery. Start at [AGENTS.md](../AGENTS.md).
Product and delivery gates remain in [PRODUCT.md](../PRODUCT.md) and [ROADMAP.md](../ROADMAP.md).
Verification and risk-based review are owned exclusively by
[logic verification](../LOGIC_VERIFICATION.md) and
[implementation verification](../IMPLEMENTATION_VERIFICATION.md).

## Execution selection

The user selects the environment. No coding agent, model family or orchestrator has permanent
ownership. A direct coding-agent session defaults to sequential execution, including eligible `[P]`
tasks. An externally orchestrated workflow uses its approved concurrency, isolation and resource
configuration. Native delegation is used only within an explicitly approved execution mode.

If session context does not establish the mode, ask for approval in this session and wait before
dependent execution. Selection pending is not an execution failure or a BLOCKED task. Do not silently
switch to parallel or sequential execution, change runtime, or launch an external orchestrator.
An approved mode persists until the user changes it; availability alone does not change it.

## Task routing

Use the existing task ID, prerequisites, allowed files and acceptance references. Workload tags from
[WP-HBC-01](workload-profile.md) describe capabilities, not assignments. These lane names remain
available to interpret existing task metadata:

| Lane | Capability |
| --- | --- |
| L1 / planning/evidence | Scope, authority, architecture and consistency |
| L2 / fidelity-motion | Visual, responsive, motion, input and state behavior |
| L3 / repo-engineering | Code, tooling, integration and debugging |
| L4 / review-verification | Verification and review appropriate to change risk |
| L5 / support-mechanical | Bounded mechanical work |

Select capabilities needed by the task in the user-selected environment.
[Candidate research](candidate-models.md) is advisory, not an allowlist or a mandatory preference order.
No blanket benchmark qualification, model-family switch, separate reviewer route, deadline or counter
protocol is required to start authorized direct work. Actual tool/input availability, coherent
requirements, feature prerequisites and meaningful acceptance gates still apply. Extra admission
conditions in an explicitly approved external workflow remain specific to that workflow.

## Isolation and integration

Read-only concurrent work may share a pinned snapshot. Concurrent writers require separate
worktrees/branches at the approved base revision; otherwise serialize writes under the approved
configuration only if it permits that fallback, or wait for current-session approval. Serialize
integration and shared instruction/configuration edits. No simultaneous
writers in a shared working tree. Review and required checks precede integration. Permission to run
CI does not grant permission to push, merge, create issues/PRs or change GitHub settings.

## Recovery and continuity

Reproduce a failure, classify it, repair its demonstrated cause and rerun affected checks. Keep failed
results; never loosen acceptance or reset history to make a run pass. Stop repeating an unchanged
failed approach when it yields no new evidence. Request input when the remaining action needs a user
decision, unavailable input or permission. Record actual missing prerequisites as blockers in the
owning task/plan; leave mode selection pending while awaiting the user.

Direct sessions need no model-switch quotas or cumulative retry journal. Approved external workflows
may impose bounded resources and retries through their native controls. A runtime/provider fallback
must preserve authorized mode, scope, permissions and acceptance; ask before a change outside them.

Use task/plan checkpoints and native reports/logs for resume. Record revision, changed files,
commands/results, remaining limitations and next action once in the owning artifact. Do not introduce
a second task database, custom orchestration infrastructure or duplicate execution receipts.

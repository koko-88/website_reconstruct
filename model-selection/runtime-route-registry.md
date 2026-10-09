# Runtime route registry — RR-HBC-01

Status: **ACTIVE-PROVISIONAL — execution-gating registry; no Critical route is qualified yet.**  
Revision: **3**
Date: **2026-10-08**
Applies to: **RP-HBC-01 / WP-HBC-01 / FC-TARGET-DESIGN-01**

## Purpose

This registry is the runtime source of truth for whether a logical candidate from [candidate-models.md](candidate-models.md) is actually runnable and qualified through the selected orchestration path.

A model family appearing in the candidate pool does **not** authorize execution. A Critical task may run only when the exact route used for that task is marked **QUALIFIED** for the task's dominant lane.

## Selected control plane

- **Primary coding agent/orchestrator:** Codex, using available native multi-agent tools.
- **Task state and handoffs:** the active Spec Kit task list and existing project artifacts, including task ownership, dependencies, progress and blockers.
- **Context recovery:** read the root [AGENTS.md](../AGENTS.md), active task artifacts and recorded checkpoints before resuming work.
- **Optional installed capabilities:** Claw/OpenClaw are not the selected control plane and are not started or reconfigured by this integration.
- **Scope/decomposition/acceptance authority:** this repository + Spec Kit artifacts + RP-HBC-01 + deterministic acceptance evidence.

Codex is the selected control plane. Native delegation availability must be verified in each session. A read-only delegation check does not qualify a Critical author/reviewer route; representative route qualification remains required before Critical execution. No project implementation, service startup or paid route test is authorized by the integration setup.

## Route-state rules

Allowed states:

- **CANDIDATE** — logical route only; no Critical execution.
- **EVALUATION-PERMITTED** — exact route is runnable enough for bounded qualification work; no Critical integration authority.
- **QUALIFIED** — passed project-specific qualification for explicitly listed lanes.
- **SUSPENDED** — temporarily ineligible because of drift, availability or contradictory evidence.

A route is identified by the tuple:

**engine/harness + exact model identifier + effort/configuration + tool/permission envelope**.

Changing any material part of that tuple creates a new route or requires requalification.

## Current route registry

| Candidate family | Intended execution access path | Exact runtime model/config | Current state | Critical lanes qualified | Required next evidence |
| --- | --- | --- | --- | --- | --- |
| GPT-6 Astra | Codex route if exposed by the installed Codex account/client | **UNVERIFIED** exact model slug/effort | CANDIDATE | none | Verify actual selectable identifier/config, then run representative L2 qualification |
| GPT-6.1 Sol | Codex route if exposed by the installed Codex account/client | **UNVERIFIED** exact model slug/effort | CANDIDATE | none | Verify actual selectable identifier/config, then run representative L1/L3 qualification |
| GPT-5.6 Sol | Codex route if exposed by the installed Codex account/client | **UNVERIFIED** exact model slug/effort | CANDIDATE | none | Verify actual selectable identifier/config, then run representative L3/L4 qualification |
| Claude Opus 5.5 | Claude Code route only if the required CLI/auth/model is available in the selected runtime | **UNVERIFIED** | CANDIDATE | none | Verify CLI/auth/model availability, then representative L1/L2/L4 qualification |
| Claude Sonnet 5.5 | Claude Code route only if the required CLI/auth/model is available in the selected runtime | **UNVERIFIED** | CANDIDATE | none | Verify CLI/auth/model availability, then representative bounded L1/L2/L4 qualification |
| GLM 5.3 | Existing approved access path only; no new paid API may be introduced silently | **UNVERIFIED** | CANDIDATE — challenger/support only | none | Establish exact runtime path and support-task evidence before any promotion request |
| Qwen3.8-27B local | Local runtime/OpenCode path if configured | User-specific local quant/runtime not yet pinned here | CANDIDATE — support only | none | Record exact local model/quant/runtime and bounded support-task evidence |

## Qualification receipt requirements

Before changing a route to **QUALIFIED**, commit or persist a receipt that records:

- route identifier and candidate family;
- execution engine/access path;
- exact model identifier and effort/configuration;
- tool/permission envelope and relevant browser/MCP capabilities;
- repo base SHA;
- Spec Kit task/spec revision used for qualification;
- target lane(s);
- representative workload/acceptance references;
- per-check PASS/FAIL results and artifact locations;
- total attempts, route switches, duration and failure reasons;
- reviewer route when the qualification itself requires independent review;
- date and any qualification limits.

Critical failures are evaluated individually. A route with an unresolved Critical acceptance failure cannot be promoted by averaging stronger results elsewhere.

## Runtime admission gate

For a Critical task, the orchestrator must verify **before assignment**:

1. the task has a Spec Kit task/spec revision and acceptance references;
2. RP-HBC-01 resolves the task to a lane;
3. the selected exact route is **QUALIFIED** for that lane;
4. an independent eligible reviewer route exists when L4 is required;
5. the task declares cumulative retry limits and an execution deadline;
6. the branch/worktree and base SHA are explicit;
7. no new paid provider/API is introduced silently.

If any item fails, the task is **BLOCKED_BEFORE_EXECUTION** rather than silently falling back to an unqualified or opaque route.

## Requalification triggers

Requalify or suspend a route when the exact model identifier, material effort/configuration, execution engine, permission/tool envelope, native agent integration, or acceptance workload changes enough to invalidate prior evidence. Routine leaderboard movement alone does not invalidate a qualified route.

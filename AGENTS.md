# AGENTS.md — Website Reconstruction

This is the tool-neutral entry point for coding agents in this repository.

## Read path

Use progressive disclosure. Do **not** recursively read the repository before acting.

1. Read the [Project Constitution](.specify/memory/constitution.md).
2. If the task concerns HBC product behavior, fidelity, current implementation scope, or phase
   boundaries, read [PRODUCT.md](PRODUCT.md).
3. If the task concerns project decomposition or any HBC feature specification, planning, task generation,
   orchestration, or implementation, read [ROADMAP.md](ROADMAP.md) before feature artifacts and obey its
   project-wide status/gates.
4. Load only the task-specific evidence linked from the
   [pre-build evidence entry point](implementation-scope/pre-build-packet/README.md).
5. When a Spec Kit feature exists, load only that feature's `spec.md`, `plan.md`, `tasks.md`,
   and linked design artifacts that are relevant to the current task.
6. If the task concerns model/agent assignment or execution, use
   [WP-HBC-01](model-selection/workload-profile.md),
   [RP-HBC-01](model-selection/routing-policy.md), and
   [RR-HBC-01](model-selection/runtime-route-registry.md) as appropriate.
7. If the task concerns motion, visual effects, GPU rendering, media, 3D, texture/asset production,
   or related debugging, read the [creative capability shelf](tooling/creative-capabilities/README.md)
   and use only the capability class required by the accepted task.
8. If the task concerns workstation/project reproducibility, tool versions, setup commands or reproducibility CI, read root `mise.toml`/`mise.lock` and [the reusable workstation profile](tooling/reconstruction-workstation/README.md).
9. Use the [reference-reconstruction skill](skills/reference-reconstruction/SKILL.md) only for
   reconstruction/evidence methodology work.

## Canonical ownership

| Decision | Canonical source |
| --- | --- |
| Project-wide non-negotiable rules | `.specify/memory/constitution.md` |
| HBC product/scope/fidelity/current local-validation boundaries | `PRODUCT.md` (FC-TARGET-DESIGN-01) |
| Project feature decomposition, ordering and cross-feature coverage | `ROADMAP.md` |
| Evidence navigation and current comparison/reference interpretation | IP-HBC-01 pre-build packet and its crosswalk/corrections |
| Bounded feature intent and acceptance | Active Spec Kit `spec.md` |
| Technical implementation decisions | Active Spec Kit `plan.md` and its linked design artifacts |
| Executable work decomposition | Active Spec Kit `tasks.md` |
| Workload/capability taxonomy | WP-HBC-01 |
| Task lane, review, escalation, and model-family policy | RP-HBC-01 |
| Exact model/engine/configuration admission | RR-HBC-01 |
| Reconstruction inspection methodology | reference-reconstruction skill |
| Creative execution capability availability/integration | `tooling/creative-capabilities/` |
| Project reproducibility interface and locked toolchain | `mise.toml` + `mise.lock` |
| Reusable host/workstation provisioning | `tooling/reconstruction-workstation/mise.toml` |

Resolve conflicts by domain ownership, not by newest-file-wins or search rank.

## Context rules

- Retrieval tooling may index/search the whole repository, but retrieval confidence does not decide
  authority.
- `reference/**` is frozen/sealed evidence: authoritative for the observations it records when
  cited, not current project policy.
- `skill-hardening/**` is development/audit history; do not load it for normal implementation work.
- Benchmark and candidate-model files support model-selection/routing decisions; they are not product
  requirements.
- Historical receipts stay historical and do not become current phase authority.
- Spec Kit templates and generated integration instructions are tooling scaffolds; they do not create
  project requirements by themselves.
- `tooling/creative-capabilities/` is a capability catalog and integration map, not product scope.
  Agents MUST NOT reinstall a workstation capability blindly; verify availability first and only install
  or repair a missing capability. Project runtime libraries remain project-local dependencies and are
  added only when an implementation task actually selects them.

## Documentation discipline

The root `AGENTS.md` applies recursively across the repository unless a nested `AGENTS.md` adds genuinely narrower directory-specific guidance. Do not create nested copies merely to repeat root rules; add one only when that subtree needs materially different instructions.

Do not create a new governance Markdown file when an existing canonical source can own the rule.
Update the owning source instead.

Use a dedicated ADR only for a significant architectural decision whose rationale must outlive the
feature/change that introduced it. Otherwise rely on the owning document plus normal Git history.

Keep pointers thin. Do not duplicate global rules into feature/component guidance unless a scoped
exception genuinely requires it.

The Spec Kit constitution at `.specify/memory/constitution.md` is the single canonical constitution.

## Codex coordination

Codex is the primary coding agent and orchestrator. Use the active Spec Kit task IDs, acceptance
criteria and existing project artifacts for task progress, dependencies, blockers and handoffs.
Inspect existing work before creating new tasks; do not duplicate accepted or in-progress work.
Persist resumable checkpoints in the owning task/plan artifact when applicable.

Verify native agent tools and concurrency limits in each session. Dispatch independent eligible
work concurrently when those tools are available; otherwise work sequentially. Give each assignment
its task ID, acceptance references, allowed files, dependencies and write mode. Follow RP-HBC-01 /
RR-HBC-01 for routing, isolation, review and admission. Tool availability does not qualify a Critical
route, and task readiness does not advance roadmap or execution gates.

Read-only agents may share a pinned snapshot. Concurrent writers require isolated worktrees/branches
at the approved base SHA; serialize writes when isolation is unavailable. Serialize integration and
shared instruction/configuration changes. Before handoff, record changed files, validation results,
remaining blockers and the next action, then inspect `git status`.

Do not run Git commits/pushes, install tools, introduce orchestration infrastructure, run CI, start
services or launch project execution without user approval.

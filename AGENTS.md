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
7. For verification, use [logic verification](LOGIC_VERIFICATION.md) and
   [implementation verification](IMPLEMENTATION_VERIFICATION.md), the only centralized Markdown
   verification authorities. Feature acceptance remains in its specification and linked contracts.
8. For reproducibility or creative capabilities, read root `mise.toml`/`mise.lock` and the capability
   audit in implementation verification. Verify availability before selecting or repairing a tool.
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
| Execution mode, task routing and recovery | RP-HBC-01 |
| Session runtime availability and configuration | RR-HBC-01 |
| Product/specification/governance consistency verification | `LOGIC_VERIFICATION.md` |
| Code/integration/runtime/engineering verification and review | `IMPLEMENTATION_VERIFICATION.md` |
| Reconstruction inspection methodology | reference-reconstruction skill |
| Project reproducibility interface and locked toolchain | `mise.toml` + `mise.lock` |

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
- Capability inventories and installed skills are not product scope.
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

## Execution coordination

The user selects the execution environment; no agent or orchestrator permanently owns this project.
Direct coding-agent sessions default to sequential execution. Externally orchestrated workflows follow
their approved concurrency and isolation configuration. If the mode is unclear, ask for approval in
the current session and wait; do not switch modes, launch an orchestrator, or mark work BLOCKED
merely because selection is pending. Use the active Spec Kit task IDs, acceptance
criteria and existing project artifacts for task progress, dependencies, blockers and handoffs.
Inspect existing work before creating new tasks; do not duplicate accepted or in-progress work.
Persist resumable checkpoints in the owning task/plan artifact when applicable.

Tool availability and `[P]` task markers indicate capability or eligibility, never permission to
delegate. For approved concurrent work, verify native tools and concurrency limits and give each
assignment its task ID, acceptance references, allowed files, dependencies and write mode. Follow
RP-HBC-01 / RR-HBC-01. Task readiness does not advance roadmap or execution gates.

Read-only agents may share a pinned snapshot. Concurrent writers require isolated worktrees/branches
at the approved base SHA. If isolation is unavailable, wait for approval unless the selected
configuration already permits serialization. Serialize integration and
shared instruction/configuration changes. Before handoff, record changed files, validation results,
remaining blockers and the next action, then inspect `git status`.

Local verification and CI execution, including integration checks and temporary loopback test
services, are authorized. Other GitHub operations, commits/pushes, installation, deployment, paid
provider expansion and launching an external orchestrator require user authorization. CI permission
does not authorize repository/PR/settings changes or advance product delivery/release gates.

## Codebase intelligence

When code-review-graph is available, use its architecture/search/impact tools first to narrow code
reads. Check the graph revision and freshness; do not assume hooks or automatic updates. Verify
findings in the current source and relevant tests. Empty results or zero risk scores do not establish
absence or correctness. When unavailable, use native source search and Git inspection, recording the
capability limit. Structural graph analysis does not substitute for independent engineering review.

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

<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:46cd31e7 -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- Use `bd` for ALL task tracking — do NOT use TodoWrite, TaskCreate, or markdown TODO lists
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — do NOT use MEMORY.md files

**Architecture in one line:** issues live in a local Dolt DB; sync uses `refs/dolt/data` on your git remote; `.beads/issues.jsonl` is a passive export. See https://github.com/gastownhall/beads/blob/main/docs/core-concepts/sync-concepts.md for details and anti-patterns.

## Agent Context Profiles

The managed Beads block is task-tracking guidance, not permission to override repository, user, or orchestrator instructions.

- **Conservative (default)**: Use `bd` for task tracking. Do not run git commits, git pushes, or Dolt remote sync unless explicitly asked. At handoff, report changed files, validation, and suggested next commands.
- **Minimal**: Keep tool instruction files as pointers to `bd prime`; use the same conservative git policy unless active instructions say otherwise.
- **Team-maintainer**: Only when the repository explicitly opts in, agents may close beads, run quality gates, commit, and push as part of session close. A current "do not commit" or "do not push" instruction still wins.

## Session Completion

This protocol applies when ending a Beads implementation workflow. It is subordinate to explicit user, repository, and orchestrator instructions.

1. **File issues for remaining work** - Create beads for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **Handle git/sync by active profile**:
   ```bash
   # Conservative/minimal/default: report status and proposed commands; wait for approval.
   git status

   # Team-maintainer opt-in only, unless current instructions forbid it:
   git pull --rebase
   bd dolt push
   git push
   git status
   ```
5. **Hand off** - Summarize changes, validation, issue status, and any blocked sync/commit/push step

**Critical rules:**
- Explicit user or orchestrator instructions override this Beads block.
- Do not commit or push without clear authority from the active profile or the current user request.
- If a required sync or push is blocked, stop and report the exact command and error.
<!-- END BEADS INTEGRATION -->

<!-- BEGIN BEADS CODEX SETUP: generated by bd setup codex -->
## Beads Issue Tracker

Use Beads (`bd`) for durable task tracking in repositories that include it. Use the `beads` skill at `.agents/skills/beads/SKILL.md` (project install) or `~/.agents/skills/beads/SKILL.md` (global install) for Beads workflow guidance, then use the `bd` CLI for issue operations.

### Quick Reference

```bash
bd ready                # Find available work
bd show <id>            # View issue details
bd update <id> --claim  # Claim work
bd close <id>           # Complete work
bd prime                # Refresh Beads context
```

### Rules

- Use `bd` for all task tracking; do not create markdown TODO lists.
- Run `bd prime` when Beads context is missing or stale. Codex 0.129.0+ can load Beads context automatically through native hooks; use `/hooks` to inspect or toggle them.
- Keep persistent project memory in Beads via `bd remember`; do not create ad hoc memory files.

**Architecture in one line:** issues live in a local Dolt DB; sync uses `refs/dolt/data` on your git remote; `.beads/issues.jsonl` is a passive export. See https://github.com/gastownhall/beads/blob/main/docs/core-concepts/sync-concepts.md for details and anti-patterns.
<!-- END BEADS CODEX SETUP -->

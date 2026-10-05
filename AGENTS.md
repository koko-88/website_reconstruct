# AGENTS.md — Website Reconstruction

This is the tool-neutral entry point for coding agents in this repository.

## Read path

Use progressive disclosure. Do **not** recursively read the repository before acting.

1. Read [Project Constitution](project-governance/constitution.md).
2. If the task concerns HBC product behavior, fidelity, current implementation scope or phase gating, read [FC-TARGET-DESIGN-01](implementation-scope/fidelity-scope-contract.md).
3. Load only the task-specific evidence linked from the [pre-build evidence entry point](implementation-scope/pre-build-packet/README.md).
4. If the task concerns model/agent assignment or execution, use [WP-HBC-01](model-selection/workload-profile.md), [RP-HBC-01](model-selection/routing-policy.md) and [RR-HBC-01](model-selection/runtime-route-registry.md) as appropriate.
5. Use the [reference-reconstruction skill](skills/reference-reconstruction/SKILL.md) only for reconstruction/evidence methodology work.

## Canonical ownership

| Decision | Canonical source |
| --- | --- |
| Project-wide non-negotiable rules | Project Constitution |
| HBC product/scope/fidelity/current local-validation boundaries | FC-TARGET-DESIGN-01 |
| Evidence navigation and current baseline interpretation | IP-HBC-01 pre-build packet and its crosswalk/corrections |
| Workload/capability taxonomy | WP-HBC-01 |
| Task lane, review, escalation and model-family policy | RP-HBC-01 |
| Exact model/engine/configuration admission | RR-HBC-01 |
| Reconstruction inspection methodology | reference-reconstruction skill |

Resolve conflicts by domain ownership, not by newest-file-wins or search rank.

## Context rules

- Retrieval tooling may index/search the whole repository, but retrieval confidence does not decide authority.
- `reference/**` is frozen/sealed evidence: authoritative for the observations it records when cited, not current project policy.
- `skill-hardening/**` is development/audit history; do not load it for normal implementation work.
- Benchmark and candidate-model files support model-selection/routing decisions; they are not product requirements.
- Historical receipts stay historical and do not become current phase authority.

## Documentation discipline

Do not create a new governance Markdown file when an existing canonical source can own the rule. Update the owning source instead.

Use a dedicated ADR only for a significant architectural decision whose rationale must outlive the feature/change that introduced it. Otherwise rely on the owning document plus normal Git/PR history.

Keep pointers thin. Do not duplicate global rules into feature/component guidance unless a scoped exception genuinely requires it.

During Spec Kit adoption, move the canonical constitution into Spec Kit's managed constitution location and update this file to point there. Keep one canonical constitution only.

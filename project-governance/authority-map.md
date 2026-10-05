# Authority Map

Status: **ACTIVE**  
Revision: **1**  
Date: **2026-10-05**

Use this map to decide which file owns each kind of decision.

| Decision | Canonical source |
| --- | --- |
| Project-wide rules | [Project Constitution](constitution.md) |
| Agent reading path | [PROJECT_AUTHORITY.md](../PROJECT_AUTHORITY.md) |
| HBC scope and fidelity obligations | [FC-TARGET-DESIGN-01](../implementation-scope/fidelity-scope-contract.md) |
| Current phase and implementation clearance | [AR-HBC-01](../implementation-scope/authority-reconciliation.md) |
| Evidence navigation and interpretation | [IP-HBC-01](../implementation-scope/pre-build-packet/README.md) plus its crosswalk/corrections |
| Workload/capability taxonomy | [WP-HBC-01](../model-selection/workload-profile.md) |
| Task-lane/review/escalation rules | [RP-HBC-01](../model-selection/routing-policy.md) |
| Exact runtime route admission | [RR-HBC-01](../model-selection/runtime-route-registry.md) |
| Reconstruction inspection methodology | [reference-reconstruction skill](../skills/reference-reconstruction/SKILL.md) |

## Classification

**ACTIVE:** the sources listed above may make current decisions within their domain.

**SUPPORTING:** motion/type/evidence indexes, acceptance templates, benchmark evidence, candidate-model research and skill references support a decision but do not own all project policy.

**FROZEN/HISTORICAL EVIDENCE:** `reference/haunted-boulder-city/**` and the sealed v2 package remain authoritative for observations when cited, but do not define current prospective policy.

**HISTORICAL DEVELOPMENT:** `skill-hardening/**` is loaded only for skill-history/regression work.

**SUPERSEDED:** `model-selection/router-decision.md` is retained as a supersession marker only.

## Conflict rule

Resolve disagreements by domain ownership, not by newest-file-wins. If two active sources in the same domain disagree, stop the affected decision, reconcile the canonical owner, then update dependent active wording before implementation continues.

## Retrieval rule

A retrieval layer may index the full repository, but an execution agent should receive the constitution, the relevant domain authority and only the evidence anchors needed for the current slice/task.

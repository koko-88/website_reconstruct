# Authority reconciliation — AR-HBC-01

Status: **ACTIVE — current phase-authority reconciliation**  
Date: **2026-10-05 (Africa/Cairo)**  
Applies to: **FC-TARGET-DESIGN-01 revision3 / IP-HBC-01 / WP-HBC-01 / RP-HBC-01**

## Purpose

This record removes contradictory implementation-readiness language from active project documents before Spec Kit adoption and the first real implementation cycle.

It does **not** modify frozen v1 evidence, sealed HBC-V2-REAL-01 evidence, historical observations, old gate outcomes, or source facts. It reconciles only the **prospective project authority** used by current planning, specification, routing and implementation.

## Current implementation mode

The first implementation mode is:

**Local Reference Fidelity Validation**

Its purpose is to validate the complete evidence → specification → implementation → browser/acceptance workflow against the HBC reference before later target adaptation.

It is **not**:
- a public/distributed release;
- a claim of asset redistribution rights;
- the real target-content adaptation;
- an Eventbrite/backend reconstruction;
- permission to copy reference application source code.

## Authority role

Start from [PROJECT_AUTHORITY.md](../PROJECT_AUTHORITY.md) and the [Authority Map](../project-governance/authority-map.md). AR-HBC-01 owns current phase status and clearance only. It does not replace the Project Constitution, fidelity contract, evidence sources, workload taxonomy or runtime-routing policy.

Within its domain, AR-HBC-01 interprets FC-TARGET-DESIGN-01 for the current implementation phase. A historical gate remains true for the historical contract/revision that produced it; it does not override a later prospective phase/scope decision.

## Reconciled phase matrix

| Concern | Current local reference-validation | Public/distributed release | Real target adaptation |
| --- | --- | --- | --- |
| Evidence integrity | PASS, subject to existing immutable-reference verification evidence | PASS does not itself authorize release | PASS does not itself authorize adaptation |
| Design/experience fidelity readiness | PASS within TF-01..06/TU-01 bounds | Required but not sufficient | Required but not sufficient |
| Evidence-package assets already present | **May be used as local fidelity fixtures; asset/reuse gate NOT REQUIRED as an implementation precondition** | **BLOCKED for affected assets until applicable TR-01 decisions are complete** | **BLOCKED for affected assets until applicable TR-01 decisions are complete** |
| Reference source-code copying | **Not authorized**; implement behavior independently | Not authorized without separate rights | Not authorized without separate rights |
| Real content/data/brand/CTA mapping | NOT REQUIRED for the local reference-equivalent run | Required only for the actual released target | **PENDING under TA-01** |
| Eventbrite commerce/backend fidelity | EXCLUDED by TX-01 | EXCLUDED unless scope changes | EXCLUDED unless scope changes |
| Runtime model/agent route | Specification/planning may proceed while routes are CANDIDATE | Critical execution/integration requires RR-HBC-01 QUALIFIED route(s) | Same qualification rule applies |

## Superseded active wording

The following old prospective statements were unsafe because they collapsed different phases into one gate. They are superseded by the matrix above:

- blanket statements that asset/reuse uncertainty blocks **all** asset-dependent implementation;
- workload wording that described affected asset use as globally blocked;
- evidence-evaluation wording that treated public reuse authorization as a prerequisite to the bounded local fidelity run;
- generic skill wording interpreted without the active contract's phase scope.

The active documents are updated alongside this record. Frozen/sealed artifacts remain unchanged.

## Verification semantics

[pre-build-packet/verification.json](pre-build-packet/verification.json) is retained as the historical 2026-10-04 evidence-preparation receipt. It predates this reconciliation and is **not** current phase authority.

[pre-build-packet/verify.py](pre-build-packet/verify.py) is updated so future clean-tree reruns verify the reconciled phase semantics: local fixture validation is not gated by public reuse clearance, while release/adaptation remain gated.

No new browser capture, reference observation, or target implementation result is claimed by AR-HBC-01.

## Spec Kit handoff rule

Spec Kit must consume the current contract and this reconciliation before generating implementation specifications.

For the first epic/slices:
- treat local reference-equivalent fixture implementation as in scope;
- keep public release/adaptation asset decisions out of the critical path unless a slice explicitly needs a missing asset or release behavior;
- preserve TA-01/TR-01 as deferred release/adaptation dependencies, not assumptions to fill;
- preserve TX-01 exclusions;
- keep route qualification separate from product requirements.

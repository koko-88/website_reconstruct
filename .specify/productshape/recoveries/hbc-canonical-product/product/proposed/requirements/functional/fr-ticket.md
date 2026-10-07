---
id: FR-TICKET
type: functional-requirement
title: Operate ticket invitation and host dialog lifecycle
status: draft
derived-from:
  - UC-TICKET
verification:
  - id: VERIFY-TICKET
    scenario: "Reference-equivalent fixture: exercise ticket in its named normal,
      narrow/touch and reduced branches; assert host closes/reopens coherently;
      exact commerce excluded and observed Tab escape remains a defect whose
      target disposition is Q-0010. Keep questions in Failure Conditions
      unresolved; this seed has not been executed."
provenance:
  source: PRODUCT.md P-08 / TF-06 / TX-01;
    implementation-scope/pre-build-packet/motion.md M-11;
    reference/haunted-boulder-city-v2/rev-2.0.0-real-01/state-route-matrix.md
    SR-25..32
  confidence: high
  recovered-from: documentation
---

## Requirement

Declared/reported observed: open/loading/visible host; focus close control and lock page; close with Escape/button/veil; restore valid prior focus/scroll; reopen retains mounted state and cancels pending hide.

Declared: narrow full-viewport panel; reduced no fog/immediate hide; preview schedules auto-open at source-declared 600ms; controlled script-block fallback is simulated evidence.

## Rationale

Declared: current P-08 observable contract. Unknown: loading/ready/fallback/retry local data contract and overlay interactions. Iframe presence is not appearance readiness; no natural outage, successful purchase or provider-empty state is inferred.

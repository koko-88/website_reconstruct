---
id: UC-TICKET
type: use-case
title: Operate ticket invitation and host dialog lifecycle
status: draft
primary-actor: ACT-VISITOR
bounded-context: BC-LOCAL-FIDELITY
uses-terms:
  - TERM-REFERENCE-FIXTURE
  - TERM-HOST-DIALOG
provenance:
  source: PRODUCT.md P-08 / TF-06 / TX-01;
    implementation-scope/pre-build-packet/motion.md M-11;
    reference/haunted-boulder-city-v2/rev-2.0.0-real-01/state-route-matrix.md
    SR-25..32
  confidence: high
  recovered-from: documentation
---

## Goal

Declared: Operate ticket invitation and host dialog lifecycle; current product owner P-08.

## Trigger

Declared: activate the ticket invitation, or enter the explicit tickets=preview query.

## Preconditions

Declared: bounded non-transactional host scope; local interior fixture remains unselected Q-0005.

## Main Flow

Declared/reported observed: open/loading/visible host; focus close control and lock page; close with Escape/button/veil; restore valid prior focus/scroll; reopen retains mounted state and cancels pending hide.

## Alternative Flows

Declared: narrow full-viewport panel; reduced no fog/immediate hide; preview schedules auto-open at source-declared 600ms; controlled script-block fallback is simulated evidence.

## Failure Conditions

Unknown: loading/ready/fallback/retry local data contract and overlay interactions. Iframe presence is not appearance readiness; no natural outage, successful purchase or provider-empty state is inferred.

## Postconditions

Declared: host closes/reopens coherently; exact commerce excluded and observed Tab escape remains a defect whose target disposition is Q-0010.

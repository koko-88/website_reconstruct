---
id: UC-MENU
type: use-case
title: Open close and reverse global menu
status: draft
primary-actor: ACT-VISITOR
bounded-context: BC-LOCAL-FIDELITY
uses-terms:
  - TERM-REFERENCE-FIXTURE
provenance:
  source: PRODUCT.md P-07; implementation-scope/pre-build-packet/motion.md M-10;
    reference/haunted-boulder-city-v2/rev-2.0.0-real-01/public/app.js 39..79
  confidence: high
  recovered-from: documentation
---

## Goal

Declared: Open close and reverse global menu; current product owner P-07.

## Trigger

Declared: activate Menu/Close or Escape.

## Preconditions

Declared: closed/default header and hidden nav on fresh root.

## Main Flow

Declared/reported observed: unhide and stagger rows/footer; expanded state and Close label; first-link focus and scroll lock. Close clears intent/lock and finishes exit before hidden; Escape returns toggle focus.

## Alternative Flows

Declared: narrow stacked versus wide left/right layout; reduced immediate transitions/hide; reopen cancels pending hide.

## Failure Conditions

Unknown: focus eligibility during closing and combined overlay arbitration remain Q-0006/7; do not claim source trap means passing runtime focus.

## Postconditions

Declared: named fully open or fully hidden endpoint with correct labels and default header relationship.

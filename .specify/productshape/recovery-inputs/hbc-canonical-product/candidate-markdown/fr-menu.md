---
id: FR-MENU
type: functional-requirement
title: Open close and reverse global menu
status: draft
derived-from:
  - UC-MENU
verification:
  - id: VERIFY-MENU
    scenario: "Reference-equivalent fixture: exercise menu in its named normal,
      narrow/touch and reduced branches; assert named fully open or fully hidden
      endpoint with correct labels and default header relationship. Keep
      questions in Failure Conditions unresolved; this seed has not been
      executed."
provenance:
  source: PRODUCT.md P-07; implementation-scope/pre-build-packet/motion.md M-10;
    reference/haunted-boulder-city-v2/rev-2.0.0-real-01/public/app.js 39..79
  confidence: high
  recovered-from: documentation
---

## Requirement

Declared/reported observed: unhide and stagger rows/footer; expanded state and Close label; first-link focus and scroll lock. Close clears intent/lock and finishes exit before hidden; Escape returns toggle focus.

Declared: narrow stacked versus wide left/right layout; reduced immediate transitions/hide; reopen cancels pending hide.

## Rationale

Declared: current P-07 observable contract. Unknown: focus eligibility during closing and combined overlay arbitration remain Q-0006/7; do not claim source trap means passing runtime focus.

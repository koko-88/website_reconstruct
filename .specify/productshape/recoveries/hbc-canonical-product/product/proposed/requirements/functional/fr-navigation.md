---
id: FR-NAVIGATION
type: functional-requirement
title: Navigate fragments history and root reset
status: draft
derived-from:
  - UC-NAVIGATION
verification:
  - id: VERIFY-NAVIGATION
    scenario: "Reference-equivalent fixture: exercise navigation in its named
      normal, narrow/touch and reduced branches; assert destination and URL
      match evidenced contract; explicit fresh root resets visit state. Keep
      questions in Failure Conditions unresolved; this seed has not been
      executed."
provenance:
  source: PRODUCT.md PJ-02 / Scrolling-input;
    implementation-scope/pre-build-packet/motion.md M-06/M-10;
    reference/haunted-boulder-city-v2/rev-2.0.0-real-01/public/app.js 568..657
  confidence: high
  recovered-from: documentation
---

## Requirement

Declared: traverse actual fragment destinations, correct scroll and evidenced focus/history relationship. Root brand removes fragment and starts a fresh visit; footer #home remains in-page.

Declared: fine-pointer smoothing can focus destination/push hash; wheel interrupts tween; touch/keyboard/scrollbar/native reduced paths remain independently assessed.

## Rationale

Declared: current P-07/PX-02 observable contract. Unknown: input-specific focus and reset/persistence for each history transition need Q-0008. No extra menu rows, pages or global state reset is inferred.

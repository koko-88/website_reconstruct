---
id: UC-NAVIGATION
type: use-case
title: Navigate fragments history and root reset
status: draft
primary-actor: ACT-VISITOR
bounded-context: BC-LOCAL-FIDELITY
uses-terms:
  - TERM-REFERENCE-FIXTURE
provenance:
  source: PRODUCT.md PJ-02 / Scrolling-input;
    implementation-scope/pre-build-packet/motion.md M-06/M-10;
    reference/haunted-boulder-city-v2/rev-2.0.0-real-01/public/app.js 568..657
  confidence: high
  recovered-from: documentation
---

## Goal

Declared: Navigate fragments history and root reset; current product owner P-07/PX-02.

## Trigger

Declared: activate an observed section/inline/footer/brand link or use browser history/reload.

## Preconditions

Declared: eight named section IDs in one root shell, unnamed highlights/footer; actual observed href inventory.

## Main Flow

Declared: traverse actual fragment destinations, correct scroll and evidenced focus/history relationship. Root brand removes fragment and starts a fresh visit; footer #home remains in-page.

## Alternative Flows

Declared: fine-pointer smoothing can focus destination/push hash; wheel interrupts tween; touch/keyboard/scrollbar/native reduced paths remain independently assessed.

## Failure Conditions

Unknown: input-specific focus and reset/persistence for each history transition need Q-0008. No extra menu rows, pages or global state reset is inferred.

## Postconditions

Declared: destination and URL match evidenced contract; explicit fresh root resets visit state.

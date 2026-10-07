---
id: QR-ACCESSIBILITY
type: quality-requirement
title: Bounded operable semantics focus and motion preference
status: draft
quality-attribute: accessibility
applies-to:
  - BC-LOCAL-FIDELITY
verification:
  - id: VERIFY-ACCESSIBILITY
    scenario: "Declared: keyboard/focus/state checks in bounded Chromium scope.
      Closing focus and dialog defect disposition remain Q-0007/10; record any
      approved deviation and its consequences. No uninspected AT parity."
provenance:
  source: PRODUCT.md TF-05 / PX-05;
    implementation-scope/pre-build-packet/motion.md M-09..12;
    reference/haunted-boulder-city-v2/rev-2.0.0-real-01/state-route-matrix.md
    SR-30
  confidence: high
  recovered-from: documentation
---

## Requirement

Declared: preserve loader status, meaningful names/roles/state, skip link, keyboard disclosures/menu and evidenced focus/return relationships; hidden endpoints excluded from focus. Reference defects are evidence, not mandatory failures.

## Measurement

Declared: keyboard/focus/state checks in bounded Chromium scope. Closing focus and dialog defect disposition remain Q-0007/10; record any approved deviation and its consequences. No uninspected AT parity.

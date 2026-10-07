---
id: SB-FAQ-REPLACE
type: structured-behaviour
title: Opening another answer replaces settled FAQ intent
status: draft
illustrates:
  - UC-FAQ
  - BR-FAQ-SETTLED
given:
  - The reference-equivalent FAQ has one settled expanded answer
  - Normal motion is enabled
when: The visitor activates a different FAQ summary
then:
  - The newly activated answer becomes the sole desired expanded answer
  - The previous answer exits continuously from its current animated state
  - After transitions settle only the newly activated answer is expanded
provenance:
  source: implementation-scope/pre-build-packet/corrections.md COR-01;
    implementation-scope/pre-build-packet/motion.md M-09
  confidence: high
  recovered-from: documentation
---

## Intent

Reported observed/source-declared and prospectively corrected: reproduce the single-settled-answer contract rather than erroneous historical prose.

## Boundaries

Declared: native details.open can overlap transiently; no fixed answer height or fabricated animation runtime is asserted.

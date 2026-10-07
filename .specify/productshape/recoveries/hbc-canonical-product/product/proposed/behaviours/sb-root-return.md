---
id: SB-ROOT-RETURN
type: structured-behaviour
title: Root brand and in-page home return are different
status: draft
illustrates:
  - UC-ENTRY
  - UC-NAVIGATION
given:
  - The visitor has traversed the reference-equivalent document
when: The visitor activates the root brand link
then:
  - The visit navigates to the root without the section fragment
  - Fresh entry behaviour applies for the current motion preference
provenance:
  source: PRODUCT.md PJ-01 / PJ-02;
    implementation-scope/pre-build-packet/motion.md M-06;
    reference/haunted-boulder-city-v2/rev-2.0.0-real-01/public/app.js 237..241
  confidence: high
  recovered-from: documentation
---

## Intent

Declared: preserve fresh navigation reset and avoid treating the brand root link as an in-page #home shortcut.

## Boundaries

Declared: footer #home instead remains in-document. Browser back/forward persistence details remain Q-0008, not assumed.

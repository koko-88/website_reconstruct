---
id: FR-PAGE-PROGRESS
type: functional-requirement
title: Candidate page scroll-progress relationship
status: draft
derived-from:
  - UC-NAVIGATION
verification:
  - id: VERIFY-PROGRESS
    scenario: "Candidate for owner confirmation: compare top, middle and end
      progress with the measured document scroll range, including after resize
      or disclosure height change and under reduced motion. No new runtime
      result is claimed."
provenance:
  source: reference/haunted-boulder-city-v2/rev-2.0.0-real-01/public/index.html
    505; reference/haunted-boulder-city-v2/rev-2.0.0-real-01/public/styles.css
    5; reference/haunted-boulder-city-v2/rev-2.0.0-real-01/public/app.js
    450..461
  confidence: medium
  recovered-from: inference
---

## Requirement

Source-declared: fixed decorative aria-hidden top progress strip scales by clamped nonnegative scrollY divided by measured document scroll range. This is separate from loader decorative progress. Product adoption/acceptance ownership remains Q-0003.

## Rationale

Inferred omission: generic P-10/PX-02 ownership does not explicitly name this visible feedback surface. Candidate is not an accepted scope expansion.

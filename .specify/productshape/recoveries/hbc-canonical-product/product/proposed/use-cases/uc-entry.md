---
id: UC-ENTRY
type: use-case
title: Enter and reach ready home
status: draft
primary-actor: ACT-VISITOR
bounded-context: BC-LOCAL-FIDELITY
uses-terms:
  - TERM-REFERENCE-FIXTURE
provenance:
  source: PRODUCT.md P-01 / Entry; implementation-scope/pre-build-packet/motion.md
    M-01; reference/haunted-boulder-city-v2/rev-2.0.0-real-01/public/index.html
    12
  confidence: high
  recovered-from: documentation
---

## Goal

Declared: Enter and reach ready home; current product owner P-01.

## Trigger

Declared: a fresh root visit or root-brand reset.

## Preconditions

Declared: a fresh anonymous fixture; motion preference selected before navigation.

## Main Flow

Declared: show normal loader, part mist, release hero and reach ready home; preserve typography, imagery and default header. Loader status is polite and its progress decorative.

## Alternative Flows

Declared: fresh reduced entry dismisses quickly. Source-declared 7s head fallback clears the loading class if application initialization never arrives. In-page #home is a separate path.

## Failure Conditions

Unknown: natural outage not observed. The head fallback does not guarantee complete application initialization or all-image readiness.

## Postconditions

Declared: loader absent and named home content ready under matched comparison conditions.

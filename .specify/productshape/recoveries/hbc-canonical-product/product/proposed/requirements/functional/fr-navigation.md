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

## Continuation batch 2 evidence reconciliation

- E-0061: Bottom wide frame shows ticket CTA/review, creator identity, footer credit and back-to-start; creator media still blurred.
- E-0072: 390 bottom layout stacks creator/media and footer credit/back-to-start; media and reveal remain partially blurred.
- E-0081: 768 bottom frame separates ticket review and creator/media before footer credit/back-to-start.

## Continuation batch 6 evidence reconciliation

- E-0185: Unwrapped live inventory has local fragment links, root branding link, named outbound maps/venues/review/credit/contact and 24 image entries. Lazy offscreen topic natural sizes zero cannot establish asset failure; links are reference affordances, not authority to send/open transactions.
- E-0188: Captured accessibility tree exposes Skip to content, branded root link, ticket link and expandable menu. Semantic exposure does not prove keyboard containment, screen-reader testing or conformance.

## Continuation batch 7 evidence reconciliation

- E-0204: Desktop log independently shows exactly requested FAQ1..9 open after settled toggle, contrary to misleading later action label 'remaining answers open'. Menu Escape restores toggle focus; fragment about focus stays on intro across history back/forward. Story buttons change track/count without hash. Ticket immediate status becomes iframe1, close/reopen retains frame, Tab escapes to BODY. Q-0008/Q-0010 remain review decisions.
- E-0205: Narrow journey reset preserves first FAQ open, prior iframe and story count. First action labeled FAQ1 open actually closes it; this explains E-0107 visible closed pixels and supports Q-0013 correction need. History forward sampled scroll0, not unconditional target restoration. Width change/reused fixture is not fresh navigation; Q-0008 preserved.

## Continuation batch 8 evidence reconciliation

- E-0230: v2 live host inventory retains section IDs, menu, three chapters, nine details, role-dialog and fragment/outbound controls. Video960 source is an observed asset choice, not a new business flow; analytics/provider scripts do not expand local product scope.

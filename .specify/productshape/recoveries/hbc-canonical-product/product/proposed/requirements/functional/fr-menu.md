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

## Continuation batch 3 evidence reconciliation

- E-0101: Inspected open menu composition with four numbered links, close control and lower ticket action, and closed hero with visible menu focus outline at desktop/narrow sizes. Narrow lower ticket content is blurred at open checkpoint. Focus outline is visual evidence only, not proof of complete focus containment or closing arbitration (Q-0006/Q-0007).
- E-0102: Inspected open menu composition with four numbered links, close control and lower ticket action, and closed hero with visible menu focus outline at desktop/narrow sizes. Narrow lower ticket content is blurred at open checkpoint. Focus outline is visual evidence only, not proof of complete focus containment or closing arbitration (Q-0006/Q-0007).
- E-0103: Inspected open menu composition with four numbered links, close control and lower ticket action, and closed hero with visible menu focus outline at desktop/narrow sizes. Narrow lower ticket content is blurred at open checkpoint. Focus outline is visual evidence only, not proof of complete focus containment or closing arbitration (Q-0006/Q-0007).
- E-0104: Inspected open menu composition with four numbered links, close control and lower ticket action, and closed hero with visible menu focus outline at desktop/narrow sizes. Narrow lower ticket content is blurred at open checkpoint. Focus outline is visual evidence only, not proof of complete focus containment or closing arbitration (Q-0006/Q-0007).

## Continuation batch 6 evidence reconciliation

- E-0187: Captured HTTP200 app source independently contains loader readiness/floor/ceiling, menu is-open versus delayed hidden, topic glitch cooldown, media/preference and ticket preview declarations. Fetch success does not prove executing behavior; earlier state-ownership questions retained.

## Continuation batch 7 evidence reconciliation

- E-0204: Desktop log independently shows exactly requested FAQ1..9 open after settled toggle, contrary to misleading later action label 'remaining answers open'. Menu Escape restores toggle focus; fragment about focus stays on intro across history back/forward. Story buttons change track/count without hash. Ticket immediate status becomes iframe1, close/reopen retains frame, Tab escapes to BODY. Q-0008/Q-0010 remain review decisions.
- E-0205: Narrow journey reset preserves first FAQ open, prior iframe and story count. First action labeled FAQ1 open actually closes it; this explains E-0107 visible closed pixels and supports Q-0013 correction need. History forward sampled scroll0, not unconditional target restoration. Width change/reused fixture is not fresh navigation; Q-0008 preserved.
- E-0216: Independent reversal log: menu Tab cycle includes header brand/ticket/toggle as well as nav links; rapid reopen remains open. FAQ interruption ends all closed. Fresh normal UFO progresses and reverses media time, ready4; modal Tabs reach BODY/skip/brand/header and story controls while open, then veil close returns ticket opener. Source intent versus observed dialog focus remains Q-0010; menu cycle ownership Q-0007.

## Continuation batch 8 evidence reconciliation

- E-0239: All28 canonical phase assessments inspected. Original desktop/narrow menu OPEN/CLOSED and desktop ticket/provider labels are rejected as unsettled/transient and superseded by repair02 OPEN/CLOSED and repair01 REOPEN. Whole-page ALL captures support selected geometry/context only. Raw settled labels remain immutable; later sidecar/pixel examination must retain these corrections.

## Continuation batch 10 evidence reconciliation

- E-0281: Desktop repair02 CLOSED/HOME paired sidecars and pixels inspected; hashes match, captureChanged false. Closed image shows unobscured hero and menu focus outline. Named repaired settled baseline supersedes original transient exit image, without defining unobserved focus arbitration.
- E-0282: Desktop repair02 CLOSED/HOME paired sidecars and pixels inspected; hashes match, captureChanged false. Closed image shows unobscured hero and menu focus outline. Named repaired settled baseline supersedes original transient exit image, without defining unobserved focus arbitration.
- E-0283: Desktop repair02 CLOSED/HOME paired sidecars and pixels inspected; hashes match, captureChanged false. Closed image shows unobscured hero and menu focus outline. Named repaired settled baseline supersedes original transient exit image, without defining unobserved focus arbitration.
- E-0284: Desktop repair02 CLOSED/HOME paired sidecars and pixels inspected; hashes match, captureChanged false. Closed image shows unobscured hero and menu focus outline. Named repaired settled baseline supersedes original transient exit image, without defining unobserved focus arbitration.
- E-0285: Desktop repair02 OPEN pixels resolve all four numbered navigation titles/subtitles and lower ticket/directions content. Sidecar checks parent plus four visible link rectangles, rather than parent alone; paired hash matches. This is the settled menu baseline prescribed by persisted assessment.
- E-0286: Desktop repair02 OPEN pixels resolve all four numbered navigation titles/subtitles and lower ticket/directions content. Sidecar checks parent plus four visible link rectangles, rather than parent alone; paired hash matches. This is the settled menu baseline prescribed by persisted assessment.
- E-0287: 390x844 repair02 CLOSED/HOME pairs show clear narrow hero and closed menu focus outline. Paired hashes match with unchanged capture state; scope remains named narrow viewport and sampled input context.
- E-0288: 390x844 repair02 CLOSED/HOME pairs show clear narrow hero and closed menu focus outline. Paired hashes match with unchanged capture state; scope remains named narrow viewport and sampled input context.
- E-0289: 390x844 repair02 CLOSED/HOME pairs show clear narrow hero and closed menu focus outline. Paired hashes match with unchanged capture state; scope remains named narrow viewport and sampled input context.
- E-0290: 390x844 repair02 CLOSED/HOME pairs show clear narrow hero and closed menu focus outline. Paired hashes match with unchanged capture state; scope remains named narrow viewport and sampled input context.
- E-0291: Narrow repair02 OPEN shows all four navigation rows/descriptions and resolved lower ticket/meeting/directions content. Sidecar includes four visible link rectangles at x24,width342, not merely visible menu parent; hashes match. Settled appearance replaces original early capture only within recorded scope.
- E-0292: Narrow repair02 OPEN shows all four navigation rows/descriptions and resolved lower ticket/meeting/directions content. Sidecar includes four visible link rectangles at x24,width342, not merely visible menu parent; hashes match. Settled appearance replaces original early capture only within recorded scope.
- E-0302: Original MENU-CLOSED is labeled raw settled with hero-visible check, but pixels retain low-contrast navigation/overlay remnants. Preserve canonical transient-exit classification and use repair02 CLOSED for settled appearance; raw label does not silently override measured phase.
- E-0303: Original MENU-CLOSED is labeled raw settled with hero-visible check, but pixels retain low-contrast navigation/overlay remnants. Preserve canonical transient-exit classification and use repair02 CLOSED for settled appearance; raw label does not silently override measured phase.
- E-0304: Original MENU raw settled check only proves visible menu parent. Pixels still show underlying hero/fog without readable settled navigation rows. Hash match does not establish visual readiness; canonical assessment routes settled appearance to repair02 OPEN.
- E-0305: Original MENU raw settled check only proves visible menu parent. Pixels still show underlying hero/fog without readable settled navigation rows. Hash match does not establish visual readiness; canonical assessment routes settled appearance to repair02 OPEN.

## Continuation batch 11 evidence reconciliation

- E-0314: Original narrow MENU-CLOSED pixels retain exit overlay/hairlines although raw metadata says settled. Preserve canonical transient-exit assessment and repaired CLOSED baseline; parent hero visibility does not certify disappearance of all overlay layers.
- E-0315: Original narrow MENU-CLOSED pixels retain exit overlay/hairlines although raw metadata says settled. Preserve canonical transient-exit assessment and repaired CLOSED baseline; parent hero visibility does not certify disappearance of all overlay layers.
- E-0316: Original narrow MENU parent is visible but pixels have unreadable/absent menu rows over darkened hero. Matching hash and raw settled label do not prove row readiness; canonical repair02 OPEN owns settled navigation appearance.
- E-0317: Original narrow MENU parent is visible but pixels have unreadable/absent menu rows over darkened hero. Matching hash and raw settled label do not prove row readiness; canonical repair02 OPEN owns settled navigation appearance.

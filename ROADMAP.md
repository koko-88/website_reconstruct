# ROADMAP — Haunted Boulder City Reconstruction

## Status

**DECOMPOSITION COMPLETE — REVIEW REQUIRED BEFORE IMPLEMENTATION**

This file is the canonical Spec-of-Specs / project decomposition owner. The decomposition below is derived from [PRODUCT.md](PRODUCT.md) revision 4 and the canonical evidence. Product-area IDs are not implementation features by themselves; features are grouped by coherent observable behavior and independent acceptance boundaries.

No implementation is authorized until this roadmap decomposition is reviewed and the execution gate is explicitly advanced.

## Epic

**Haunted Boulder City Local Reference-Fidelity Reconstruction**

Product authority: [PRODUCT.md](PRODUCT.md)  
Project-wide rules: [.specify/memory/constitution.md](.specify/memory/constitution.md)  
Evidence entry point: [implementation-scope/pre-build-packet/README.md](implementation-scope/pre-build-packet/README.md)

## Decomposition principles

The feature set is intentionally smaller than the product-area inventory.

- A feature exists only when it has a coherent observable outcome and an independently testable acceptance boundary.
- Static/editorial sections that share the same delivery character are grouped instead of receiving ceremony-only feature directories.
- Stateful systems with distinct progression, reversal, overlay, or interruption semantics remain separate features.
- Shared visual, typography, responsive, input, motion and accessibility obligations are acceptance dimensions applied to the feature that exposes them; they are not a standalone "foundation" feature.
- Technical architecture, library selection and code-sharing boundaries belong in feature planning, not this roadmap.
- The final navigation/integration slice depends on all destination-bearing sections being present; the other product slices do not acquire artificial product dependencies merely because they will share implementation infrastructure.

## Approved feature decomposition

| Roadmap ID | Feature / intended spec | Product coverage | Independent outcome | Dependencies | Status |
| --- | --- | --- | --- | --- | --- |
| R-001 | Home Entry and Ready Hero Fidelity — existing specs/001-home-entry-fidelity | P-01; closed/default-header subset of P-07; relevant P-10/PX obligations | A fresh normal, touch/mobile or reduced-motion visit reaches the correct ready home state with loader lifecycle, hero/header composition, input effects, semantics and fallback behavior independently accepted. | None | **EXISTING SPEC — KEEP; roadmap-aligned** |
| R-002 | Informational Sections Fidelity — intended specs/002-informational-sections-fidelity | P-02, P-05, P-09; relevant P-10/PX obligations | About/intro/facts, venue, local destinations, creator/proof and footer are complete reference-equivalent sections with their reveal/fact/link/responsive/accessibility behavior accepted without requiring the stateful story/topic/FAQ/ticket systems. | None at product level | **READY TO SPECIFY AFTER REVIEW** |
| R-003 | Stories Progression Fidelity — intended specs/003-stories-progression-fidelity | P-03; relevant P-10/PX obligations | The three-chapter story experience passes forward/reverse progression, count/selection, wide pinned vs narrow/reduced layout, media readiness/fallback and interruption acceptance. | None at product level | **READY TO SPECIFY AFTER REVIEW** |
| R-004 | Tour Highlights Interaction Fidelity — intended specs/004-tour-highlights-fidelity | P-04; relevant P-10/PX obligations | All eight topic states, corrected row/media bindings, scroll-selected scenery, hover/glitch feedback, reversal, touch and reduced-motion distinctions are independently accepted. | None at product level | **READY TO SPECIFY AFTER REVIEW** |
| R-005 | Plan / FAQ Disclosure Fidelity — intended specs/005-plan-faq-fidelity | P-06; relevant P-10/PX obligations | Nine distinct disclosures pass zero/one settled state, content-driven height, keyboard operation, open/close interruption and reversal acceptance. | None at product level | **READY TO SPECIFY AFTER REVIEW** |
| R-006 | Ticket Invitation and Host Dialog Fidelity — intended specs/006-ticket-host-dialog-fidelity | P-08; TF-06; TX-01; relevant P-10/PX obligations | Ticket invitation and host-dialog opening/loading/visible/close/reopen/preview/fallback/focus-return behavior passes without importing excluded Eventbrite commerce semantics. | None at product level | **READY TO SPECIFY AFTER REVIEW** |
| R-007 | Global Menu, Fragment Navigation and Whole-Page Integration — intended specs/007-global-navigation-integration | P-07 remainder; PJ-02; shared cross-section sequence/history/return behavior; final applicable P-10/PX convergence | Open/close menu, all real fragment destinations, reload/back/forward/root-vs-home semantics and cross-section integration are accepted against the completed page without fake destinations or placeholder sections. | R-001 through R-006 | **FINAL PRODUCT-INTEGRATION SLICE** |

## Why the informational surfaces are grouped

P-02, P-05 and P-09 remain distinct product owners in PRODUCT.md, but they do not need separate Spec Kit features. Their implementation-facing behavior is predominantly section composition, reveal/fact state, link contracts, responsive geometry and accessibility rather than separate multi-step state systems. Grouping them in R-002 preserves their individual acceptance rows while avoiding section-per-feature ceremony.

If implementation planning later proves that one of these surfaces has a materially independent architectural or delivery dependency, the roadmap may split R-002 through an explicit roadmap revision. It must not be split merely because the DOM has separate sections.

## Product → feature coverage

| Product owner | Roadmap owner | Coverage disposition |
| --- | --- | --- |
| P-01 Entry and Home | R-001 | Complete within the local reference-equivalent phase. |
| P-02 About, intro and facts | R-002 | Complete. |
| P-03 Stories | R-003 | Complete. |
| P-04 Tour Highlights | R-004 | Complete. |
| P-05 Venue and Local Information | R-002 | Complete. |
| P-06 FAQ / Plan | R-005 | Complete. |
| P-07 Global Menu and Fragment Navigation | R-001 owns only the closed/default header relationship required by ready home; R-007 owns open-menu/navigation/history journeys. | Deliberately split by independently testable acceptance boundary; no duplicate acceptance claim. |
| P-08 Ticket Invitation and Host Dialog | R-006 | Complete; exact commerce stays excluded. |
| P-09 Creator, Proof and Footer | R-002 | Complete. |
| P-10 Shared Experience System | R-001..R-007 as applicable | Cross-cutting owner; each feature must adopt the PX/TF obligations its visible states exercise. No standalone foundation feature. |

## Journey coverage

| Journey | Roadmap owner |
| --- | --- |
| PJ-01 Fresh root entry | R-001 |
| PJ-02 Menu / fragment navigation | R-007, with closed-header prerequisites accepted in R-001 |
| PJ-03 Story progression | R-003 |
| PJ-04 FAQ interaction | R-005 |
| PJ-05 Ticket host lifecycle | R-006 |
| PJ-06 Outbound information | R-002 |

## Cross-cutting obligation coverage

- **TF-01 / visual hierarchy and geometry:** accepted inside every feature for the surfaces it owns.
- **TF-02 / typography:** accepted inside every feature that renders reference-equivalent text; global replacement decisions remain under PRODUCT/TR-01.
- **TF-03 / responsive behavior:** each feature owns its evidenced width/height/input branches; R-007 verifies final cross-section navigation/integration, not every section's local geometry again.
- **TF-04 / interaction character:** R-001 entry/home motion; R-002 fact/reveal behavior; R-003 stories; R-004 topics; R-005 FAQ; R-006 ticket host; R-007 menu/navigation/history.
- **TF-05 / accessibility:** each feature owns semantics/keyboard/focus relationships for its surfaces; reference defects use PRODUCT's deviation policy.
- **TF-06 / visible CTA shell:** R-006.
- **TA-01:** later real-content adaptation is outside the first local reference-equivalent feature set unless a slice explicitly receives target mappings.
- **TR-01:** local available fixtures may be used under PRODUCT; public/distributed release decisions remain a separate release gate.
- **TX-01:** enforced by R-006 and the project boundary; commerce is not a hidden dependency of any slice.
- **TU-01:** bounded unknowns remain unknown; no feature may silently claim expanded device/engine/AT/hidden-renderer parity.

## Dependency graph

The project-level dependency graph is intentionally shallow:

- R-001, R-002, R-003, R-004, R-005 and R-006 have no product-level dependency on one another.
- R-007 depends on R-001..R-006 because its acceptance requires the real destination sections and host states to exist; placeholder anchors or fabricated journeys are not permitted.
- Technical plans may identify implementation-order dependencies such as shared primitives or assets. Those do not retroactively become product dependencies unless they alter independent acceptance.

Graph:

R-001 ─┐
R-002 ─┤
R-003 ─┤
R-004 ─┼──> R-007
R-005 ─┤
R-006 ─┘

No cycle exists.

## Acceptance-boundary test

| Feature | Can be accepted without unfinished feature behavior? | Boundary decision |
| --- | --- | --- |
| R-001 | Yes. Existing spec explicitly excludes menu-open and later-section journeys while preserving destination identities. | PASS |
| R-002 | Yes. Its sections can be revealed, measured and behaviorally checked without stories/topics/FAQ/ticket interactions. | PASS |
| R-003 | Yes. Story progression/reversal is self-contained in its section and evidence. | PASS |
| R-004 | Yes. Topic selection/feedback is self-contained in highlights and its corrected bindings. | PASS |
| R-005 | Yes. FAQ state machine/keyboard/interruption is self-contained in Plan. | PASS |
| R-006 | Yes. Host dialog lifecycle is testable without provider commerce and without requiring global menu journeys. | PASS |
| R-007 | Yes, after R-001..R-006. It is explicitly the cross-section navigation/integration acceptance slice. | PASS |

## Existing pre-roadmap feature reconciliation

### 001-home-entry-fidelity → R-001

**Disposition: KEEP.**

Reason:

- its included boundary matches P-01 plus only the closed/default-header relationship required for a ready home;
- it explicitly excludes menu opening/closing, later sections, ticket/modal/provider behavior and whole-site navigation/history;
- it already distinguishes fresh root navigation from in-page home return;
- it already covers normal desktop, touch/mobile, fresh reduced motion, keyboard semantics, entry fallback and repeatable temporal/visual acceptance;
- keeping it does not force any other pre-roadmap boundary to survive.

Required alignment before implementation: update its canonical PRODUCT reference from revision 3 to revision 4 and record parent roadmap ID R-001. No scope expansion is required by this reconciliation.

## Roadmap completion gate

- [x] Derive the smallest coherent set of independently testable features from PRODUCT.md and canonical evidence.
- [x] Assign every material product/fidelity obligation to one feature where possible, or to an explicit cross-cutting owner.
- [x] Identify and resolve uncovered, duplicated, or ambiguous ownership.
- [x] Define an acyclic dependency graph.
- [x] Confirm each feature has an independently testable acceptance boundary.
- [x] Reconcile 001-home-entry-fidelity against the completed decomposition.
- [x] Record final feature count, durable IDs/names, ordering, dependencies, and coverage result.

## Evidence-row disposition closure

The roadmap does not turn every evidence row into a feature. All SR-01..46 are accounted for through feature ownership or an explicit non-feature disposition:

| Evidence rows | Roadmap / policy owner | Disposition |
| --- | --- | --- |
| SR-01/10/37/38 | R-001 plus shared obligations | Home entry, closed/default header and home motion/entry states. |
| SR-02/08/13/24/34/38/39 | R-002 plus shared obligations | Informational/reveal/fact/link/creator/footer behavior. SR-13's whole-site navigation portion is finalized in R-007. |
| SR-03..06/38 | R-003 | Stories progression/media/reduced behavior. |
| SR-07/39 | R-004 | Topic selection/feedback behavior. |
| SR-09/14..23 | R-005 | FAQ/default, per-answer, keyboard and interruption behavior. |
| SR-25..32/39 | R-006 | Ticket invitation and host-dialog lifecycle. |
| SR-10..13 | R-007, except R-001 closed-header prerequisite | Open menu, destinations, history and root/home navigation integration. |
| SR-33 | TX-01 / R-006 boundary | Historical selectable-commerce evidence gap remains real, but exact commerce is excluded from the target product. |
| SR-35/36 | P-10/PX-04 across R-001..R-007 | Responsive width/height boundaries are accepted in the owning feature surfaces, not as a standalone feature. |
| SR-40 | P-10/PX-06 | Renderer/public-artifact evidence constrains implementation claims; it is not a user-facing feature. |
| SR-41 | Evidence integrity / project verification | Evidence-file integrity and supersession provenance are project verification inputs, not product behavior. |
| SR-42 | TR-01 across affected features | Asset/source/replacement availability and rights remain a cross-cutting input/release boundary. |
| SR-43 | PRODUCT inspected absence | No first-party forms/search/pagination system exists; no feature is created for an absent system. |
| SR-44 | TX-01 exclusion | External purchase/payment/submission/account/message flows and external designs are excluded. |
| SR-45 | TU-01 | Expanded device/engine/AT/zoom/RTL/dark/DPR parity remains an allowed unknown unless scope expands. |
| SR-46 | Evidence handoff / project verification | Evidence-package portability and replay are project evidence obligations, not an application feature. |

**Coverage result: 46/46 SR rows have an explicit owner or non-feature disposition; no SR row is orphaned.**

## Review / execution gate

The decomposition is complete but intentionally awaits review before delivery resumes.

Required review result:

- confirm that seven slices are the appropriate smallest coherent set;
- confirm R-002 grouping does not hide a materially independent product dependency;
- confirm P-07 split between R-001 closed state and R-007 open/navigation state is unambiguous;
- confirm no evidence/product obligation is orphaned by the coverage tables.

After that review passes, change status to **ROADMAP APPROVED — FEATURE DELIVERY ADMITTED**, align R-001 metadata, and begin specification of the next selected slice. Roadmap review does not authorize target adaptation or public asset release.

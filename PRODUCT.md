# PRODUCT — Haunted Boulder City Reconstruction

Contract **FC-TARGET-DESIGN-01**, revision 4, 2026-10-07 (Africa/Cairo). This is the canonical product authority for the bounded local reference-fidelity reconstruction. Revision 4 completes product-level ownership needed for project decomposition; it does not create feature boundaries, technical architecture, or new reference observations.

Agent entry point: [AGENTS.md](AGENTS.md). Project-wide rules live in the [Spec Kit Constitution](.specify/memory/constitution.md). Project decomposition and execution admission live in [ROADMAP.md](ROADMAP.md). Implementation evidence starts at the [pre-build packet](implementation-scope/pre-build-packet/README.md), whose corrections, evidence index, motion fingerprint, typography/assets crosswalk, and authority crosswalk remain the detailed evidence owners.

## Product completion status

**COMPLETE FOR ROADMAP DECOMPOSITION**

This status means the material observable product surfaces, journeys, stateful behaviors, cross-cutting obligations, exclusions, unknowns, and current-phase input constraints have an explicit product-level owner. It does **not** mean implementation is admitted; ROADMAP.md remains **DECOMPOSITION REQUIRED** until independently testable feature boundaries, dependencies, coverage, and acceptance ownership are derived and approved.

## Whole-product purpose and visitor outcomes

The local reconstruction must reproduce the observable design/experience system strongly enough to validate the full evidence → specification → implementation → verification workflow against the reference. Within the reference-equivalent fixture, a visitor must be able to:

- enter through the normal or reduced-motion entry path and reach a stable home state;
- understand and traverse the narrative sections in the observed order and interaction model;
- progress through story chapters and topic-driven visual states, including reversal/interruption behavior;
- use menu and fragment navigation with the observed history/reset semantics;
- inspect venue/local information and disclosures;
- reach and operate the visible ticket invitation/dialog host shell without reproducing excluded commerce;
- use the evidenced keyboard/focus/semantic relationships within the bounded Chromium scope.

Real target content, branding, destinations, and CTA functionality remain later adaptation decisions under TA-01. These outcomes describe the reference-equivalent local validation product, not a general-purpose tourism platform.

## Product / experience ownership

These IDs are stable product-area identifiers. They are **not** Spec Kit feature IDs and do not imply implementation slicing.

| Product ID | Product area | Product intent / observable outcome | Routes, states and journeys owned | Evidence anchors |
| --- | --- | --- | --- | --- |
| P-01 | Entry and Home | Establish fresh entry, loader/hero transition, ready home, root reset, and reduced-motion entry as distinct product states. | root and home fragment; loading → parting/hero overlap → ready; reduced fast-entry; source-declared initialization fallback. | SR-01/10/37/38; M-01/03/04/12; AC2-01/04 |
| P-02 | About, intro and facts | Present the intro/photo/facts composition and its decode/rearm behavior without flattening responsive or input differences. | about fragment; revealed intro; fact decode/settle/rearm; normal/touch/reduced branches. | SR-02/38/39; M-05/06; AC2-02/03/04 |
| P-03 | Stories | Preserve the three-chapter narrative progression, reversal, count/selection state, wide pinned behavior, narrow/reduced vertical behavior, and UFO still/video fallback relationships. | stories fragment; chapter 0/1/2; forward/reverse; reduced vertical; media-ready/fallback states. | SR-03..06/38; M-06/07/12; AC2-03/04 |
| P-04 | Tour Highlights | Preserve eight reference topic rows, selected scenery, scroll-driven selection, hover/glitch feedback, corrected topic bindings, and reduced/touch distinctions. | unnamed highlights section; eight topic states; selected-scene transitions; hover/rearm feedback. | SR-07/39; M-08; COR-03; AC2-03/04 |
| P-05 | Venue and Local Information | Preserve venue composition, directions contract, local destination rows, link roles and externally-bound navigation without reproducing external destination designs. | zombies and local fragments; venue/default; outbound link contracts. | SR-08/24; AC2-02/08 |
| P-06 | FAQ / Plan | Preserve nine distinct disclosures, zero-or-one settled expansion, content-driven height, keyboard activation, interruption and reversal continuity. | plan fragment; nine closed; each open/close; rapid interruption; Enter/Space. | SR-09/14..23; COR-01; M-09; AC2-05 |
| P-07 | Global Menu and Fragment Navigation | Preserve closed/open menu, stagger, focus/scroll lock, Escape/close behavior, fragment navigation, back/forward/reload, root reset and in-page home-return distinctions. | menu closed/open/closing; all observed fragments; browser history states. | SR-10..13; M-10; AC2-06/07 |
| P-08 | Ticket Invitation and Host Dialog | Preserve the visible CTA section and host-dialog lifecycle while excluding Eventbrite business semantics. | tickets fragment; opening/loading/visible/close/reopen; tickets preview query; simulated host fallback; focus/scroll restoration. | SR-25..32/39; M-11; AC2-09/10/11/12 |
| P-09 | Creator, Proof and Footer | Preserve creator/proof/footer presentation and back-home relationship as part of the reference-equivalent fixture. | creator fragment; creator/proof; footer; home return. | SR-13/34; AC2-02/07 |
| P-10 | Shared Experience System | Own product-wide visual, typography, responsive, scrolling/input, motion, semantics/focus, renderer/public-artifact and environment obligations that span multiple product areas. | all scoped surfaces; width/height/input/preference branches; visibility/interruption; cross-cutting acceptance. | SR-35..45 as applicable; TF-01..05; TU-01 |

## Reference topology and fixture cardinality

These counts describe the **reference-equivalent local validation fixture**. They are not permanent business-data cardinalities for later adaptation.

| Reference relationship | Current fixture obligation | Adaptation rule |
| --- | --- | --- |
| Route topology | One document/root route shell with fragment-driven sections plus the tickets preview query entry variant. | Target routing may change only through an explicit adaptation decision that preserves required observable relationships or records deviations. |
| Stories | Three chapters: Ghosts, Dark history, UFO. | Target chapter data/count may change later under TA-01; the local validation fixture keeps all three. |
| Tour highlights | Eight ordered topic rows with corrected source identifiers/bindings. | Real target topics may change; local fixture keeps all eight and their reference mapping. |
| FAQ | Nine disclosures; FAQ7 has two paragraphs. | Target FAQ count/content may change later; local fixture validates all nine distinct answers. |
| Local destinations | Three indexed local destination rows plus observed external agency/contact/Tripadvisor-style links. | Target destinations require explicit mapping; external destination page designs remain excluded. |
| Facts | Three-column fact relationship is retained, including narrow-layout internal rearrangement. | Target fact data may change, but geometry/cardinality changes require explicit acceptance impact. |
| Sections | Home → About → Stories → Highlights → Venue → Plan → Local → Tickets → Creator → Footer. | This sequence is part of the reference fixture; later information architecture changes are adaptation decisions, not silent implementation freedom. |

## Routes, entry points and critical journeys

| Journey ID | Product-owned journey | Required disposition |
| --- | --- | --- |
| PJ-01 | Fresh root entry | New root navigation is distinct from in-page home return; normal and reduced entry are separate acceptance paths. |
| PJ-02 | Menu / fragment navigation | Open/close/Escape, first-link focus, scroll lock, fragment navigation, reload/back/forward, and home-return behavior remain observable obligations. |
| PJ-03 | Story progression | Chapter 0 → 1 → 2 and reverse progression occur without inventing separate hashes for chapter state; interruption/reversal continuity matters. |
| PJ-04 | FAQ interaction | Each disclosure opens/closes in sequence with zero/one settled answer; interruption and keyboard activation are required. |
| PJ-05 | Ticket host lifecycle | Ticket section → dialog opening/loading/visible → close/reopen/return-focus, plus preview entry and controlled fallback distinction. Provider commerce is excluded. |
| PJ-06 | Outbound information | Venue/local links preserve observed link roles/attributes; external page design, submission and transaction outcomes are excluded. |

## Stateful behavior dispositions

The following behaviors are product truth because they materially change observable acceptance. Detailed formulas/timings remain in the evidence packet rather than being duplicated here.

- **Entry:** loader readiness, loader dismissal, hero release and final ready state are distinct. The source-declared 7-second initialization failsafe is retained as a fallback requirement for the local fixture, without claiming a naturally observed outage.
- **Scrolling/input:** fine-pointer smoothing/hero effects, native keyboard/scrollbar/touch behavior, navigation interruption, fragment focus/history and root reset are cross-cutting product behavior. Implementation algorithms are a planning decision.
- **Stories/media:** wide normal pinned progression, narrow/reduced vertical presentation, synchronized chapter/count state, reversal, video readiness and still fallback are explicit P-03 behavior.
- **Facts/topics:** fact decode/settle/rearm and topic scroll-selection are distinct from hover feedback. Hover does not silently redefine selected scenery.
- **Preference changes:** fresh reduced-motion entry and switching motion preference during a session are separate cases. Width, input capability and motion preference remain independent dimensions.
- **Ticket host:** visible shell lifecycle, close methods, focus/scroll restoration and retained mounted state are P-08 obligations. Provider inventory/business flows remain excluded by TX-01.
- **Visibility/interruption:** ambient/reveal behavior must honor the evidenced visibility and cancellation relationships rather than being accepted from one arbitrary static frame.

## Shared product obligations

| Shared ID | Owner | Obligation |
| --- | --- | --- |
| PX-01 | P-10 | Visual hierarchy, section geometry, layering, crop/focal roles, typography metrics and responsive relationships across the complete fixture. |
| PX-02 | P-10 | Scrolling, input-mode selection, interruption, browser-history behavior and state restoration across navigation and section interactions. |
| PX-03 | P-10 | Ambient motion/reveals: fog, grain, rotating marks, flashlight, scene effects and CTA spirit are evaluated by character/range/lifecycle, not fixed stochastic frame identity. |
| PX-04 | P-10 | Responsive and preference behavior: width/height boundaries, touch/coarse input, reduced motion and preference switching are independently owned dimensions. |
| PX-05 | P-10 | Accessibility behavior: skip navigation, loader status, meaningful roles/names/state, disclosure operation, hidden-state focus exclusion, visible focus, overlay focus/return and documented correction of reference defects. |
| PX-06 | P-10 | Renderer/public-artifact boundary: DOM/CSS/SVG/video/iframe/worker findings and unknown internals remain classified; no hidden renderer equivalence is inferred. |

## Accessibility and reference-defect disposition

TF-05 remains the governing accessibility policy. For decomposition purposes, the following evidenced relationships are explicitly product-owned: skip-link visibility/activation, polite loader status, meaningful home heading/image semantics, keyboard-operable menu/disclosures, hidden navigation exclusion from focus order, and ticket-dialog focus/return behavior.

The observed ticket-dialog Tab escape is a **reference defect**, not a target requirement. The target may correct it, but the correction and any visual/interaction consequence must be recorded as an explicit deviation. This does not claim uninspected assistive-technology, other-engine or zoom parity.

## Asset and implementation-input availability

Reuse permission and input availability are separate concerns.

| Input group | Current local-validation availability | Product disposition |
| --- | --- | --- |
| Display / Manticore / Space Mono inspection fonts | Present in the evidence package as inspection bytes. | May be used as local fidelity fixtures under the current phase allowance; public reuse still requires TR-01 resolution. |
| Hero/section/topic/venue/portrait imagery | Mostly represented by captured/reference evidence and source inventory; original reusable media library is not complete. | Missing original bytes are an implementation input gap, not permission to invent a generic substitute and call it exact. Use an actually available fixture or document a concrete replacement/deviation. |
| UFO video | Behavior/metadata/timeline evidence exists; reusable MP4 is not acquired. | Preserve the media/still behavior contract; exact video fidelity cannot be claimed without an available authorized fixture or documented replacement mapping. |
| Fog/spirit/grain/marks | Behavior/source evidence exists; standalone reusable assets are incomplete. | Independently authored equivalents are allowed only with measured visual consequences; source code/art must not be silently copied. |
| Reference app/CSS | Available for inspection. | Source-declared mechanisms may inform independent implementation; code reuse remains blocked unless authority is established. |

## Exclusions, inspected absences, unknowns and pending decisions

| Class | Disposition |
| --- | --- |
| Exact Eventbrite commerce | Excluded: inventory, selectable dates/tickets, booking, purchase, payment and provider business semantics are not reconstruction obligations. |
| External transaction/submission/account/message flows | Excluded. No external write action is required for local fidelity validation. |
| Host forms/search/pagination/validation/empty-state system | Inspected host contains no such first-party product system; do not invent one. |
| External destination page design | Excluded; only the host-side link contract is owned. |
| Telemetry/tracking behavior | Not a visual/experience fidelity obligation unless a later product decision explicitly adopts it. |
| Document metadata / canonical/social/favicon details | Observed source details, but not automatically a product requirement. Adopt only when a later target/release decision needs them. |
| Physical devices, Safari/other engines, browser zoom, AT parity, RTL/dark, DPR2+ | Remain outside the currently evidenced parity claim under TU-01. |
| Random ambient phase and inaccessible provider/worker/shadow internals | Remain allowed unknowns; evaluate bounded observable character, not hidden equivalence. |
| Real target content/brand/data/CTA action | Pending TA-01 adaptation mapping. |
| Public/distributed asset rights | Pending TR-01 source/license/replacement decisions for affected assets. |

## Authority and source precedence

The user's hardening request defines the intended reconstruction as Haunted Boulder City's observable design, experience, interaction and motion system, to be adapted later to different real content/data. It explicitly excludes reproduction of its commerce system and permits replacement of the visible ticket/CTA experience under a visual/interaction contract. This contract applies those decisions to the implementation scope. It does not amend FC-HBC-V2-01 or either frozen evidence package.

Evidence: sealed `reference/haunted-boulder-city-v2/rev-2.0.0-real-01/` (HBC-V2-REAL-01, FC-HBC-V2-01) and immutable `reference/haunted-boulder-city/`. Use the sealed E2-013 canonical capture assessments over misleading raw settled labels; repaired desktop/touch menus and final reopened/provider states support their named appearance. Full-page raw geometry artifacts support context/geometry only. E2-014 supplies current section geometry. Historical per-section/motion/breakpoint evidence retains its original environment and source-reconciliation limits (E2-006). No universal historical/current raster identity is asserted.

## Obligations and acceptance

| ID / class | Scoped obligation | Acceptance and permitted variation | Evidence anchors |
| --- | --- | --- | --- |
| TF-01 / exact design | Visual hierarchy, section geometry/spacing, layering, image aspect/crop roles and section transitions | Reference-equivalent fixture first; compare named revealed section states in matching viewport/DPR/browser/scroll conditions. Adopt current measured geometry where the sealed package gives source precedence; calibrate raster tolerances at implementation time. Full-page screenshot agreement alone is insufficient. | SR-01..09, SR-24/25/34, E2-014; AC2-01/02 |
| TF-02 / exact design | Typography metrics: display/body hierarchy, width/height, wrapping, line-height, tracking, weight, baseline relationships | Authorized original fonts or documented metric-compatible replacements. A replacement name is insufficient: check headline/body wraps, density, line boxes and overflow across reference-equivalent and target stress fixtures. Record allowed residual deviations rather than silently changing type/layout. | E-055 historical rendered fonts, E2-010 current bytes, SR-01/42 |
| TF-03 / exact behavior | Responsive relationships, breakpoints, short/landscape behavior, mobile/touch structure | Match inspected Chromium conditions and the inherited boundary evidence at 759/760/761, 1099/1100/1101, 1799/1800/1801. Preserve hierarchy/wrapping/crop changes; real-device/other-engine/zoom/AT/RTL/dark/DPR2+ parity remains outside existing evidence claims. | SR-06/12/28/35/36/45; AC2-04/06/09/14 |
| TF-04 / exact character | Menu stagger, activation/close/Escape, section navigation/history, story progression/reversal, disclosure anatomy, hover/rearm feedback | Preserve state graph, ordering, motion timing relationships, layering/scroll locks, interruptions, reversal and reduced-motion relationships. Test multiple phases, not identical random frames. Target routes, wording and chapter/disclosure data can change under TA-01. FAQ intent is zero or one expanded answer; overlapping native open attributes during exit are transient. | SR-03..07/10..23/37..39; AC2-03..07 (FAQ correction in packet overrides historical multiple-open prose) |
| TF-05 / accessibility | Relevant semantics, keyboard activation, accessible names/state, focus relationships and motion preference behavior | Preserve operable reference interaction intent. Reference defects remain evidence, not a requirement to reproduce in the target: document any focus/keyboard/contrast correction and its visual/interaction consequence as an explicit target deviation before acceptance. Do not claim uninspected assistive-technology parity. | SR-06/11/12/13/14..23/29/30/34; AC2-04/05/06/07/10 |
| TF-06 / visible CTA shell | CTA hierarchy, placement, dialog/panel scale/layers, reveal/close/return character, responsive and keyboard relationships | Target functionality may replace Eventbrite. Preserve the agreed host/visible interaction roles where applicable; target loading/empty/error/success states are defined by the target's data/action contract. Provider-owned text, logo, inventory controls and business semantics are not exact baselines. Do not fabricate missing selectable reference states as observed facts. | SR-25..32, canonical E2-013 final provider/repair frames; AC2-09/10/11/12 (host scope only) |
| TA-01 / adaptable content-data-actions | Text, names, real data, item counts, imagery, brand identity, destinations and CTA actions | Explicit adaptation mapping below. Keep geometry/type/image-role constraints or document approved deviations; long/short/empty/many-item fixtures expose overflow and count effects. Changes in substantive action semantics are intentional target decisions. | Adaptation contract below; source inventory E2-004 |
| TR-01 / third-party replacement | Fonts, photographic/video media, textures, marks and implementation code | Use authorized originals or documented replacements with source/owner/license/attribution and visual consequences. Public availability is inspection access, not reuse permission. Independently authored behavior/effects may reproduce observed relationships without copying reference code. | Sealed asset-reuse register; SR-42/U-02 |
| TX-01 / excluded business fidelity | Eventbrite inventory, provider backend, dates/ticket availability/selection data, booking, purchase and payment systems | No exact reconstruction or selectable Eventbrite fixture required. Provider service/error/purchase semantics and third-party page designs are excluded. A target ticket/CTA action is accepted against its own contract, not Eventbrite internals. | New user scope overrides old future implementation assumption only |
| TU-01 / allowed unknown | Random ambient phase, uninspected engines/devices/AT/zoom, inaccessible provider/worker/shadow internals and historical asset byte equality | Remain unknown. No pixel-fixed ambient, hidden renderer or provider equivalence claim. Reopen only if required observable behavior remains unexplained, replacement metrics fail, or environment/commerce scope expands. | SR-38/40/45, U-03..06 |

The CTA replacement preserves the host visual/interaction obligations above, not the original transaction system. The target's exact destination/action still needs an explicit mapping before adaptation; this requirement does not resurrect Eventbrite fidelity.

## Explicit adaptation contract

**Authorized now:** adapt text/data/images/actions and replace third-party assets/services according to TF-01..06/TR-01. **Not yet selected:** actual target content/data, assets/fonts/brand and CTA functionality. This is a policy decision, not acceptance of an unspecified final mapping.

Before target adaptation, maintain a mapping per affected component: reference role/evidence; target field/source/owner; required versus optional content; count/order/cardinality; length/empty/missing/long stress fixtures; image aspect/crop/focal point/alt text; locale/direction; CTA destination/action, permissions and loading/error/success/return states; font/source rights; deviations and acceptance assertions. Keep reference-equivalent fixtures separate from real target data. Target loading/error states need correct accessibility and state behavior, but no Eventbrite state parity is implied. Actual purchases/submissions remain outside this task's authority.

Replacement decisions must record the replacement itself and its effect, not only an intention to replace. The following groups remain pending: display/body/mono fonts; section/hero/story/topic/venue/portrait images; scene video or equivalent target medium; branded marks; fog/grain/icons/textures. Reference app/CSS must not be copied without authority; independent implementations can use the observed behavior specification. Eventbrite script/media/brand/backend need not be acquired when replaced. Newly licensed/owned target marks and service integration are evaluated under their own requirements.

## Local reference-validation mode

The first HBC implementation is a **local reconstruction/fidelity validation** of the evidence → implementation → verification workflow. For this bounded local validation mode, assets already present in the reference/evidence package may be used as local implementation fixtures to measure exact visual and motion fidelity. **The asset/reuse gate is NOT REQUIRED as a precondition for this local validation run.** This phase-specific allowance does not authorize publication or redistribution.

This local validation allowance does not mutate either sealed reference package and does not convert the evidence package into a distributable asset license. Keep the sealed evidence immutable and consume assets as inputs/copies only. If the work later becomes a public/distributed target implementation or adaptation, TR-01 source/license/replacement decisions re-enter as release requirements for the affected assets.

This distinction exists so the local fidelity experiment can test reconstruction quality without an unrelated release gate blocking technical validation, while preserving the separate release/adaptation obligations.

## U-01 / SR-33 reassessment

The sealed gate blocked fidelity because **FC-EX-02 expressly required a selectable Eventbrite date/ticket journey**. U-01 truthfully recorded that its public postponed event could not reveal selection/back/cancel/empty/error/retry/pre-submit states. That fact, disposition and gate remain unchanged in the sealed revision and frozen v1.

Under **TX-01**, those business/provider states have no exact target-reference obligation. Under **TF-06**, their visible host role is supported by existing CTA/panel/lifecycle and final reviewed provider evidence; the target action can replace the provider and is judged under TA-01. Therefore U-01/SR-33 is **non-blocking for FC-TARGET-DESIGN-01 design fidelity**, while remaining an unresolved source fact. This follows the changed obligation, not an assertion that missing evidence was obtained or an unexplained waiver. Expanding target scope to exact selectable provider behavior reopens the need for an authorized fixture and focused captures. U-01 is not resolved or retroactively relabeled N/A in old evidence.

## Separate readiness decisions

| Gate | Decision for this contract | Genuine dependency |
| --- | --- | --- |
| Evidence integrity | PASS, subject to preserved hash/manifest verification receipt in the hardening evidence | Existing sealed/current and frozen baseline checks; no new reference observations |
| Reference design/experience fidelity | **PASS (fidelity-ready) within TF-01..06 and TU-01 bounds** | Existing canonical repaired appearance, historical section/temporal evidence and current geometry support the obligations. No unresolved material evidence blocker remains for this bounded design scope. This is readiness to use a specification, not a built-product fidelity PASS. |
| Asset/reuse implementation decisions | **Current local reference-validation: NOT REQUIRED as a precondition. Public/distributed target release or real adaptation: BLOCKED for affected assets until applicable TR-01 decisions are complete.** | Local validation may use assets already present in the evidence package as fidelity fixtures. This does not convert inspection copies into reusable/public assets; TR-01 source/license/attribution or documented replacement decisions are required before affected release/adaptation. |
| Target adaptation readiness | **PENDING / not yet ready** | Actual target mappings/content/data/CTA action and stress fixtures are not supplied/selected. These are later adaptation inputs, not missing Eventbrite reference evidence. |

Actual reconstruction scope is **fidelity-ready from the evidence perspective**. This does **not** authorize implementation before project decomposition: ROADMAP.md remains the canonical execution gate and currently blocks specification/planning/implementation until feature decomposition is complete. Real-content adaptation remains pending its actual target mappings, and public/distributed target release remains blocked for affected assets until the applicable TR-01 decisions are complete. No reference recapture is required by this reconciliation.

## Spec Kit intake boundary

For the first local-fidelity specifications, reference-equivalent local fixtures are in scope. Public-release and real-adaptation decisions stay deferred unless a slice explicitly depends on them; TX-01 remains excluded. Model/engine route qualification is execution governance owned by RP-HBC-01/RR-HBC-01, not a product requirement.


## Product completion gate and ROADMAP handoff

The product authority is complete enough for project-level decomposition when all of the following hold:

- every material reference surface/journey has one product-area owner;
- every TF/TA/TR/TX/TU obligation has a product-area or shared owner;
- stateful behavior that can change acceptance is explicit rather than left to a feature to invent;
- exclusions, inspected absences, allowed unknowns, reference defects and pending decisions are distinguishable;
- missing implementation inputs are not confused with reuse permission or evidence readiness;
- no product-area ID is treated as a predetermined implementation feature boundary.

**Current decision: PASS FOR ROADMAP DECOMPOSITION.**

ROADMAP.md now owns the next gate: derive the smallest coherent set of independently testable feature slices, establish product-obligation coverage and an acyclic dependency graph, then reconcile the pre-roadmap 001-home-entry-fidelity boundary. Until that roadmap gate passes, no feature implementation is authorized.

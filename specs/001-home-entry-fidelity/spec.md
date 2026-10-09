# Feature Specification: Home Entry and Ready Hero Fidelity

**Feature Branch**: Not created; no specification extension hook is configured.

**Feature Directory**: `specs/001-home-entry-fidelity`

**Created**: 2026-10-05 (Africa/Cairo)

**Status**: Roadmap-aligned draft — requirements quality reviewed; implementation acceptance pending.

**Parent Roadmap**: R-001 in [ROADMAP.md](../../ROADMAP.md)

**Input**: R-001 of Haunted Boulder City's local reference-fidelity validation: reconstruct initial root navigation, loader lifecycle and transition into the fully ready home/hero experience, including relevant desktop, mobile/touch, fresh reduced-motion and keyboard behavior. This specification authorizes no implementation until the ROADMAP review/execution gate admits delivery; its existing technical plan and tasks remain pre-implementation artifacts.

## User Scenarios & Testing *(mandatory)*

### Acceptance vocabulary and conditions

Evidence classifications used throughout are **O** (observed runtime, measurements or pixels), **S** (source-declared behavior), **I** (inference), **U** (unknown or evidence limit), and **D** (prospective acceptance decision). S requirements describe the resulting experience; they do not require copying the reference implementation. No inference is promoted to an observation.

The three named endpoints are **HOME-D-READY**, **HOME-M-READY** and **HOME-R-READY**, mapped respectively to `raw-run-01/D--HOME`, `M--HOME` and `R--HOME`. Use their PNGs and JSON conditions, qualified by E2-013. Fresh entry means a new anonymous session, root navigation, no restored scroll or imported storage, and the input/motion preference selected before navigation. A reload or brand-root navigation starts a new entry; an in-page home return is not evidence for replaying the loader.

| Acceptance case | Conditions and comparison basis |
| --- | --- |
| HOME-D-READY | ENV2-D: recorded Chrome 154.0.8037.58/Windows 10, 1440×900 CSS pixels, DPR1, fine pointer, normal motion, scroll zero. Match the recorded 1425px document content width and capture conditions rather than assuming screenshot width equals layout width. |
| HOME-M-READY | ENV2-M: same browser/platform, 390×844, DPR1, emulated touch/coarse input, normal motion, scroll zero, recorded desktop user agent. |
| HOME-R-READY | ENV2-R: mobile conditions above with reduced motion enabled before navigation. |
| Responsive variants | E-040's nine recorded widths: 759/760/761, 1099/1100/1101, 1799/1800/1801; E-030's 1024×768 and 768×1024; E-041's 844×390 landscape and 1440×400 short desktop. Compare only hero/header properties supported by each record, with its original input and environment. |

All canonical cases use en-US, LTR, light appearance and Africa/Cairo. Browser zoom is unknown; visual scale 1 does not establish zoom. Different browser versions or conditions must be recorded as comparison deviations, not silently described as matching reference conditions.

**Ready-state predicate (D, derived from AC2-01 and IP-HBC-01):** loading coverage and the loader are absent; visible home media is decoded; fonts have settled; the header, both title lines, attribution, introductory copy and explore affordance have reached their intended revealed appearance. Check their opacity, blur and entry displacement as well as visibility and geometry. At scroll zero, take three consecutive geometry samples whose changes are within half a CSS pixel, while separately confirming those appearance predicates. Moving fog, rotating marks and other permitted ambient effects do not prevent readiness. A stable rectangle, a timer expiry or one screenshot alone cannot establish readiness.

### User Story 1 - Enter the desktop home experience (Priority: P1)

A visitor opening the local site sees the reference loading composition resolve into the recognizable Haunted Boulder City hero, with its lettering, nighttime photograph and header hierarchy intact.

**Why this priority**: This is the first impression and the main fidelity experiment. Both the entry sequence and its final composition must work without depending on any later section.

**Independent Test**: Start a fresh normal desktop visit, record the entry phases, then compare HOME-D-READY with the canonical desktop reference. No menu, ticket action or later-section journey is necessary.

**Acceptance Scenarios**:

1. **Given** fresh normal desktop entry, **When** the page begins loading, **Then** the loader's title, mist, light, status and decorative progress appear in their reference relationships; the hero entrance is held, then fog parts and the veil/title dissolve while the hero reveals in the ordering and timing character defined by FR-002–FR-004. Retain loading, parting/overlap and ready evidence, rather than only the endpoint.
2. **Given** entry has completed, **When** HOME-D-READY is evaluated, **Then** all ready predicates pass and the header, two-line title, attribution, introductory sentences, explore circle, photograph, scrims, coordinates and ambient layering match their scoped baseline and metrics (FR-005–FR-008).
3. **Given** page/font readiness is delayed beyond normal entry, **When** the source-declared ceiling is reached, **Then** the loader dismisses once and releases the entrance without waiting indefinitely or requiring every offscreen image; missing visible fonts/media still prevent a fidelity-ready verdict (FR-003, FR-017).
4. **Given** the ready home, **When** the brand home link performs a new root navigation, **Then** entry starts from a fresh state and reaches the same named ready endpoint; stale loader phases do not persist (FR-001, FR-003).
5. **Given** normal fine-pointer home, **When** the pointer moves, leaves or the window loses focus, and when the visitor scrolls within the hero then returns to the top, **Then** light tracking/cancellation and hero motion follow FR-009–FR-010, with no light interception and no persistent displaced title at the returned top state.

---

### User Story 2 - Enter and view the mobile or touch hero (Priority: P1)

A visitor using touch sees a complete mobile composition with the reference title fit, image crop and readable copy, without depending on mouse interaction.

**Why this priority**: Mobile is a separate canonical endpoint and input branch, not a scaled desktop screenshot.

**Independent Test**: Run a fresh ENV2-M entry and bounded hero scroll, then inspect only header/home at the recorded width and height variants. This produces a usable entry experience independently of desktop pointer effects or later sections.

**Acceptance Scenarios**:

1. **Given** fresh normal touch entry at 390×844, **When** loading resolves, **Then** HOME-M-READY satisfies the same readiness predicate with the mobile header spacing, title line metrics, narrower photograph crop, stacked introductory/explore placement, and mobile visibility rules (FR-005–FR-008, FR-011).
2. **Given** coarse input or no hover, including at a wider width, **When** the visitor touches and scrolls within the hero and returns to the top, **Then** there is no flashlight or desktop pointer parallax; the supported touch image movement, or its source-declared still-image fallback, follows FR-009–FR-011. Width alone does not select the pointer branch.
3. **Given** each recorded breakpoint, tablet, short or landscape variant, **When** the home layout settles, **Then** the applicable hero/header relationships match the original record, title and controls do not overlap or clip, and no horizontal content overflow is hidden to conceal a layout defect. Reference minimum hero height may extend below a short viewport (FR-007, FR-011).

---

### User Story 3 - Enter with reduced motion already selected (Priority: P1)

A visitor who prefers reduced motion reaches a readable, complete home without the normal loading spectacle, hero entrance or ambient movement.

**Why this priority**: Fresh reduced entry is an evidenced alternative user experience and must not be inferred from a preference changed after loading.

**Independent Test**: Enable reduced motion before a fresh mobile root navigation, record early entry and HOME-R-READY, then observe the hero for continuing motion. No prior normal visit is required.

**Acceptance Scenarios**:

1. **Given** reduced motion before navigation, **When** entry begins, **Then** the normal minimum loader dwell and parting choreography are skipped; loading coverage is promptly cleared through the fast-dismiss path and readable hero content is not held for a normal animation (FR-012).
2. **Given** fonts and visible media are ready, **When** HOME-R-READY is evaluated, **Then** it matches R--HOME's composition with visible stationary title/copy, static photograph and reduced fog treatment; no flashlight, star rotation, arrow drift or loader loop continues (FR-012).
3. **Given** a normal hero with active light/motion, **When** input capability or motion preference changes, **Then** tracked light state is cleared and disallowed hero movement is released. This cancellation check is separate from fresh reduced entry and does not claim identical session history (FR-009, FR-012).

---

### User Story 4 - Identify and reach home controls with a keyboard (Priority: P1)

A keyboard visitor can identify the page, traverse the controls belonging to home, and see where focus is without decorative effects obscuring interaction.

**Why this priority**: Header/home fidelity includes meaningful semantics and focus relationships. A visually accurate hero with inaccessible controls is incomplete.

**Independent Test**: After a fresh entry, traverse focus forward and backward and inspect the accessible roles/names and loader status. Exercise the brand's root action only; opening menus or reaching later sections is unnecessary.

**Acceptance Scenarios**:

1. **Given** HOME-D-READY or HOME-M-READY, **When** Tab and Shift+Tab traverse home controls, **Then** the skip link becomes visible on focus, subsequent controls follow the reference reading order, focus indication is visible, and hidden navigation/decorative elements do not add stops (FR-013–FR-015).
2. **Given** the home controls, **When** their roles and names are inspected, **Then** the brand is a named home link, the ticket affordance is a link, Menu is a button with a closed expanded state and navigation relationship, attribution and explore are named links, the hero has its heading relationship, and the photograph has meaningful alternative text (FR-013–FR-014). Destination and menu lifecycle acceptance remain deferred as defined by the slice boundary.
3. **Given** loader entry and completion, **When** status semantics and subsequent focus are examined, **Then** loading has a polite status, decorative title/effects/progress do not duplicate the readable announcement, and dismissal does not introduce focus on removed loader content or conceal ready-state focus (FR-013, FR-015).

### Edge Cases

- Delayed fonts/load can trigger the ceiling before the hero is visually ready. Loader completion and fidelity readiness are separate results; do not accept fallback metrics or undecoded visible imagery as the named endpoint.
- Competing readiness/ceiling signals must not dismiss twice, replay entry or leave a residual overlay. Fast/repeated root visits must also reset the lifecycle.
- Historical timing samples bracket states; they are not exact universal dismissal timestamps or network-performance guarantees.
- Narrow fine-pointer and wide coarse-input configurations separate responsive layout from input effects. Touch image-motion capability may be unavailable; the documented still photograph is the supported fallback.
- Short/landscape screens can require vertical scrolling because of the reference hero minimum height. Do not squeeze the title or remove content to force a single-screen fit.
- Font settlement and viewport changes require title fit to be evaluated again. Fit must preserve irregular ascenders and the intended two-line composition.
- Pointer leave, blur, hidden document and touch interaction cancel tracked light; document visibility also pauses ambient drift as source-declared. Test cancellation independently from matching a random fog frame.
- Without scripting, the source declares that the loader is skipped. If the initial loading marker is set but the main entry script fails to arrive, the source declares a 7-second loading-coverage failsafe. These are S fallback obligations, not observed outage journeys; no invented error screen is required (FR-016).
- Focus/keyboard/contrast defects discovered in the reference are evidence, not obligations to reproduce. Any correction must record its visual/interaction consequence before acceptance (FR-015).

## Requirements *(mandatory)*

### Authority, scope and evidence

Project authority is [AGENTS.md](../../AGENTS.md), the [constitution](../../.specify/memory/constitution.md), [PRODUCT.md / FC-TARGET-DESIGN-01 revision 4](../../PRODUCT.md) and the [IP-HBC-01 entry point](../../implementation-scope/pre-build-packet/README.md). This slice applies TF-01/02/03/05 and the home/entry portions of motion fidelity, within TU-01. Local reference-equivalent fixtures are permitted under the contract's local validation allowance. Real adaptation and public/distributed release are later phases.

**Included:** root entry, loader/hero transition, closed/default header, home visual hierarchy/type/image/crop/layers/geometry, home ambient effects, bounded hero scroll/input effects, relevant responsive behavior, fresh reduced-motion entry, home semantics/keyboard/focus, and repeatable state/temporal validation. A lower-edge seam visible in a HOME capture is comparison context only.

**Excluded:** menu opening/closing; about/facts and marquee behavior; stories/UFO narrative; topics/highlights; venue; FAQ; ticket/modal/provider behavior; creator/footer sections; whole-site navigation/history journeys; real target content; public asset authorization; Eventbrite commerce/backend; architecture/framework/model/routing/Claw decisions. The header ticket link and hero attribution remain visible fixture roles; their destinations do not import those sections into this slice. Preserve the skip/explore `#about`, attribution `#creator`, and header `#tickets` destination identities, but activation beyond the home boundary is not accepted here. Menu's closed state is necessary for ready home; its open lifecycle is not.

The bounded local slice is not a complete production website or acceptance of deferred controls' journeys. No fake destination, unrelated menu shortcut, fabricated provider or replacement copy may be introduced to claim completion of those journeys.

| Stable evidence locator | Use and classification |
| --- | --- |
| [Authority/baseline crosswalk](../../implementation-scope/pre-build-packet/authority-crosswalk.md), hero/header and fresh reduced rows | Canonical named HOME appearance; SR-01/10/37 and AC2-01/04. Other sections' rasters are not home baselines. |
| [Evidence index](../../implementation-scope/pre-build-packet/evidence-index.md): E2-013; `raw-run-01/D--HOME`, `M--HOME`, `R--HOME` PNG/JSON pairs | O endpoint appearance and its conditions/assessment. These do not establish every entry phase. |
| Evidence index: E2-014 `#home`; E-030 D/M hero/header descendants; E-055 | O current section geometry and historical descendant/rendered-font metrics, each within its recorded environment. |
| [Typography/assets crosswalk](../../implementation-scope/pre-build-packet/typography-assets.md), HAUNTED/BOULDER CITY/labels/body, hero town, logo, fog/grain/icon rows; E2-010 | O historical font provenance and current font inspection bytes; S type/crop/layout relationships; asset availability/replacement limits. |
| [Motion fingerprint](../../implementation-scope/pre-build-packet/motion.md), M-01/02/03/04/12; index E-060/E-062/E-080 | O temporal samples and runtime effects, S timing/input/ambient relationships, explicit variable/unknown limits. M-03 is used only for the home/loader mark, not marquee or later marks. |
| Evidence index: E-040, E-041 and E-030 tablet records; SR-35/36/45; AC2-14 | O inherited breakpoint/height/input observations. No physical-device, other-engine or expanded parity claim. |
| Evidence index: HTML lines 491–532; JS-LOADER, JS-MEASURE, JS-RENDER, JS-GLOW, JS-FOG; CSS-LOADER/GLOW/TOUCH-HERO/REDUCE and final hero/header/type rules | S anatomy, semantics, fit, lifecycle and resulting motion. Read the final applicable declarations, not the first matching rule; independently authored behavior may be equivalent. |
| Evidence index: ENVIRONMENT-MATRIX; HANDOFF AC2-01/04/14 and PLAN-capture-real-01 HOME checkpoints | Recorded comparison conditions and bounded 10-second ready checkpoint seed. These are historical recipes, not new reference observations. |
| [Prospective corrections](../../implementation-scope/pre-build-packet/corrections.md) | Scope/anchor safeguards. FAQ/topic corrections confer no additional scope on this slice. |

E2-006's equal host source bytes allow inherited behavior rules to inform this slice; they do not prove media/font byte identity or universal raster equality. Packet quick geometry summaries are navigation aids: the final source and HOME sidecars show the later desktop title clearance and content-driven hero sizing. Earlier margin/minimum/maximum declarations must not override those final rules. This reconciliation does not modify sealed evidence.

### Functional Requirements

- **FR-001 — Fresh entry:** The experience MUST begin at the root/top with the menu closed and without residual loader state, and MUST support repeatable fresh entry after new root navigation. It MUST distinguish this from an in-page home return. **Basis:** O SR-01/10/37; S HTML/JS-LOADER; D slice reset boundary. **Acceptance:** US1.1/4, SC-001/002.
- **FR-002 — Loader composition:** Normal entry MUST retain the loader's layered veil, warm light, back/front mist, two-line title/mark, readable loading status, dots, coordinates where applicable and decorative progress. Their hierarchy, crop, responsive visibility and motion character MUST follow the entry evidence. Progress MUST NOT be represented as measured network percentage. **Basis:** O E-060; S M-01/CSS-LOADER/HTML. **Acceptance:** US1.1, US2.1, SC-002/003.
- **FR-003 — Bounded lifecycle:** Normal entry MUST dismiss on page/font readiness plus the declared 1.6-second minimum from navigation, or on the declared ceiling 3.6 seconds after loader setup, whichever path completes first. Dismissal MUST occur once; hero release is declared 260ms after dismissal and loader removal 1500ms after dismissal. These timing origins MUST remain distinct. The ceiling MUST NOT be turned into a wait for all site media. **Basis:** S M-01/JS-LOADER; O E-060 brackets. **Acceptance:** US1.1/3/4, SC-002.
- **FR-004 — Temporal reveal:** Normal entry MUST preserve title condensation, fog parting, title/light/veil exit and the overlapping hero reveal. The declared loader title entrance is 1.7 seconds with a 180ms city delay; exit title is 700ms, veil 1.1 seconds with 300ms delay, fog parting 1.15 seconds. Hero title entrance is 1.5 seconds; attribution/bottom entrance is 1.4 seconds with 200ms delay, held until release. Preserve the referenced acceleration/blur/opacity/displacement relationships rather than replacing this sequence with an unrelated fade. **Basis:** S M-01; O E-060 phase sequence. **Acceptance:** US1.1, US2.1, SC-002.
- **FR-005 — Ready visual hierarchy:** Ready home MUST retain the branded header at the top, ticket affordance and closed Menu control, the dominant two-line hero title, attribution below it, introductory sentences and explore circle below, with coordinates where evidenced. Reference-equivalent wording/order and icon roles MUST remain intact. No later-section content is required. **Basis:** O HOME D/M/R; S HTML. **Acceptance:** US1.2, US2.1, US3.2, SC-001/003.
- **FR-006 — Typography fidelity:** The HAUNTED lettering, condensed city line, mono labels and body/control type MUST preserve their reference width/height, weight, tracking, line-height, baseline and wrap relationships. Preserve the paper HAUNTED line and accent city line from the final reference. Fit the hero title to its available width after font settlement and resizing without arbitrary compression, clipping ascenders, changing copy or flattening distinct roles into one scale. Any metric-compatible font replacement MUST have measured consequences/deviations. **Basis:** TF-02; O E-055/E-030/HOME; S JS-MEASURE/final type rules. **Acceptance:** US1.2, US2.1/3, SC-003/004.
- **FR-007 — Geometry:** Header height/gutters, title clearance, hero height, internal spacing and bottom placements MUST match the final applicable rules and recorded home geometry. The desktop hero retains a minimum of the greater of 850px and the small viewport height; narrow home uses the greater of 760px and the small viewport height, with content allowed to increase height under the final rules. Earlier fixed maximums MUST NOT be reinstated. Content MUST remain complete without overlap, clipped required text or overflow masking as a substitute for correct layout. **Basis:** TF-01/03; O E2-014/HOME/E-040/E-041; S final hero rules. **Acceptance:** US1.2, US2.3, SC-003/004.
- **FR-008 — Photograph and layers:** The home MUST preserve the nighttime town image role, focal arch/monument, desktop/mobile cover crop, final photograph treatment, dark scrim/contrast, fog depth, grain and header/text/mark stacking. The final declared crop is centered horizontally/60% vertically on desktop and 50%/50% narrow, with the referenced overscan. Decorative layers MUST NOT intercept input. Missing original media MUST NOT be silently substituted with a generic gradient or claimed as an exact match. **Basis:** TF-01, TR-01 local boundary; O HOME; S final media rules/M-02/04. **Acceptance:** US1.2, US2.1, SC-003/007.
- **FR-009 — Pointer light:** Normal fine-pointer home MUST preserve the soft viewport light's default placement, primary non-touch tracking, bounds and layer relationship. Leave, blur and hidden-document events MUST hide tracked light; touch interaction or input/preference change MUST clear tracking/coordinates. Coarse/no-hover and reduced-motion home MUST suppress it. **Basis:** O E-062 tracking; S M-04/JS-GLOW. **Acceptance:** US1.5, US2.2, US3.2/3, SC-005.
- **FR-010 — Home motion:** Normal desktop home MUST retain independently phased ambient fog and rotating title mark. Within the hero, fine-pointer scroll MUST preserve the declared photograph displacement/scale and title displacement/opacity relationships, returning to the top composition when scroll returns to zero. Relevant visible fog drift MUST pause when the document is hidden. Preserve M-02/03/04 ranges and clocks; do not fix one fog/rotation frame as the only accepted appearance. **Basis:** O E-060/E-062/E-080; S M-02/03/04. **Acceptance:** US1.5, SC-005.
- **FR-011 — Responsive and touch:** Home/header MUST honor the recorded inclusive width boundaries and short/tablet/landscape relationships. Narrow home hides the title star and coordinates, changes title metrics/header/logo spacing, balances narrower introductory sentences and retains the mobile explore placement. Normal narrow fog retains its separate reduced-density/independent-drift treatment and arrow drift. Coarse/no-hover hero image motion MUST use the source-declared scroll relationship toward a 22-small-viewport-height-percent displacement across hero exit when supported, otherwise the still photograph; it MUST NOT inherit desktop pointer parallax. **Basis:** O E-040/E-041/HOME-M; S final rules/M-02/03/04; U physical-device parity. **Acceptance:** US2.1–3, SC-004/005.
- **FR-012 — Reduced motion:** Fresh reduced entry MUST bypass normal dwell/choreography, clear loading coverage immediately on fast dismissal and remove the loader after the declared 50ms, without withholding readable content for normal entrance animations. Title/copy/image/fog MUST be static with the documented reduced fog opacity/layer visibility; flashlight, rotations, arrow drift and entry loops MUST be absent. Input/preference cancellation MUST release disallowed hero movement. Fresh and switched sessions MUST be evaluated separately. **Basis:** O R--HOME/E-041/E-060; S M-12/M-04. **Acceptance:** US3.1–3, SC-001/005.
- **FR-013 — Semantics:** Home MUST expose a named principal heading and section relationship, meaningful hero-image alternative text, reference control roles/names and closed-menu expanded/navigation relationship. Loading MUST provide a polite status; decorative loader lettering, effects, coordinates, marks, dots and progress MUST remain outside the accessible reading/focus sequence. **Basis:** TF-05; S HTML; O closed home state. **Acceptance:** US4.2/3, SC-006.
- **FR-014 — Keyboard relationships:** Home MUST retain reference focus order through skip, brand, ticket link, Menu, attribution and explore, with visible focus indication and the skip link visible when focused. Hidden navigation MUST be absent from keyboard traversal. Brand-root keyboard activation is in scope; other controls retain their destination/role contracts while their subsequent journeys remain deferred. **Basis:** TF-05; S HTML/CSS-BASE; D slice boundary. **Acceptance:** US4.1/2, US1.4, SC-006.
- **FR-015 — Accessibility deviations:** The slice MUST preserve operable reference intent rather than reproduce a discovered focus/keyboard/contrast defect. A necessary correction MUST be recorded as an explicit target deviation, with its reason, affected evidence, visible/interaction consequence and acceptance assertion, before fidelity acceptance. No uninspected assistive-technology equivalence may be claimed. **Basis:** TF-05/TU-01. **Acceptance:** US4.1/3, SC-006/008.
- **FR-016 — Entry fallback:** Without scripting, readable home MUST not be covered by the loader. If the initial loading marker is applied but normal entry initialization never arrives, loading coverage MUST clear through the source-declared 7-second failsafe. This does not establish font/media readiness or require an invented outage interface. **Basis:** S HTML entry switch/CSS-LOADER; U no retained natural failure observation. **Acceptance:** targeted fallback checks, SC-002/008.
- **FR-017 — State and temporal evidence:** Acceptance MUST record each named ready state's appearance/readiness and the normal/reduced entry sequence with navigation-relative timestamps and loader-setup/dismissal-relative timing where relevant. It MUST distinguish loader completion from decoded-media/font readiness and fail a ready checkpoint that does not converge within its bounded 10-second reference recipe deadline. Temporal phases, appearance assertions and independent geometry convergence are all required. **Basis:** AC2-01/04, IP-HBC-01, PLAN-capture-real-01; D repeated acceptance protocol. **Acceptance:** US1–3, SC-001/002/008.
- **FR-018 — Comparison integrity:** Acceptance MUST use the canonical references in their named conditions, preserve O/S/I/U distinctions and record environment, fixture and asset/font deviations. Calibrate numerical geometry/raster/timing tolerances against reference evidence before judging the target; only documented uncontrollable ambient regions may be masked, without masking required title/crop/header defects. No implementation-generated reference, full-page geometry raster or static endpoint alone may substitute for scoped reference/temporal proof. **Basis:** TF-01/02/TU-01, IP-HBC-01 precedence/acceptance. **Acceptance:** all scenarios, SC-003/007/008.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001 — Repeatable ready home:** Three independent fresh visits per canonical case (nine total, D repeatability decision) reach HOME-D/M/R-READY with 100% of readiness predicates satisfied within the reference recipe's 10-second checkpoint deadline. Every run retains its state/appearance record; no failed run is discarded. This deadline is a local acceptance bound, not an internet performance promise. **Covers:** FR-001/005/012/017.
- **SC-002 — Complete entry lifecycle:** Every normal trial records at least loading, parting/hero-overlap and ready phases in order; every reduced trial records fast entry and ready. All applicable source-declared floors, ceilings, release/removal offsets and reveal relationships pass the predeclared timing tolerances. Delayed-readiness, duplicate-signal, no-script and missing-initialization checks each leave no persistent loading coverage. Historical E-060 sample times remain brackets, not exact target timestamps. **Covers:** FR-001–004/016/017.
- **SC-003 — Recognizable composition:** All three ready endpoints pass comparison of five named regions: header, title, attribution, bottom copy/explore, and photograph/scrim/fog composition. Required text, line count, color hierarchy and crop/focal visibility are correct in every case; geometry/type and raster comparisons meet the reference-calibrated tolerances. Zero required glyphs or controls are clipped/overlapped. Ambient phase difference alone is not a failure. **Covers:** FR-002/005–008/018.
- **SC-004 — Responsive fit:** All nine recorded boundary widths and four tablet/short/landscape sizes pass the scoped header/hero relationship assertions under their recorded conditions, with zero unintended horizontal overflow or concealed required content. Width and height expectations are evaluated against the relevant measured record/final rule, not a resized desktop baseline. **Covers:** FR-006/007/011.
- **SC-005 — Motion and input branches:** All prescribed normal pointer, normal touch, fresh reduced and switched cancellation checks pass. Normal motion demonstrates independent fog/mark phases and the correct hero scroll branch; coarse/reduced checks produce zero tracked flashlight, and fresh reduced produces zero running entry/hero ambient animations. Touch capability fallback produces the still photograph without desktop movement. **Covers:** FR-009–012.
- **SC-006 — Keyboard and accessible home:** Every scoped control exposes its required role/name/state; forward/backward home traversal has zero decorative/hidden-navigation stops and zero invisible focused controls at readiness. Skip focus visibility and brand-root activation pass. Loading has the required polite status without duplicate decorative title/progress announcements. Any corrective deviation has its explicit acceptance assertion. This is bounded semantics/keyboard acceptance, not an assistive-technology parity claim. **Covers:** FR-013–015.
- **SC-007 — Fixture fidelity:** Every home visual dependency has an identified evidence fixture or documented concrete replacement and measured consequence before acceptance. There are zero unexplained font, imagery, icon, crop or layering substitutions and zero copied reference application-code dependencies. Local available fixtures follow FC-TARGET-DESIGN-01; this criterion does not reopen public-release asset clearance. **Covers:** FR-006/008/018.
- **SC-008 — Reviewable acceptance:** Every requirement has the acceptance mapping shown above, and every acceptance result records its reference IDs, environment, classification, timestamps where relevant and deviations. There are zero claims that a ready screenshot establishes entry motion, that a historical observation is newly collected, or that this slice accepts excluded sections/services/parity. **Covers:** FR-015–018 and the full slice boundary.

## Assumptions

- **D — Scope:** The requested product is a local reference-equivalent validation slice. Reference copy is fixture content; actual target wording/data/destinations and public distribution are not selected here. No technical architecture or runtime/model choice is implied.
- **Dependency — Evidence:** Sealed/current and inherited records remain immutable. Stable IDs resolve through IP-HBC-01's evidence index; each comparison retains the original evidence environment and applicable precedence.
- **Dependency — Assets:** Available font inspection files may be local fixtures under the current contract. The packet records that hero photography, fog and branded artwork are not a complete acquired media library. Permission to use already-present fixtures does not make missing media available. Concrete local assets or documented replacements and visual consequences must be identified before claiming exact visual acceptance; missing bytes are a dependency, not invented product behavior or grounds for silently relaxing fidelity.
- **Dependency — Calibration:** FC-TARGET-DESIGN-01 assigns numerical raster/geometry tolerance calibration to implementation time. This spec defines the states, regions, metrics and outcomes; the later verification preparation must record calibrated tolerances before target acceptance, without changing baselines to hide a failure. This is not an unresolved product choice.
- **U — Temporal limits:** Observed normal loader samples show loading around 376/995ms, parting around 1904/2912ms and absence by approximately 4123ms; reduced absence/loading release is sampled by approximately 814ms. These samples do not prove an exact dismissal instant, mobile network latency or all-image completion. Source timing relationships remain S.
- **U — Parity limits:** Physical touch devices, Safari/other engines, assistive technologies, browser zoom, RTL/dark appearance, DPR2+ and historical/current media-byte equality remain uninspected. No parity guarantee is inferred. Random ambient phase is variable within its documented character/range.
- **I — Inferences:** No inferred behavior is needed to close this slice. The source's touch-browser comments express intent, not measured physical-device performance.
- **Product clarification disposition:** No material unresolved product ambiguity remains within the requested boundary and current contract. Future asset identification/calibration is a validation dependency, while menu/destination journeys, real adaptation and distribution are explicitly deferred. A newly discovered material behavior ambiguity must be marked for clarification before implementation, rather than resolved through an architectural assumption.

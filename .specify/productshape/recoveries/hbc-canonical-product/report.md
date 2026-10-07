# Recovery report: hbc-canonical-product

Generated 2026-10-07T05:08:20.633Z by ProductShape speckit-adapter. This report and every file in this session directory are generated, non-canonical material.

## Non-acceptance statement

Nothing in this session is accepted product knowledge. Every candidate lives under `.specify/productshape/recoveries/hbc-canonical-product/product/proposed/` as part of `CHG-INITIAL`, carries status `draft`, and enters the model only after overlay validation, human product approval and explicit apply on a working branch; a human merge of the reviewed result then accepts the baseline. The accepted model was not modified: verified.

## Scope

Independently recover and challenge the Haunted Boulder City bounded local reference-fidelity product meaning; propose draft knowledge and expose omissions, contradictions, unsupported decisions, state ownership gaps and ambiguities without inventing behaviour.
- Roots: .
- Include: AGENTS.md, .specify/memory/constitution.md, PRODUCT.md, ROADMAP.md, implementation-scope/pre-build-packet/**, reference/haunted-boulder-city-v2/rev-2.0.0-real-01/**, skills/reference-reconstruction/**
- Forbidden (never read): **/*.key, **/*.pem, **/.env, **/.env.*, **/id_rsa*, **/secrets/**, model-selection/**, reference/haunted-boulder-city/**, skill-hardening/**, specs/**
- Documentation languages: en
- Secondary evidence policy: code yes, tests no, issues no, commit history no, external no

## Sources

| Status | Count |
| --- | --- |
| pending | 0 |
| processed | 346 |
| stale | 0 |
| missing | 0 |
| excluded | 0 |
| total | 346 |

## External and user-provided evidence

None. Every source was a repository file.

## Candidate artifacts

37 candidate(s) under `.specify/productshape/recoveries/hbc-canonical-product/product/proposed/`:

| Kind | Count |
| --- | --- |
| actor | 1 |
| bounded-context | 1 |
| business-rule | 1 |
| constraint | 3 |
| domain-term | 3 |
| functional-requirement | 9 |
| journey | 6 |
| quality-requirement | 3 |
| structured-behaviour | 2 |
| use-case | 8 |

Family probe results:

- actor: candidates
- journey: candidates
- use-case: candidates
- business-rule: candidates
- domain-term: candidates
- bounded-context: candidates
- functional-requirement: candidates
- quality-requirement: candidates
- constraint: candidates
- structured-behaviour: candidates

## Provenance mapping

- ACT-VISITOR (actor, confidence high): E-0003, E-0020
- SB-FAQ-REPLACE (structured-behaviour, confidence high): E-0003, E-0007, E-0010, E-0021, E-0023
- SB-ROOT-RETURN (structured-behaviour, confidence high): E-0003, E-0010, E-0021, E-0023
- BR-FAQ-SETTLED (business-rule, confidence high): E-0003, E-0007, E-0010, E-0023, E-0050, E-0105, E-0106, E-0108, E-0204, E-0225, E-0241, E-0298, E-0299, E-0310, E-0311
- BC-LOCAL-FIDELITY (bounded-context, confidence medium): E-0003
- TERM-HOST-DIALOG (domain-term, confidence high): E-0003, E-0113, E-0114, E-0115, E-0116
- TERM-REFERENCE-FIXTURE (domain-term, confidence high): E-0003, E-0024
- TERM-SOURCE-DECLARATION (domain-term, confidence high): E-0003, E-0010, E-0017, E-0018, E-0186, E-0187
- JRN-FAQ-INTERACTION (journey, confidence high): E-0003, E-0010, E-0021
- JRN-FRAGMENT-NAVIGATION (journey, confidence high): E-0003, E-0010, E-0021
- JRN-FRESH-ENTRY (journey, confidence high): E-0003, E-0010, E-0021
- JRN-OUTBOUND-INFORMATION (journey, confidence high): E-0003, E-0010, E-0021
- JRN-STORY-PROGRESSION (journey, confidence high): E-0003, E-0010, E-0021, E-0109, E-0110, E-0111, E-0112, E-0204
- JRN-TICKET-HOST (journey, confidence high): E-0003, E-0010, E-0021, E-0165, E-0171, E-0217, E-0219
- CON-ADAPTATION-INPUTS (constraint, confidence high): E-0003, E-0008, E-0011, E-0013, E-0018, E-0242
- CON-EVIDENCE-BOUNDS (constraint, confidence high): E-0001, E-0002, E-0003, E-0005, E-0009, E-0012, E-0014, E-0015, E-0017, E-0019, E-0022, E-0050, E-0051, E-0185, E-0189, E-0190, E-0194, E-0195, E-0196, E-0205, E-0212, E-0213, E-0222, E-0225, E-0227, E-0228, E-0229, E-0234, E-0236, E-0239, E-0241, E-0242, E-0257, E-0258, E-0259, E-0260, E-0263, E-0264, E-0270, E-0271, E-0272, E-0273, E-0274, E-0275, E-0276, E-0277, E-0285, E-0286, E-0291, E-0292, E-0302, E-0303, E-0304, E-0305, E-0306, E-0307, E-0308, E-0314, E-0315, E-0316, E-0317, E-0318, E-0319
- CON-LOCAL-BOUNDARY (constraint, confidence high): E-0001, E-0002, E-0003, E-0007, E-0015, E-0019, E-0020, E-0113, E-0114, E-0115, E-0116, E-0171, E-0225, E-0233, E-0241, E-0242, E-0306, E-0307, E-0318, E-0319
- FR-ENTRY (functional-requirement, confidence high): E-0003, E-0006, E-0010, E-0021, E-0023, E-0024, E-0055, E-0058, E-0067, E-0078, E-0083, E-0084, E-0085, E-0086, E-0087, E-0088, E-0089, E-0090, E-0091, E-0092, E-0093, E-0094, E-0095, E-0096, E-0097, E-0098, E-0099, E-0100, E-0117, E-0118, E-0119, E-0120, E-0121, E-0122, E-0123, E-0124, E-0125, E-0126, E-0127, E-0128, E-0129, E-0142, E-0153, E-0187, E-0194, E-0195, E-0196, E-0197, E-0198, E-0199, E-0200, E-0201, E-0209, E-0210, E-0225, E-0240, E-0261, E-0262, E-0265, E-0266, E-0281, E-0282, E-0283, E-0284, E-0287, E-0288, E-0289, E-0290, E-0300, E-0301, E-0312, E-0313, E-0320, E-0321
- FR-FAQ (functional-requirement, confidence high): E-0003, E-0007, E-0010, E-0021, E-0023, E-0064, E-0075, E-0105, E-0106, E-0108, E-0144, E-0155, E-0172, E-0187, E-0204, E-0205, E-0216, E-0220, E-0225, E-0230, E-0298, E-0299, E-0310, E-0311
- FR-INFORMATION (functional-requirement, confidence high): E-0003, E-0006, E-0010, E-0011, E-0021, E-0023, E-0024, E-0056, E-0059, E-0060, E-0061, E-0063, E-0069, E-0070, E-0071, E-0072, E-0074, E-0080, E-0081, E-0134, E-0135, E-0139, E-0140, E-0141, E-0143, E-0149, E-0150, E-0151, E-0152, E-0154, E-0160, E-0166, E-0167, E-0168, E-0169, E-0170, E-0185, E-0211, E-0218, E-0230, E-0240
- FR-MENU (functional-requirement, confidence high): E-0003, E-0006, E-0010, E-0021, E-0023, E-0101, E-0102, E-0103, E-0104, E-0187, E-0204, E-0205, E-0216, E-0239, E-0281, E-0282, E-0283, E-0284, E-0285, E-0286, E-0287, E-0288, E-0289, E-0290, E-0291, E-0292, E-0302, E-0303, E-0304, E-0305, E-0314, E-0315, E-0316, E-0317
- FR-NAVIGATION (functional-requirement, confidence high): E-0003, E-0010, E-0016, E-0021, E-0023, E-0061, E-0072, E-0081, E-0185, E-0188, E-0204, E-0205, E-0230
- FR-PAGE-PROGRESS (functional-requirement, confidence medium): E-0023, E-0024, E-0025
- FR-STORIES (functional-requirement, confidence high): E-0003, E-0010, E-0021, E-0023, E-0065, E-0068, E-0076, E-0093, E-0094, E-0095, E-0096, E-0097, E-0098, E-0099, E-0100, E-0109, E-0110, E-0111, E-0112, E-0136, E-0137, E-0138, E-0145, E-0146, E-0156, E-0157, E-0161, E-0162, E-0163, E-0164, E-0187, E-0189, E-0190, E-0194, E-0195, E-0196, E-0197, E-0198, E-0199, E-0200, E-0201, E-0202, E-0203, E-0216, E-0230, E-0240, E-0322, E-0323
- FR-TICKET (functional-requirement, confidence high): E-0003, E-0006, E-0010, E-0016, E-0021, E-0023, E-0024, E-0056, E-0060, E-0061, E-0066, E-0071, E-0077, E-0081, E-0113, E-0114, E-0115, E-0116, E-0130, E-0131, E-0147, E-0158, E-0165, E-0171, E-0187, E-0204, E-0205, E-0211, E-0216, E-0217, E-0219, E-0230, E-0233, E-0239, E-0270, E-0271, E-0272, E-0273, E-0274, E-0275, E-0276, E-0277, E-0296, E-0297, E-0306, E-0307, E-0308, E-0309, E-0318, E-0319
- FR-TOPICS (functional-requirement, confidence high): E-0003, E-0007, E-0010, E-0011, E-0021, E-0023, E-0024, E-0054, E-0068, E-0079, E-0132, E-0133, E-0148, E-0159, E-0185, E-0187, E-0197, E-0198, E-0199, E-0200, E-0201, E-0211
- QR-ACCESSIBILITY (quality-requirement, confidence high): E-0003, E-0010, E-0016, E-0021, E-0025, E-0101, E-0102, E-0103, E-0104, E-0172, E-0188, E-0208, E-0216, E-0220, E-0225, E-0233, E-0281, E-0282, E-0283, E-0284, E-0287, E-0288, E-0289, E-0290, E-0296, E-0297, E-0309
- QR-MOTION (quality-requirement, confidence high): E-0003, E-0005, E-0006, E-0008, E-0010, E-0014, E-0016, E-0020, E-0021, E-0025, E-0093, E-0094, E-0095, E-0096, E-0097, E-0098, E-0099, E-0100, E-0117, E-0118, E-0119, E-0120, E-0121, E-0122, E-0123, E-0124, E-0125, E-0126, E-0127, E-0128, E-0129, E-0130, E-0131, E-0132, E-0133, E-0134, E-0135, E-0136, E-0137, E-0138, E-0161, E-0162, E-0163, E-0164, E-0166, E-0167, E-0168, E-0169, E-0170, E-0186, E-0203, E-0209, E-0211, E-0218, E-0302, E-0303, E-0304, E-0305, E-0314, E-0315, E-0316, E-0317, E-0320, E-0321, E-0322, E-0323
- QR-VISUAL (quality-requirement, confidence high): E-0003, E-0005, E-0006, E-0008, E-0010, E-0011, E-0012, E-0016, E-0020, E-0021, E-0022, E-0025, E-0054, E-0055, E-0056, E-0057, E-0058, E-0059, E-0062, E-0064, E-0073, E-0082, E-0084, E-0085, E-0086, E-0087, E-0088, E-0089, E-0090, E-0091, E-0092, E-0093, E-0094, E-0095, E-0096, E-0097, E-0098, E-0099, E-0100, E-0123, E-0124, E-0125, E-0126, E-0127, E-0128, E-0129, E-0139, E-0140, E-0141, E-0142, E-0143, E-0144, E-0145, E-0146, E-0147, E-0148, E-0149, E-0150, E-0151, E-0152, E-0153, E-0154, E-0155, E-0156, E-0157, E-0158, E-0159, E-0160, E-0186, E-0189, E-0190, E-0194, E-0195, E-0196, E-0197, E-0198, E-0199, E-0200, E-0201, E-0202, E-0203, E-0207, E-0210, E-0212, E-0213, E-0227, E-0228, E-0229, E-0236, E-0239, E-0240, E-0255, E-0257, E-0258, E-0259, E-0260, E-0261, E-0262, E-0263, E-0264, E-0265, E-0266, E-0270, E-0271, E-0272, E-0273, E-0274, E-0275, E-0276, E-0277, E-0281, E-0282, E-0283, E-0284, E-0285, E-0286, E-0287, E-0288, E-0289, E-0290, E-0291, E-0292, E-0296, E-0297, E-0298, E-0299, E-0300, E-0301, E-0309, E-0310, E-0311, E-0312, E-0313, E-0320, E-0321, E-0322, E-0323
- UC-ENTRY (use-case, confidence high): E-0003, E-0010, E-0021, E-0023
- UC-FAQ (use-case, confidence high): E-0003, E-0010, E-0021, E-0023
- UC-INFORMATION (use-case, confidence high): E-0003, E-0010, E-0021, E-0023
- UC-MENU (use-case, confidence high): E-0003, E-0010, E-0021, E-0023
- UC-NAVIGATION (use-case, confidence high): E-0003, E-0010, E-0021, E-0023
- UC-STORIES (use-case, confidence high): E-0003, E-0010, E-0021, E-0023
- UC-TICKET (use-case, confidence high): E-0003, E-0010, E-0021, E-0023
- UC-TOPICS (use-case, confidence high): E-0003, E-0010, E-0021, E-0023

## Contradictions

- E-0003: Audit F-01: source-policy uncertainty or acceptance ownership gap; no new behaviour adopted. (tracked as Q-0001)
- E-0007: Historical SR-23/AC2-05 multiple-open prose conflicts with COR-01 and source-declared zero/one desired/settled state. Current authority already supplies prospective disposition; old facts/prose remain immutable.
- E-0011: Packet says final hero height100svh/max1400 (narrow max1050); source CSS286 later declares height:auto/max-height:none and narrow rule retains no cap. Source not new runtime observation. (tracked as Q-0002)
- E-0016: Historical SR-23/AC2-05 multiple-open prose conflicts with COR-01 and source-declared zero/one desired/settled state. Current authority already supplies prospective disposition; old facts/prose remain immutable.
- E-0021: Historical SR-23/AC2-05 multiple-open prose conflicts with COR-01 and source-declared zero/one desired/settled state. Current authority already supplies prospective disposition; old facts/prose remain immutable.
- E-0025: Packet says final hero height100svh/max1400 (narrow max1050); source CSS286 later declares height:auto/max-height:none and narrow rule retains no cap. Source not new runtime observation. (tracked as Q-0002)

## Questions

- Q-0001 (OPEN): Review F-01 in audit.md: Which current roadmap review gate should PRODUCT pointers name?
- Q-0002 (OPEN): Review F-02 in audit.md: Confirm prospective correction of hero geometry summary against final CSS cascade.
- Q-0003 (OPEN): Review F-03 in audit.md: Is page scroll-progress explicitly required, and which owner accepts it?
- Q-0004 (OPEN): Review F-04 in audit.md: Which switched preference behaviours are retained, corrected or deliberately left unknown?
- Q-0005 (OPEN): Review F-05 in audit.md: What exact non-transactional local host interior and loading/ready/fallback fixture is accepted?
- Q-0006 (OPEN): Review F-06 in audit.md: What is the product disposition for loader/menu/dialog overlap and focus/Escape arbitration?
- Q-0007 (OPEN): Review F-07 in audit.md: What focus and pointer eligibility is accepted during overlay closing before native hidden?
- Q-0008 (OPEN): Review F-08 in audit.md: What focus/reset/persistence relationships apply to each navigation transition and input mode?
- Q-0009 (OPEN): Review F-09 in audit.md: Which concrete available inputs or measured deviations satisfy each missing visual/media fixture?
- Q-0010 (OPEN): Review F-10 in audit.md: Is correcting the observed dialog Tab escape required before local acceptance?
- Q-0011 (OPEN): Review F-11 in audit.md: Which owner accepts the ticket review cue and which accepts creator-media proof?
- Q-0012 (OPEN): Review F-12 in audit.md: What visibility/cancellation rule applies separately to each effect and overlay clock?
- Q-0013 (OPEN): What canonical phase/disposition applies to inherited E-051-390-faq-1.jpg whose filename suggests FAQ 1 but visible first answer is closed?

## Leads

- L-0001 (repo, resolved: Inspected inherited E-050/E-080/E-085/E-086/E-090 in continuation batch7 (E-0204/0205/0216/0218/0219/0220). Findings and candidate reconciliations distinguish fresh versus reused state, single settled FAQ, reversal/media, preview and observed dialog focus escape. Q-0004/Q-0008/Q-0010 remain open; repository inspection lead is exhausted, no policy answer implied.): Next authorized batch: inspect inherited-v1 E-050/E-080/E-085/E-086/E-090 and preference traces to independently corroborate FAQ, focus, timing and switched-history claims; do not treat report summaries as newly executed proof.
- L-0002 (repo, resolved: Completed independent E2-013/E2-014 assessment/geometry inspection in batch8 and all named ALL/TOP, raw-run01 and repair01/02 sidecars/pixels across batches9-11 (E-0259..0326). Canonical phase precedence retained: ALL context/geometry only, original menus transient/unsettled, repaired menus settled, original desktop ticket/provider partial versus repair01 REOPEN settled. Paired hashes verified within batches; boundary-separated narrow CLOSED metadata/pixels independently inspected. Repository lead exhausted; Q-0005/Q-0007/Q-0009 and human fixture input remain open, no policy or acceptance decision implied.): Next authorized batch: independently read E2-013 canonical phase assessment and E2-014 exact geometry plus named image sidecars/pixels. Parent manifest validation does not validate appearance.
- L-0003 (user, open): Resolve available-media fixture inputs and concrete visual/video deviations for affected surfaces. No new download or external source is authorized; keep missing inputs separate from local reuse permission.

## Validation

Last run 2026-10-07T05:08:19.871Z: 0 error(s), 0 warning(s).

No low-confidence candidates reported.

## Completion

Complete: no

- sourcesClassified: met
- leadsResolved: not met
- questionsResolved: not met
- familiesProbed: met
- duplicatesReconciled: met
- validationPasses: met
- validationFresh: met
- noStaleEvidence: met
- lowConfidenceReported: met
- modelUntouched: met
- outputOnlyChgInitial: met

## Where the output lives

`.specify/productshape/recoveries/hbc-canonical-product/product/` holds `change.md` and the proposed candidates. Review happens there; this session directory (`.specify/productshape/recoveries/hbc-canonical-product/`) is bookkeeping and safe to regenerate.

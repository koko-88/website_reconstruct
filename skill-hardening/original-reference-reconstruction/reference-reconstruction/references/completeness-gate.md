# Evidence completeness and implementation gate

Evaluate bounded scope against obligations, not screenshot count or a subjective completion percentage.

## Coverage dispositions

- **Complete:** artifacts and replay instructions support the material observation without unresolved conflict.
- **Incomplete:** missing, uncertain, stale, inaccessible or conflicting evidence could affect the result.
- **Not applicable:** inspected scope has no such feature; include the reason/evidence. Tool absence is not N/A.
- **Excluded:** outside the actual user scope; cite that scope decision. Do not hide failed inspection here.

Every row names route/family, component/state, viewport/input/preferences, required observation, evidence IDs, disposition and uncertainty IDs. Reuse evidence for proven identical instances with explicit links. Avoid a redundant full Cartesian product, but inspect every unique state and combination that changes layout, behavior or risk, plus each critical journey at applicable desktop/mobile modes.

## Mandatory scoped dimensions

| Dimension | Required evidence |
| --- | --- |
| Scope/authority | Route/state inventory, reference version, source precedence, access and exclusions |
| Capture integrity | Openable originals, environment/state metadata, repeatable readiness/reset steps |
| Appearance | Full context and key details/states; measured geometry, typography, assets and distinctive effects |
| Responsiveness | Desktop/tablet/mobile, transitions and boundary probes, fluid/container rules, relevant height/overflow cases |
| Behavior | Replayable transitions/journeys, URL/history/persistence and applicable asynchronous states |
| Motion | Normal/reduced-motion, trigger/timing/sequence/interruption sufficient for reproduction |
| Accessibility | Keyboard, focus, semantics, validation and overlay behavior; testing limits/defects identified |
| Runtime/data | Sanitized evidence explaining visible asynchronous state contracts; unrelated backend internals unnecessary |
| Assets/type | Sources/variants/rendered font identified; viable authorized acquisition or explicit replacement decision |
| Uncertainty | No critical/high issues; lower-impact issues bounded with disposition, validation case and responsible role |
| Handoff | Versioned package, evidence-linked requirements, invariants and replayable acceptance plan |

## Impact and confidence

- **Critical:** intended reference/scope cannot be identified, core journey cannot be reproduced, or baseline is untrustworthy.
- **High:** uncertainty can materially alter layout, type metrics, breakpoints, distinctive assets/effects, navigation, important interaction/motion or accessible operation.
- **Low:** bounded detail has little effect on those contracts and can be checked without structural rework.

Confidence is separate: give its basis without invented precision. Supported inference stays inference. Low confidence on high-impact details blocks passage; calling them minor does not resolve them.

## Decisions

**PASS** only if all mandatory obligations are Complete or justified N/A, exclusions match user scope, no critical/high issue remains, and every retained low-impact issue has a bounded implementation rule and acceptance check. Name residual limits; PASS does not certify unobserved detail.

**BLOCKED** if any mandatory obligation is incomplete, source authority conflicts materially, or the handoff is unusable. Record issue IDs, affected requirements, smallest resolving action and needed source/person/capability. Continue independent inspection, not dependent implementation.

Do not manufacture PASS by down-ranking uncertainty, marking unknown as N/A, substituting generic fonts/assets, or counting test plans as evidence. Static-only evidence can pass a user-requested static-only scope, never the full responsive/behavioral goal. Scope reduction requires an actual user instruction recorded in the gate.

Routine assessment/passage needs no user sign-off. Consequential substitutions, source conflicts or inaccessible evidence may need a user decision; reuse existing authorization.

## Reopen rules

Changes to source version, scope, material artifacts, discovered rules or capture conditions invalidate affected rows and dependent implementation clearance. Preserve the old revision and rerun affected obligations. Real-content changes normally update adaptation/tests; reopen extraction if they reveal an unknown reference rule.

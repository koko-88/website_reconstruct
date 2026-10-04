# Reference Evidence Package

Template instructions: copy as `reference-evidence.md` into the project's evidence directory. Replace bracketed fields with project observations; use `unknown` plus an uncertainty ID instead of leaving material fields blank. Empty tables are not evidence of completeness. Mark absent features N/A with an inspected reason. Keep this template unchanged in the reusable skill.

## Package identity and scope

- Schema version: 1
- Package ID / revision / captured date and timezone: [values]
- Requested phase: [evidence / gate review / reconstruction / adaptation]
- Reference identity / intended source version: [values]
- Scope instruction / authority: [user instruction or artifact identifying scope]
- In-scope routes, page families and critical journeys: [inventory links]
- Explicit exclusions and source of each decision: [values]
- Supported width/height range, browsers, input modes, themes/locales/direction: [values]
- Capture operator / responsible role: [value]
- Target project/content known so far: [optional; keep adaptation decisions separate]
- Fidelity requirements / permitted deviations: [values]
- Gate: **NOT ASSESSED**

## Canonical directory layout

Use paths relative to this package so another agent can consume it elsewhere. Create artifact directories only when actual evidence exists. Do not store private raw traffic/session exports in this shared package.

```text
reference-evidence.md        Manifest, observations, scope, uncertainty, gate
captures/                   Original screenshots, recordings, timestamped frames
observations/               Sanitized DOM/style/accessibility/runtime excerpts
supplied/                   Supplied SingleFile/design/static evidence
media/                      Approved reusable assets/fonts, if acquired
adaptation-contract.md      Separate target-content contract, when needed
acceptance-plan.md          Expanded deterministic cases and run results
```

## Source register and precedence

| Source ID | Kind / URL or local path | Captured date / version | Known viewport/state | Intended authority and reason | Limitations / conflict IDs |
| --- | --- | --- | --- | --- | --- |

Resolve source conflicts for the intended reference version; do not combine incompatible versions into an invented design.

## Environment and reset recipes

Assign `ENV-*` IDs and record every capture's environment. Shared defaults may be referenced, with overrides written explicitly.

| Environment ID | Browser/version / OS | Viewport CSS W x H / DPR / zoom | Input / touch / orientation | Locale / timezone / direction | Theme / reduced motion | Session / consent / storage / fixture | Readiness / reset recipe | Emulation limits |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

For a reset recipe give ordered navigation, storage/session preparation without secrets, fixture setup, scroll position and ready conditions. For motion record time origin and whether it is normal, paused, reduced or otherwise modified.

## Artifact manifest

Every observation must point to openable artifacts, not only a URL or an assertion that a tool was used. Give stable `E-*` IDs. Multiple frames can form one evidence set with timestamps.

| Evidence ID | Source ID | Relative artifact path / optional hash | Timestamp with timezone | URL/query/hash | Environment ID / overrides | Route/component/state / scroll | Capture method / readiness / modifications | Supports requirement IDs / limits |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Routes, components and state graph

| Route ID / URL pattern | Page family | Unique layout/components | States and variants | Critical journey IDs | Representative sampling / exceptions | Evidence IDs |
| --- | --- | --- | --- | --- | --- | --- |

| Component ID | Anatomy / slots / variants | State IDs | Reuse scope | Responsive differences | Content constraints | Evidence IDs |
| --- | --- | --- | --- | --- | --- | --- |

| Transition ID / journey | From state / preconditions | Trigger / input | To state / visible effect | URL/history/storage / async effect | Reverse / cancel / repeat / reset | Evidence IDs / observation status |
| --- | --- | --- | --- | --- | --- | --- |

## Design and layout contract

Use `R-*` requirement IDs across all contracts. Preserve raw measurements next to normalized token candidates. Distinguish source-declared, computed, measured and estimated values; token names are descriptive, not proof of original implementation names.

| Requirement ID / token or rule | Raw value / units / measurement type | Scope/component/state | Relationships / fluid or fixed behavior | Evidence IDs | Observed / inferred / unknown / conflicting | Confidence basis / uncertainty ID |
| --- | --- | --- | --- | --- | --- | --- |

Cover layout/gutters/columns/gaps, rhythm, color/gradients, borders/radii/shadows, overflow/layers, pseudo-elements and distinctive visual effects.

### Typography

| Requirement ID / text role | Declared family / actual rendered font / file | Weight/style/axes | Size/line-height/tracking | Wrapping/measure / responsive change | Load/fallback/glyph evidence | Evidence IDs / uncertainty |
| --- | --- | --- | --- | --- | --- | --- |

### Assets

| Asset ID / role | Source / local path / type | Intrinsic size / variants / selected source | Render size / crop / object-position / aspect ratio | Semantic/decorative / alt behavior | Acquisition/reuse status / replacement decision | Evidence IDs / uncertainty |
| --- | --- | --- | --- | --- | --- | --- |

## Responsive contract

| Requirement ID / component | Query or observed threshold interval / units | Environment / container | Below / at / above evidence IDs | Fluid interpolation / layout change | Height/orientation/input/overflow effects | Confidence / uncertainty |
| --- | --- | --- | --- | --- | --- | --- |

List provisional sampling sizes separately from discovered breakpoints. For each threshold record exact probes; for container rules include container dimensions. Document keyboard/zoom or real-device coverage limits.

## Behavior and accessibility contract

| Requirement ID / control/flow | Applicable states / transition IDs | Pointer/touch behavior | Keyboard/focus/scroll-lock behavior | Role/name/state / labels/validation/announcements | URL/history/persistence | Evidence IDs / known defect / testing limits |
| --- | --- | --- | --- | --- | --- | --- |

## Motion contract

| Requirement ID / motion | Trigger / time origin | Initial / intermediate / final properties | Duration/delay/easing/stagger/repeat | Scroll linkage / interruption/reversal | Reduced-motion behavior | Recording/frames/runtime evidence | Measured versus estimated / uncertainty |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Runtime/data contract

| Requirement ID / transition | Sanitized request/transport/event | Data fields/types / statuses | Loading/empty/error/success effects | Ordering/debounce/cache/retry/persistence | Evidence IDs / capture limits |
| --- | --- | --- | --- | --- | --- |

Record observable client contracts only. Exclude credentials, cookies, sensitive values, reference host dependencies and unrelated requests.

## Tool decisions and escalation

| Gap ID | Missing observation / impact | Existing capability tried / result | Chosen capability / expected artifact | Access or side effects / authorization | Stop condition / outcome |
| --- | --- | --- | --- | --- | --- |

## Uncertainty and conflict register

| Issue ID | Claim / competing alternatives | Observed/inferred/unknown/conflicting | Critical/high/low impact and reason | Evidence / confidence basis | Smallest resolving observation | Responsible role / disposition | Blocking requirements / acceptance case |
| --- | --- | --- | --- | --- | --- | --- | --- |

Disposition can be resolved with evidence, bounded low-impact rule, pending capture, or explicitly excluded by user scope. Record who authorized scope/deviation decisions. A missing tool is not resolution.

## Coverage matrix

| Coverage ID | Route/family/component/state | Viewport/input/preferences or proven equivalent group | Dimension / required observation | Evidence IDs | Complete / Incomplete / N/A / Excluded | Reason / issue ID | Replay / acceptance case ID |
| --- | --- | --- | --- | --- | --- | --- | --- |

Include scope, capture integrity, appearance, responsive edges, behavior, motion, accessibility, runtime/data, assets/type, uncertainty and handoff obligations. Include each unique state and critical journey. Explain equivalence-based sampling; do not silently omit combinations.

## Acceptance seeds

These are handoff requirements, not executed test results. Expand in `acceptance-plan.md` later.

| Case ID | Requirement / evidence IDs | Route / environment / fixture | Reset / ordered actions / ready condition | Visual checkpoint and behavioral assertions | Motion/timing/geometry tolerances | Allowed variable regions / reason |
| --- | --- | --- | --- | --- | --- | --- |

## Pre-implementation gate record

- Decision: [NOT ASSESSED / PASS / BLOCKED]
- Assessed package revision / time / assessor: [values]
- Exact scope cleared (routes, states, environments): [values]
- Coverage review: [mandatory row IDs and dispositions; links to evidence]
- Critical/high issues remaining: [IDs or explicitly none]
- Retained low-impact uncertainties and bounded rules/checks: [IDs or none]
- Source conflicts and resolutions: [IDs or none]
- Asset/font acquisition or authorized substitutions: [links]
- Handoff integrity and replay checks: [results]
- Missing observations / smallest next capture / needed input: [values or none]
- User-authorized exclusions/deviations and source: [values or none]
- Gate invalidation triggers / next receiving role: [values]

## Revision record

| Revision | Changed source/scope/evidence | Reason | Invalidated requirements/gate rows | Replacement evidence / reassessment |
| --- | --- | --- | --- | --- |

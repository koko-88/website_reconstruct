# Visual and Behavioral Acceptance Plan

Copy into the project evidence area and replace bracketed fields. Prepare during handoff; implement/run with Playwright later. Blank cases, proposed tests and unexecuted tests are not acceptance evidence.

## Authority and environments

- Fidelity / Scope Contract path/revision and comparison criteria: [values]
- Reference package path/revision and separate integrity/fidelity/asset-reuse clearance: [values]
- State & Route and Environment matrices / Non-DOM and Public Artifact reports: [paths]
- Implementation revision / target base URL: [values]
- Adaptation contract revision when applicable: [value]
- Test runner version / command / artifact directory: [values; unknown until configured]
- Baseline provenance: [captured reference, reference-equivalent or reviewed adapted baseline; link artifacts]

| Environment ID | Browser/version/OS | CSS viewport/height/DPR/zoom | Fonts/readiness | Locale/timezone/direction/theme | Motion preference / pointer/touch | Session/storage/fixture/time controls |
| --- | --- | --- | --- | --- | --- | --- |

Keep browser/font/rendering conditions matched. Where original capture conditions cannot be reproduced, record calibration limits instead of increasing thresholds until the comparison passes.

## Baseline policy

- Reference-equivalent comparisons use matching content/state and reference evidence IDs.
- Adapted comparisons use preserved contracts and explicitly reviewed adapted snapshots. Record expected text/image/count differences; do not mask the entire changed page.
- Screenshot stability measures: [font/image/content ready conditions, fixture controls, scroll/state reset]
- Static capture animation policy: [settled/frozen state and why]
- Separate motion verification strategy: [time origin, checkpoints, sequence/tolerance/reduced-motion assertions]
- Per-case image/geometry/timing tolerances and rationale: [values set before evaluation]
- Masks/crops: [specific regions, non-determinism reason, retained geometry/behavior checks; none by default]
- Baseline changes: [require evidence-backed intended change and reviewed diff; no automatic acceptance]

## Cases

Use `TC-*` IDs and include every gate coverage row through direct linkage or justified equivalence. Cover desktop/tablet/mobile, b-1/b/b+1 and container edges, critical flows, keyboard/focus, scrolling, reduced motion and applicable async/content stress states.

Repeat this record per case:

```text
Case ID / purpose:
Stage: reference-equivalent | adapted
Reference requirement IDs / coverage rows / evidence IDs:
Environment ID / route / viewport or container dimensions:
Fixture ID / data source / storage/session state:
Reset and preconditions:
Ordered user actions (input mode, focus, scroll, URL/history):
Observable ready condition:
Screenshot checkpoint / crop / reference artifact:
Visual rules and geometry assertions:
Behavioral assertions (state, URL, persistence, focus, semantics):
Motion assertions (trigger, sequence, interruption, reduced motion):
Image / geometry / timing tolerance and rationale:
Allowed dynamic regions and masking justification:
Output artifact paths:
Status: NOT RUN | PASS | FAIL | BLOCKED
Failure or limitation / linked issue IDs:
```

## Results and mismatch triage

| Run / implementation revision | Case IDs | Command/environment | Status | Actual/diff/overlay/trace paths | Human or agent visual inspection result | Issue IDs |
| --- | --- | --- | --- | --- | --- | --- |

Classify failures as environment/capture mismatch, reference evidence gap, implementation defect, adaptation conflict, or intended difference. Fix the cause and rerun affected cases. Reopen the gate for evidence gaps; do not retune thresholds or refresh baselines to hide defects.

## Acceptance record

- Tested scope and untested limits: [values]
- Passed / failed / blocked / not-run cases: [IDs/counts]
- Behavioral and motion results separate from static screenshots: [links]
- Approved differences and unresolved defects: [IDs or none]
- Conclusion supported by these results: [bounded statement]

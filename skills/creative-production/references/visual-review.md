# Browser visual and temporal acceptance

Capture the real maintained consumer with existing Playwright/DevTools/Polypane. Wait for fonts,
assets and rendered readiness; distinguish requested progress from the pose actually painted.
Retain normal captures before any annotations/masking. Record URL/build, viewport/DPR, motion
preference, quality, direction, time/progress and rendered subject/camera/material state when
observable. A source moodboard or build screenshot cannot replace browser evidence.

Sample within meaningful beats, including entry/exit and start/middle/end; uniform full-page
samples can miss a narrow peak or landing glitch. Replay slow/fast scroll, reverse and interrupted
travel. Capture mobile-specific framing and reduced/static/manual variants separately. Check
video decoded frames, not only its requested playhead. Essential text needs a readable dwell,
including during reverse; the final commercial action should remain stable and usable.

## Contact sheets and conservative hold triage

Reuse `npm run creative:review -- --manifest CAPTURES.json --output REVIEW_DIRECTORY` from root.
Sharp is already a maintained dependency; no Scroll Craft engine or full FFmpeg is needed for
still sheets. Captures stay inside the manifest directory, including real linked paths. Maximum
48 frames, 32 MiB/20M pixels per image, 256 KiB manifest. The utility emits contact-sheet.webp and
review.json with original SHA256, frame labels and adjacent comparisons; it never edits originals.
Existing symbolic/hard-linked output targets are rejected to preserve linked source evidence.
File identities are checked independently of path spelling and platform case conventions.
Manifest/captures must be regular files; pipes/devices are rejected before reading.
Read completed immutable captures. Validated file handles bind identity/bounds to the bytes read;
detected source mutation rejects the review. Use a fresh output directory for each round: output
files are exclusively created and never written through substituted links or existing reports.
A failed write may leave partial new outputs; the command fails and that round is not accepted.
This is a local review utility, not a hostile-filesystem sandbox or multi-writer transaction.

```json
{
  "schemaVersion": 1,
  "url": "http://127.0.0.1:4173/showcase.html",
  "build": "actual inspected revision plus local diff identifier",
  "frames": [
    {"file":"arrival.png","label":"start","scene":"transformation","viewport":{"width":1440,"height":1000},"progress":0,"atMs":0,"direction":"forward","expectation":"change","renderedState":{"subjectPose":"assembled"}},
    {"file":"middle.png","label":"detail","scene":"transformation","viewport":{"width":1440,"height":1000},"progress":0.5,"atMs":1200,"direction":"forward","expectation":"change","renderedState":{"subjectPose":"separated"}},
    {"file":"landing.png","label":"resolved","scene":"transformation","viewport":{"width":1440,"height":1000},"progress":1,"atMs":2400,"direction":"forward","expectation":"hold","reason":"read product choice","renderedState":{"subjectPose":"resolved"}}
  ]
}
```

Metadata describes actual measurements, not these illustrative labels/times. Each frame's
expectation applies to its following interval. Use hold/static only for an intentional reading,
settling, reduced-motion or resolved state, with a reason. Optional focus `{left,top,width,height}`
selects a rectangle in captured-image pixels (not CSS pixels) for comparison; the sheet stays
whole. Focus on the subject/story to avoid particles or unrelated UI hiding a stalled scene.
Optional renderedState records actual painted values; raw changing scroll progress is not a
valid substitute. Capture the same rectangle and viewport for comparable frames.

Suspected-unexpected-hold means intended change, >=0.02 progress travel and nearly identical
downsampled pixels or identical supplied rendered state. It is a conservative flag, not a defect
verdict. Intentional holds are still reviewed, never automatically exempted from taste/accessibility.
Pixel activity alone cannot prove narrative progress, focus rectangles can omit defects, and sparse
sampling can miss frozen clips. Use the full interaction and storyboard to decide. A changing
shader clock does not prove the subject moved. Human approval is always pending in the report.
Comparison composites alpha over black and white; changes hidden inside fully transparent pixels
do not simulate progress. Painted state uses semantic key-independent comparison; null is unknown.

## Feedback round and acceptance

For each issue record capture/viewport/beat/progress, observed fault, intended composition or
sequence, priority and affected assets/scenes. Examples: subject too small at transformation;
shadow moves before the turn; words lost against a real shadow; mobile crop removes product
identity; landing overshoots; blank travel after copy exits. Batch related issues into a bounded
round, apply concrete authorized fixes, recapture the same states and adjacent transitions.
Do not change thresholds or intended holds merely to silence a failed check.

Review identity/continuity, layout/type/hierarchy, light/contrast, motion causality/easing/reading
time, responsive composition and actual commercial action. Keep engineering acceptance separate:
console/network, keyboard/touch/focus, axe plus manual accessibility, reduced/pause, failure/load,
GPU lifecycle, bundle/frame budgets and cleanup. Human approves subjective direction and final
creative quality explicitly; no numeric aesthetic score or autonomous self-refinement. Retain
remaining shortcomings and physical-device/browser omissions in the owning verification artifact.

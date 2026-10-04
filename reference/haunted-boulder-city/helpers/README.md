# Inspection helpers

These files collect reference evidence only. They contain no reconstruction, target UI, adaptation, deployment or Playwright acceptance code.

The capture root is derived from the helper directory. Never rerun them into frozen revision 1.0.0: first copy the package/helper inputs to a new revision directory. They write named evidence files and can overwrite matching paths.

Requirements: installed Node.js with built-in fetch/WebSocket, an existing authorized Chromium debugging endpoint, and a live public reference target. REFERENCE_CDP_PORT selects the endpoint; the session used 9223 for an isolated Chrome profile and initially verified 5858 for Polypane. Endpoint/target IDs are ephemeral. Start/verify the browser first using its supported tooling. Do not install or reconfigure MCP merely to replay this evidence.

- cdp.mjs: evidence-root-confined writes, target filtering, CDP evaluation/screenshots/environment metadata.
- measure-function.js: read-only computed geometry/type/media/motion collection.
- baseline.mjs: provisional viewport sweeps, top/footer/full context, forward/reverse scroll observations.
- responsive.mjs: declared breakpoint edges, height/landscape/reduced-motion probes.
- interactions.mjs: trusted pointer/touch/keyboard state journeys, sanitized network fields and rendered font lookup.
- motion.mjs: normal/reduced load timelines and motion samples. Its original all-image async expression was not invoked; final image readiness was correctly recollected by settled.mjs. Do not use that intermediate empty result as evidence.
- settled.mjs: fresh desktop/mobile settled scenes, bounded visible-image decoding, source reconciliation. This supplies the authoritative final image readiness.
- edge-states.mjs: focus/reversal/UFO observations plus an explicitly induced widget-script failure. Clears the block and emulation on normal completion.
- additional.mjs: fresh facts decode frames and source-discovered preview query.
- keyboard.mjs: native FAQ Enter/Space behavior and focus styling.
- verify-package.mjs: file/link/JSON/JPEG/hash integrity only; no implementation acceptance.

All captures use public anonymous reference states. No real purchase, reservation, payment, contact submission, account or login action is permitted by these recipes. No headers/cookies/private payloads or signed URLs belong in this package.

A full-page screenshot preserves current scroll-dependent styles; it does not show every chapter, prove sticky positioning, or replace temporal evidence. Wait for fonts, loader removal and relevant image decoding, not generic network silence. Preserve normal motion originals before inducing faults or changing preferences.

See ../reference-evidence.md for source authority, supported environments, limitations and the BLOCKED gate. Missing available-date behavior and reuse rights require reassessment before reconstruction.

# Reference inspection procedure

Use during extraction. Write findings into the canonical package rather than competing narratives.

## A. Source and scope inventory

- Identify live URLs, route parameters, families and unique layouts. Enumerate every scoped route; sample repeated families only after verifying common structure and documenting exceptions.
- Inventory supplied SingleFile captures, images/video, design exports and original assets with URL, date/version, viewport/state if known, path and optional checksum.
- Select the intended reference version. New live content does not automatically supersede a designated archive. Preserve ambiguous alternatives and log conflicts.
- Follow reachable controls to inventory navigation, overlays, forms, list/detail/search flows, URL/history and persistence. Record exclusions.
- Discover actual tool capabilities. An installed MCP server does not prove browser access: enumerate targets and verify the intended URL/pane. Do not fabricate calls.

## B. Capture conditions and baseline

For each capture record URL/query/hash, time with timezone, browser/version/OS, CSS viewport width/height, DPR, zoom, input mode, locale/direction, theme, reduced motion, session/consent, scroll position and data fixture/version. Unknown fields stay unknown.

Wait on observable readiness: fonts settled, required images decoded, loaders resolved and expected content present. Record the readiness condition. Network silence alone is unreliable for polling, streaming, or lazy loading.

Capture full-page context and viewport/element details. Scroll top-to-bottom and back for lazy content, sticky headers, reveals, footer behavior and reverse transitions. A stitched full-page screenshot does not prove sticky positioning or motion. Keep a pristine baseline before style edits, throttling, state injection or animation freezing; label modified captures.

## C. Design system, typography and assets

Measure repeated examples; one incidental value does not establish a global token. Record value, units, scope, evidence, and whether it is a declared rule, computed value, or estimated rendered measurement.

- Geometry: gutters, max widths, alignment axes, section rhythm, grids/gaps, columns, intrinsic widths, wrapping, aspect ratios, padding/borders and box sizing. Distinguish fixed, fluid, min/max, and content-driven dimensions.
- Layering: relative/absolute/sticky/fixed placement, containing blocks, clipping/overflow, stacking contexts, z-order, gradients, shadows, radii, borders, masks, blend/filter effects and visible pseudo-elements.
- Typography: actual rendered font versus declared stack, load/fallback state, family/file, weight/style, variable axes, size, line height, tracking, case, decoration and wrapping. Record font response evidence when accessible; pixels cannot identify the exact font file. Check representative scripts/glyphs.
- Assets: accessible source/file, type, intrinsic size, variants/srcset, selected source, rendered dimensions, crop/object-position, SVG viewBox/strokes, video poster/loop/autoplay and semantic role. Track acquisition/reuse separately from visibility. Record decisions for distinctive substitutions.
- Components: slots, variants, state styles, responsive changes and content constraints, including repeated shells and distinctive one-offs.

Keep extraction descriptive. Framework defaults are not reference evidence.

## D. Responsive rules and edges

Inspect desktop, tablet and mobile, then sweep intermediate widths. Use visible discontinuities plus media/container queries when accessible to identify candidate breakpoints. Validate b-1, b, b+1 CSS pixels; for em/rem queries record units and effective environment. If estimated, retain an interval/confidence instead of inventing an exact rule.

Cover hidden/shown/reordered elements, navigation mode, grid collapse, wrapping, type scaling, gutters, image changes, alignment, overflow and touch targets. Vary container width for container queries. Check relevant short-height/landscape cases, zoom/text enlargement, scrolling overlays and observable safe-area behavior. Mark emulation limits for virtual keyboards and real mobile browser chrome.

With Polypane, verify each pane's dimensions, session and state. Synchronized actions do not guarantee equivalent states; reset and inspect divergent panes individually. Do not merge different viewport states under one evidence ID.

## E. Interactions, accessibility and motion

Inspect applicable default, hover, focus-visible, active, disabled, selected, expanded and error states. Build a state graph: trigger, preconditions, visible outcome, URL/storage change, asynchronous dependency and reset steps. Cover closing, cancellation, outside click, Escape, repeated activation, back/forward, reload and persistence where applicable.

Use keyboard and pointer/touch paths. Record role/name/state, focus order/visibility, initial focus, trap/restoration, inert background, labels, validation, announcements and scroll locking. Distinguish DOM/ARIA inspection from actual assistive-technology testing. Record reference accessibility defects and target corrections as explicit deviations.

Motion needs temporal evidence: trigger, initial/intermediate/final states, properties/values, duration/delay, easing/spring behavior, stagger, repeat/direction, scroll linkage, interruption/reversal and reduced-motion response. Use recordings, timestamped frames or animation/runtime inspection. Label estimated timing and retain originals before freezing animations. CSS declarations alone cannot establish JavaScript, canvas or spring behavior.

Capture loading, empty, success, failure, retry and partial-data states where the scoped flow has them. Unobserved states stay unknown; local simulations must be labeled separately from observed reference behavior.

## F. Runtime and network

Observe ordinary authorized interactions through network, console, DOM/accessibility and runtime timing capabilities. Correlate relevant requests/events with before/after UI. Inspect what explains the experience: content schema, pagination, debounce, optimistic updates, ordering, cache/persistence, media/font loading or live updates.

Record method/path pattern, sanitized request shape, response fields/types, status/error shape, event order and visible effect. For WebSocket/SSE, capture transport and sanitized event schema as needed. This is a UI contract, not a requirement to duplicate the backend, hosts, secrets, telemetry or proprietary internals.

Use `tool-selection.md` escalation criteria for protocol gaps. Real writes require independent authorization. Separate reference failures from capture-environment failures.

## G. Reconcile and freeze

Cross-check artifacts against extracted rules. Design exports may differ from runtime; archives may lack fonts/scripts. Resolve source/state/version differences or preserve conflicting alternatives in the uncertainty register.

Recapture only affected evidence after corrections. Every mandatory row needs evidence, replay steps and disposition. Freeze the package revision, manifest and gate inputs; never silently replace old evidence when the live reference changes.

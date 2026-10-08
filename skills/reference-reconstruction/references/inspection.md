# Reference inspection procedure

Use after the Fidelity / Scope Contract permits discovery. Write findings into the canonical package rather than competing narratives. Populate both mandatory matrices and both reports even when access is static-only or blocked.

## Compact static-only inspection

For small supplied archives, use the canonical fields without copying every empty optional table. Retain identity/source/provenance, the five-class contract, both matrices, both mandatory reports, uncertainty and all four gate results, plus a concise handoff/acceptance seeds. Combine sparse typography/assets/responsive/state/motion observations into a short evidence-linked table with explicit declaration/inference/unknown status. Describe absent or unavailable dimensions once and link their uncertainty IDs instead of repeating full explanations in every row. Do not execute supplied scripts merely to fill a table or invent state variants. Reports complete does not mean runtime coverage complete. A smaller document may carry exactly the same scoped blockers and authority.

## A. Source and scope inventory

- Identify live URLs, route parameters, families and unique layouts. Enumerate every scoped route; sample repeated families only after verifying common structure and documenting exceptions.
- Inventory supplied SingleFile captures, images/video, design exports and original assets with URL, date/version, viewport/state if known, path and optional checksum.
- Select the intended reference version. New live content does not automatically supersede a designated archive. Preserve ambiguous alternatives and log conflicts.
- Follow reachable controls to inventory navigation, overlays, forms, list/detail/search flows, URL/history and persistence. Record exclusions.
- Discover actual tool capabilities. An installed MCP server does not prove browser access: enumerate targets and verify the intended URL/pane. Do not fabricate calls.

## B. Capture conditions and baseline

For each capture record URL/query/hash, time with timezone, browser/version/OS, CSS viewport width/height, DPR, zoom, input mode, locale/direction, theme, reduced motion, session/consent, scroll position and data fixture/version. Unknown fields stay unknown.

Use capture.md for bounded observable readiness: fonts, required visible-image decode, absent loaders, expected controls and named geometry. Record total deadline, pending signals and actual phase. Never await all offscreen lazy images or use network silence alone. Transient/loading captures have a separate time origin and cannot become settled baselines.

Capture full-page context and viewport/element details. Scroll top-to-bottom and back for lazy content, sticky headers, reveals, footer behavior and reverse transitions. A stitched full-page screenshot does not prove sticky positioning or motion. Keep a pristine baseline before style edits, throttling, state injection or animation freezing; label modified captures.

## C. Design system, typography and assets

Measure repeated examples; one incidental value does not establish a global token. Record value, units, scope, evidence, and whether it is a declared rule, computed value, or estimated rendered measurement.

- Geometry: gutters, max widths, alignment axes, section rhythm, grids/gaps, columns, intrinsic widths, wrapping, aspect ratios, padding/borders and box sizing. Distinguish fixed, fluid, min/max, and content-driven dimensions.
- Layering: relative/absolute/sticky/fixed placement, containing blocks, clipping/overflow, stacking contexts, z-order, gradients, shadows, radii, borders, masks, blend/filter effects and visible pseudo-elements.
- Typography: actual rendered font versus declared stack, load/fallback state, family/file, weight/style, variable axes, size, line height, tracking, case, decoration and wrapping. Record font response evidence when accessible; pixels cannot identify the exact font file. Check representative scripts/glyphs.
- Assets: accessible source/file, type, intrinsic size, variants/srcset, selected source, rendered dimensions, crop/object-position, SVG viewBox/strokes, video poster/loop/autoplay and semantic role. Track acquisition/reuse separately from visibility. For required originals use [asset-acquisition.md](asset-acquisition.md): combine declarations and runtime occurrences, acquire/verify dependency closure, and assess explicit asset obligations. Record decisions for distinctive substitutions.
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

## F. Non-DOM rendering and public artifacts (mandatory reports)

Run the bounded shared page probe where possible; review visuals and identified public sources. Inventory DOM canvas (size/visibility), SVG/filter/mask/blend effects, video/audio and embedded/cross-origin/shadow surfaces. Correlate source/network signals for getContext(2d/webgl/webgl2), GPU adapters/devices, OffscreenCanvas/workers, WASM and renderer libraries. A token in a bundle/comment is observed source text, with runtime use inferred or unknown. Do not call getContext merely to detect an existing context; it may create/change one. navigator.gpu presence proves capability only. Closed shadow roots/workers/cross-origin internals not probed remain unknown.

For material non-DOM effects, document renderer uncertainty, viewport/DPR/GPU/browser/codec needs, temporal trigger/frame sequence and visible hit/input behavior. Escalate only the missing obligation: normal/reduced-motion recording, authorized public source/assets/shaders, GPU-capable or real-device capture, or owner-provided renderer contract. Keep geometry/behavior targets if internals may be replaced under contract; do not guess shaders or silently substitute a distinctive effect. Record when GPU acceleration/headless codecs cannot reproduce observed rendering.

For Public Artifact / source-map inspection, enumerate identified document/CSS/JS, manifests, worker/WASM/media/font references and sourceMappingURL comments/observed SourceMap headers. Use already obtained responses or explicit public referenced URLs within authorized origin scope. Record inspected/not attempted/unavailable/oversize status, hash/version, map-bundle match, original-source/embedded-source counts, relevant rule/route/rendering findings and evidence type. Parse maps as data; no executing source bundles. source-report.mjs supports bounded local text/map inspection. Large maps use a specific byte-budgeted excerpt or declared omission; never transfer whole bodies by shell arguments. Do not guess .map suffixes/admin paths or recursively retrieve map source paths. A missing map does not block sufficient observable evidence. Source visibility and license text are separate from reuse permission.

## G. Runtime and network

Observe ordinary authorized interactions through network, console, DOM/accessibility and runtime timing capabilities. Correlate relevant requests/events with before/after UI. Inspect what explains the experience: content schema, pagination, debounce, optimistic updates, ordering, cache/persistence, media/font loading or live updates.

Record method/path pattern, sanitized request shape, response fields/types, status/error shape, event order and visible effect. For WebSocket/SSE, capture transport and sanitized event schema as needed. This is a UI contract, not a requirement to duplicate the backend, hosts, secrets, telemetry or proprietary internals.

Use `tool-selection.md` escalation criteria for protocol gaps. Real writes require independent authorization. Separate reference failures from capture-environment failures.

## H. Reconcile and freeze

Cross-check artifacts against extracted rules. Design exports may differ from runtime; archives may lack fonts/scripts. Resolve source/state/version differences or preserve conflicting alternatives in the uncertainty register.

Recapture only affected evidence after corrections. Every mandatory row needs evidence, replay steps and disposition. Freeze a new revision, manifest and four independent gate inputs. Verify byte/link/JSON/image integrity separately from semantic completeness; never silently replace frozen evidence when the live reference changes.

# Settled-Appearance policy

Use this policy for named appearance checkpoints and capture repair. A stable parent rectangle, loaded host fonts and decoded host images are prerequisites, not proof that the intended state has appeared. Keep the reference's motion observable.

## Choose a claim and its signals

- **Viewport / region appearance:** sample descendants and generated `::before`/`::after` styles as well as specified geometry. A region must uniquely match and fit inside the current viewport; sampling never scrolls it into a different state. Explicit actions perform any required navigation/scroll first.
- **Named semantic state:** declare expected state using count, visibility, effective opacity through ancestors, computed styles or attributes. For example, an open menu may require all its relevant items to reach opacity 1 and the toggle to expose `aria-expanded=true`. Use selectors discovered from the actual reference as plan data; no site selectors in helpers. A stationary opacity-0 child can be legitimate or a not-yet-triggered reveal. Finite sampling cannot distinguish these without an expected state. Generic convergence with no assertions supports only the observed window, never semantic completion of an arbitrary page.
- **Geometry only:** explicitly declare `appearance.mode=geometry-only` with a reason. A legacy `phase=settled` then describes only the selected geometry; `readiness.appearance.state=unresolved` and `convergence.pass=false` prohibit an appearance claim. This preserves useful full-page context captures without falsely clearing reveal coverage.
- **Full-page appearance:** the adapter conservatively remains unresolved, even if a sweep/reset or whole-page pixels look stable. Offscreen/lazy/rearmed reveals need named section/scroll-state evidence. Full-page pixels and a viewport sample cannot prove that coverage.
- **Frames:** every in-scope iframe is content-unresolved by default, including same-origin frames this collector has not sampled. `frames` may explicitly bound a checkpoint to a `shell-only` obligation with a reason; it never clears provider contents. If content is material, use a capable independently bounded frame adapter and expected provider state/image/font signals, or retain unresolved/manual visual evidence. Playwright Frame/FrameLocator access, if actually available and authorized, is an additional capability; document-ready/load events, elapsed time and screenshots of a stationary blank shell are insufficient.

## Plan data

The existing schema2 checkpoint accepts optional `appearance`:

```json
{
  "scope": "region",
  "selector": "[role='dialog']",
  "assertions": [
    {"selector": "[role='dialog'] [role='menuitem']", "minCount": 3, "maxCount": 3, "visible": true, "minOpacity": 0.99},
    {"selector": "[aria-controls='navigation']", "attributes": {"aria-expanded": "true"}}
  ],
  "visual": true,
  "intervalMs": 100,
  "minStableMs": 300,
  "stableSamples": 3,
  "maxSamples": 100,
  "maxNodes": 400,
  "ambient": [{"selector": "[data-effect='ambient']", "properties": ["transform"], "reason": "Observed continuous decorative motion; the semantic state is independent of its phase"}],
  "frames": [{"selector": "iframe", "mode": "shell-only", "reason": "Host wrapper obligation only; provider content remains unresolved"}]
}
```

Selectors/attributes above are illustrative fixture data, not a required website vocabulary. Assertions apply to **every match**, with explicit minimum/maximum count; `styles` accepts exact computed values for display, visibility, opacity, transform, filter, clipPath, color, backgroundColor, fontFamily, fontSize, fontWeight, lineHeight, letterSpacing. Missing attributes can be asserted with null. Scope defaults to viewport, mode to appearance, visual to false. Sampling defaults are shown. Timeout still comes from checkpoint timeoutMs. All budgets and exceptions are validated before browsing; no arbitrary executable predicates in plans.

## Temporal and motion handling

Compare consecutive descendant geometry/style signatures for the minimum observation window and sample count. Keep document/fonts/required/absent/images healthy for that same window. Read Web Animations where available: active finite animations/transitions, including delayed or paused finite motion, block completion; unclassified continuous motion remains unresolved. Sampling works without this API but the capability gap is recorded and semantic assertions become especially important.

Ambient exceptions name selectors, reasons and only justified opacity/transform/filter properties. Infinite duration alone never classifies an effect as ambient. Finite transitions inside an ambient region still block. Membership, presence, display/visibility and non-exempt properties still converge. Transform exclusions compare the element's layout footprint rather than its moving transformed rectangle. Do not exempt a meaningful reveal, entire changing provider or text/data transition as ambient. Legacy stableSelectors still constrain their declared geometry; select static layout anchors around ambient movement.

States are `transient`, `settled-static`, `settled-with-ambient-motion`, `unresolved`. Legacy top-level raw phases remain `transient` / `settled` / `unsettled` for schema2 consumers. Consumers must read appearance claim/state and limits; `settled` alone grants no semantic gate.

## Scoped screenshot convergence

Optional `visual=true` supplements DOM/style and semantic readiness for a viewport or region, including raster changes outside DOM styles. The adapter uses maintained public `page.screenshot`, a region clip, and masks for explicitly classified ambient regions **only in diagnostic comparison images**. Evidence PNGs remain unmasked with animations allowed and caret unchanged. Select a stable bounded ambient wrapper when using masks: a moving transformed mask rectangle itself produces changing pixels and must not be force-passed. Exact consecutive PNG byte hashes are a conservative signal with no pixel tolerance; differences may over-block, while equal samples cannot disprove a future delayed change. Preserve sample hashes, clips, bytes, masks, sample times and comparison method. Unavailable required screenshot/mask capabilities remain unresolved.

Playwright Test's [toHaveScreenshot](https://playwright.dev/docs/api/class-pageassertions#page-assertions-to-have-screenshot-1) waits for consecutive screenshots, then compares to an expected snapshot. It is useful in a configured test project with a meaningful baseline and tolerances; it requires the test runner and disables animations by default. Do not import its defaults or create a fabricated expected reference snapshot merely to obtain readiness. Set animations to allow and record any justified masks when using it. This portable core does not require Playwright Test, pixelmatch or a baseline; an adapter may provide a decoded pixel comparator if its thresholds and capabilities are recorded. [page.screenshot](https://playwright.dev/docs/api/class-page#page-screenshot) supplies the maintained capture primitive. [Element.getAnimations](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAnimations) includes scheduled animations; record actual availability.

## Diagnostics and capture verification

Every wait retains policy, total/sample/node/window budgets, elapsed time, each sample's geometry signature, descendant/pseudo styles, animation status, assertions with observed values and failures, images/base readiness, optional visual hashes, streak/window result, pending reasons and limits. Node/scan/assertion truncation, missing region, unclassified motion, iframe contents, full-page coverage, unsupported capability and timeout are explicit reasons. A sampling error resets convergence; timeout/sample exhaustion cannot force-pass. Static DOM agreement does not establish fonts actually rendered, background-image decode, closed roots, canvas/media semantics or inner-frame completeness.

After saving the final evidence image, compare base readiness and descendant appearance again; visual checks also recheck their scoped diagnostic signal when enabled. Any change/error invalidates appearance convergence in the sidecar. Screenshot timing still spans an interval; manual semantic review remains required for unexplained raster producers and material unknowns.

Run `node --test scripts/test-capture.mjs scripts/test-settled-appearance.mjs`. Set REFERENCE_PLAYWRIGHT_MODULE to an existing installation to exercise local real-browser fixtures, and REFERENCE_BROWSER_CHANNEL if needed. Optional REFERENCE_APPEARANCE_RESULTS saves sampled diagnostics to a new caller-selected file. A skipped browser suite is not a passing regression validation.

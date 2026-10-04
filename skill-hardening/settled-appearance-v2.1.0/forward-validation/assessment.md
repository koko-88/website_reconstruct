# Independent forward validation

Request assessed: Can a developer use the reference-reconstruction skill and its maintained declarative runner to capture named menus/dialogs, continuous decorative effects, provider frames, and section reveal states with honest appearance diagnostics?

Scope: Read the skill entrypoint, settled-appearance policy, capture/capture-plan references, completeness gate, and executable capture/probe/appearance scripts. All evaluation writes are confined to this directory. No live reference site, browser, installed-file mutation, or frozen evidence was used. The browser-like adapter is synthetic data-only code, not Playwright or a real browser.

## Findings observed in the initial revision

1. **Region appearance omitted ancestor compositing and motion.** The probe restricts region nodes to its root and descendants. It records effective opacity through ancestors but the initial appearance signature omitted that value. A named menu checkpoint with its toggle's `aria-expanded=true` therefore returned `settled-static`, `convergence.pass=true`, while the region's measured effective opacity changed through 0.2, 0.3, 0.4, and 0.5. Its wrapper's active finite animation was also omitted from the sampled nodes. This falsely clears even the observed appearance window. Evidence: `portable-results.json`, `portable-evaluation.mjs`. Action: include non-exempt effective opacity in comparison and include region ancestor styles and scheduled/active finite motion as required appearance signals.

2. **Screenshot refusal retained appearance clearance.** An allowed 8000×8000 viewport passes validation but exceeds the 30-million-pixel screenshot limit. The raw run correctly returned `INCOMPLETE`; its sidecar nevertheless retained `phase=settled`, `appearance.state=settled-static`, and `convergence.pass=true`, although its PNG did not exist. This contradicts capture verification and can mislead a consumer assessing the checkpoint rather than the run summary. Evidence: `data-only-giant-run/GIANT--VIEWPORT.json`, `portable-results.json`. Action: every failed or refused required evidence screenshot must downgrade settled appearance and add an explicit capture failure reason.

## Verification after the first two corrections

The parent agent updated the writable skill after the initial findings were sent. A separate `portable-postfix-evaluation.mjs` read the updated source and verified:

- Changing ancestor opacity now returns `unsettled`, `appearance.state=unresolved`, and `convergence.pass=false`.
- Pixel-budget refusal now returns an `unsettled` checkpoint with unresolved appearance and `convergence.pass=false`; the run remains `INCOMPLETE` and no PNG is fabricated.
- Unsampled provider content, including a same-origin accessible but unsampled frame, remains unresolved. A declared shell-only frame is explicitly bounded. Full-page reveal appearance remains unproven, and unsupported decorative-property exclusions are rejected.

Evidence: `portable-postfix-results.json` and `data-only-giant-run-postfix/GIANT--VIEWPORT.json`. Original records remain separate.

At this intermediate revision the **region ancestor animation issue remained**: a wrapper with stable current opacity but an active finite opacity animation was excluded from the region sample, and the checkpoint returned `settled-static`/pass=true. Effective-opacity comparison alone cannot detect a delayed animation before its values begin changing. Evidence: `finite-ancestor-results.json` and `finite-ancestor-evaluation.mjs`.

The parent agent subsequently included region scope ancestors regardless of their geometry intersection. A fresh `finite-ancestor-postfix-evaluation.mjs` verified that the wrapper is now sampled, `finite-motion:2:section` remains a pending reason, and the same checkpoint returns `unsettled`/`unresolved`/pass=false on its bounded deadline. Evidence: `finite-ancestor-postfix-results.json`. All correctness defects observed by this isolated evaluation have therefore been corrected in the evaluated portable paths. The original reproducer scripts intentionally assert the original erroneous behavior and are retained as historical reproduction artifacts; the separate postfix scripts assert the corrected behavior.

## What this evaluation establishes

The policy gives a developer usable named-state assertions, bounded budgets, explicit decorative-motion exceptions, provider-content limitations, and section-versus-full-page distinctions. Those instructions avoid blanket semantic or gate clearance from raw capture totals. The demonstrated defects are implementation mismatches, not missing website-specific guidance.

Both maintained suites ran with browser execution explicitly disabled before and after corrections: 11 dependency-free tests passed; 2 browser suites were skipped. See `existing-unit-results.txt` and `final-unit-results.txt`; `final-source-hashes.json` identifies the last evaluated script revision. Skips are not passing browser regression evidence. The original suites did not cover either demonstrated false clearance path. This evaluation proves the exercised portable logic and source-driven synthetic invariants; real browser animation, clipping, masks, image decode, provider, and section-reveal behavior remains outside this isolated evaluation's permitted scope.

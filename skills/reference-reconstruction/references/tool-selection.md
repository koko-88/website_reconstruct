# Route tools by concrete evidence gaps

Discover available tools and read installed schemas. Verify target URL/page/pane; tool availability is not browser access. Use supplied authoritative evidence first when the reference is archived. No installation, server reconfiguration, trust-store changes or broader session access is implied.

| Evidence question | Route | Limits / escalation |
| --- | --- | --- |
| Live pixels, DOM/styles, rendered fonts, focus, runtime/network | Chrome DevTools MCP | Verify page IDs/current snapshot UIDs. DOM/source rules are not pixels or temporal proof. |
| Responsive pane comparison | Polypane via exposed MCP/Chromium targets | Verify every pane's dimensions/state/session. Let Polypane own pane dimensions; direct emulation may be overwritten. Sequential Chrome probes suffice if panes add no evidence. |
| Designated archived appearance/source | Supplied SingleFile/static screenshot/video/export | Hash original first; inspect text without execution. Fonts/lazy content/iframes/motion can be absent. For rendering use an isolated offline context and record blocking/modifications; never equate archive with live behavior. |
| Repeated capture, bounded readiness/local saves | Maintained capture runner/shared page probe | Use for a concrete replay/save/environment gap. Fresh browser is a different environment. Do not recapture adequate evidence solely to exercise another tool. |
| Public source/asset/map structure | Existing document/network responses and bounded static inspection | Only identified public artifacts; map references/status/hashes are evidence. Stop at reproduction-relevant rules. No guessed map/admin endpoints or executing bundles. |
| Unexplained async/protocol behavior | DevTools request/event metadata first | Deeper network/proxy inspection only for a named state question ordinary evidence cannot answer. No default scanning, fuzzing, replay, full HAR/session dump. |
| Canvas/GPU/worker/cross-origin effects | Non-DOM report -> focused temporal/source/GPU-capable capture | Canvas existence is fact; WebGL/WebGPU remains unknown until corroborated. API presence is capability, not use. See inspection.md. |
| Original asset availability/completeness | Existing capture runner with opt-in asset observer, maintained static parsers, assets.mjs sidecar | See [asset-acquisition.md](asset-acquisition.md). Anonymous GET/supplied originals only; runtime/declaration/version/rights remain distinct. Specialist decoders/exports resolve named material gaps, not blanket crawling/provisioning. |
| Later implementation comparison | Project-compatible visual/behavior runner | Tests cannot recover missing reference observations. Reference captures are not target acceptance results. |

Figma/html.to.design exports or manual VisBug measurements can supplement supplied evidence for a missing question. Neither is required; original/edited states remain distinct. General design/review skills do not replace observation.

## Escalation ledger and stop rules

Before a second tool/deeper capability record gap ID, affected obligation/impact, already-tried artifact/tool and limitation, smallest additional capability/artifact, authority/data exposure/side effects, and stop condition. Stop when the artifact is obtained or the bounded attempt fails. Retry a failing adapter only after diagnosing schema/conditions/save ownership and changing a justified remedy. Failure never justifies disabling browser security or bypassing approval review.

Both DevTools and Polypane may answer different questions; do not duplicate complete observations. Do not attach the runner to a daily-use profile or Playwright over CDP by default: existing contexts can acquire overrides and CDP is a weaker Playwright connection. The provided runner launches fresh contexts and closes only its browser.

## Authoritative setup sources

Consult installed versions/schemas first, official docs for setup only when necessary:

- [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp), [tool reference](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/tool-reference.md)
- [Polypane MCP](https://polypane.app/docs/mcp-server/)
- [Playwright connections/launch](https://playwright.dev/docs/api/class-browsertype), [screenshots](https://playwright.dev/docs/api/class-page#page-screenshot)

# Choose tools by missing evidence

Discover callable capabilities and use their actual schemas. These roles do not authorize configuring servers, installing extensions, changing trust stores or inventing calls.

| Question | Preferred capability | Boundary / fallback |
| --- | --- | --- |
| What is rendered, computed, loaded or focused? | Chrome DevTools MCP page state, screenshots, DOM/styles, accessibility, network, console and runtime as exposed | Verify target/conditions; DOM alone does not establish pixels or motion |
| How do layouts/states vary by size? | Polypane panes through Chrome DevTools MCP | Verify targets/dimensions; sequential Chrome viewport captures are an adequate fallback |
| What did the supplied archived page show? | User-supplied SingleFile | May lack fonts, assets, scripts, lazy content and backend state; do not execute supplied code blindly or infer live parity |
| What geometry/grouping/styling does a design export show? | Supplied html.to.design/Figma exports | Static support, not proof of responsive rules, semantics, source DOM or timing; live Figma tools only if relevant/available |
| Can manual measurements clarify a discrepancy? | Optional user-supplied VisBug evidence | Label original versus edited state; no requirement to install or automate it |
| What protocol detail explains an unresolved HTTP/API/WebSocket state? | DevTools first; Burp only for a documented capability gap | Authorized hosts/session and exact question only; no default interception, scanning, fuzzing or replay |
| Does a later build meet the contract repeatably? | Playwright visual and behavioral acceptance | Prepare cases now; run later with controlled fixtures. Tests cannot recover missing reference evidence |

## Polypane operating notes

Polypane exposes multiple pane targets through Chromium debugging. Treat identifiers as ephemeral; select verified URL/pane targets and exclude app internals. A screenshot is not proof of all panes and synchronized actions need state checks.

Use existing setup first. If repair is necessary, consult installed versions and current official documentation; do not hard-code MCP flags here. Establish whether Polypane or DevTools controls emulation to avoid conflicts. Polypane is a convenience, not a gate requirement.

## Escalation decision

Before adding a capability or using Burp, record:

1. Exact unresolved observation and its fidelity impact.
2. Existing tools/artifacts tried and concrete limitations.
3. Smallest additional capability and expected artifact.
4. Access/configuration, data exposure or side effects and existing authorization.
5. Stopping condition: obtain that artifact or record the remaining limitation; do not expand inspection.

Prefer existing adequate capabilities. If none is available, continue independent extraction and request only essential evidence/access. Tool absence cannot make an unknown state observed or N/A; essential unknowns remain blocking until resolved or explicitly removed from scope.

## Capability and setup sources

Consult only when needed; installed capability schemas govern actual calls.

- [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp)
- [Polypane MCP integration](https://polypane.app/docs/mcp-server/)
- [Playwright visual comparisons](https://playwright.dev/docs/test-snapshots)

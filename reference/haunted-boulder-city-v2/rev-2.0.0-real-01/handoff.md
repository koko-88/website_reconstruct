# Evidence handoff and replay

Revision HBC-V2-REAL-01/2.0.0-real-01, contract FC-HBC-V2-01. [Four gates](readiness-gates.md): integrity PASS; fidelity BLOCKED; adaptation NOT REQUIRED; asset/reuse BLOCKED. Exact reconstruction/adaptation clearance: none. This is an evidence-only handoff, not target acceptance or permission to build.

Carry the whole sealed directory, manifest and sibling verification receipt. inherited-v1 is byte-identical to all172 frozen originals; don't execute its write-capable helpers. tooling/reference-reconstruction carries maintained v2 scripts/resources with exact hashes; repository and installed skill matched. Sources/assets in public are inspection evidence only. Chrome MCP availability and root/argument limits are in observations/tool-capabilities.json.

Read-only package checks from this revision:
```text
node tooling/reference-reconstruction/scripts/package.mjs verify .
node tooling/reference-reconstruction/scripts/package.mjs verify raw-run-01
node tooling/reference-reconstruction/scripts/package.mjs verify raw-repair-01
node tooling/reference-reconstruction/scripts/package.mjs verify raw-repair-02
node tooling/reference-reconstruction/scripts/package.mjs verify raw-geometry-01
node tooling/reference-reconstruction/scripts/package.mjs verify inherited-v1 observations/v1-before.json
```

A future authorized recapture must use a new writable revision outside this sealed directory, installed Node/Playwright and compatible installed Chrome, with security sandbox enabled. Save roots and local writes are separate preflights. Reuse the carried maintained runner; selectors/actions live in plan JSON. CLI form:
```text
node tooling/reference-reconstruction/scripts/capture.mjs PLAN.json NEW_OUTPUT_DIR EXISTING_PLAYWRIGHT_MODULE_DIR
```
NEW_OUTPUT_DIR must not exist; its parent must exist. Do not append reports to a sealed raw directory. No installation, profile attachment, CDP helper, security-disable flag or tool-root reconfiguration is implied.

| Acceptance seed | Requirements / evidence | Exact reset/actions / environment | Later assertions / limits |
| --- | --- | --- | --- |
| AC2-00 | Integrity, immutable originals, all reports/gates | Verify parent/raw manifests and carried v1 baseline; read E2-013 assessments, both matrices, provenance | Unique qualified IDs, byte/link/JSON/image closure. No silent v1 gate upgrade |
| AC2-01 | R-02/03/04/06/07 fresh home | plans/capture-real-01.json; new anonymous contexts ENV2-D/M/R, navigate root, fonts/loader/images/heading geometry | Match appearance/metrics/crop after same conditions; calibrate raster tolerance, don't reuse old scrollbar pixels as new |
| AC2-02 | R-10 sections/assets | plans/capture-geometry-01.json; bounded30-step700px/6s sweep and top reset; E2-014 all10 selector rects; v1 E-070 per-section pixels | Current offsets separate from v1; full-page opacity/reveal resets are not settled appearance. If comparing a section, scroll/reveal/decode it first |
| AC2-03 | R-15/22/23 chapters/topics/facts/glitch/spirit | Inherited E-050/E-062/E-080/E-085 exact recipes; fresh normal before navigation, forward/reverse tabs/scroll, hover/rearm | Compare recorded sequences/ranges, no identical random phase. No new site helper |
| AC2-04 | R-13/21 fresh motion preference | Fresh reduce before load versus fresh normal; raw R--HOME/UFO and inherited loader frames | Reduced still/no video assignment; preserve distinct switched preference behavior, no fresh-normal equivalence inference |
| AC2-05 | R-16 FAQ1..9 | Fresh closed; scroll #plan, every summary toggle/reclose; multiple open, Enter/Space, reversal | Distinct answer content, native state/focus/animation; exception FAQ7 extra paragraph. New FAQ1 complements original all-nine |
| AC2-06 | R-14 staggered menu | plans/capture-repair-02.json; HOME then click; afterMs12000 measured from navigation start; child list/footer geometry + required rows; Escape, absent .site-nav:not([hidden]) | Confirm row/footer opacity1 and readable labels. Parent geometry alone/three early static samples insufficient |
| AC2-07 | J-01 hash/history | Current observed fragment hrefs; menu/inline navigation, back/forward, reload | Correct scroll/focus/hash; no invented pages; reset removes menu/dialog/FAQ transient state |
| AC2-08 | J-05 destinations/no host forms | Read E2-004 href/target and source topology, no external form action | Exact destinations/link attributes; external page design excluded; host form/search absence does not exclude embedded commerce |
| AC2-09 | R-19/20 current box office | plans/capture-repair-01.json and ENV2-M original plan; click reviewed CTA; loading transient then afterMs20000 from nav, current provider review, close/reopen | Must see provider text and order image where applicable; shell/iframe/status readiness doesn't prove internal fonts/media. Stop before transactions |
| AC2-10 | R-17/19 defects | Repeat inherited keyboard/close/veil recipes and current AX | Tab-escape defect remains a reference fact; remediation gets separate authorized deviation |
| AC2-11 | Preview query | Fresh /?tickets=preview only; original E-086 and equal source | Auto-open at declared600ms with actual current fixture; no generic empty/provider-success assumption |
| AC2-12 | R-27 simulated failure | Original E-081 only; future authorized controlled block/reload if needed | Distinguish simulated fallback from natural outage; no network replay |
| AC2-13 | U-01 missing selectable commerce | Needs authorized selectable reference event/test fixture; desktop/touch, availability, selection/back/cancel/empty/error/retry through pre-submit | Gate remains blocked until trustworthy real fixture states; never invent dates or complete real purchase |
| AC2-14 | R-11/12 boundaries | Retained E-040 widths759/760/761,1099/1100/1101,1799/1800/1801; original short/landscape/tablet conditions | Exact inclusive rules, wrapping/overflow; equal host source doesn't prove other engines |
| AC2-15 | Renderer/artifacts | Shared page-probe via complete supported wrapper, bounded visible decode; source-report on identified static files only | Canvas measurement/CSS SVG distinct from DOM absence; no context creation/map guessing |
| AC2-16 | U-02 reuse | Owner's per-group license/source/attribution or explicit replacement/deviation decision | Rights independent of integrity/fidelity; public bytes never authorize copying |
| AC2-17 | U-03 expanded parity | Only if actual scope expands: physical touch/zoom/AT/other engines/DPR/dark/RTL | New environment observations required before equivalence claims |

These seeds were prepared, not run as target tests. The raw capture cases were run against the reference, and package checks were executed; neither is a reconstructed-product acceptance result.

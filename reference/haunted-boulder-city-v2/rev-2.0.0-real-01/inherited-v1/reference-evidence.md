# Reference Evidence Package

## Package identity and scope

- Schema version: 1.
- Package ID: HBC-2026-10-04; revision: 1.0.0.
- Captured and assessed: 2026-10-04, Africa/Cairo (UTC+03:00). Individual artifacts retain UTC timestamps and hashes in the manifest.
- Requested phase: reference inspection, evidence collection, and completeness gate only. No reconstruction, adaptation, application scaffolding, deployment, or acceptance implementation was performed.
- Reference: [Haunted Boulder City](https://www.hauntedbouldercity.com/), live public website during this session. No archive or design export was designated.
- Scope authority: the user's request to validate reference-reconstruction against that URL and stop before implementation.
- Scope: the public single-page site, all discovered on-page sections, menu, three story chapters, eight topic rows, nine FAQs, ticket-dialog loading/postponed/reopen/closing states, source-discovered preview entry, pointer/keyboard/emulated-touch paths, responsive boundaries, and normal/reduced motion.
- Critical journeys: J-01 navigate sections and history; J-02 progress/reverse story chapters; J-03 disclose/reclose FAQs; J-04 open/read/close/reopen the box office; J-05 inspect directions and outbound destination contracts.
- Access constraints/exclusions: no purchase, reservation, payment, submission, message, account change, or login. External destination website designs are outside the supplied reference URL; their link destinations and target attributes remain inventoried. Actual transaction completion is excluded by the skill's authorized-inspection contract, not declared observed. Available-date and ticket-selection behavior remain unknown rather than excluded.
- Provisional probes: 1440x900, 1024x768, 768x1024, 390x844; additional 320/500/1280 Polypane panes, breakpoint edges, 844x390 landscape and 1440x400 short height. These sizes are probes, not invented reference breakpoints.
- Browser scope: Windows Chromium evidence: Polypane 31 / Chromium 155 and isolated HeadlessChrome 154. DPR 1, scale 1, en-US, LTR, Cairo timezone. No Safari/Firefox or physical-device parity claim.
- Operator/receiving role: Codex reference inspector / future reconstruction engineer.
- Target: this writable workspace is not a Git checkout. Stack, target content, data mappings, and implementation choices are unnecessary for this evidence-only phase and remain unspecified.
- Fidelity: preserve measured reference relationships and observable behavior. No universal pixel identity or permitted substitutions are asserted.
- Gate: **BLOCKED**. The evidence phase is delivered; implementation clearance is not granted.

## Canonical directory layout

- [reference-evidence.md](reference-evidence.md): canonical scope, contracts, uncertainties, coverage, gate.
- [observations/artifact-manifest.json](observations/artifact-manifest.json): complete file inventory, stable evidence IDs, hashes, timestamps, image dimensions, provenance and condition links.
- [observations/artifact-index.md](observations/artifact-index.md): clickable per-artifact index.
- captures/: original JPEG screenshots and timestamped frame sets. Compression is recorded; none is an implementation rendering.
- observations/: sanitized accessibility, CSSOM, geometry, font, source, runtime, network, and temporal evidence.
- helpers/: disposable inspection/capture code only. [helpers/README.md](helpers/README.md) explains replay and limits.
- No supplied/ or media/ directory: no supplied archive/export and no approved reusable asset acquisition.
- No adaptation contract or expanded implementation acceptance plan: those phases were not requested.

## Source register and precedence

| Source ID | Kind / source | Version / state | Authority | Limits |
| --- | --- | --- | --- | --- |
| S-01 | Live public root and fragments, Polypane MCP | Initial existing anonymous panes at #tickets, subsequently observed at multiple scroll positions | Live appearance, CSSOM, initial route/control/asset inventory | Existing pane history/consent before inspection is unknown; no private storage export |
| S-02 | Live public root and fragments, isolated Chrome CDP | Fresh task profile; normal and reduced preferences, documented viewport probes | Reproducible primary baselines and transitions | Headless Chrome 154 differs from Polypane Chromium 155; no cross-engine equivalence |
| S-03 | Public /styles.css and /app.js plus runtime CSSOM | Same session; byte hashes in E-071, cross-browser JavaScript equality in E-072 | Declared rules supplement observed pixels/runtime | Declarations and comments are not proof a transition happened |
| S-04 | Eventbrite embedded checkout | Public event 2000657664932, visibly postponed | Authority for the currently visible checkout state | Available dates/selection inaccessible; future inventory can change |
| S-05 | Tool documentation | [Polypane MCP](https://polypane.app/docs/mcp-server/), [CDP Emulation](https://chromedevtools.github.io/devtools-protocol/tot/Emulation/), [CDP Page](https://chromedevtools.github.io/devtools-protocol/tot/Page/), [Chrome Headless](https://developer.chrome.com/docs/automation-and-testing/headless) | Capability/setup guidance only | Not reference visual/behavioral evidence |

No incompatible source versions were merged. E-072 proves equal JavaScript bytes between S-01 and S-02, not equal browser rendering. Live S-02 settled state takes precedence over transient initial captures for settled appearance. Reduced-to-normal preference switching is a separate state, not a contradiction of a fresh normal session.

## Environment and reset recipes

| Environment ID | Browser / viewport / DPR / zoom | Input / preferences | Session / fixture / readiness | Reset / limits |
| --- | --- | --- | --- | --- |
| ENV-P | Polypane 31, Chromium 155, Windows; 500x768, 320x564 initially (565 subsequently), 1280x800; DPR 1, visual scale 1 | Pointer and accessibility inspection; light preference, no reduced motion | Existing public page at #tickets; fonts loaded; initial session state unknown | Verify each pane individually. Original scroll positions restored: 2614, 2623, 2891; do not assume pane synchronization |
| ENV-C | Isolated HeadlessChrome 154, Windows; named capture dimensions; DPR 1, scale 1 | Pointer/keyboard; en-US / LTR / Africa/Cairo; light, normal motion | Anonymous task profile, public live content, no account login or consent interaction | Navigate root; wait document complete, fonts loaded, loading class absent and loader removed; decode visible images with bounded waits; scroll to named section |
| ENV-C-T | ENV-C at 390x844, touch enabled, maxTouchPoints 1 | Trusted CDP touch input plus keyboard probes | Fresh mobile navigation for final E-070 captures; mobile video source selected independently | Mobile emulation retains desktop Chromium UA. No virtual keyboard, safe-area or physical mobile browser-chrome claim |
| ENV-C-R | ENV-C at 1440x900 and 390x844 | prefers-reduced-motion: reduce | E-041 preference changes and E-060 fresh reduced navigation | Reload for fresh preference behavior. Preference change in an existing session is recorded separately |
| ENV-C-H | ENV-C at 844x390 touch and 1440x400 pointer | Normal motion | E-041 height/landscape probes | Short-height inspection is bounded to these sizes |
| ENV-C-F | ENV-C 1440x900 | Normal motion, widget script deliberately blocked | E-081 controlled failure, not a naturally occurring service failure | Block only Eventbrite widget script, fresh navigation, open dialog, capture fallback, clear blocking rule |

Shared capture conditions: no style edits, font substitution, animation freezing, CPU/network throttling, secret export, or content replacement in baselines. Network blocking occurs only in clearly labeled E-081. Screenshots are original JPEGs (85 quality for CDP, 70/85 for individual MCP transfers). Live fog/video/spirits are not synchronized to a deterministic clock.

Readiness repairs matter: early E-030 geometry/section shots can contain active entrance/reveal animation and some pending lazy images. E-061 and E-070 are the settled checkpoints; E-064 confirms every image decoded in the final desktop/mobile sweeps. Preserve both sets. A full-page capture taken at the footer can retain scroll-dependent hero opacity and the final pinned story; use scroll logs and individual chapter/top captures to reconstruct those states.

## Artifact manifest

The [complete manifest](observations/artifact-manifest.json) and [clickable artifact index](observations/artifact-index.md) enumerate every actual file; uncreated/failed screenshot paths are not evidence. Each filename stem is its exact evidence ID. Prefixes below denote explicit evidence sets whose individual members are listed in the manifest.

| Evidence set | Relative artifacts | Conditions / state | Supports / limits |
| --- | --- | --- | --- |
| E-001 | [inventory](observations/E-001-inventory.json) | S-01, visible text, links, controls, image sources, environment | R-01 scope and content; not all behaviors |
| E-004 / E-010 | [1280 story](captures/E-004-polypane-1280-story.jpg), [1280 top](captures/E-010-top-4.jpg) | S-01 originals, verified 1280x800 | Distinctive appearance; initial existing session |
| E-005 / E-006 | [CSSOM](observations/E-005-css-runtime.json), [application source](observations/E-006-app-runtime.json) | S-03, sanitized public source; no target code | Declared rules and control logic, distinct from live observations |
| E-007 / E-008 / E-009 | [AX snapshot](observations/E-007-accessibility-desktop.json), [1280 geometry](observations/E-008-geometry-4.json), [500 geometry](observations/E-009-geometry-2.json) | S-01 computed values and semantics | Type/layout/component evidence |
| E-020 / E-021 / E-022 | Capability, Chrome session, capture summary observations | Verified surfaces and environments | Capture provenance; not appearance requirements |
| E-030-* | Four geometry/forward-reverse scroll records, top/footer/full context and section screenshots | S-02, four provisional sizes | R-02 to R-10; some initial/transitional states, superseded only for settled checkpoints |
| E-040-* | [boundary observations](observations/E-040-boundaries.json), nine edge screenshots | 759/760/761, 1099/1100/1101, 1799/1800/1801 | R-11 breakpoint evidence |
| E-041-* | [height/preferences observations](observations/E-041-preferences-height.json), top/story captures | Landscape, short height, reduced desktop/mobile | R-12, R-13; emulation limits apply |
| E-050-* / E-051-* / E-052-* | Desktop/mobile [journeys](observations/E-050-1440-journeys.json), [touch journeys](observations/E-050-390-journeys.json), menu/FAQ/chapter screenshots | Trusted inputs, times, focus, history and states | R-14 to R-18 |
| E-053-* / E-054 | Dialog loading/postponed screenshots; [sanitized network](observations/E-054-network-console.json) | Real widget load and HTTP observations | R-19/R-20; no purchasable-date evidence |
| E-055 / E-056 | [rendered fonts](observations/E-055-rendered-fonts.json), [accessibility tree](observations/E-056-accessibility.json) | Actual platform-font identities / DOM semantics | R-06/R-17; not assistive-technology testing |
| E-060-* / E-061 | [loader timeline](observations/E-060-loader-timeline.json), [settled desktop](observations/E-061-settled-desktop.json), temporal frames | Fresh normal and reduced navigation | R-21; captured times, not guessed timing |
| E-062-* / E-063-* | [motion samples](observations/E-062-distinctive-motion.json), frames | Facts/meter/spirit plus reduced-to-normal session | R-22; this preference-switch session never loaded UFO video |
| E-064 | [image and video readiness](observations/E-064-image-readiness.json) | Fresh final desktop/mobile, every image decoded | R-07; resolves earlier lazy-image failures |
| E-070-* | [per-capture conditions](observations/E-070-capture-conditions.json), settled section screenshots | Fresh desktop/mobile; named section, scroll, decoded images, ready conditions | Primary settled appearance checkpoints |
| E-071 / E-072 | [source integrity](observations/E-071-source-integrity.json), [source reconciliation](observations/E-072-source-reconciliation.json) | Hashes and cross-browser JS equality | Source version/authority |
| E-080-* | [reversal, focus and fresh UFO](observations/E-080-reversal-focus-ufo.json), UFO frames | Fresh normal; bidirectional scroll, rapid menu/FAQ, focus wrap, veil closing | R-15/R-17/R-23; confirms modal focus escape defect |
| E-081 | [induced failure](observations/E-081-simulated-widget-failure.json), fallback screenshot | Modified transport, explicitly simulated | R-20 fallback condition; not observed natural outage |
| E-085-* / E-086 | Facts timeline and source-discovered preview query observation/capture | Fresh normal facts; preview auto-open entry | R-22/R-24; static source alone was insufficient |

## Routes, components and state graph

| Route ID / URL | Family / components | States | Journey / evidence |
| --- | --- | --- | --- |
| RT-01 / | Single public landing page | Loading, settled, scroll/reveal, menu closed/open | J-01; E-001/E-030/E-060/E-070 |
| RT-02 /#home /#about | Hero / introductory facts | Hash navigation and browser history | J-01; E-050 |
| RT-03 /#stories | Three story chapters | 01 Ghosts / 02 Dark history / 03 UFOs; desktop horizontal / narrow vertical | J-02; E-030/E-040/E-052/E-080 |
| RT-04 /#zombies | Meeting venue | Directions link / photo / wordmark | J-05; E-001/E-070 |
| RT-05 /#plan | Visit planning, nine disclosures | Each closed/open; multiple answers open; interrupted close | J-03; E-050/E-051/E-080 |
| RT-06 /#local | Three local outbound rows | Default/hover/focus styling declared and visible | E-001/E-005/E-070 |
| RT-07 /#tickets | CTA and box office | Anchor landing, dialog loading, postponed iframe, close/reopen, induced fallback | J-04; E-053/E-054/E-080/E-081 |
| RT-08 /#creator | Creator portrait / television logos | Anchor section / footer return | E-001/E-070 |
| RT-09 /?tickets=preview | Same landing-page shell, source-discovered entry | Automatically opens box office after arrival | E-006/E-086; not a separate page family |

| Component ID | Anatomy / states / reuse | Responsive / content constraints | Evidence |
| --- | --- | --- | --- |
| C-01 header | Logo, ticket anchor, menu button; closed/open | 110/90px height; absolute normally, fixed in menu state | E-001/E-005/E-030/E-050 |
| C-02 menu | Four numbered links/descriptions, CTA, meeting/directions; open/closing/hidden | Full-screen scrollable scene; header participates in focus cycle | E-050/E-080 |
| C-03 hero | Scene, two title words, star, creator, summary, coordinates, explore | City nowrap; title fit measurement; image crops; independent role type scales | E-030/E-055/E-070 |
| C-04 facts | Three figures/labels; armed/decoding/resolved | Three columns also narrow; fixed glyph boxes prevent decode layout shifts | E-005/E-085 |
| C-05 stories | Three article scenes, sticky pin/track, tabs/count, video | Wide normal horizontal; narrow/reduced stacked; explicit heading line breaks | E-030/E-040/E-052/E-080 |
| C-06 topics | Eight indexed rows and selected scenery | Scroll-selected image state; mobile list layout; text is not arbitrarily truncated | E-005/E-070 |
| C-07 venue | Heading, description, directions, photo, wordmark | Distinct photo/text layout and narrow stack; role-specific heading scale | E-030/E-064/E-070 |
| C-08 FAQ | Nine details/summary and answer wrappers; each closed/open | Multiple answers remain open; height follows answer content | E-050/E-080/E-090 |
| C-09 local | Three indexed outbound rows | Title/description/arrow slots; observed wrapping, no invented card count | E-001/E-030/E-070 |
| C-10 tickets | Scene, headline, CTA, note, rating and spirit | Centered display composition; touch/full-width differences in source | E-005/E-062/E-070 |
| C-11 creator/footer | Portrait, credit, five media marks, agency credit/back | Responsive grid/logo sizing; text/brand semantic names recorded | E-001/E-030/E-064/E-070 |
| C-12 dialog | Veil/fog, panel, header, close, loading/widget/fallback, footer note | Scrollable panel; cross-origin postponed widget; no available-date fixture | E-053/E-080/E-081 |

| Transition ID | Preconditions / trigger | Outcome / URL / async | Reverse/reset / status |
| --- | --- | --- | --- |
| T-01 | Menu closed; pointer/touch menu activation | Opens full-screen menu, expanded true, first menu link focused, root menu-open | Escape restores menu-button focus; repeated activation/link closes; E-050 observed |
| T-02 | Menu open; activate The tour | Closes menu, pushes #about, smooth scroll and section focus | Back/forward restore URL/scroll; E-050 observed |
| T-03 | Desktop normal motion; story tab 0/1/2 | Scrolls to chapter positions, track 0/-one/-two viewport widths, active tab and count | 2 -> 1 tested; URL stays existing fragment; E-050/E-080 observed |
| T-04 | Narrow or reduced environment; scroll stories | Vertical article sequence, controls hidden | Scroll reverse; E-030/E-041 observed |
| T-05 | FAQ closed; trusted click/touch summary | Native open state, animated height, answer shown; other disclosures stay open | Reclick closes; rapid reversal tested; E-050/E-080 observed |
| T-06 | CTA focused/hovered | Transient spirit/flare; random motion properties | Ends automatically; reduced branch disables; E-062/E-081 plus source |
| T-07 | Primary ticket CTA; ordinary activation | Host dialog opens, close button focused, widget GET, loading status -> iframe | Escape, close button, veil, reopen observed; E-053/E-080 |
| T-08 | Widget present | Current public event displays postponed state | Available-date selection unknown U-01; no transaction attempted |
| T-09 | Controlled widget script blocking | Loading status hidden; contact fallback shown | Unblock and reload; E-081 simulated, not a natural outage |
| T-10 | Fresh /?tickets=preview entry | Same dialog auto-opens | Normal close; E-086 observed |
| T-11 | Fresh reduced -> normal preference change | Motion resumes but UFO remains unloaded in that session | Fresh normal reload restores video loading; E-062 versus E-080/E-064, observed reference defect |

## Design and layout contract

Values below distinguish declarations from computed measurements; later cascade overrides matter. Full component values remain in geometry artifacts.

| Requirement | Value / measurement / scope | Relationship / evidence | Status / confidence |
| --- | --- | --- | --- |
| R-01 content topology | 1 landing shell; hero, marquee, intro/facts, 3 stories, 8 topics, venue, 9 FAQs, 3 local links, tickets, creator/footer | E-001/E-007/E-070 | Observed inventory; no invented pages or content counts |
| R-02 palette | Declared ink #090f0e, accent #b9cbb7, paper #e7e9d8, muted #a7b3a7, line #35463d, amber #d9b47b, mist #c4d1c0, surface #192a23 | E-005 plus computed E-008/E-030 | Observed declarations; component overrides are retained |
| R-03 gutters | Declared pad clamp(24px,4.6vw,88px); <=760px fixed 24px. Computed 1440 probe: 65.55px; 390: 24px | Desktop screenshot includes 15px scrollbar: innerWidth 1440, layout content 1425. E-030/E-040 | Observed; distinguish CSS unit/layout viewport from screenshot width |
| R-04 hero/header | Hero declared 100svh with desktop min 850px / max 1400px; mobile min 730px / max 1050px. Computed 1440x900 hero 900px, 390x844 hero 844px. Header absolute 110px desktop, 90px narrow, fixed only when menu open | Header scrolls away; E-030 scroll logs and E-005/E-050 | Observed, not an assumed sticky header |
| R-05 layer/effect system | Photographic scenes, dark scrims, drifting cloud texture, grain, masked fog, outlined numerals, tilted marquee, pointer flashlight, spirit/glitch layers | E-005/E-062/E-070/E-080; inspect pseudo-elements/declarations alongside pixels | Observed/source-supported; no generic gradient substitution |
| R-08 facts/grid | Three columns persist even narrow; figure/label layout changes within cells. At 1440: three ~431.3px tracks; at 390: 110.4/119.7/111.9px | E-030; source and computed samples show content constraints | Observed; do not assume every mobile grid stacks |
| R-09 stories | Declared 340svh scroll section, 100svh sticky pin (min 650px), flex track and 100% panels above 760 under normal motion | E-005/E-030/E-040/E-080 | Observed source + runtime; full-page screenshot alone is insufficient |
| R-10 section geometry | Distinct intro image/text, topic-list/scenery, venue, FAQ, local rows, centered tickets, portrait/logos and small footer; geometry is content-driven | E-008/E-030/E-070 are raw measured rectangles, grids, gaps and padding | Observed per environment; do not normalize everything to one card/grid layout |

### Typography

| Requirement / role | Declared family / actual font / source | Weight / computed sizes | Wrapping / evidence / limits |
| --- | --- | --- | --- |
| R-06a HAUNTED | Manticore -> actual Manticore; /assets/manticore.woff2 | 400; 207px at 1440, 81.9px at 390; line-height 194.58 / 85.995px; tracking -0.035em | Final paper color overrides earlier amber declaration. Source canvas measurement can shrink to fit. E-005/E-030/E-055 |
| R-06b BOULDER CITY | Display alias -> actual Anton / Anton-Regular; /assets/display.ttf | 400; final desktop clamp(90px,16.3vw,179px), narrow 17.2vw; computed 179px / 67.08px; line-height .92 | nowrap, narrow -0.02em tracking, final accent color. E-005/E-030/E-055 |
| R-06c display headings | Display -> Anton | Intro 123.975px desktop / 41.73px narrow; story 121.125px / 52.65px; tickets 185.25px / 76.05px in recorded probes | Explicit line breaks, varying role formulas; do not impose one global heading size. E-030/E-070 |
| R-06d labels | SpaceMono -> actual Space Mono / SpaceMono-Regular; /assets/space-mono-400.woff2 | 400; representative kicker 12px, 1.5 line-height, .11em tracking; menu has its own cascade | Uppercase/numbered labels; E-005/E-055 |
| R-06e body/FAQ | Arial, Helvetica, sans-serif -> actual ArialMT | Regular body; bold button text; representative base 16px and FAQ summary 17px desktop/16px narrow declared | Real Arial observed, not identified from pixels. E-005/E-055; no broad script/glyph coverage claimed |

All custom fonts were loaded during measured final captures. Font-file reuse/license is unresolved U-02; identifying a family does not authorize acquisition.

### Assets

| Requirement / asset | Public source / variants | Size / selected-source behavior | Semantics / acquisition |
| --- | --- | --- | --- |
| R-07a hero | /assets/haunted-downtown-boulder-city.webp | 1280x720 observed; cover scene; viewport crops and parallax documented in geometry | Descriptive alt; evidence-only visibility, no reuse permission |
| R-07b intro | /assets/boulder-dam-hotel.webp and responsive -960 variant | Variant currentSrc, srcset, natural/rendered sizes in E-030/E-064 | Descriptive alt, photo-window crop |
| R-07c story scenes | /assets/boulder-city-haunted-walk-tour.webp, boulder-city-shop.webp, ufo-night.webp | Ghost 1280x852, history 1280x720, UFO still 1672x941 initially observed; object-position varies by chapter/width | Descriptive images beneath overlays; selected sources in E-064 |
| R-07d UFO motion | /assets/ufo-night.mp4 and /assets/ufo-night-960.mp4 | Fresh desktop/mobile independently select sources; both duration 8.041667s, readyState 4; scroll seeks to duration minus .05s | Motion layer over still, reduced uses still; E-064/E-080 |
| R-07e topics | hoover-dam, ghost-dog, dam-workers, first-murderer, strange-celebs, flying-saucer, buried-bodies, esp-gambling .webp files | Complete per-image inventory and dimensions in E-001/E-030/E-064 | Scroll-selected scenery; no inferred ownership |
| R-07f venue/CTA | beer-zombies-boulder-city.webp / -960 variant; boulder-city-inn.webp; bz-logo.svg | SVG intrinsic 300x148 initially; selected image/currentSrc and crop recorded | Logo/site brand meaningful alt; photo usage recorded |
| R-07g creator/proof/footer | joshua-p-warren-960.webp; ghost-adventures.png, travel-channel.png, history-current.svg, discovery-channel.svg, national-geographic-channel.svg, artisan-icon.jpg | Raw natural/rendered dimensions in geometry and final decode evidence | Branded media/proof images and actual alt strings retained |
| R-07h fog/noise/icons/type | CSS textures/SVG icon markup and three public font paths | E-005/E-006 capture declared imagery and icon anatomy; E-055 rendered-font verification | No approved reusable media or substitution decision; U-02 blocks asset/type gate |

Asset registry is expanded in the raw inventory/geometry, not guessed from filenames. E-064 resolves early zero natural dimensions after proper visible/lazy readiness. No private or signed media URL is stored.

## Responsive contract

| Requirement | Boundary / rule | Below / at / above / additional evidence | Result / confidence |
| --- | --- | --- | --- |
| R-11a | max-width 760px; complementary min-width 761px | E-040 759,760,761 plus E-030 four-size matrix | 759/760 track block, pin relative, controls none; 761 flex/sticky/controls flex. Confirmed exact inclusive boundary |
| R-11b | max-width 1100px | E-040 1099,1100,1101; E-005 rules | Secondary layout/type/gap changes, including creator arrangement; story mode remains desktop. Not a new mobile-navigation threshold |
| R-11c | min-width 1800px | E-040 1799,1800,1801; E-005 rules | Large-width padding/title/content adjustments; story mode unchanged |
| R-12 | Height / landscape | E-041 844x390 touch, 1440x400 pointer; top/story frames | Width still selects story mode; min-height may exceed visible height. No universal fit-to-screen claim |
| R-13 | Reduced motion | E-041 desktop/mobile and E-060 fresh reduced | Vertical stories even desktop, controls hidden, no running animation in the preference-change sample; loader quickly removed on fresh reduced entry |
| R-11d | Fluid typography/gutters and container geometry | E-030 computed rectangles, E-005 final cascade, E-070 | CSS viewport formulas plus content-fit logic; no discovered container-query breakpoint in captured stylesheet |
| R-11e | Overflow / input differences | E-040 records scrollWidth == clientWidth at all edge probes; E-030 scroll sweep; touch source variants E-064 | No horizontal document overflow observed at edge samples; physical touch/200% browser zoom untested, U-03 |

768px portrait remains above the 760px width breakpoint and uses desktop stories. It is not evidence that every tablet switches to mobile layout. No browser/container breakpoint is inferred from a common device label.

## Behavior and accessibility contract

| Requirement | Observable contract | Evidence / defect / limits |
| --- | --- | --- |
| R-14 menu/navigation | Menu button expanded state and text change; first indexed link receives focus; fixed header/menu and root scroll lock; Escape returns focus; hash navigation and history retained | E-007/E-050/E-080. Keyboard wrap includes visible header controls and menu links, not just four menu links |
| R-15 chapters | Buttons named Ghosts/Dark history/UFOs; active class/count mirror scroll; trusted click moves to chapter and reverse is supported; no new hash on tab click | E-050/E-052/E-080; narrow/reduced controls absent |
| R-16 FAQs | Nine native details/summary controls, independent open states; multiple answers remain open; repeated/reversed activation animates close | E-007/E-050/E-051/E-080/E-090. Native FAQ Enter opens and Space closes in E-090; focus-visible styling is recorded. Content/answer strings in E-008/E-030; no form validation feature in host page |
| R-17 focus/semantics | Skip link, banner/main/regions/headings/footer; explicit image names and dialog label; 2px accent focus-visible outline with 7px offset declared | E-005/E-007/E-055/E-056 and trusted keyboard logs. DOM/AX inspection, not screen-reader testing |
| R-18 outbound actions | Directions points to public Google Maps destination at Beer Zombies, 567 Nevada Way; three local websites, Tripadvisor review and agency credit inventoried | E-001 href/target attributes. Destination designs and real contact/submission flows not inspected |
| R-19 box office | role dialog, aria-modal true, heading label, close button focus on open; root modal-open; Escape/button/veil restore CTA focus; iframe retained on reopen | E-050/E-053/E-080. **D-01 reference defect:** repeated Tab escapes dialog to body, skip link, brand and background controls while dialog remains open. Do not claim a working focus trap from source code |
| R-20 loading/failure | Widget load status has role=status; successful embed hides host loading status; widget unavailable branch shows contact fallback | E-053/E-054 real postponed embed, E-081 induced failure only. Ticket availability/payment validation/success unknown U-01 |

D-01 is an observed reference defect, not corrected target behavior. No target accessibility deviation was approved or implemented. D-02: fresh reduced-to-normal switching does not initialize/load the UFO clip in that inspected session; a fresh normal load does. Keep this distinction in reproduction/acceptance rather than blending the states.

## Motion contract

| Requirement / motion | Trigger / sequence / timing | Temporal/source evidence | Reduced / interruption / confidence |
| --- | --- | --- | --- |
| R-21 loader/hero | Fresh load; source floor 1600ms, ceiling 3600ms, root loading released ~260ms into parting, loader removed ~1500ms later. Observed normal frames: loading at perf ~376/995ms, parting at ~1904/2912ms, gone by ~4123ms | E-006 source; E-060 timestamped frames; hero-in 1500ms and other entrance timing in runtime | Reduced fresh loader absent by ~814ms in sampled session; observed brackets are not invented exact transition times |
| R-22a ambient | Star 24s linear loop; marquee runtime 35s loop; fog runtime layers 40/56/70s with delays/direction; offscreen fog pauses through visibility/intersection logic | E-005/E-006/E-008/E-062/E-081 and frames | No deterministic random/fog phase promised. Reduced sample has no running animations |
| R-22b facts | Scroll-entry decode of fixed-width glyph boxes, numbers then labels, stagger; rearm after leaving viewport | E-006 plus E-085 fresh normal frames/DOM | Source declares 150ms fact staggering; source timings do not alone prove every random glyph path |
| R-22c word/photo/topic motion | Scroll-linked hero parallax/title fade, selected topic imagery, drifting photos, venue mark rotation | E-030 forward/reverse logs, E-005/E-006/E-070 | Reduced removes scene motion; sampling preserves distinct input/preference states |
| R-22d glitch | Ghost Meter selection/pointer entry; glitch class/window, jitter and split | E-006 source window 800ms and cooldown, E-062 samples/frames | Disabled reduced; exact scanline/fog phase is variable |
| R-22e spirit | CTA hover/focus or ambient/touch entry; random side/path/duration. Source bright base 2800ms, faint 4600ms, +/-15%; ambient gap 20-45s | E-006/E-062/E-081 runtime observed ~2453ms flight in one sample | Disabled reduced; retain distribution/range, not one path as universal |
| R-23 UFO/chapter | Scroll-driven track uses holds plus smoothstep; scene layers counter-travel; fresh normal UFO time increases and reverses with scroll | E-080 phases .65/.8/1 -> video ~.888/2.796/5.340s; reverse returns ~2.796 then 0. E-064 actual duration and variants | Fresh reduced uses still. E-062 no-video result is D-02 preference-switch behavior |
| R-24 interaction motion | Menu transitions/600ms delayed hide; dialog ~500ms delayed hide; FAQ source open 620ms/close 420ms and opacity choreography; smooth-scroll duration clamped 900-2000ms | E-005/E-006, E-050 timed state logs, E-080 rapid menu and FAQ reversal | Reduced bypasses these motion branches; observed timestamps and raw keyframes retained |

## Runtime/data contract

| Requirement | Sanitized transport / data | Visible effect / persistence | Evidence / limits |
| --- | --- | --- | --- |
| R-25 public site | Static host document/CSS/JS/media; no host application form/search/pagination/API model observed | Fonts/media and scrolling govern appearance | E-001/E-005/E-006/E-054/E-064/E-071 |
| R-26 checkout | GET Eventbrite widget script, then GET /checkout-external with query-key names eid/parent/theme; 200 responses captured; no headers/cookies/body values exported | Host loading -> embedded postponed event; iframe retained on reopening, fresh navigation resets mount | E-054 correlated to E-050/E-053. Event ID is public, not a credential |
| R-27 fallback | Source script rejection or 10s watchdog without iframe triggers fallback; controlled script block confirms contact branch | Status hidden/fallback shown; retry via fresh reload after unblocking | E-006/E-081; simulation clearly labeled |
| R-28 history/state | On-page history/scroll changes and section focus; no FAQ URL/persistence contract observed beyond runtime document state | Back/forward tested; fresh reload resets transient menu/dialog/disclosures | E-050/E-060/E-086; no private storage export |
| R-29 missing commerce | Available dates, selectable tickets, empty inventory/error/retry inside embedded commerce, order success | Unknown, not fabricated or inferred from generic Eventbrite behavior | U-01 blocks clearance; no transaction performed |

Keyboard evidence: [E-090 FAQ keyboard and focus](observations/E-090-faq-keyboard.json) supplements the input/state rows.

## Tool decisions and escalation

| Gap | Capability tried / limitation | Chosen action / outcome |
| --- | --- | --- |
| G-01 live surfaces | Chrome DevTools MCP and Polypane DevTools MCP list verified actual reference pages | Used both; no app-internal DOM inspection, no invented tools |
| G-02 artifact saves | MCP filePath rejects repo and alternate permitted visualization roots | Preserved returned artifacts using ordinary authorized local file writes; no permission/trust configuration altered |
| G-03 readiness | Unbounded all-image decode awaited lazy images and stalled initial Chrome MCP; orchestrator waits terminated | Polypane continued; later bounded visible-image readiness, complete scroll/decode E-064/E-070. Do not repeat the unbounded recipe |
| G-04 emulation | Polypane MCP lacks emulation; direct Polypane metrics were reset by its viewport manager and screenshot calls timed out | Consulted official docs; did not install/alter MCP. Isolated Chrome provided sequential probes; failed attempts are limitations, not passing evidence |
| G-05 isolated Chrome startup | Shell-sandbox GPU process failure | Automatic approval allowed hidden isolated Chrome outside shell sandbox, scoped task profile; no security flags disabled |
| G-06 omitted script | One attempted stored function was unavailable after terminated orchestration; automatic review rejected the resulting call with no inspectable function | Explicit read-only function supplied and observed; no approval bypass. No blocked action remains from this rejection |
| G-07 large file transfers | Windows command-length/smart-quote/PTY transport limits | Local stdin writer and small safe writes, then direct CDP screenshot files; actual files validated. Helpers are capture infrastructure, not a target app |
| G-08 missing commerce | Public event is postponed | Preserve current state; record U-01, not a generic fabricated booking flow |
| G-09 other capabilities | No evidence gap requires Burp, VisBug, Figma, SingleFile acquisition or extra plugin | None installed/used; no Playwright reconstruction tests run |

## Uncertainty and conflict register

| Issue | Classification / impact | Evidence / resolving action | Disposition / responsible role |
| --- | --- | --- | --- |
| U-01 available-date/ticket journey | Unknown; **High**, changes core booking UI/states/data | E-053 postponed event. Smallest resolution: authorized public/test event with selectable dates/tickets; capture desktop/mobile read-only availability/selection/back/retry through the pre-submission boundary | Pending suitable reference fixture/source; reference owner and capture operator. R-19/R-20/R-29, AC-06 |
| U-02 reuse/acquisition | Unknown; **High**, distinctive imagery and type metrics cannot be silently replaced | E-001/E-055/E-064 identify sources, not licenses. Smallest resolution: documented permission/license for fonts/photos/logo/video/textures, or explicit authorized replacements/deviation contract | Pending rights/source decision before construction; owner. R-06/R-07, AC-01 |
| U-03 device/zoom/AT parity | Unknown; Low within stated Chromium-emulation scope, potentially material if scope broadens | No physical device, browser zoom/text enlargement, other engine or actual assistive technology was tested | Bounded: no claim beyond recorded environments; require AC-08 before expanded scope. Future acceptance engineer |
| U-04 variable motion/live data | Observed variability; Low | Fog/glyph/random spirit phase and Eventbrite status vary; source ranges and timestamps retained | Bounded: preserve distributions/timing relationships, compare geometry/type separately; AC-04/AC-06. Future acceptance engineer |
| U-05 source differences | Resolved | E-072 identical app JS bytes; Chrome/Polypane version and preference-state differences remain explicit | No material source-authority conflict; do not merge environment states |
| U-06 early image/capture readiness | Resolved for final checkpoints | E-030 initial zero natural sizes/transient geometry; E-064 all final images decoded and E-070 settled scene conditions | Retain earlier captures as transient evidence, use final checkpoints for settled acceptance |
| D-01 modal focus escape | Observed reference defect; not uncertainty | E-080 Tab sequence escapes into background while modal remains open | Preserve finding; any future correction must be separately recorded as a deviation; AC-07 |
| D-02 preference-switch video | Observed reference defect/state distinction | E-062 reduced->normal no clip; E-080 fresh normal scrubs; E-064 independent desktop/mobile video sources | Preserve distinct reset recipes; AC-04 |

## Coverage matrix

| Coverage ID | Scope / environment | Dimension / obligation | Evidence | Disposition / reason | Replay |
| --- | --- | --- | --- | --- | --- |
| CV-01 | Root, fragments, preview, outbound inventory | Scope/version/authority | E-001/E-007/E-071/E-072/E-086 | Complete | AC-00 |
| CV-02 | All artifacts / stated environments | Originals, metadata, readiness/reset | Manifest, E-020/E-021/E-064/E-070 | Complete for final checkpoints; early states labeled | AC-01 |
| CV-03 | All page sections; desktop/mobile + tablet context | Appearance, geometry, effects | E-008/E-030/E-055/E-061/E-070 | Complete for observed current landing state | AC-01 |
| CV-04 | 759/760/761, 1099/1100/1101, 1799/1800/1801 | Responsive boundary rules | E-005/E-040 | Complete | AC-02 |
| CV-05 | Provisional 4 sizes, short/landscape/touch | Fluid/height/overflow/input | E-030/E-041/E-050/E-064 | Complete within emulation scope; U-03 retained | AC-02/AC-08 |
| CV-06 | Menu open/close/link/history/reverse; desktop/touch | Behavior + focus | E-050/E-080 | Complete | AC-03 |
| CV-07 | Three story states/scroll/reverse; narrow/reduced | Behavior + responsive motion | E-030/E-041/E-050/E-080 | Complete | AC-04 |
| CV-08 | All nine FAQs; closed/open/multiple/reversal | Disclosure behavior/semantics | E-007/E-050/E-051/E-080/E-090 | Complete | AC-05 |
| CV-09 | Loading/postponed dialog; close/reopen/veil | Runtime, focus, current visible checkout | E-053/E-054/E-080 | Complete for current postponed state; D-01 recorded | AC-06/AC-07 |
| CV-10 | Available-date/ticket selection/pre-submit journey | Core commerce behavior/data | E-053 establishes inaccessible state | **Incomplete**, U-01; unknown cannot become N/A | AC-06 |
| CV-11 | Widget failure | Failure visibility/runtime | E-006/E-081 | Complete for labeled induced branch; no natural outage claim | AC-06 |
| CV-12 | Normal/reduced load, fog, facts, glitch, spirit, UFO, reversal | Temporal motion | E-060/E-062/E-064/E-080/E-085 | Complete for recorded triggers/ranges; variable detail U-04 | AC-04 |
| CV-13 | Host semantics, focus-visible, menu, disclosures, dialog | Accessibility relevant behavior | E-005/E-007/E-056/E-050/E-080 | Complete as reference observations, including defect; not certification | AC-07 |
| CV-14 | All distinctive assets/custom fonts | Identify variants/rendered type + viable authorized reuse | E-001/E-055/E-064 | **Incomplete**, U-02 acquisition/rights decision absent | AC-01 |
| CV-15 | Host forms/search/list backend states | Validation/empty/pagination | E-001/E-007/E-006 | N/A for host: none inspected; embedded commerce remains CV-10 | AC-00 |
| CV-16 | Real transaction/account/write outcomes | Purchase/submission success | Scope/access contract | Excluded, never executed or claimed equivalent | AC-06 boundary |
| CV-17 | Source reconciliation/high uncertainty | No critical/high unknowns | U-01/U-02 register | **Incomplete**, two high issues remain | Gate reopen |
| CV-18 | Versioned contract/evidence/replay/acceptance seeds | Handoff | This package, manifest, helpers, verification record | Complete for evidence handoff; does not clear implementation | AC-00 |

Equivalence-based sampling: all sections share the single route shell; repeated FAQ anatomy is source-proven and every one of nine disclosures was activated. Every story chapter and reverse transition was observed. Desktop/mobile get final per-section captures; tablet probes get geometry/full-scroll/full context rather than a redundant state Cartesian product. None of this substitutes for the missing commerce states or reuse decision.

## Acceptance seeds

These are future reconstruction acceptance requirements, **not executed tests and not passing implementation results**.

| Case | Requirements / environment | Reset / ordered actions | Assertions / tolerance policy |
| --- | --- | --- | --- |
| AC-00 | R-01, scope/handoff | Open package/index; verify hashes; inventory every route/control before building | No missing references or silent scope reduction; exact source/version recorded |
| AC-01 | R-02 to R-10; desktop/mobile plus tablet | Match browser/viewport/DPR/scrollbar/fonts/locale; settle loader and visible images; capture named E-070 scenes | Match geometry, wrapping, crop and layer order. Calibrate cross-OS rasterization before setting numeric image tolerance; no invented universal threshold |
| AC-02 | R-11/R-12; boundary matrix | Probe each b-1/b/b+1; portrait, landscape and short height; measure client/scroll width | Match inclusive media rules, preserve narrow vertical / wide pinned behavior; no accidental horizontal document overflow |
| AC-03 | R-14; pointer/keyboard/touch | Open menu, walk full focus order, reverse activation, Escape, navigate each section and back/forward | Match expansion/focus/scroll/URL/history behavior and captured layout |
| AC-04 | R-13/R-21 to R-24 | Fresh normal and fresh reduced loads; scroll facts/story/topics both directions; hover meter/CTA; test interruption and preference changes | Compare recorded event sequences, source timing/ranges and measured video seeks. Variable fog/spirit/glyph phase may vary without masking typography/layout |
| AC-05 | R-16 | Open all nine disclosures, preserve multiple opens, keyboard Enter/Space, close and interrupt animation | Match content, semantics, expansion/collapse and captured heights; verify keyboard activation separately |
| AC-06 | R-19/R-20/R-26/R-29 | Current postponed fixture; open/close/reopen; induced blocked widget; later authorized available-date fixture | Assert real loading/postponed/fallback distinctions. Do not invent dates, success or order flow; stop before real submission/payment |
| AC-07 | R-17/R-19, D-01 | Follow captured focus order, dialog Escape/veil, repeat Tab; inspect AX | Report reference focus defect; any correction gets explicit deviation entry, not rewritten reference evidence |
| AC-08 | U-03 expanded scope | Only after expanding scope: physical touch browser, 200% zoom/text enlargement, additional engines/AT | No equivalence claim until independently observed/accepted |

## Pre-implementation gate record

- Decision: **BLOCKED**.
- Assessed revision: HBC-2026-10-04 / 1.0.0, 2026-10-04 Africa/Cairo, Codex reference inspector.
- Exact clearance: **none**. Public landing-page evidence is substantially inspected and specified; no independently requested implementation scope was cleared.
- Coverage review: CV-10, CV-14 and CV-17 are Incomplete. All other mandatory scoped dimensions are supported or explicitly bounded/justified as in the matrix.
- Critical issues: none. High-impact issues: **U-01** unavailable purchasable-date/ticket states; **U-02** authorized asset/font acquisition or replacement decision.
- Retained low issues: U-03 limited browser/device/zoom/AT scope; U-04 live stochastic motion/data. Bounded rules and acceptance cases are provided.
- Source conflicts: no unresolved version/authority conflict; E-072 verifies equal JavaScript. Different browser/preference states remain separate.
- Acquisition/substitutions: none approved or performed; public paths and actual font identities do not confer rights.
- Handoff integrity: manifest/index, source hashes, raw evidence, condition records, state contracts and replay helpers retained. File/hash/JSON/image/link checks are recorded in [package verification](observations/package-verification.json).
- Smallest next resolving work: obtain an authorized reference event/fixture exposing selectable dates/tickets; capture read-only desktop/mobile states through selection/back/error/retry. Obtain reuse/license documentation or an explicit substitution/deviation contract for distinctive media/fonts.
- User input needed to complete this evidence request: none. The requested inspection and gate assessment can finish with a blocked gate. The above decisions are needed before future reconstruction can be cleared.
- Authorized exclusions: real external writes/transactions/accounts, outside-site page designs, implementation and adaptation. No silent waiver of inaccessible commerce behavior or asset authorization.
- Reopen triggers: live source/status/assets/fonts change, broader route/browser/device scope, newly resolved availability/reuse decisions, evidence corrections, or a discovered material responsive/motion rule.
- Receiving role: reference inspector first for high-issue resolution, then reconstruction engineer only after reassessment.

## Revision record

| Revision | Changes | Reason / gate effect |
| --- | --- | --- |
| 1.0.0 | Initial canonical live package; original Polypane/MCP evidence, isolated Chrome baselines, edge/state/temporal captures, repaired readiness, source reconciliation | Freeze evidence-only work; BLOCKED for U-01/U-02. No implementation baseline or acceptance result exists |

## Skill validation outcome

The requested skill workflow was exercised through source/scope inventory, reproducible conditions, full-scroll context, computed design/type/assets, responsive edges, input/state/temporal/runtime inspection, conflict reconciliation and an obligation-based gate. The gate correctly remains blocked despite extensive screenshots. This validates execution of the evidence workflow on a real site; it does not validate a reconstructed product. Capture limitations exposed during the run are documented in G-01 through G-07, with concrete recoveries and final usable artifacts. The reusable skill itself was not edited.

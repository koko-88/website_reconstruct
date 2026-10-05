# Observable Interface Contract: Home and Entry

Applies only to [spec.md](../spec.md), FR-001..018. This application exposes a document/interaction interface rather than an HTTP API. Internal class names may differ from inspection source; assertions bind roles and stable locally authored `data-*` state hooks to evidence IDs. Hooks disclose state and timestamps without driving behavior. [Data model](../data-model.md) defines fields; [verification](verification.md) defines checks and tolerances.

## Document and controls

Root `/` is a new document/top entry with the menu closed. Static DOM contains one named principal h1 associated with home, two ordered lines HAUNTED and BOULDER CITY, the attribution and two observed introductory sentences. Use [HTML home locator](../../../implementation-scope/pre-build-packet/evidence-index.md) for exact strings and meaningful hero alt; do not transplant markup or source paths.

| Reading/focus order | Interface |
| --- | --- |
| 1 | Skip to content link, href `#about`, revealed by focus |
| 2 | Brand link href `/`, accessible name `Beer Zombies, Haunted Boulder City home`, image alt `Beer Zombies` |
| 3 | `Get tickets` link href `#tickets` |
| 4 | `Menu` button, `aria-expanded=false`, controls an existing hidden navigation element |
| 5 | Attribution link href `#creator`, observed attribution name/copy |
| 6 | Explore link href `#about`, accessible name `Explore the tour` |

Decorative fog/light/noise/coordinates/marks/progress/dots are aria-hidden and non-focusable with `pointer-events:none`. Loader has polite status and the single readable phrase `Gathering the mist`; ornamental title/progress is not separately announced and never claims measured network percentage. No focus is moved to the loader or to removed content. Focus indicators remain visible over the actual photograph/scrim, with any corrective deviation explicitly recorded.

Menu open behavior, fragment activation downstream and ticket/attribution journeys are deferred. Preserve destinations and closed semantics without implementing substitutes, redirecting to fake sections, or claiming downstream operation. The slice can contain the hidden empty navigation target solely for the closed relationship; it must not introduce new keyboard stops. No fabricated `#about/#creator/#tickets` destination section is added for acceptance. Brand keyboard activation is the accepted action and starts a new entry.

## Entry and timing

Timing declarations are S requirements, not exact inferred observation timestamps. All values below are required; real-time scheduling tolerance comes from the locked calibration profile, while pure clock tests assert exact scheduling.

| Signal/relationship | Normal | Fresh reduced |
| --- | --- | --- |
| Dismiss readiness branch | page load + font settlement +1600ms from navigation | bypass normal dwell/parting |
| Competing ceiling |3600ms from entry setup | not used to hold content |
| Hero release |dismiss+260ms |immediate |
| Loader removal |dismiss+1500ms |dismiss+50ms |
| Title condensation |1700ms, city delay180ms; cubic-bezier(.2,.7,.2,1) |absent |
| Loader title exit / veil / fog part |700ms /1100ms with300ms delay /1150ms cubic-bezier(.45,0,.2,1) |absent |
| Hero title / attribution-bottom entrance |1500ms /1400ms with200ms delay; held until release |readable stationary baseline |
| Progress |decorative2800ms toward.86, no network percentage |no running loop |

Normal transition preserves loading -> parting/hero overlap -> fully ready. Readiness and ceiling race once; canceled/stale callbacks do not replay entry. The source's E-060 observed samples only bracket phases (loading~376/995, parting~1904/2912, absent~4123ms); tests must not replace setup/navigation clocks with those timestamps.

Unscripted home remains readable with no loader coverage. Independently activated bootstrap without main initialization clears loading/entrance coverage by its7000ms guard; late module arrival adopts the state. Reduced or capability changes cancel prohibited current movement without inventing a fresh visit. Runtime telemetry names navigation/setup/dismiss/release/remove/failsafe and includes reasons/generation; tests also independently inspect actual DOM/styles so telemetry cannot falsely certify the UI.

## Ready geometry and appearance

Case IDs HOME-D-READY, HOME-M-READY, HOME-R-READY reference canonical named raw PNG/JSON pairs qualified by E2-013. Required ready predicates are defined in the spec and verification contract. Layout uses current measures and final source rules:

- viewport1440 with stable gutter yields1425 desktop flow, viewport-relative gutter~66.24; mobile flow390 and24px gutter;
- header110px desktop/90px narrow; role-specific logo/action spacing from final cascade;
- desktop min-height max(850px,100svh), narrow max(760px,100svh), content can grow without old maximums;
- inclusive760/1100/1800 rules; title star/coordinates have their evidenced visibility branches;
- paper HAUNTED, accent city, mono attribution/coordinates, system-body intro/control hierarchy;
- two lines and shrink-only fit after fonts/container changes, ascenders unclipped; explicitly verify long/narrow line boxes rather than hiding overflow;
- town cover crop center/60% desktop,50%/50% narrow and documented overscan; scrim/fog/grain/marks maintain distinct depth and no input interception.

No generic gradient, screenshot-as-background, arbitrary font replacement, fixed page width, universal overflow-hidden rule or omission of required content can satisfy the interface. Short viewport can scroll; do not force-fit all content into400px height. A seam visible at the lower HOME edge is inert comparison context only, not acceptance of marquee/next section.

## Motion and capability branches

Fine-pointer normal photograph displacement y*.25, scale1+y*.00008; title displacement y*.10, opacity clamp(1-y/heroHeight). Evaluate during bounded scroll and reverse to zero using measured hero height. Coarse/no-hover never inherits these formulas. Supported touch view-timeline exits toward22svh; unsupported support retains the still photo. Reduced clears dynamic transforms and loops.

Light has normal default75vw/45vh, then primary non-touch bounded tracking with fixed layer role/no input interception and declared fade. Leave/blur/hidden hide tracking; touch or capability/preference change clears tracking/coordinates and queued frame work. Narrow fine and wide coarse test layout/effect independence. Normal desktop fog clocks40/56/70s and title mark24s remain independently phased; loader mark7s; narrow fog44/60s and its hidden third bank/density differ. Reduced fog is static with documented.26 treatment, hidden third/crossing banks, and no rotating mark/light/arrow drift/entry loop. Hidden-document fog pause is tested as native visibility behavior; synthetic event injection is only a unit check.

For the standalone slice, bounded scroll tests supply the explicitly labeled neutral test continuation described in the verification contract. It is added after the unmodified ready capture and removed before the final top comparison; it has no content, controls or destination IDs and is never shipped. Assert native scroll/timeline movement rather than injecting transforms. This does not accept any later-section journey.

Motion range/character and timing relationship are the contract, not exact random/ambient frame identity. Compare more than one phase plus the endpoint. Full-page geometry pixels and a timer expiry cannot substitute for appearance.

# Environment Matrix

ENV-HBC-V2-01, 2026-10-04 Africa/Cairo. Planned and actually inspected states are separated. CSS viewport uses innerWidth/innerHeight; clientWidth/scrollbar/visual scale remain distinct. Browser zoom is unknown everywhere unless explicitly recorded; visualViewport.scale=1 is not browser zoom proof.

| ID / status | Browser / OS / headless | CSS viewport / DPR / client | Input / orientation | Locale / timezone / direction | Preferences | Session / fixture / reset and readiness | Limits / evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ENV2-CDT / planned, unavailable | Chrome DevTools MCP configured profile; version/target unknown | Unknown | Unknown | Unknown | Unknown | list_pages failed before reference enumeration: profile already running; process inspection denied | No Chrome MCP page inspected; no process/profile/server changes. tool-capabilities.json |
| ENV2-P500 / inspected | Polypane 31.0.0, Chromium 155.0.0.0 UA, Win32, headed pane | 500x768, DPR1, client500, no scrollbar | Pointer, touch0, portrait | en-US, Africa/Cairo, LTR | Light, normal | Existing anonymous pane #tickets, scroll8400 at initial probe; prior session/consent/storage unknown; document complete/fonts loaded/visible image decode ok | E2-001; not a fresh-device fixture |
| ENV2-P320 / inspected | Same Polypane version/OS | 320x565, DPR1, client305, scrollbar15 | Pointer, touch0, portrait | Same | Light, normal | Existing #tickets, scroll8511; prior state unknown; video readyState0 | E2-002; differs from other panes, so no synchronized-equivalence claim |
| ENV2-P1280 / inspected | Same Polypane version/OS | 1280x800, DPR1, client1265, scrollbar15 | Pointer, touch0, landscape | Same | Light, normal | Existing #tickets, initial scroll9291; later reversible dialog open, wait<=15s for postponed text, AX/probe, Escape; loading/settled distinct | E2-003/E2-007/E2-008; no emulation overrides applied to panes |
| ENV2-D / inspected | Chrome 154.0.8037.58, Windows 10 Pro 10.0.19045 x64, headless; Playwright1.62.1 | 1440x900, DPR1, client1425, layout scrollbar15, visual scale1 | Pointer/keyboard, touch0, landscape | en-US, Africa/Cairo, LTR | Light, normal | Fresh anonymous browser context per case; no imported storage/consent interaction; live public fixture. Navigation commit, fonts, absent loader, decoded visible images, required selectors, three stable half-pixel geometry samples, post-capture check; exact plan/action/time origin retained | raw-run-01 D, raw-repair-01, raw-repair-02 D, raw-geometry-01 D; cache disabled by route guard; ambient motion allowed |
| ENV2-M / inspected | Same fresh Chrome/OS/runtime | 390x844, DPR1, client390, no layout scrollbar, scale1 | isMobile/hasTouch true, touch1/coarse input, portrait; keyboard used for close | Same | Light, normal | Fresh per case, same explicit readiness. Sweeps reach bottom within30 steps/6s then return top; cumulative checkpoint actions preserved | raw-run-01 M, raw-repair-02 M, raw-geometry-01 M. UA remains desktop HeadlessChrome; not Android/iOS evidence |
| ENV2-R / inspected | Same fresh Chrome/OS/runtime | 390x844, DPR1, client390, scale1 | Emulated touch1, portrait | Same | Light, fresh reduced | Fresh context created with reduce; home and UFO still after sweep; video unassigned, readyState0 | raw-run-01 R. Different from switching an existing normal session to reduced and back |

Historical rows are carried unchanged, not newly executed or promoted to schema2 captures. All have original UTC timestamps and state recipes in the [frozen environment section](inherited-v1/reference-evidence.md#environment-and-reset-recipes), E-030/E-041/E-050/E-064/E-070. Source-equivalent behavior evidence remains dated.

| ID / status | Browser/OS | Viewport / DPR | Input/preferences/session | Evidence / inspection limit |
| --- | --- | --- | --- | --- |
| ENV1-D / inherited | HeadlessChrome154 UA, Win32; full binary version not recorded here | 1440x900 /1 | Fresh task profile, normal, pointer/keyboard, en-US/Cairo/LTR | E-070 final settled; earlier E-030 may be transient |
| ENV1-M / inherited | Same | 390x844 /1 | Emulated touch, normal | E-050/E-064/E-070 final; not a physical phone |
| ENV1-T1024 / inherited | Same | 1024x768 /1 | Pointer normal | E-030 geometry/full/scroll; retain initial readiness limits |
| ENV1-T768 / inherited | Same | 768x1024 /1 | Pointer normal | E-030 geometry/full/scroll |
| ENV1-B759, ENV1-B760, ENV1-B761 / inherited | Same | 759/760/761 x900 /1 | Pointer normal, fresh/reset per original helper provenance | E-040; inclusive760 and complementary761 behavior |
| ENV1-B1099, ENV1-B1100, ENV1-B1101 / inherited | Same | 1099/1100/1101 x900 /1 | Pointer normal | E-040; secondary geometry boundary |
| ENV1-B1799, ENV1-B1800, ENV1-B1801 / inherited | Same | 1799/1800/1801 x900 /1 | Pointer normal | E-040; large-screen changes |
| ENV1-RD / inherited | Same | 1440x900 /1 | Reduced; switching/fresh reset distinction retained | E-041/E-060/E-062; not equated to fresh normal |
| ENV1-RM / inherited | Same | 390x844 /1 | Touch/reduced | E-041/E-060 |
| ENV1-L / inherited | Same | 844x390 /1 | Touch normal landscape | E-041; min-height may exceed viewport |
| ENV1-S / inherited | Same | 1440x400 /1 | Pointer normal short height | E-041; no fit-to-screen promise |

Uninspected: browser zoom/text enlargement, DPR2/3, dark preference, RTL/other locale, Safari/Firefox, actual AT, physical touch and virtual keyboard/browser chrome. FC-U-01 bounds these outside parity claims; they remain unknown, not negative results.

Capture conditions: screenshot animations allowed/caret initial; no page CSS/source mutation, clock freeze or artificial backend fixture. Playwright PNG excludes ordinary scrollbar pixels even when client metrics reserve15px; v1 CDP JPEG includes visible scrollbar chrome. Exact raster identity is therefore uncalibrated. Fresh network routing disables HTTP cache; provider/ambient frames/content can change. All save timestamps and event/performance origins are recorded separately.

Tool-root preflight failed once; local filesystem writes succeeded. Shared probe required latest per-page snapshot; Polypane args were element UIDs, so explicit wrapper carried bounded options. Returned JSON was saved locally with UTF-8 and verified. Native panes own dimensions; no direct emulation/CDP attachment to existing user profiles.

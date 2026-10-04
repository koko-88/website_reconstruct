# Motion / interaction fingerprint

Read [precedence](README.md) and [evidence index](evidence-index.md). **O** = retained runtime/pixels, **S** = source declaration, **L** = unresolved/variable limit. Numbers below are S unless explicitly marked O. Source spans make formulas traceable without copying implementation code. `clamp` defaults to [0,1]; y is nonnegative scrollY, H viewport height, W pin client width. All source calculations must use current measured dimensions, not historical absolute y values.

## M-01 Loader / hero entrance — SR-01/37; AC2-01/04

**O:** E-060 normal frames show loading at performance ~376/995ms, parting ~1904/2912ms, removed by ~4123ms. Fresh reduced loader absent by ~814ms sampled. Current HOME frames are settled endpoints only.

**S:** JS-LOADER waits load + fonts + floor `max(0,1600-performance.now())`; races against ceiling timer3600ms scheduled at setup. Dismiss is idempotent: parting -> root `is-loading` removed after260ms -> element removed1500ms after dismiss. Reduced dismiss uses0/50ms. CSS-LOADER pauses hero entrances while loading; title condenses1.7s cubic-bezier(.2,.7,.2,1), city delay.18s; hero heading1.5s same easing, topline/bottom1.4s delay.2s. Veil1.1s delay.3s, title exit.7s, fog parts1.15s cubic-bezier(.45,0,.2,1). Visual loader-progress2.8s to.86 is decorative, not network percent.

**L:** Runtime brackets do not establish exact dismissal instant/network latency. Touch hero scroll branch in M-04; reduced removes CSS animation. No all-image completion gate or replay of historical cache conditions implied.

## M-02 Fog / grain / ambient — SR-38; AC2-03/04

**O:** E-080 animation records show normal desktop fog40/56/70s and spin24s/marquee35s; E-041 reduced preference sample has no running animations. E-070 captures ambient phase without freezing.

**S:** JS-FOG adds three decorative wisps per bank; intersection rootMargin80px enables animation, document.hidden pauses. CSS-FOG main drift40s delay-19s alternate ease-in-out: (-9%,4%,scale1.04) -> at52%(1%,-5%,1.10) -> (9%,2%,1.03). Counter56s delay-41s mirrored: (10%,-4%,1.13) ->58%(-2%,5%,1.05) ->(-10%,-2%,1.10). Third70s delay-62s. Ambient/seam and dark bank opacity/masks differ; grain is static encoded SVG fractal noise, fixed body pseudo-element opacity.04, z40; not a regenerated canvas per frame. Final mobile no-preference cascade gives44/60s (supersedes earlier52s), hides third wisp/crossing bank; reduced static banks opacity.26, third/crossing hidden. Menu/loader/dialog fog has separate CSS clocks (CSS-LOADER/MENU/MODAL).

**L:** Preserve multiple independent phases and occlusion/layer order; exact fog phase/bitmap pixels require authorized assets. Runtime duration observation cited is desktop; mobile44/60 remains S.

## M-03 Marquee / rotating marks — SR-38/39; AC2-03/04

**O:** E-080 records35s marquee and24s slow-spin. E-030/E-070 show tilted continuous strip, numerals, asterisk/venue mark relationships.

**S:** CSS-BASE marquee track linear infinite to translateX(-50%); tilted strip and clipped shell share layout. Star360deg/24s, loader icon7s. JS-RENDER intro asterisk angle `(H-intro.top)*.065` while visible. Venue wordmark adds independent rotate `scenePhase(rect)*10deg` atop fixed stylesheet tilt. `scenePhase(r)=clamp((H/2-r.top-r.height/2)/((H+r.height)/2),-1,1)`.

**L:** Rotation cannot be inferred from one raster. Reduced clears render transforms/animations. Mobile hides hero star; preserve actual final CSS and inline SVG marks (asset decision still pending).

## M-04 Pointer flashlight / hero scroll — SR-38; AC2-03/04

**O:** E-062 layers record `.flashlight.is-tracking`; retained normal/touch source/runtime branch evidence exists. No physical Safari verification.

**S:** JS-GLOW coalesces primary non-touch pointermove/down into one RAF; clamps clientX/Y to viewport; sets tracking, removes hidden. Leave/blur/document-hidden hides; touch down/preference/input change cancels RAF and clears tracking/coordinates. CSS-GLOW fixed z45, pointer-events none, alpha radial1000px light, no blend mode, opacity fade.3s; default75vw/45vh before tracking. Coarse/hover-none/reduced hides glow. JS-RENDER pointer normal hero: media translateY(y*.25), scale(1+y*.00008), title translateY(y*.10), opacity clamp(1-y/heroHeight). Touch uses CSS-TOUCH-HERO view timeline exit0..100% to translateY22svh if supported; unsupported browser keeps still photograph. This branch is selected by input capability, not only width.

**L:** CSS comments about Safari are intent, not tested parity. Fresh reduced and switching states stay separate. Acceptance checks light coordinates/layering and cancellation; raster light phase is not locked.

## M-05 Facts decode / rearm — SR-02/39; AC2-03/04

**O:** E-085 frame/DOM sequence records armed/decoding glyph boxes progressing into settled copy; E-062 earlier frames are partial timeline evidence, not final facts baseline.

**S:** JS-FACTS initializes only when normal preference and IntersectionObserver exists. Per fact k base150*k ms; per figure glyph i show=base+45*i, resolve=base+480+190*i+random[0,70); label show=base+220+24*i, resolve=base+560+44*i+random[0,60). Cadence figures90ms, labels60ms varied*.7..1.3; sets digits/letters/other separately. Lock each box to final glyph width; visually-hidden readable twin and aria-hidden visual words; restore original markup700ms after pending chars finish. Trigger at intersection>=.3, wait fonts and poll loading veil every120ms. Full exit rearms; exit while decoding schedules rearm after completion. No repeated trigger merely while visible. CSS-FACTS lock color.6s and rule reveal1.2s cubic-bezier(.2,.7,.2,1).

**L:** Random glyph paths/cadence are S distribution, not exhaustively observed. Fresh reduced/no observer keeps readable original. Source does not add a live reduced-change cleanup to already-created fact observer; do not assert that switched mid-decode equals fresh reduced. Preserve/record this distinction if target testing exposes it (MEDIUM).

## M-06 Story progression / reversal / general reveals — SR-03..06/13/38; AC2-02/03/04/07

**O:** E-050/E-052/E-080 forward chapter0->1->2 and reverse1->0 change count/active state without tab hash; E-040 confirms width branch, E-041 reduced vertical. E-030 scroll geometry is context for timed sequences.

**S:** JS-RENDER measures storyTop and travel=max(1,stories.height-H). Desktop normal p=clamp((y-top)/travel), stage=2p, segment=min(1,floor(stage)), fraction=stage-segment, t=clamp((fraction-.16)/.68), e=t*t*(3-2*t), position=segment+e. Track x=-position*W; scenery shift=clamp(position-i,-1,1)*W*.45, so image counter-travels relative to text. Active index=round(position), count01..03 and history palette follow it. Crossing fog opacity=sin(pi*t)^2*.58 and x=(1-2t)*8%; no fog in holds. Tab destination=top+travel*i/2.

CSS-BASE normal desktop section340svh, sticky pin100svh min650px; <=760/reduced vertical track, controls hidden. JS-RENDER narrow media y=scenePhase*36px, numerals*-18px; ordinary photo travel=min(16px,.06*height), tickets=min(30px,.06*height); desktop venue photo moves scenePhase*height*.09 within120% overscan. Other desktop photo windows do not inherit mobile parallax.

JS-REVEAL enters at12% with bottom rootMargin-25px, resets only full exit, remembering top exit via from-above. CSS-REVEAL opacity.9s/blur1.1s/translate1.1s cubic-bezier(.2,.75,.25,1), from +/-45px; mobile story content .75/.9/.95s from +/-28px. Word reveal progress=clamp((.90H-block.top)/(block.height+.05H)), visible when progress>i/wordCount, .25s opacity/blur. Full-page reset can hide descendants again.

JS-SCROLL fine-pointer normal wheel inertia weight.28s: current += gap*(1-exp(-dt/.28)), dt capped.05s, snap gap<.3px; line delta100/3px, page deltaH. Keyboard/scrollbar/touch stay native; outside scroll>1px resyncs. In-page/tab tween duration=clamp(900+distance/2.5,900,2000)ms, quartic ease `1-(1-t)^4`; wheel interrupts tween; ignore Ctrl/horizontal/nested scrolls. Fragment navigation applies scroll-padding and focus/history; brand root resets scroll restoration. Reduced instant, touch native smooth destination.

**L:** Source interpolation is authoritative S, not frame-perfect measured easing. Width and pointer capability are independent. Reduced static vertical layout, no transformed scene/reveal motion. Source reset/rearm conditions rather than whole-page screenshots define named states.

## M-07 UFO / video scrub — SR-05/06; AC2-03/04

**O:** E-064 fresh desktop/mobile sources duration8.041667s readyState4. E-080 desktop progress .65/.8/1 -> ~.888/2.796/5.340s; reversal ~2.796 then0. Fresh v2 reduced R--UFO unassigned media/readyState0 and visible still. Earlier E-062 no-video after preference switching is not fresh normal behavior.

**S:** JS-UFO lazy load within100% rootMargin of stories, normal only; <=760 picks small MP4 at first load. Metadata play/pause attempts decoding; loadeddata/seeked adds is-ready. Single seek in flight; time=target*max(0,duration-.05), seek only abs error>1/48s. Desktop target=clamp((y-start)/(end-start)), start=top+travel*.58, end=top+travel+pinHeight*.5. Narrow target=clamp((H-section.top)/(H+section.height)/.75). CSS-UFO opacity1.1s ease to .95 desktop/.65 narrow, still remains underneath; fresh reduced never assigns video.

**L:** Play attempt or seek can fail; still remains fallback. Source choice not reloaded automatically merely on resize after initial load. D-02 initial reduced -> normal fails to initialize clip in retained session; fresh normal differs. No unobserved decoder/device parity or universal video time at chapter2 endpoint inferred.

## M-08 Topic selection / meter glitch — SR-07/39; AC2-03/04

**O:** E-062 guide pointer frames record glitch class/window; E-001/E2-004 and HTML-TOPICS establish identifiers/images. Use [explicit topic crosswalk](typography-assets.md), never SR-07 prose as selectors.

**S:** JS-TOPICS selects nearest `abs(row.top+.4*row.height-.52*H)` while highlights intersects viewport. Matching data-topic/image toggles current/active. Image drift=scenePhase(highlights)*min(narrow?14:26,.035*H). CSS-TOPICS crossfade1.1s to .4 desktop/.3 narrow; active title fills outline (.65s color), desktop x -16->0 over.8s cubic-bezier(.2,.75,.25,1); hover also fills, but does not select image by itself. Meter identifier guide triggers selection glitch cooldown5000ms; pointerenter fine input cooldown900ms, ignored reduced; is-glitching lasts800ms. CSS-GLITCH exact band/static/jitter/split keyframes .72s steps(1,end); JS removes class after800ms. Touch relies on scroll trigger. Reduced renderHighlights returns before selecting new topic, clearing only transforms; fresh default dam remains; switching retains last selection.

**L:** Exact band path definitions are linked S (CSS-GLITCH), not observed timing extrema. Image DOM order differs from topic row order. Variable ambient texture phase remains outside fixed-frame comparison.

## M-09 FAQ animation / interruption — SR-09/14..23; AC2-05 corrected

**O:** E-050 desktop settled samples FAQ1..9 each retain only the activated answer; the misleading final action label says close while state actually has FAQ1 open. E-080 rapid interruption sample ends all closed; E-090 Enter/Space confirms keyboard activation. Desktop/mobile D--FAQ/M--FAQ are current FAQ1 endpoint baselines, not proof of all answers or multi-open behavior.

**S:** JS-FAQ desiredOpen toggles on summary click; opening closes all other intents. During exit native details.open stays true while data-expanded=false/answer inert; overlap is transient. Read current height/answer opacity/transform/filter before cancelling animations. Generation guards stale finish handlers. Height open620/close420ms cubic-bezier(.22,.8,.22,1), answer open550/close260ms cubic-bezier(.2,.7,.2,1): entrance opacity0,y-8,blur4 -> at75% opacity1,y2,blur0 -> y0; exit opacity0,y-6,blur3. Height includes summary + padding/borders + open answer. Settle cancels fills/removes overflow, applies desired native state and remeasures. ResizeObserver restarts when natural target changes>1px. Reduced/no WAAPI settles immediately; reduced change settles active animations. CSS-FAQ icon uses data-expanded with225deg for true,0 for false.

**L:** Use zero/one desired and settled answer, tolerate multiple open attributes only in bounded exit. Measure continuity on rapid open/close/open rather than restarting from zero. FAQ7 has two paragraphs; preserve content-driven height. Historical multiple-open prose/AC2-05 wording is prospectively corrected, not rewritten.

## M-10 Menu open / close / stagger — SR-10..13; AC2-06/07

**O:** Repair02 desktop/touch OPEN/CLOSED are canonical, descendants opacity1 when open and hidden when closed. E-050/E-080 show first-link focus, Escape restoration and rapid reversal. Raw initial MENU/MENU-CLOSED are incomplete/transient only.

**S:** JS-MENU hidden false -> layout commit -> is-open/expanded true/text Close/root menu-open/first-link focus. Close removes truth class/root lock immediately, aria false/text Menu, hides after600ms (reduced0); reopen cancels delayed hide. Links close; Escape focuses toggle; Tab loop includes visible header controls and nav links. CSS-MENU rows from opacity0,y22,blur6 ->1/none/0: opacity/filter.6s, transform.7s cubic-bezier(.2,.7,.2,1), delays.26/.34/.42/.50s, footer.62s. Exit rows together .25/.3/.3s. Veil open.45s/close.35s delay.15; fog entrance1s/opacity.8s, exit.5/.4. Desktop left centered stops/right-bottom CTA; <=760 narrow stacked layout. Header fixed while menu open; default header absolute, not sticky.

**L:** Repair12s navigation deadline is not 12s menu animation. Read row/footer state and hidden, not overlay geometry or parent opacity alone. Reduced global transitions none, delayed hide0; remaining labels/focus intact.

## M-11 Ticket host modal / CTA spirit — SR-25..32/39; AC2-09/10/11/12 host only

**O:** Final desktop REOPEN and mobile TICKETS show host shell with loaded provider; LOADING is transient; earlier desktop TICKETS/PROVIDER incomplete. E-080 Escape/button/veil return focus and retain iframe on reopen; D-01 repeated Tab escapes to background. E-081 fallback is script-block simulation only. E-062 observed one spirit flight ~2453ms; not universal duration.

**S:** JS-MODAL open cancels hide, remembers focus, unhides/commits/adds is-open/root modal-open, focuses close. Close removes class/lock, hides500ms later (reduced0), restores valid prior focus; reopen cancels hide and preserves mounted host state. CSS-MODAL veil.4s; panel from y30/blur8/opacity0 -> none/0/1 with delay.1s, transform.65s cubic-bezier(.2,.7,.2,1), opacity/filter.55s; exit.35/.3/.3s. Panel width min(1080px,100%), max-height100%, own overflow; <=760 full viewport with18px20px14px padding. Dialog fog has34s drift, reduced hidden. Preview query schedules600ms from setup; provider load source watchdog10s checks only iframe presence, message/script outcomes affect host status; this does not prove provider appearance readiness. No Eventbrite internals required by TX-01; replacement data/action states must be recorded under TA-01.

JS-SPIRIT hover(non-touch)/focus bright, first touch arrival at intersection.45 schedules900ms, ambient while in-view and document visible20..45s gaps. One flight; bright base2800/faint4600ms varied*.85..1.15, peaks.68/.28, random side,40% dip; passing released duration+200ms. Linger=button.top+button.height*(narrow?1.9:.5)-section.top-section.height/2; side narrow0 else round(button.width/2+28). CSS-SPIRIT controls actual paths/pulses/flare/sheen (linked source, preserve layered mist/light). Reduced disables pass.

**L:** Retained source trap declaration does not negate D-01 observed defect. TF-05 permits documented target correction. Provider text/image/logo/date UI excluded; mounted-state reuse and loading character matter to host contract. Random distributions/source watchdog aren't observations of real failure frequency.

## M-12 Reduced-motion matrix — SR-06/37..39; AC2-04

**O:** E-041/E-060 reduced captures, E-062 switching limit, current R--HOME/R--UFO distinguish fresh and changed sessions. E2-006 equal app/CSS supports inherited evidence without relabeling dates.

**S:** CSS-REDUCE globally animation/transition none!important, static visible reveals/words/title, vertical stories/hidden controls, static photos/fog, no flashlight/glitch/spirit; loader fast-dismiss; FAQ immediate settle, menu hide0/modal hide0, native instant destination. JS-RENDER clears track/scene/wordmark/asterisk and crossing fog. Fresh reduced skips facts initialization/motion-ready/UFO loading. Change to normal can initialize reveals and smooth-scroll but does not create UFO near observer that was skipped initially. Topic reduced preserves existing/default selection rather than advancing with scroll. Facts change caveat M-05.

**L:** Preserve fresh-before-load versus switched-session cases; do not promise the same layout/video/observer history. No claim of physical-device or other-engine equivalence. Test a discrepancy if implementation reveals it; new inspection is not justified solely to remove bounded uncertainty.

(() => {
  'use strict';
  // Eventbrite. Paste the event ID between the quotes and the Get Tickets
  // button opens checkout in the on-page box office instead of leaving the
  // site. The ID is the long number at the end of the event page's address:
  // eventbrite.com/e/haunted-boulder-city-tour-tickets-123456789 -> '123456789'
  // While it is empty the button keeps its ordinary link. The box office can
  // be previewed any time at /?tickets=preview
  const EVENTBRITE_EVENT_ID = '2000657664932';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const smallScreen = window.matchMedia('(max-width: 760px)');
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  // Loading screen. Fonts and the load event decide readiness; a floor keeps the
  // reveal legible and a ceiling keeps a slow connection from trapping anyone
  // behind the veil. The hero entrance is paused until the mist starts to part.
  const loader = document.querySelector('.loader');
  if (loader) {
    const root = document.documentElement;
    let dismissed = false;
    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      const parting = !reduceMotion.matches;
      loader.classList.add('is-parting');
      setTimeout(() => root.classList.remove('is-loading'), parting ? 260 : 0);
      setTimeout(() => loader.remove(), parting ? 1500 : 50);
    };
    if (!root.classList.contains('is-loading') || reduceMotion.matches) dismiss();
    else {
      const loaded = new Promise(resolve => {
        if (document.readyState === 'complete') resolve();
        else window.addEventListener('load', resolve, { once:true });
      });
      const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
      const floor = new Promise(resolve => setTimeout(resolve, Math.max(0, 1600 - performance.now())));
      const ceiling = new Promise(resolve => setTimeout(resolve, 3600));
      Promise.race([Promise.all([loaded, fonts, floor]), ceiling]).then(dismiss);
    }
  }
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const menuText = menuButton.querySelector('.menu-toggle-text');
  const siteNav = document.querySelector('.site-nav');
  // The menu stays in the DOM through its exit so the mist can roll back out.
  // `is-open` is the truth; `hidden` follows once the transitions have finished.
  let menuTimer = 0;
  const menuOpen = () => siteNav.classList.contains('is-open');
  const closeMenu = () => {
    if (!menuOpen()) return;
    siteNav.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuText.textContent = 'Menu';
    document.documentElement.classList.remove('menu-open');
    clearTimeout(menuTimer);
    menuTimer = setTimeout(() => { siteNav.hidden = true; }, reduceMotion.matches ? 0 : 600);
  };
  const openMenu = () => {
    clearTimeout(menuTimer);
    siteNav.hidden = false;
    void siteNav.offsetWidth; // commit the display change so the entrance transitions run
    siteNav.classList.add('is-open');
    menuButton.setAttribute('aria-expanded', 'true');
    menuText.textContent = 'Close';
    document.documentElement.classList.add('menu-open');
    siteNav.querySelector('a').focus({ preventScroll:true });
  };
  menuButton.addEventListener('click', () => { if (menuOpen()) closeMenu(); else openMenu(); });
  siteNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuOpen()) { closeMenu(); menuButton.focus(); }
    if (event.key === 'Tab' && menuOpen()) {
      const focusable = [...header.querySelectorAll('a,button'), ...siteNav.querySelectorAll('a')].filter(el => el.offsetParent !== null);
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  smallScreen.addEventListener('change', measure);
  const progressBar = document.querySelector('.scroll-progress');
  const hero = document.querySelector('.hero');
  const flashlight = document.querySelector('.flashlight');
  const touchScreen = window.matchMedia('(hover: none), (pointer: coarse)');
  const glowAllowed = () => !reduceMotion.matches && !touchScreen.matches;
  const heroMedia = document.querySelector('.hero-media');
  const heroTitle = document.querySelector('.hero h1');
  const stories = document.querySelector('.stories-scroll');
  const storyPin = document.querySelector('.stories-pin');
  const track = document.querySelector('.story-track');
  const storyButtons = [...document.querySelectorAll('[data-story]')];
  const count = document.querySelector('.story-count');
  const asterisk = document.querySelector('.large-asterisk');
  const intro = document.querySelector('.intro');
  // A chapter's scenery may be a photograph or a photograph with a clip over it;
  // every layer moves together.
  const storyScenes = [...document.querySelectorAll('.story')].map(section => ({
    section, media:[...section.querySelectorAll('.story-background')], number:section.querySelector('.story-number')
  }));
  const photoScenes = [...document.querySelectorAll('.photo-window')].map(frame => ({ frame, media:frame.querySelector('img') }));
  const ticketScene = { frame:document.querySelector('.tickets'), media:document.querySelector('.ticket-background img') };
  const wordmark = document.querySelector('.zombies-photo .bz-wordmark');
  const zombieScene = photoScenes.find(scene => scene.frame.closest('.zombies-photo'));
  const highlights = document.querySelector('.tour-highlights');
  const topics = [...highlights.querySelectorAll('.topic')];
  const topicImages = [...highlights.querySelectorAll('[data-topic-image]')];
  let activeTopic = -1;
  function renderHighlights() {
    if (reduceMotion.matches) {
      topicImages.forEach(image => { image.style.transform = ''; });
      return;
    }
    const bounds = highlights.getBoundingClientRect();
    if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;
    const focus = window.innerHeight * .52;
    let nearest = 0, distance = Infinity;
    topics.forEach((topic, i) => {
      const rect = topic.getBoundingClientRect();
      const delta = Math.abs(rect.top + rect.height * .4 - focus);
      if (delta < distance) { distance = delta; nearest = i; }
    });
    if (nearest !== activeTopic) {
      activeTopic = nearest;
      topics.forEach((topic, i) => topic.classList.toggle('is-current', i === nearest));
      topicImages.forEach(image => image.classList.toggle('is-active', image.dataset.topicImage === topics[nearest].dataset.topic));
      if (topics[nearest].dataset.topic === 'guide') glitch();
    }
    const drift = scenePhase(bounds) * Math.min(smallScreen.matches ? 14 : 26, window.innerHeight * .035);
    topicImages.forEach(image => { image.style.transform = `translate3d(0,${drift}px,0)`; });
  }
  // Interference. When the Ghost Meter comes up, the page picks something up
  // for about two thirds of a second: the grain flares into static, a few
  // tracking bands cross the screen, and the line itself jitters and splits
  // into its colour channels. The choreography lives in CSS (.is-glitching);
  // this only opens and closes the window, with a cooldown so hovering around
  // that topic does not strobe.
  const glitchOverlay = document.createElement('div');
  glitchOverlay.className = 'glitch';
  glitchOverlay.setAttribute('aria-hidden', 'true');
  glitchOverlay.innerHTML = '<i></i><i></i><i></i>';
  document.body.appendChild(glitchOverlay);
  let glitchTimer = 0, lastGlitch = -Infinity;
  function glitch(cooldown = 5000) {
    if (reduceMotion.matches || performance.now() - lastGlitch < cooldown) return;
    lastGlitch = performance.now();
    document.documentElement.classList.add('is-glitching');
    clearTimeout(glitchTimer);
    glitchTimer = setTimeout(() => document.documentElement.classList.remove('is-glitching'), 800);
  }
  // Hovering the line asks for it directly; only an interference already in
  // progress holds it back. Touch gets pointerenter with every scroll, so the
  // scroll trigger alone covers those screens.
  const meter = document.querySelector('.topic[data-topic="guide"]');
  if (meter && !touchScreen.matches) meter.addEventListener('pointerenter', () => glitch(900));
  // Case file 03 is a single locked-off take: the saucer breaks the clouds
  // around the four-second mark and beams down a second later. Scrolling is
  // its timeline (render() sets the target, scrubUfo() seeks toward it, one
  // seek in flight at a time). The clip only loads once motion is on and the
  // chapters are near; until its first frame is on screen the still artwork
  // underneath is the scene, and reduced motion never leaves that still.
  const ufoVideo = document.querySelector('.story-ufo .story-video');
  const ufo = ufoVideo && { video:ufoVideo, section:ufoVideo.closest('.story'), target:0, loaded:false, ready:false };
  function loadUfo() {
    if (!ufo || ufo.loaded || reduceMotion.matches) return;
    ufo.loaded = true;
    const { video } = ufo;
    const ready = () => { if (!ufo.ready) { ufo.ready = true; video.classList.add('is-ready'); } };
    video.addEventListener('loadedmetadata', () => {
      // A muted inline clip may start without a gesture, and a play/pause pair
      // is what gets iOS to fetch and decode frames for seeking.
      const attempt = video.play();
      if (attempt) attempt.then(() => { video.pause(); scrubUfo(); }).catch(() => {});
      scrubUfo();
    }, { once: true });
    video.addEventListener('loadeddata', () => { scrubUfo(); if (!video.seeking) ready(); }, { once: true });
    video.addEventListener('seeked', () => { ready(); scrubUfo(); });
    video.src = smallScreen.matches && video.dataset.srcSmall ? video.dataset.srcSmall : video.dataset.src;
    video.preload = 'auto';
    video.load();
  }
  function scrubUfo() {
    if (!ufo || ufo.video.readyState < 1 || ufo.video.seeking) return;
    const time = ufo.target * Math.max(0, ufo.video.duration - .05);
    if (Math.abs(ufo.video.currentTime - time) > 1 / 48) ufo.video.currentTime = time;
  }
  if (ufo && !reduceMotion.matches) {
    const near = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      near.disconnect();
      loadUfo();
    }, { rootMargin: '100% 0px' });
    near.observe(stories);
  }
  function resetSceneMotion() {
    storyScenes.forEach(scene => { scene.media.forEach(layer => { layer.style.transform = ''; }); scene.number.style.transform = ''; });
    [...photoScenes, ticketScene].forEach(scene => { scene.media.style.transform = ''; });
    if (wordmark) wordmark.style.rotate = '';
  }
  function scenePhase(rect) {
    return clamp((window.innerHeight / 2 - rect.top - rect.height / 2) / ((window.innerHeight + rect.height) / 2), -1, 1);
  }

  const revealBlock = document.querySelector('.reveal-word-block');
  // A static cloud texture drifts on separate layers; the noise itself is never
  // recalculated per frame. Fog does not participate in layout or hit testing.
  function addFog(parent, modifier) {
    const bank = document.createElement('div');
    bank.className = `fog-bank ${modifier}`;
    bank.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 3; i++) {
      const wisp = document.createElement('span');
      wisp.className = 'fog-wisp';
      bank.appendChild(wisp);
    }
    parent.appendChild(bank);
    return bank;
  }
  addFog(hero, 'fog-bank--ambient');
  document.querySelectorAll('main > section:not(.hero):not(.stories-scroll)').forEach(section => {
    addFog(section, `fog-bank--seam${section.classList.contains('zombies') ? ' fog-bank--dark' : ''}`);
  });
  document.querySelectorAll('.story').forEach(story => {
    addFog(story, `fog-bank--ambient${story.classList.contains('story-history') ? ' fog-bank--dark' : ''}`);
  });
  addFog(document.querySelector('.tickets'), 'fog-bank--ambient');
  const storyFog = addFog(storyPin, 'fog-bank--crossing');
  const fogBanks = document.querySelectorAll('.fog-bank');
  if ('IntersectionObserver' in window) {
    const fogObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('fog-in-view', entry.isIntersecting));
    }, { rootMargin: '80px' });
    fogBanks.forEach(bank => fogObserver.observe(bank));
  } else {
    fogBanks.forEach(bank => bank.classList.add('fog-in-view'));
  }
  const pauseFog = () => document.documentElement.classList.toggle('fog-paused', document.hidden);
  document.addEventListener('visibilitychange', pauseFog);
  pauseFog();
  // The logo starts the visit over: a fresh load from the top, veil and all.
  // Its href is "/", so any #section in the address is dropped; turning off
  // scroll restoration stops the browser putting us back where we were.
  const brand = document.querySelector('.brand');
  if (brand) brand.addEventListener('click', () => { history.scrollRestoration = 'manual'; });
  // The passer-by. A pale wisp crosses the final call to action when the ticket
  // button is approached, and drifts through faintly on its own now and then
  // while that section is on screen. One spirit at a time, and no two flights
  // alike: side, path and pace are drawn fresh for each crossing. The flight
  // itself lives in CSS (see .spirit); this only sets the terms and the timing.
  const SPIRIT = {
    brightPeak: .68, faintPeak: .28,           // share of the orb's light shown: on approach / unprompted
    brightDuration: 2800, faintDuration: 4600, // ms for a crossing, varied ±15% per flight
    ambientGap: [20000, 45000],                // ms between unprompted crossings while in view
    dipChance: .4,                             // odds a flight dives into the fog instead of rising
  };
  const tickets = document.querySelector('.tickets');
  const ticketButton = tickets.querySelector('.button-large');
  const spiritLight = document.createElement('div');
  spiritLight.className = 'spirit-light';
  spiritLight.setAttribute('aria-hidden', 'true');
  tickets.insertBefore(spiritLight, tickets.querySelector('.fog-bank')); // lights the fog from beneath
  const spirit = document.createElement('div');
  spirit.className = 'spirit';
  spirit.setAttribute('aria-hidden', 'true');
  spirit.innerHTML = '<i></i><i></i><i></i>';
  tickets.appendChild(spirit); // above the fog, behind the words
  let passing = 0, ambientTimer = 0, ticketsInView = false, greeted = false;
  const pass = bright => {
    if (passing || reduceMotion.matches || document.hidden) return;
    const duration = Math.round((bright ? SPIRIT.brightDuration : SPIRIT.faintDuration) * (.85 + Math.random() * .3));
    // Hesitate at button height, peeking out just past its edge before slipping
    // behind it; on a phone the button spans the screen, so it lingers below.
    const section = tickets.getBoundingClientRect(), button = ticketButton.getBoundingClientRect();
    const linger = button.top + button.height * (smallScreen.matches ? 1.9 : .5) - section.top - section.height / 2;
    tickets.style.setProperty('--spirit-linger', `${Math.round(linger)}px`);
    tickets.style.setProperty('--spirit-side', `${smallScreen.matches ? 0 : Math.round(button.width / 2 + 28)}px`);
    tickets.style.setProperty('--dir', Math.random() < .5 ? '1' : '-1');
    tickets.style.setProperty('--spirit-duration', `${duration}ms`);
    tickets.style.setProperty('--spirit-peak', bright ? SPIRIT.brightPeak : SPIRIT.faintPeak);
    tickets.classList.toggle('spirit--dip', Math.random() < SPIRIT.dipChance);
    tickets.classList.add('is-haunted');
    passing = setTimeout(() => { tickets.classList.remove('is-haunted'); passing = 0; }, duration + 200);
  };
  const scheduleAmbient = () => {
    clearTimeout(ambientTimer);
    if (!ticketsInView || document.hidden) return;
    const [least, most] = SPIRIT.ambientGap;
    ambientTimer = setTimeout(() => { pass(false); scheduleAmbient(); }, least + Math.random() * (most - least));
  };
  ticketButton.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') pass(true); });
  ticketButton.addEventListener('focus', () => pass(true));
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => entries.forEach(entry => {
      ticketsInView = entry.isIntersecting;
      // Nothing hovers on a touch screen, so the first arrival gets the bright crossing.
      if (ticketsInView && !greeted && touchScreen.matches) { greeted = true; setTimeout(() => pass(true), 900); }
      scheduleAmbient();
    }), { threshold: .45 }).observe(tickets);
  }
  document.addEventListener('visibilitychange', scheduleAmbient);
  // Case-file decode. The tour facts arrive scrambled and lock in glyph by
  // glyph as the strip scrolls into view: figures first, labels close behind,
  // one fact after another. Every character sits in a box the width of its
  // final glyph so nothing shifts while it cycles; the copy stays readable to
  // assistive tech in a visually hidden twin, and the original markup comes
  // back the moment the last glyph settles. Wrappers are <i>, not <span>, so
  // the strip's own "strong span" styling cannot reach them. Once the strip
  // has left the screen entirely it re-arms, so it decodes again on the way
  // back, from either direction.
  const facts = document.querySelector('.tour-facts');
  if (facts && !reduceMotion.matches && 'IntersectionObserver' in window) {
    const GLYPHS = { digit: '0123456789', letter: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', other: '0123456789#%' };
    const glyphSet = ch => /\d/.test(ch) ? GLYPHS.digit : /[a-z]/i.test(ch) ? GLYPHS.letter : GLYPHS.other;
    let chars = [], restore = [], armed = false, decoding = false, rearmWhenDone = false;
    const arm = () => {
      chars = []; restore = [];
      facts.querySelectorAll(':scope > div').forEach((fact, k) => {
        const base = k * 150;
        fact.querySelectorAll('strong, :scope > span').forEach(el => {
          restore.push([el, el.innerHTML]);
          const figure = el.tagName === 'STRONG';
          let index = 0;
          const wrap = node => [...node.childNodes].forEach(child => {
            if (child.nodeType === Node.ELEMENT_NODE) { wrap(child); return; }
            if (child.nodeType !== Node.TEXT_NODE || !child.textContent.trim()) return;
            const fragment = document.createDocumentFragment();
            const twin = document.createElement('i');
            twin.className = 'sr-only';
            twin.textContent = child.textContent;
            fragment.appendChild(twin);
            child.textContent.split(/(\s+)/).forEach(part => {
              if (!part) return;
              if (!part.trim()) { fragment.appendChild(document.createTextNode(part)); return; }
              const word = document.createElement('i');
              word.className = 'decode-word';
              word.setAttribute('aria-hidden', 'true');
              [...part].forEach(ch => {
                const box = document.createElement('i');
                box.className = 'decode-char';
                box.textContent = ch;
                word.appendChild(box);
                chars.push(figure
                  ? { el: box, final: ch, set: glyphSet(ch), showAt: base + index * 45, resolveAt: base + 480 + index * 190 + Math.random() * 70, cadence: 90 }
                  : { el: box, final: ch, set: glyphSet(ch), showAt: base + 220 + index * 24, resolveAt: base + 560 + index * 44 + Math.random() * 60, cadence: 60 });
                index++;
              });
              fragment.appendChild(word);
            });
            child.replaceWith(fragment);
          });
          wrap(el);
        });
      });
      facts.classList.remove('is-decoded');
      facts.classList.add('is-armed');
      armed = true;
    };
    const decode = () => {
      const widths = chars.map(c => c.el.getBoundingClientRect().width);
      chars.forEach((c, i) => { c.el.style.width = `${widths[i]}px`; });
      facts.classList.add('is-decoding');
      const t0 = performance.now();
      chars.forEach(c => { c.showAt += t0; c.resolveAt += t0; c.flipAt = c.showAt; });
      const frame = now => {
        let pending = false;
        chars.forEach(c => {
          if (c.done) return;
          pending = true;
          if (now < c.showAt) return;
          if (now >= c.resolveAt) { c.el.textContent = c.final; c.el.classList.add('is-set'); c.done = true; return; }
          if (now >= c.flipAt) {
            c.el.textContent = c.set[Math.floor(Math.random() * c.set.length)];
            c.el.classList.add('is-live');
            c.flipAt = now + c.cadence * (.7 + Math.random() * .6);
          }
        });
        if (pending) requestAnimationFrame(frame);
        else setTimeout(() => {
          restore.forEach(([el, html]) => { el.innerHTML = html; });
          facts.classList.replace('is-decoding', 'is-decoded');
          decoding = false;
          if (rearmWhenDone) { rearmWhenDone = false; arm(); }
        }, 700);
      };
      requestAnimationFrame(frame);
    };
    const begin = () => {
      armed = false;
      decoding = true;
      const ready = document.fonts ? document.fonts.ready : Promise.resolve();
      // Never decode behind the loading screen; wait for the veil to part.
      const start = () => document.documentElement.classList.contains('is-loading') ? setTimeout(start, 120) : ready.then(decode);
      start();
    };
    arm();
    new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { if (armed && entry.intersectionRatio >= .3) begin(); }
      else if (decoding) rearmWhenDone = true;
      else if (!armed) arm();
    }), { threshold: [0, .3] }).observe(facts);
  }
  let words = [], motionInitialized = false;
  function initializeMotion() {
    if (motionInitialized || reduceMotion.matches) return;
    motionInitialized = true;
    document.documentElement.classList.add('motion-ready');
    const wrapTextNodes = node => {
      [...node.childNodes].forEach(child => {
        if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
          const fragment = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(word => {
            if (!word.trim()) fragment.appendChild(document.createTextNode(word));
            else { const span = document.createElement('span'); span.className = 'word'; span.textContent = word; fragment.appendChild(span); words.push(span); }
          });
          child.replaceWith(fragment);
        } else if (child.nodeType === Node.ELEMENT_NODE) wrapTextNodes(child);
      });
    };
    wrapTextNodes(revealBlock);
    // Reveals run both ways. An element shows once 12% of it is on screen and
    // resets only after it has left the screen entirely, remembering which
    // edge it left by so it can come back in from that side.
    const targets = document.querySelectorAll('.reveal, .story-content');
    if ('IntersectionObserver' in window) {
      const enter = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('in-view');
      }), { threshold: .12, rootMargin: '0px 0px -25px 0px' });
      const exit = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) return;
        entry.target.classList.remove('in-view');
        entry.target.classList.toggle('from-above', entry.boundingClientRect.top < 0);
      }), { threshold: 0 });
      targets.forEach(el => { enter.observe(el); exit.observe(el); });
    } else targets.forEach(el => el.classList.add('in-view'));
  }
  let storyTop = 0, storyTravel = 1, scrollRange = 1, activeStory = -1, scheduled = false, heroHeight = 1;
  const releaseHeroMotion = () => {
    heroMedia.style.transform = '';
    heroTitle.style.translate = '';
    heroTitle.style.opacity = '';
  };
  function measure() {
    resetSceneMotion();
    const word = document.querySelector('.haunted-word');
    word.style.fontSize = '';
    const wordStyle = getComputedStyle(word);
    const fontSize = parseFloat(wordStyle.fontSize);
    const context = document.createElement('canvas').getContext('2d');
    if (context) {
      context.font = `${wordStyle.fontWeight} ${wordStyle.fontSize} ${wordStyle.fontFamily}`;
      const width = context.measureText(word.textContent).width + (parseFloat(wordStyle.letterSpacing) || 0) * (word.textContent.length - 1);
      if (width > heroTitle.clientWidth) word.style.fontSize = `${fontSize * heroTitle.clientWidth / width}px`;
    }
    heroHeight = hero.offsetHeight;
    storyTop = stories.getBoundingClientRect().top + window.scrollY;
    storyTravel = Math.max(1, stories.offsetHeight - window.innerHeight);
    scrollRange = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    requestTick();
  }
  function render() {
    scheduled = false;
    const y = Math.max(0, window.scrollY);
    progressBar.style.transform = `scaleX(${clamp(y / scrollRange)})`;
    renderHighlights();
    if (reduceMotion.matches) {
      track.style.transform = '';
      storyFog.style.opacity = '0';
      storyFog.style.transform = '';
      releaseHeroMotion();
      flashlight.style.removeProperty('--mouse-x');
      flashlight.style.removeProperty('--mouse-y');
      if (asterisk) asterisk.style.transform = '';
      resetSceneMotion();
      return;
    }
    // Touch / Safari mobile: CSS scroll-driven animation owns the hero image.
    // JS transforms lag the compositor there and jump when the chrome hides.
    if (!touchScreen.matches && y < heroHeight + 200) {
      heroMedia.style.transform = `translate3d(0, ${y * .25}px, 0) scale(${1 + y * .00008})`;
      heroTitle.style.translate = `0 ${y * .10}px`;
      heroTitle.style.opacity = String(clamp(1 - y / heroHeight));
    }
    // The Beer Zombies mark turns clockwise as it scrolls past: twenty degrees
    // across its whole trip up the screen, on top of the tilt it is drawn with.
    // The independent rotate property stacks on the stylesheet's transform.
    if (wordmark) {
      const rect = wordmark.getBoundingClientRect();
      if (rect.bottom > -100 && rect.top < window.innerHeight + 100) wordmark.style.rotate = `${(scenePhase(rect) * 10).toFixed(2)}deg`;
    }
    if (smallScreen.matches) {
      track.style.transform = '';
      storyFog.style.opacity = '0';
      storyFog.style.transform = '';
      storyPin.classList.remove('history-active');
      activeStory = -1;
      storyScenes.forEach(scene => {
        const rect = scene.section.getBoundingClientRect();
        if (rect.bottom < -100 || rect.top > window.innerHeight + 100) return;
        const phase = scenePhase(rect);
        scene.media.forEach(layer => { layer.style.transform = `translate3d(0, ${phase * 36}px, 0)`; });
        scene.number.style.transform = `translate3d(0, ${phase * -18}px, 0)`;
      });
      if (ufo) {
        // The panel's trip up the screen is the timeline, finished at 75% of
        // it: the saucer sits in the top third of the frame, which leaves
        // first, so it must break the clouds before the panel top does.
        const rect = ufo.section.getBoundingClientRect();
        ufo.target = clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height) / .75);
        scrubUfo();
      }
      [...photoScenes, ticketScene].forEach(scene => {
        const rect = scene.frame.getBoundingClientRect();
        if (rect.bottom < -100 || rect.top > window.innerHeight + 100) return;
        const distance = Math.min(scene === ticketScene ? 30 : 16, rect.height * .06);
        scene.media.style.transform = `translate3d(0, ${scenePhase(rect) * distance}px, 0)`;
      });
    } else {
      const p = clamp((y - storyTop) / storyTravel);
      // Each chapter has a short hold before the next scene sweeps across.
      const stage = p * 2;
      const segment = Math.min(1, Math.floor(stage));
      const fraction = stage - segment;
      const transition = clamp((fraction - .16) / .68);
      const ease = transition * transition * (3 - 2 * transition);
      const position = segment + ease;
      track.style.transform = `translate3d(${-position * storyPin.clientWidth}px,0,0)`;
      // Counter-travel keeps the photograph moving at 55% of the text's pace.
      // Each panel clips its image; exposed local edges are already offscreen.
      storyScenes.forEach((scene, i) => {
        const shift = clamp(position - i, -1, 1) * storyPin.clientWidth * .45;
        scene.media.forEach(layer => { layer.style.transform = `translate3d(${shift}px,0,0)`; });
      });
      if (ufo) {
        // Case file 03's timeline runs from the moment it starts sweeping in
        // (fraction .16 of the second half, per the transition above) to the
        // pin being half-way off the top, so the saucer breaks the clouds
        // once the chapter has settled and the beam holds through the exit.
        const start = storyTop + storyTravel * ((1 + .16) / 2);
        const end = storyTop + storyTravel + storyPin.clientHeight * .5;
        ufo.target = clamp((y - start) / (end - start));
        scrubUfo();
      }
      // Mist gathers only while crossing between chapters, then clears during
      // each reading hold. Its children keep their independent drifting motion.
      const mist = Math.sin(Math.PI * transition) ** 2;
      storyFog.style.opacity = String(mist * .58);
      storyFog.style.transform = `translate3d(${(1 - transition * 2) * 8}%,0,0)`;
      const next = Math.round(position);
      if (next !== activeStory) {
        activeStory = next;
        storyButtons.forEach((button, i) => { button.classList.toggle('is-active', i === next); button.setAttribute('aria-pressed', String(i === next)); });
        storyPin.classList.toggle('history-active', next === 1);
        count.textContent = `0${next + 1} / 03`;
      }
      // The Beer Zombies photograph drifts against the scroll inside its frame.
      // Its image is drawn 20% taller than the window (see styles), so 9% of
      // travel each way never shows an edge.
      if (zombieScene) {
        const rect = zombieScene.frame.getBoundingClientRect();
        if (rect.bottom > -100 && rect.top < window.innerHeight + 100) zombieScene.media.style.transform = `translate3d(0, ${(scenePhase(rect) * rect.height * .09).toFixed(1)}px, 0)`;
      }
    }
    const rect = revealBlock.getBoundingClientRect();
    const readProgress = clamp((window.innerHeight * .90 - rect.top) / (rect.height + window.innerHeight * .05));
    words.forEach((word, i) => word.classList.toggle('visible', readProgress > i / words.length));
    const introRect = intro.getBoundingClientRect();
    if (asterisk && introRect.top < window.innerHeight && introRect.bottom > 0) asterisk.style.transform = `rotate(${(window.innerHeight - introRect.top) * .065}deg)`;
  }
  function requestTick() { if (!scheduled) { scheduled = true; window.requestAnimationFrame(render); } }

  // Inertial scrolling. Wheel input moves a target and the real scroll position
  // eases toward it every frame, so the pinned scenes, observers, and scrollY
  // keep working exactly as they do natively. Keyboard, scrollbar, and touch stay
  // native; an outside jump simply resyncs. Reduced motion and touch opt out.
  const smoothScroll = (() => {
    const WEIGHT = .28;      // seconds to close 63% of the gap. Higher is heavier.
    const LINE = 100 / 3;    // pixels per wheel "line" where deltas arrive in lines
    const root = document.documentElement;
    let enabled = false, running = false, current = 0, target = 0, settled = 0, previous = 0, tween = null;
    const allowed = () => !reduceMotion.matches && !touchScreen.matches;
    const limit = () => Math.max(0, root.scrollHeight - window.innerHeight);
    const sync = () => { current = target = settled = window.scrollY; tween = null; };
    const scrollsItself = node => {
      for (let el = node instanceof Element ? node : null; el && el !== document.body; el = el.parentElement) {
        const overflow = getComputedStyle(el).overflowY;
        if ((overflow === 'auto' || overflow === 'scroll') && el.scrollHeight > el.clientHeight + 1) return true;
      }
      return false;
    };
    function frame(now) {
      if (!enabled) { running = false; return; }
      const dt = previous ? Math.min(.05, (now - previous) / 1000) : 1 / 60;
      previous = now;
      // Keyboard, scrollbar, or find-in-page moved the page: let it win.
      if (Math.abs(window.scrollY - settled) > 1) sync();
      target = clamp(target, 0, limit());
      if (tween) {
        const t = clamp((now - tween.start) / tween.duration);
        current = tween.from + (tween.to - tween.from) * (1 - (1 - t) ** 4);
        if (t >= 1) { tween = null; target = current; }
      } else {
        current += (target - current) * (1 - Math.exp(-dt / WEIGHT));
        if (Math.abs(target - current) < .3) current = target;
      }
      window.scrollTo(0, current);
      settled = window.scrollY;
      render();
      running = tween !== null || current !== target;
      if (running) window.requestAnimationFrame(frame);
    }
    const start = () => { if (!running) { running = true; previous = 0; window.requestAnimationFrame(frame); } };
    const onWheel = event => {
      if (event.ctrlKey || event.defaultPrevented || Math.abs(event.deltaX) > Math.abs(event.deltaY) || scrollsItself(event.target)) return;
      event.preventDefault();
      if (!running) sync();
      else if (tween) { tween = null; target = current; }
      const scale = event.deltaMode === 1 ? LINE : event.deltaMode === 2 ? window.innerHeight : 1;
      target = clamp(target + event.deltaY * scale, 0, limit());
      start();
    };
    const to = destination => {
      destination = clamp(destination, 0, limit());
      if (!enabled) { window.scrollTo({ top: destination, behavior: reduceMotion.matches ? 'instant' : 'smooth' }); return; }
      if (!running) sync();
      const distance = Math.abs(destination - current);
      tween = { from: current, to: destination, start: performance.now(), duration: clamp(900 + distance / 2.5, 900, 2000) };
      target = destination;
      start();
    };
    // In-page links glide too, landing where scroll-padding would put them.
    // Focus follows so the keyboard continues from the destination.
    document.addEventListener('click', event => {
      if (!enabled || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest('a[href^="#"]');
      if (!link || link.classList.contains('skip-link')) return;
      const id = decodeURIComponent(link.hash.slice(1));
      const section = id ? document.getElementById(id) : document.body;
      if (!section) return;
      event.preventDefault();
      const padding = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
      to(section.getBoundingClientRect().top + window.scrollY - padding);
      if (!section.hasAttribute('tabindex')) section.tabIndex = -1;
      section.focus({ preventScroll:true });
      if (link.hash && link.hash !== location.hash) history.pushState(null, '', link.hash);
    });
    const update = () => {
      const next = allowed();
      if (next === enabled) return;
      enabled = next;
      root.classList.toggle('smooth-scroll', enabled);
      if (enabled) window.addEventListener('wheel', onWheel, { passive:false });
      else { window.removeEventListener('wheel', onWheel); tween = null; }
    };
    update();
    return { to, update };
  })();
  storyButtons.forEach((button, i) => button.addEventListener('click', () => {
    smoothScroll.to(storyTop + storyTravel * (i / 2));
  }));

  // Keep native details semantics, but let a closing answer finish its exit.
  // Reading the current animated state makes fast reversals continuous. Only
  // one answer is open at a time: opening the next one closes the previous.
  const faqItems = [];
  document.querySelectorAll('.faq details').forEach(details => {
    const summary = details.querySelector('summary');
    const answer = document.createElement('div');
    answer.className = 'faq-answer';
    [...details.childNodes].filter(node => node !== summary).forEach(node => answer.appendChild(node));
    details.appendChild(answer);
    let desiredOpen = details.open;
    let heightAnimation = null, answerAnimation = null, generation = 0, targetHeight = 0;
    details.dataset.expanded = String(desiredOpen);
    answer.inert = !desiredOpen;

    function cancelAnimations() {
      if (heightAnimation) { heightAnimation.onfinish = null; heightAnimation.cancel(); }
      if (answerAnimation) answerAnimation.cancel();
      heightAnimation = answerAnimation = null;
    }
    function settle() {
      generation++;
      cancelAnimations();
      details.open = desiredOpen;
      details.dataset.expanded = String(desiredOpen);
      answer.inert = !desiredOpen;
      details.style.removeProperty('overflow');
      measure();
    }
    function naturalHeight(open) {
      const style = getComputedStyle(details);
      const edges = ['paddingTop', 'paddingBottom', 'borderTopWidth', 'borderBottomWidth']
        .reduce((sum, key) => sum + (parseFloat(style[key]) || 0), 0);
      return summary.getBoundingClientRect().height + edges + (open ? answer.getBoundingClientRect().height : 0);
    }
    function animateAnswer() {
      if (reduceMotion.matches || typeof details.animate !== 'function') { settle(); return; }
      const currentHeight = details.getBoundingClientRect().height;
      const currentAnswer = getComputedStyle(answer);
      const start = details.open
        ? { opacity:currentAnswer.opacity, transform:currentAnswer.transform, filter:currentAnswer.filter }
        : { opacity:0, transform:'translateY(-8px)', filter:'blur(4px)' };
      const run = ++generation;
      cancelAnimations();
      details.open = true;
      details.dataset.expanded = String(desiredOpen);
      answer.inert = !desiredOpen;
      details.style.overflow = 'hidden';
      targetHeight = naturalHeight(desiredOpen);
      if (Math.abs(targetHeight - currentHeight) < 1) { settle(); return; }
      const duration = desiredOpen ? 620 : 420;
      heightAnimation = details.animate(
        [{ height:`${currentHeight}px` }, { height:`${targetHeight}px` }],
        { duration, easing:'cubic-bezier(.22,.8,.22,1)', fill:'both' }
      );
      const frames = desiredOpen
        ? [start, { opacity:1, transform:'translateY(2px)', filter:'blur(0)', offset:.75 }, { opacity:1, transform:'translateY(0)', filter:'blur(0)' }]
        : [start, { opacity:0, transform:'translateY(-6px)', filter:'blur(3px)' }];
      answerAnimation = answer.animate(frames, {
        duration:desiredOpen ? 550 : 260,
        easing:'cubic-bezier(.2,.7,.2,1)', fill:'both'
      });
      heightAnimation.onfinish = () => { if (run === generation) settle(); };
    }
    const close = () => { if (desiredOpen) { desiredOpen = false; animateAnswer(); } };
    faqItems.push({ details, close });
    summary.addEventListener('click', event => {
      event.preventDefault();
      desiredOpen = !desiredOpen;
      if (desiredOpen) faqItems.forEach(item => { if (item.details !== details) item.close(); });
      animateAnswer();
    });
    reduceMotion.addEventListener('change', () => { if (reduceMotion.matches) settle(); });
    if ('ResizeObserver' in window) {
      const resize = new ResizeObserver(() => {
        if (heightAnimation && Math.abs(naturalHeight(desiredOpen) - targetHeight) > 1) animateAnswer();
      });
      resize.observe(summary);
      resize.observe(answer);
    }
  });
  // Viewport coordinates keep the light under the cursor, even during pinned
  // horizontal scenes. Touch and coarse pointers never track or paint the glow.
  let glowFrame = 0, glowX = 0, glowY = 0;
  const moveGlow = event => {
    if (!glowAllowed() || event.pointerType === 'touch' || !event.isPrimary) return;
    glowX = event.clientX;
    glowY = event.clientY;
    if (glowFrame) return;
    glowFrame = window.requestAnimationFrame(() => {
      glowFrame = 0;
      if (!glowAllowed() || document.hidden) return;
      flashlight.style.setProperty('--mouse-x', `${clamp(glowX, 0, window.innerWidth)}px`);
      flashlight.style.setProperty('--mouse-y', `${clamp(glowY, 0, window.innerHeight)}px`);
      flashlight.classList.add('is-tracking');
      flashlight.classList.remove('is-hidden');
    });
  };
  const hideGlow = () => {
    window.cancelAnimationFrame(glowFrame);
    glowFrame = 0;
    if (flashlight.classList.contains('is-tracking')) flashlight.classList.add('is-hidden');
  };
  const resetGlow = () => {
    hideGlow();
    flashlight.classList.remove('is-tracking', 'is-hidden');
    flashlight.style.removeProperty('--mouse-x');
    flashlight.style.removeProperty('--mouse-y');
    requestTick();
  };
  document.addEventListener('pointermove', moveGlow, { passive:true });
  document.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch') resetGlow();
    else moveGlow(event);
  }, { passive:true });
  document.documentElement.addEventListener('pointerleave', hideGlow, { passive:true });
  window.addEventListener('blur', hideGlow);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) hideGlow();
  });
  reduceMotion.addEventListener('change', () => { resetGlow(); smoothScroll.update(); });
  touchScreen.addEventListener('change', () => {
    if (touchScreen.matches) releaseHeroMotion();
    resetGlow();
    smoothScroll.update();
  });
  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', measure, { passive: true });
  window.addEventListener('load', measure);
  reduceMotion.addEventListener('change', () => { initializeMotion(); measure(); });
  initializeMotion();
  if (document.fonts) document.fonts.ready.then(measure);
  measure();
  // The box office. With an Eventbrite event configured up top, the Get
  // Tickets button opens checkout in a modal drawn like the rest of the
  // night: veil, mist, one lit panel. Eventbrite's widget script is only
  // fetched the first time the box office opens, and its checkout renders
  // into the frame inside the panel. If the script cannot arrive (offline,
  // blocked), the panel offers the direct line to Beer Zombies instead.
  // `?tickets=preview` opens the empty box office on arrival so the design
  // can be checked before the event exists.
  const boxOffice = document.querySelector('.ticket-modal');
  if (boxOffice) {
    const previewMode = new URLSearchParams(location.search).get('tickets') === 'preview';
    const checkoutEnabled = /^\d+$/.test(EVENTBRITE_EVENT_ID);
    const panel = boxOffice.querySelector('.ticket-modal-panel');
    const closeButton = boxOffice.querySelector('.ticket-modal-close');
    const veil = boxOffice.querySelector('.ticket-modal-veil');
    const waitNote = boxOffice.querySelector('.ticket-modal-status');
    const fallbackNote = boxOffice.querySelector('.ticket-modal-fallback');
    const report = (name, params) => { if (typeof window.gtag === 'function') window.gtag('event', name, params); };
    let hideTimer = 0, watchdog = 0, widgetsPromise = null, mounted = false, lastFocus = null;
    const boxOfficeOpen = () => boxOffice.classList.contains('is-open');
    const showFallback = () => { clearTimeout(watchdog); waitNote.hidden = true; fallbackNote.hidden = false; };
    const settleCheckout = () => { clearTimeout(watchdog); waitNote.hidden = true; };
    // The widget announces its first paint to the parent window; undocumented,
    // so a patient watchdog backs it up rather than anything relying on it.
    window.addEventListener('message', event => {
      if (/\beventbrite\./.test(event.origin) && event.data && event.data.messageName === 'widgetRenderComplete') settleCheckout();
    });
    const loadWidgets = () => widgetsPromise || (widgetsPromise = new Promise((resolve, reject) => {
      if (window.EBWidgets) { resolve(); return; }
      const script = document.createElement('script');
      script.src = 'https://www.eventbrite.com/static/widgets/eb_widgets.js';
      script.async = true;
      script.onload = () => { if (window.EBWidgets) resolve(); else reject(new Error('Eventbrite widgets unavailable')); };
      script.onerror = () => reject(new Error('Eventbrite widget script failed to load'));
      document.head.appendChild(script);
    }));
    const mountCheckout = () => {
      if (mounted) return;
      waitNote.hidden = false;
      fallbackNote.hidden = true;
      clearTimeout(watchdog);
      watchdog = setTimeout(() => {
        if (boxOffice.querySelector('.ticket-modal-checkout iframe')) settleCheckout();
        else showFallback();
      }, 10000);
      loadWidgets().then(() => {
        if (mounted) return;
        mounted = true;
        window.EBWidgets.createWidget({
          widgetType: 'checkout',
          eventId: EVENTBRITE_EVENT_ID,
          iframeContainerId: 'eventbrite-checkout',
          iframeContainerHeight: 625,
          themeSettings: { brandColor: '#D9B47B' }, // the site's amber, on Eventbrite's buttons
          onOrderComplete: order => report('eventbrite_order_complete', { order_id: order && order.orderId })
        });
      }).catch(() => { widgetsPromise = null; showFallback(); });
    };
    const openBoxOffice = () => {
      if (boxOfficeOpen()) return;
      lastFocus = document.activeElement;
      clearTimeout(hideTimer);
      boxOffice.hidden = false;
      void boxOffice.offsetWidth; // commit the display change so the entrance transitions run
      boxOffice.classList.add('is-open');
      document.documentElement.classList.add('modal-open');
      if (checkoutEnabled) mountCheckout();
      else { waitNote.hidden = true; fallbackNote.hidden = false; }
      closeButton.focus({ preventScroll:true });
      report('ticket_modal_open');
    };
    const closeBoxOffice = () => {
      if (!boxOfficeOpen()) return;
      boxOffice.classList.remove('is-open');
      document.documentElement.classList.remove('modal-open');
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => { boxOffice.hidden = true; }, reduceMotion.matches ? 0 : 500);
      if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll:true });
    };
    closeButton.addEventListener('click', closeBoxOffice);
    veil.addEventListener('click', closeBoxOffice);
    document.addEventListener('keydown', event => {
      if (!boxOfficeOpen()) return;
      if (event.key === 'Escape') { closeBoxOffice(); return; }
      if (event.key === 'Tab') {
        const focusable = [...panel.querySelectorAll('a[href], button, iframe')].filter(el => el.offsetParent !== null);
        if (!focusable.length) return;
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
    if (checkoutEnabled || previewMode) {
      ticketButton.setAttribute('aria-haspopup', 'dialog');
      ticketButton.addEventListener('click', event => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; // honor open-in-new-tab
        event.preventDefault();
        openBoxOffice();
      });
    }
    if (previewMode) window.setTimeout(openBoxOffice, 600);
  }
})();

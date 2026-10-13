import { StrictMode, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SceneJourney, type JourneySignal } from '@ai-factory/creative-three';
import { useReducedMotion, type Quality } from '@ai-factory/creative-core';
import './showcase.css';
gsap.registerPlugin(useGSAP, ScrollTrigger);

function Showcase() {
  const journey = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const requestFrame = useRef<(() => void) | null>(null);
  const signal = useMemo<JourneySignal>(() => ({ progress, requestFrame }), []);
  const [paused, setPaused] = useState(false);
  const [quality, setQuality] = useState<Quality>('eco');
  const manual = useRef<HTMLInputElement>(null);
  const reduced = useReducedMotion();
  const trigger = useRef<ScrollTrigger | null>(null);
  useGSAP(() => {
    if (reduced) return;
    // This page owns one viewport trigger. Preference changes remove all triggers;
    // clear the saved restoration position before constructing a fresh one.
    ScrollTrigger.clearScrollMemory(); ScrollTrigger.getScrollFunc(window)(window.scrollY);
    trigger.current = ScrollTrigger.create({ trigger: journey.current, start: 'top top', end: 'bottom bottom',
      onUpdate: self => {
        progress.current = self.progress;
        if (manual.current) manual.current.value = String(Math.round(self.progress * 100));
        requestFrame.current?.();
      },
    });
    return () => { trigger.current = null; };
  }, { scope: journey, dependencies: [reduced], revertOnUpdate: true });
  useGSAP(() => {
    const current = trigger.current;
    if (!current) return;
    if (paused) current.disable(false);
    else {
      // Disabled triggers can retain an old cached scroll value. Refresh from the native
      // position before re-enabling, so resume follows where the visitor actually is.
      ScrollTrigger.clearScrollMemory(); current.scroll(window.scrollY); current.enable(false); current.update();
    }
  }, { dependencies: [paused, reduced] });
  const move = (value: number) => {
    progress.current = value / 100; requestFrame.current?.();
  };
  return <>
    <a className="shift-skip" href="#chapters">Skip to chapters</a>
    <header className="shift-header"><a href="/" aria-label="Return to creative workbench">SHIFT<span>/01</span></a><span>AN ORIGINAL STUDY<br/>FORM / LIGHT / CHANGE</span><a className="shift-enter" href="#chapters">Explore ↘</a></header>
    <main>
      <section ref={journey} className="shift-journey" aria-label="Sculpture journey">
        <div className="shift-sticky">
          <div className="shift-title" aria-hidden="true">SHIFT</div>
          <SceneJourney signal={signal} paused={paused} quality={quality}/>
          <div className="shift-overlay"><span>01 — 03 / TRANSFORMATION</span><h1>Nothing stays<br/><em>in one shape.</em></h1><p>An orbit becomes a constellation.<br/>{reduced ? 'Use manual chapters. Explore at your own pace.' : 'Scroll to take it apart. Return to bring it home.'}</p></div>
          <span className="shift-scroll" aria-hidden="true">{reduced ? 'EXPLORE WITH MANUAL CHAPTERS' : 'SCROLL TO TRANSFORM ↓'}</span>
        <div className="shift-controls" aria-label="Scene controls">
          <button onClick={() => setPaused(value => !value)} aria-pressed={paused}>{paused ? 'Resume motion' : 'Pause motion'}</button>
          <label>Scene quality<select value={quality} onChange={event => setQuality(event.target.value as Quality)}><option value="eco">Eco</option><option value="high">High + bloom</option></select></label>
          <label>Manual chapter<input ref={manual} type="range" min="0" max="100" defaultValue="0" onChange={event => move(Number(event.target.value))}/></label>
          <p role="status">{reduced ? 'Reduced motion · use manual chapters' : paused ? 'Motion paused · manual chapters available' : 'Scroll choreography enabled'}</p>
        </div>
        </div>
      </section>
      <section className="shift-chapters" id="chapters" aria-label="Chapters">
        <div className="shift-intro"><span>THE SAME OBJECT. A DIFFERENT PERSPECTIVE.</span><h2>Take the familiar<br/><em>somewhere strange.</em></h2></div>
        <div className="shift-chapter-grid"><article><span>01 / ASSEMBLE</span><h3>A centre of gravity.</h3><p>Three folded orbits. One core. A sculpture built from an original Blender source.</p></article><article><span>02 / SEPARATE</span><h3>Make space for surprise.</h3><p>Scroll separates each form while the camera changes its point of view. Every movement can be reversed.</p></article><article><span>03 / RESOLVE</span><h3>Return, transformed.</h3><p>The object comes together in a new light. Shape, material and atmosphere tell one connected story.</p></article></div>
        <a href="/" className="shift-back">Open the creative instruments ↗</a>
      </section>
    </main><footer className="shift-footer"><span>SHIFT / AI FACTORY</span><span>ORIGINAL FORM. REUSABLE SCENE.</span></footer>
  </>;
}
createRoot(document.getElementById('root')!).render(<StrictMode><Showcase/></StrictMode>);

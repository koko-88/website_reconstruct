import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion } from 'motion/react';
import { useReducedMotion } from '@ai-factory/creative-core';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Native scrolling owns progression. GSAP owns only this inner transform. */
export function ScrollComposition({ paused = false }: { paused?: boolean }) {
  const scope = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const pause = useRef(paused);
  pause.current = paused;
  const reduced = useReducedMotion();
  useGSAP(() => {
    if (reduced) return;
    const tween = gsap.fromTo('.composition-form', { rotation: -25, xPercent: -25 }, {
      rotation: 75, xPercent: 25, ease: 'none',
      scrollTrigger: { id: 'creative-composition', trigger: scope.current, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
    });
    trigger.current = tween.scrollTrigger ?? null;
    if (pause.current) trigger.current?.disable(false);
    return () => { trigger.current = null; };
  }, { scope, dependencies: [reduced], revertOnUpdate: true });
  useEffect(() => { if (paused) trigger.current?.disable(false); else trigger.current?.enable(false); }, [paused, reduced]);
  return <div ref={scope} className="scroll-composition" data-testid="scroll-composition" data-reduced={reduced}>
    <div className="composition-grid" aria-hidden="true"/>
    <div className="composition-form" data-testid="composition-form" aria-hidden="true"><span/><span/><span/></div>
    <div className="composition-caption"><span>SCROLL TO COMPOSE</span><span>01 — 03</span></div>
  </div>;
}

/** Motion owns only this DOM subtree; it never competes with GSAP for a transform. */
export function PresencePanel({ children, stateKey }: { children: ReactNode; stateKey: string }) {
  const reduced = useReducedMotion();
  return <motion.div key={stateKey} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.22 }}>{children}</motion.div>;
}

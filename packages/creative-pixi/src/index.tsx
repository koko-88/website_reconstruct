import { useEffect, useRef, useState } from 'react';
import { Application, Container, Graphics } from 'pixi.js';
import { Poster, qualityPolicy, useSceneActivity, useWebGL2, type Quality } from '@ai-factory/creative-core';

export function ParticleStage({ color, paused, quality, spread, angle = 0 }: { color: string; paused: boolean; quality: Quality; spread: number; angle?: number }) {
  const root = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const parameters = useRef({ color, spread, angle, active: false });
  const { active } = useSceneActivity(root, paused);
  const supported = useWebGL2();
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [revision, setRevision] = useState(0);
  parameters.current = { color, spread, angle, active };
  useEffect(() => {
    if (!supported || failed || !root.current) return;
    const host = root.current;
    const app = new Application();
    setReady(false);
    let disposed = false;
    let initialized = false;
    let destroyed = false;
    let observer: ResizeObserver | undefined;
    let lose: (() => void) | undefined;
    let elapsed = 0;
    let lastAngle = parameters.current.angle;
    const particles = new Container();
    const destroyOwned = () => {
      if (destroyed) return;
      destroyed = true; observer?.disconnect(); lose?.();
      if (appRef.current === app) appRef.current = null;
      if (initialized) app.destroy(true, { children: true });
      else {
        // Application.destroy assumes every plugin/renderer completed init. A rejected init
        // requires cleaning only resources actually assigned to this instance.
        app.ticker?.destroy();
        if (app.queueResize) globalThis.removeEventListener('resize', app.queueResize);
        app.cancelResize?.();
        app.renderer?.destroy(true);
        if (!app.stage.destroyed) app.stage.destroy({ children: true });
      }
      if (!particles.destroyed) particles.destroy({ children: true });
    };
    const count = qualityPolicy[quality].particles;
    const points = Array.from({ length: count }, (_, index) => {
      const dot = new Graphics().circle(0, 0, 3 + index % 3).fill('#d7ef8c');
      particles.addChild(dot); return dot;
    });
    const draw = () => {
      const { width, height } = app.screen;
      particles.pivot.set(width / 2, height / 2);
      particles.position.set(width / 2, height / 2);
      const { spread: radius, color: tint } = parameters.current;
      if (lastAngle !== parameters.current.angle) { lastAngle = parameters.current.angle; particles.rotation = lastAngle * Math.PI / 180; }
      points.forEach((dot, index) => {
        const turn = index * 2.399963 + elapsed * 0.18;
        const distance = Math.sqrt(index / count) * Math.min(width, height) * radius / 220;
        dot.position.set(width / 2 + Math.cos(turn) * distance, height / 2 + Math.sin(turn) * distance);
        dot.tint = index % 4 === 0 ? '#d7ef8c' : tint;
      });
    };
    app.init({ resizeTo: host, preference: ['webgl'], autoStart: false, sharedTicker: false, background: '#202720', resolution: Math.min(devicePixelRatio, qualityPolicy[quality].dpr), autoDensity: true, antialias: true }).then(() => {
      initialized = true;
      if (disposed) { destroyOwned(); return; }
      appRef.current = app; app.stage.addChild(particles); host.appendChild(app.canvas);
      particles.rotation = parameters.current.angle * Math.PI / 180;
      app.canvas.setAttribute('aria-hidden', 'true');
      const onLost = (event: Event) => { event.preventDefault(); setFailed(true); };
      app.canvas.addEventListener('webglcontextlost', onLost);
      lose = () => app.canvas.removeEventListener('webglcontextlost', onLost);
      const move = (event: PointerEvent) => {
        const box = host.getBoundingClientRect();
        particles.rotation = ((event.clientX - box.left) / box.width - 0.5) * 0.5;
        if (!parameters.current.active) app.render();
      };
      host.addEventListener('pointermove', move);
      const priorLose = lose;
      lose = () => { priorLose(); host.removeEventListener('pointermove', move); };
      app.ticker.maxFPS = quality === 'eco' ? 30 : 60;
      app.ticker.add(ticker => { if (parameters.current.active) elapsed += Math.min(ticker.deltaMS, 50) / 1000; draw(); });
      observer = new ResizeObserver(() => { app.resize(); draw(); app.render(); }); observer.observe(host);
      draw(); app.render(); setReady(true); setRevision(n => n + 1);
    }).catch(() => { destroyOwned(); if (!disposed) setFailed(true); });
    return () => {
      disposed = true;
      if (initialized) destroyOwned(); // Pending initialization settles before its resources are destroyed.
    };
  }, [supported, failed, quality]);
  useEffect(() => {
    const app = appRef.current;
    if (!app) return;
    if (active) app.start(); else { app.stop(); app.ticker.update(performance.now()); app.render(); }
  }, [active, color, spread, angle, revision]);
  return <div ref={root} className="creative-stage" data-testid="particle-stage" data-active={active && !failed} data-ready={ready && !failed && supported === true}>
    {failed || supported === false ? <Poster reason="Particle graphics unavailable"/> : !ready && <p role="status">Preparing particle field…</p>}
  </div>;
}

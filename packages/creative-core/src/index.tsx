import { Component, useEffect, useState, type ReactNode, type RefObject } from 'react';

export type Quality = 'eco' | 'high';
export const qualityPolicy = {
  eco: { dpr: 1, particles: 96, effects: false },
  high: { dpr: 1.5, particles: 240, effects: true },
} as const;

export function useReducedMotion() {
  // Conservative first render also works during server rendering.
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update(); query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return reduced;
}

export function useSceneActivity(ref: RefObject<HTMLElement | null>, paused: boolean) {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    const visibility = () => setHidden(document.hidden);
    observer.observe(element); visibility();
    document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); };
  }, [ref]);
  return { active: visible && !hidden && !paused && !reduced, visible, reduced };
}

export function Poster({ reason = 'Interactive view unavailable', src = '/assets/poster.webp' }: { reason?: string; src?: string }) {
  return <div className="scene-poster" role="status"><picture>{src === '/assets/poster.webp' && <source type="image/avif" srcSet="/assets/poster-480.avif 480w, /assets/poster-960.avif 960w" sizes="260px"/>}<img src={src} alt="Original folded form in rust and lime"/></picture><p>{reason}. All controls and descriptions remain available.</p></div>;
}

export class CreativeBoundary extends Component<{ children: ReactNode; fallback: ReactNode; onError?: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError?.(); }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

export function useWebGL2() {
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl2');
      setSupported(Boolean(context));
      context?.getExtension('WEBGL_lose_context')?.loseContext();
    } catch { setSupported(false); }
  }, []);
  return supported;
}

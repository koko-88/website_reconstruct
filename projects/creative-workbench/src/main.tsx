import { StrictMode, Suspense, lazy, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CreativeBoundary, Poster, useReducedMotion, type Quality } from '@ai-factory/creative-core';
import { PresencePanel, ScrollComposition } from '@ai-factory/creative-motion';
import './style.css';

const Spatial = lazy(() => import('@ai-factory/creative-three').then(module => ({ default: module.SpatialStage })));
const Particles = lazy(() => import('@ai-factory/creative-pixi').then(module => ({ default: module.ParticleStage })));
const modes = ['motion', 'spatial', 'particles'] as const;
type Mode = typeof modes[number];
function route(): Mode { const value = location.hash.slice(1); return modes.includes(value as Mode) ? value as Mode : 'motion'; }
const palettes = [{ name: 'Oxide', color: '#ba5735' }, { name: 'Lime', color: '#d7ef8c' }, { name: 'Cobalt', color: '#527bbd' }];
const descriptions = {
  motion: { title: 'A form in time.', text: 'Scroll the page. Three folded planes turn together, then retrace their path when you scroll back. A small study in rhythm, proportion, and restraint.' },
  spatial: { title: 'An object with presence.', text: 'A sculpture made in Blender, brought into the browser. Drag to orbit, or use the orientation control. Change its finish and explore the light moving across its surface.' },
  particles: { title: 'Order, with a little play.', text: 'A field of points arranged by the golden angle. Move across the surface to turn the field, or change the spread below. A living pattern that remains legible at rest.' },
};

function App() {
  const [mode, setMode] = useState<Mode>(route);
  const [color, setColor] = useState(palettes[0].color);
  const [paused, setPaused] = useState(false);
  const [quality, setQuality] = useState<Quality>('eco');
  const [angle, setAngle] = useState(0);
  const [spread, setSpread] = useState(90);
  const [effects, setEffects] = useState(false);
  const [textured, setTextured] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      const value = location.hash.slice(1);
      if (!modes.includes(value as Mode)) return;
      setMode(value as Mode);
      frame = requestAnimationFrame(() => document.getElementById('instrument')?.scrollIntoView({ behavior: 'instant', block: 'start' }));
    };
    update(); addEventListener('hashchange', update);
    return () => { cancelAnimationFrame(frame); removeEventListener('hashchange', update); };
  }, []);
  const select = (next: Mode) => { location.hash = next; setMode(next); };
  return <>
    <a className="skip-link" href="#instrument">Skip to instrument</a>
    <header><a className="wordmark" href="#motion" aria-label="Form, motion instrument">F<span>O</span>RM<span className="wordmark-slash">/</span></a><span className="header-note">AI FACTORY<br/>CREATIVE WORKBENCH</span><span className="edition">EDITION 001<br/>FORM & MOVEMENT</span></header>
    <main>
      <section className="intro" aria-labelledby="headline"><div className="eyebrow"><span className="dot"/> AN OPEN STUDIO FOR THE WEB</div><h1 id="headline">Make the web<br/><em>feel something.</em></h1><p className="intro-copy">Material. Movement. A little imagination.<br/>Three ways to turn an idea into an experience.</p><a className="text-link" href="#instrument">Enter the instrument <span aria-hidden="true">↘</span></a> <a className="text-link" href="/showcase.html">Explore SHIFT <span aria-hidden="true">↗</span></a><span className="intro-index" aria-hidden="true">F / 01</span></section>
      <section id="instrument" className="instrument" aria-label="Creative instrument">
        <div className="instrument-top"><span className="eyebrow">CHOOSE YOUR DISCIPLINE</span><span className="run-state" role="status">{reduced ? 'Reduced motion · static view' : paused ? 'Motion paused' : 'Motion enabled'}</span></div>
        <nav className="discipline-nav" aria-label="Disciplines">{modes.map((item, index) => <button key={item} aria-pressed={mode === item} onClick={() => select(item)}><span>0{index + 1}</span>{item}<span className="discipline-arrow" aria-hidden="true">↗</span></button>)}</nav>
        <div className="instrument-body">
          <div className="view-wrap"><div className="view-label" aria-hidden="true"><span>LIVE STUDY / {mode.toUpperCase()}</span><span>FORM LAB</span></div>
            <CreativeBoundary key={mode} fallback={<Poster reason="This discipline failed to load"/>}><Suspense fallback={<p className="load-note" role="status">Loading discipline…</p>}>
              {mode === 'motion' ? <ScrollComposition paused={paused}/> : mode === 'spatial' ? <Spatial color={color} angle={angle} quality={quality} paused={paused} effects={effects} textured={textured}/> : <Particles color={color} spread={spread} angle={angle} quality={quality} paused={paused}/>}
            </Suspense></CreativeBoundary>
          </div>
          <aside className="control-panel" aria-label="Instrument controls">
            <PresencePanel stateKey={mode}><span className="eyebrow">STUDY 0{modes.indexOf(mode) + 1}</span><h2>{descriptions[mode].title}</h2><p>{descriptions[mode].text}</p></PresencePanel>
            {mode !== 'motion' && <fieldset><legend>Material / color</legend><div className="swatches">{palettes.map(palette => <button key={palette.name} aria-label={palette.name} aria-pressed={color === palette.color} style={{ background: palette.color }} onClick={() => setColor(palette.color)}>{color === palette.color && <span aria-hidden="true">✓</span>}</button>)}</div></fieldset>}
            {mode !== 'motion' && <><label className="range-label" htmlFor="orientation">Orientation <output>{angle}°</output></label><input id="orientation" type="range" min="-180" max="180" value={angle} onChange={event => setAngle(Number(event.target.value))}/></>}
            {mode === 'particles' && <><label className="range-label" htmlFor="spread">Spread <output>{spread}%</output></label><input id="spread" type="range" min="30" max="100" value={spread} onChange={event => setSpread(Number(event.target.value))}/></>}
            {mode !== 'motion' && <><label htmlFor="quality">Render quality</label><select id="quality" value={quality} onChange={event => setQuality(event.target.value as Quality)}><option value="eco">Eco · lower energy</option><option value="high">High · more detail</option></select></>}
            {mode === 'spatial' && <label className="checkbox-label"><input type="checkbox" disabled={quality === 'eco'} checked={quality === 'high' && effects} onChange={event => setEffects(event.target.checked)}/> Bloom {quality === 'eco' && <span>(High quality)</span>}</label>}
            {mode === 'spatial' && <label className="checkbox-label"><input type="checkbox" checked={textured} onChange={event => setTextured(event.target.checked)}/> Original pattern</label>}
            <button className="pause-button" onClick={() => setPaused(value => !value)} aria-pressed={paused}>{paused ? 'Resume motion' : 'Pause motion'}<span aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span></button>
            <p className="control-footnote">{reduced ? 'Your reduced-motion preference is respected. Manual controls remain active.' : 'Animation rests when the instrument leaves the screen.'}</p>
          </aside>
        </div>
      </section>
      <section className="principles" aria-labelledby="principles-title"><span className="eyebrow">BUILT WITH INTENTION</span><h2 id="principles-title">Expressive by design.<br/>Considerate by default.</h2><div className="principle-grid"><article><span>01 / MATERIAL</span><h3>Start with something real.</h3><p>An original source scene, a portable model, a deliberate palette. Every detail has a reason to be here.</p></article><article><span>02 / MOVEMENT</span><h3>Give motion a purpose.</h3><p>Movement reveals relationships. Reverse it, interrupt it, or pause it. The experience still makes sense.</p></article><article><span>03 / CARE</span><h3>Leave room for everyone.</h3><p>Keyboard controls. Quiet motion. Smaller screens. A static view when graphics are unavailable.</p></article></div></section>
    </main><footer><span className="wordmark">FORM /</span><p>Original studies. Reusable instruments.<br/>Made for the next idea.</p><a className="text-link" href="#headline">Back to the beginning <span aria-hidden="true">↑</span></a></footer>
  </>;
}

createRoot(document.getElementById('root')!).render(<StrictMode><App/></StrictMode>);

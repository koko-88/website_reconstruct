import { Suspense, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { AdditiveBlending, Color, Mesh, MeshPhysicalMaterial, ShaderMaterial, type Group } from 'three';
import { CreativeBoundary, Poster, qualityPolicy, useSceneActivity, useWebGL2, type Quality } from '@ai-factory/creative-core';
import { ContextGuard } from './context';

export type JourneySignal = { progress: RefObject<number>; requestFrame: RefObject<(() => void) | null> };
const clamp = (value: number) => Math.max(0, Math.min(1, value));

function JourneySculpture({ signal, onReady }: { signal: JourneySignal; onReady: () => void }) {
  const { scene } = useGLTF('/assets/form.glb', false);
  const root = useRef<Group>(null);
  const { camera, size } = useThree();
  const owned = useMemo(() => {
    const material = new MeshPhysicalMaterial({ color: '#eee9dd', metalness: 0.75, roughness: 0.22, iridescence: 0.8, iridescenceIOR: 1.3, clearcoat: 1 });
    const object = scene.clone(true);
    const parts: { mesh: Mesh; position: [number, number, number]; rotation: [number, number, number] }[] = [];
    object.traverse(child => {
      if (child instanceof Mesh) {
        child.material = material;
        parts.push({ mesh: child, position: child.position.toArray(), rotation: [child.rotation.x, child.rotation.y, child.rotation.z] });
      }
    });
    return { object, material, parts };
  }, [scene]);
  useEffect(() => { onReady(); }, [onReady]);
  useEffect(() => () => owned.material.dispose(), [owned]);
  const lime = useMemo(() => new Color('#d7ef8c'), []);
  const ivory = useMemo(() => new Color('#eee9dd'), []);
  useFrame(() => {
    const p = clamp(signal.progress.current);
    const separation = Math.sin(p * Math.PI) * 0.95;
    owned.parts.forEach(({ mesh, position, rotation }, index) => {
      const direction = index * Math.PI * 2 / owned.parts.length;
      mesh.position.set(position[0] + Math.cos(direction) * separation, position[1] + Math.sin(direction) * separation * 0.7, position[2] + (index - 1.5) * separation * 0.55);
      mesh.rotation.set(rotation[0] + separation * (index - 1) * 0.25, rotation[1] + separation * 0.55, rotation[2]);
    });
    if (root.current) root.current.rotation.set(0.1 + p * 0.35, p * Math.PI * 1.4, -0.22 + p * 0.44);
    owned.material.color.copy(ivory).lerp(lime, p);
    camera.position.set(Math.sin(p * Math.PI) * 0.55, 0.1 + p * 0.3, (size.width / size.height < 0.8 ? 9.7 : 7.5) - p * 0.6);
    camera.lookAt(0, 0, 0);
  });
  return <group ref={root} scale={1.35}><primitive object={owned.object} dispose={null}/></group>;
}

function JourneyField({ signal, active, quality }: { signal: JourneySignal; active: boolean; quality: Quality }) {
  const material = useRef<ShaderMaterial>(null);
  const positions = useMemo(() => {
    const count = quality === 'high' ? 2800 : 1200;
    const values = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const y = 1 - 2 * (i + 0.5) / count;
      const radius = Math.sqrt(1 - y * y); const theta = i * 2.399963229728653;
      values.set([Math.cos(theta) * radius * 4.8, y * 4.8, Math.sin(theta) * radius * 4.8], i * 3);
    }
    return values;
  }, [quality]);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uProgress: { value: 0 } }), []);
  useFrame((_state, delta) => {
    if (!material.current) return;
    if (active) uniforms.uTime.value += Math.min(delta, 0.05);
    uniforms.uProgress.value = clamp(signal.progress.current);
  });
  return <points><bufferGeometry key={quality}><bufferAttribute attach="attributes-position" args={[positions, 3]}/></bufferGeometry>
    <shaderMaterial ref={material} uniforms={uniforms} transparent depthWrite={false} blending={AdditiveBlending}
      vertexShader={`uniform float uTime;uniform float uProgress;varying float vDepth;
        void main(){vec3 p=position;float a=uTime*0.06+uProgress*1.8;
        p.xz=mat2(cos(a),-sin(a),sin(a),cos(a))*p.xz;
        p.y+=sin(p.x*1.4+uTime*0.35)*(0.1+uProgress*0.3);
        vec4 mv=modelViewMatrix*vec4(p,1.0);vDepth=clamp(5.0/-mv.z,0.15,1.0);
        gl_PointSize=clamp(15.0/-mv.z,1.0,4.0);gl_Position=projectionMatrix*mv;}`}
      fragmentShader={`varying float vDepth;void main(){float d=length(gl_PointCoord-0.5);if(d>0.5)discard;
        gl_FragColor=vec4(vec3(0.74,0.88,0.51),smoothstep(0.5,0.15,d)*vDepth*0.72);}`}/>
  </points>;
}

function SignalBridge({ signal }: { signal: JourneySignal }) {
  const { invalidate } = useThree();
  useEffect(() => {
    signal.requestFrame.current = invalidate; invalidate();
    return () => { if (signal.requestFrame.current === invalidate) signal.requestFrame.current = null; };
  }, [signal, invalidate]);
  return null;
}

export function SceneJourney({ signal, paused, quality = 'eco' }: { signal: JourneySignal; paused: boolean; quality?: Quality }) {
  const root = useRef<HTMLDivElement>(null);
  const { active } = useSceneActivity(root, paused);
  const supported = useWebGL2();
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const onReady = useMemo(() => () => setReady(true), []);
  const onError = useMemo(() => () => setFailed(true), []);
  return <div ref={root} className="journey-canvas" data-testid="scene-journey" data-ready={ready && !failed && supported === true} data-active={active && !failed}>
    {supported === null ? <p className="journey-loading" role="status">Preparing the scene…</p> : !supported || failed ? <Poster reason={failed ? 'Scene failed to load or graphics context was lost' : 'Immersive graphics unavailable; use the chapter controls'}/> :
      <CreativeBoundary onError={onError} fallback={<Poster reason="Scene failed to load"/>}>
        {!ready && <p className="journey-loading" role="status">Assembling the original sculpture…</p>}
        <Canvas aria-hidden="true" dpr={[1, qualityPolicy[quality].dpr]} frameloop={active ? 'always' : 'demand'} camera={{ position: [0, 0.1, 7.5], fov: 42 }} gl={{ antialias: true, powerPreference: 'low-power' }}>
          <ContextGuard onLost={onError}/><SignalBridge signal={signal}/><ambientLight intensity={1.4}/><directionalLight position={[4, 3, 5]} intensity={5}/><directionalLight color="#d7ef8c" position={[-4, -2, 1]} intensity={3}/>
          <Suspense fallback={null}><JourneySculpture signal={signal} onReady={onReady}/></Suspense>
          <JourneyField signal={signal} active={active} quality={quality}/>
          {qualityPolicy[quality].effects && <EffectComposer multisampling={0}><Bloom intensity={0.45} luminanceThreshold={0.85} mipmapBlur resolutionScale={0.5}/></EffectComposer>}
        </Canvas>
      </CreativeBoundary>}
  </div>;
}

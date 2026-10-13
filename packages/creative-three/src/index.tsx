import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { Color, Mesh, MeshStandardMaterial, ShaderMaterial, type Group } from 'three';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';
import { CreativeBoundary, Poster, qualityPolicy, useSceneActivity, useWebGL2, type Quality } from '@ai-factory/creative-core';
import { ContextGuard } from './context';
export { SceneJourney, type JourneySignal } from './journey';

const vertexShader = `varying vec2 vUv;
void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;
const fragmentShader = `uniform float uTime;uniform vec3 uInk;varying vec2 vUv;
void main(){float wave=sin(vUv.x*25.0+vUv.y*15.0+uTime)*0.5+0.5;
vec3 c=mix(uInk,vec3(0.84,0.94,0.55),smoothstep(0.35,0.8,wave));
gl_FragColor=vec4(c,1.0);}`;

function LoadedForm({ url, color, angle, active, onReady }: { url: string; color: string; angle: number; active: boolean; onReady: () => void }) {
  const { scene } = useGLTF(url, false);
  const group = useRef<Group>(null);
  const { invalidate } = useThree();
  // Geometry/textures belong to the loader cache. Only this instance's materials are cloned.
  const clone = useMemo(() => {
    const object = scene.clone(true);
    object.traverse(child => { if (child instanceof Mesh) child.material = Array.isArray(child.material) ? child.material.map(m => m.clone()) : child.material.clone(); });
    return object;
  }, [scene]);
  useEffect(() => {
    clone.traverse(child => { if (child instanceof Mesh) for (const material of Array.isArray(child.material) ? child.material : [child.material]) {
      if (material instanceof MeshStandardMaterial) { material.color.set(color); material.metalness = 0.55; material.roughness = 0.28; }
    } }); invalidate();
  }, [clone, color, invalidate]);
  useEffect(() => { onReady(); }, [onReady]);
  useEffect(() => () => {
    clone.traverse(child => { if (child instanceof Mesh) for (const material of Array.isArray(child.material) ? child.material : [child.material]) material.dispose(); });
  }, [clone]);
  useFrame((_state, delta) => {
    if (active && group.current) group.current.rotation.y += Math.min(delta, 0.05) * 0.28;
  });
  return <group ref={group} rotation={[0.1, angle * Math.PI / 180, 0.15]}><primitive object={clone} dispose={null}/></group>;
}

function ShaderField({ active }: { active: boolean }) {
  const material = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uInk: { value: new Color('#a84527') } }), []);
  useFrame((_state, delta) => { if (active && material.current) material.current.uniforms.uTime.value += Math.min(delta, 0.05); });
  return <mesh position={[0, 0, -1.8]}><planeGeometry args={[10, 7]}/><shaderMaterial ref={material} uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader}/></mesh>;
}

function TextureField({ onReady }: { onReady: () => void }) {
  const { gl } = useThree();
  const texture = useLoader(KTX2Loader, '/assets/poster.ktx2', loader => loader.setTranscoderPath('/assets/basis/').detectSupport(gl));
  useEffect(() => { onReady(); }, [texture, onReady]);
  return <mesh position={[0, 0, -1.8]}><planeGeometry args={[8, 8]}/><meshBasicMaterial map={texture}/></mesh>;
}

export function SpatialStage({ color, angle, quality, paused, effects, textured = false, modelUrl = '/assets/form.glb' }: {
  color: string; angle: number; quality: Quality; paused: boolean; effects: boolean; textured?: boolean; modelUrl?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const { active } = useSceneActivity(root, paused);
  const supported = useWebGL2();
  const [lost, setLost] = useState(false);
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
  const [textureReady, setTextureReady] = useState(false);
  const [failedKey, setFailedKey] = useState<string | null>(null);
  const boundaryKey = `${modelUrl}|${textured}`;
  const failed = failedKey === boundaryKey;
  const ready = loadedUrl === modelUrl && (!textured || textureReady) && !failed && !lost && supported === true;
  const onReady = useMemo(() => () => setLoadedUrl(modelUrl), [modelUrl]);
  const onTextureReady = useMemo(() => () => setTextureReady(true), []);
  const onError = useMemo(() => () => setFailedKey(boundaryKey), [boundaryKey]);
  const onLost = useMemo(() => () => setLost(true), []);
  return <div ref={root} className="creative-stage" data-testid="spatial-stage" data-active={active && !lost && !failed} data-ready={ready} data-effects={effects && qualityPolicy[quality].effects}>
    {supported === null ? <p role="status">Preparing spatial view…</p> : !supported || lost ? <Poster reason={lost ? 'Graphics context lost; reload to retry' : 'WebGL2 unavailable'}/> :
      <CreativeBoundary key={boundaryKey} onError={onError} fallback={<Poster reason="Model or graphics failed to load"/>}>
        {!ready && <p className="stage-loading" role="status">Loading original form…</p>}
        <Canvas aria-hidden="true" dpr={[1, qualityPolicy[quality].dpr]} frameloop={active ? 'always' : 'demand'} camera={{ position: [0, 0.2, 6], fov: 40 }} gl={{ antialias: quality === 'high', powerPreference: 'low-power' }}>
          <ContextGuard onLost={onLost}/><ambientLight intensity={1.7}/><directionalLight position={[3, 4, 5]} intensity={4}/>
          <Suspense fallback={null}><LoadedForm url={modelUrl} color={color} angle={angle} active={active} onReady={onReady}/></Suspense>
          {textured ? <Suspense fallback={null}><TextureField onReady={onTextureReady}/></Suspense> : <ShaderField active={active}/>}<OrbitControls makeDefault enableZoom={false} enablePan={false} enableDamping={active} autoRotate={false}/>
          {effects && qualityPolicy[quality].effects && <EffectComposer multisampling={0}><Bloom intensity={0.4} luminanceThreshold={0.8} mipmapBlur resolutionScale={0.5}/></EffectComposer>}
        </Canvas>
      </CreativeBoundary>}
  </div>;
}

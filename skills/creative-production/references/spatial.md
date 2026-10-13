# Spatial production

Consume `@ai-factory/creative-three` and declare the selected peers in the project manifest.
The workbench selects React 19.3.0, Three 0.186.1, Fiber 9.8.1, Drei 10.7.9,
react-three/postprocessing 3.2.0 and postprocessing 6.39.5. The last peer limits Three to <0.187.
Inspect peers and test before upgrades; do not use current v10 Fiber docs for the pinned v9 stack.

The real SpatialStage implementation is in packages/creative-three/src/index.tsx.
GLTFLoader runs through Drei useGLTF without external Draco downloads. Cached geometry belongs
to the loader; instance materials are cloned/disposed. Demand rendering is used while paused,
reduced, hidden or offscreen. OrbitControls invalidates manual changes. Avoid continuous controls
damping when static. Cached textures/models are bounded to the selected local assets in this example;
future unbounded user uploads need an explicit eviction/ownership policy.

The shader owns a delta-based uniform, not React state. Bloom is optional and High quality only.
KTX2Loader detects GPU formats and reads local Basis decoder bytes. The baseline GLB is uncompressed
so it works without decoder dependencies. Compressed variants require explicit local decoder setup
and browser verification; a successful optimizer command alone does not prove they load.

Read primary interfaces when making changes:
- [R3F demand rendering and scaling](https://r3f.docs.pmnd.rs/advanced/scaling-performance)
- [Three GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html)
- [Three KTX2Loader](https://threejs.org/docs/pages/KTX2Loader.html)
- [Drei controls](https://drei.docs.pmnd.rs/controls/introduction)
- [React postprocessing](https://react-postprocessing.docs.pmnd.rs/introduction)

Babylon graph MCPs are optional specialist tools already exposed. Do not add Babylon to every project
or turn graph payloads into a second universal renderer. Verify exported shaders/graphs in the
chosen runtime before claiming integration. No Babylon workflow is certified by the Three example.

SceneJourney (packages/creative-three/src/journey.tsx) is the maintained immersive pattern.
Its JourneySignal contains mutable progress and requestFrame refs. GSAP ScrollTrigger in the
workbench owns scroll progress; useFrame derives mesh separation, camera framing and material
color directly. R3F invalidate serves manual changes at rest. The point field uses deterministic
geometry and shader uniforms, 1,200/2,800 points, one point draw, and the same visibility/preference
policy. MeshPhysicalMaterial is owned by the instance and disposed; loader geometry stays cached.
For detailed product/environment projects, source asset quality, local PBR maps/lighting and a
project-specific camera storyboard are required. A richer asset needs measured budgets and target
browser review; this abstract reference does not certify photorealistic product rendering.

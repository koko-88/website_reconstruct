// Integration fixture imports the maintained package directly; no alternate scene implementation.
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { SpatialStage } from '@ai-factory/creative-three';
import '../../src/style.css';
function SceneConsumer() {
  const [url, setUrl] = useState('/assets/form.glb?variant=first');
  return <main><h1>Model replacement boundary</h1><button onClick={() => setUrl('/assets/form.glb?variant=second')}>Replace model</button>
    <SpatialStage color="#ba5735" angle={0} quality="eco" paused effects={false} modelUrl={url}/>
  </main>;
}
createRoot(document.getElementById('root')!).render(<SceneConsumer/>);

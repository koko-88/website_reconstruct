import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

// Mount outside asset Suspense so loss is observed even while model/texture loading is pending.
export function ContextGuard({ onLost }: { onLost: () => void }) {
  const { gl } = useThree();
  useEffect(() => {
    const lost = (event: Event) => { event.preventDefault(); onLost(); };
    gl.domElement.addEventListener('webglcontextlost', lost);
    return () => gl.domElement.removeEventListener('webglcontextlost', lost);
  }, [gl, onLost]);
  return null;
}

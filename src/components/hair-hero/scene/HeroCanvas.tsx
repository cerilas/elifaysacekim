import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import type { SceneProps } from '../types';
import { CameraRig } from './CameraRig';
import { Follicle, FollicleField } from './Follicle';
import { Lighting } from './Lighting';
import { Particles, TargetHalo } from './Particles';
import { Scalp } from './Scalp';
import { createPlacements } from './geometry';

type CanvasProps = SceneProps & {
  active: boolean;
  onReady: () => void;
  onContextLost: () => void;
  onContextRestored: () => void;
};

function Scene(props: SceneProps & { onReady: () => void }) {
  const group = useRef<THREE.Group>(null);
  const placements = useMemo(() => createPlacements(props.mobile), [props.mobile]);
  const ready = useRef(false);
  useFrame(() => {
    if (group.current) group.current.rotation.y = props.animation.current.rotation;
    if (!ready.current) { ready.current = true; props.onReady(); }
  });
  return <>
    <CameraRig {...props} />
    <Lighting {...props} />
    <group ref={group}>
      <Scalp {...props} />
      <FollicleField {...props} placements={placements} />
      <Follicle {...props} />
      <Particles {...props} />
      <TargetHalo {...props} />
    </group>
  </>;
}

function Lifecycle({ active, reducedMotion, onContextLost, onContextRestored }: CanvasProps) {
  const { gl, invalidate } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => { event.preventDefault(); onContextLost(); };
    canvas.addEventListener('webglcontextlost', lost);
    canvas.addEventListener('webglcontextrestored', onContextRestored);
    return () => {
      canvas.removeEventListener('webglcontextlost', lost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);
    };
  }, [gl, onContextLost, onContextRestored]);
  useEffect(() => { if (active) invalidate(); }, [active, reducedMotion, invalidate]);
  return null;
}

export default function HeroCanvas(props: CanvasProps) {
  const { active, mobile, reducedMotion } = props;
  const [qualityDpr, setQualityDpr] = useState(1.5);
  const decline = useCallback(() => setQualityDpr(previous => Math.max(0.8, previous - 0.25)), []);
  const fallback = useCallback(() => setQualityDpr(0.8), []);
  const dpr = Math.min(typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1,
    mobile ? 1.15 : 1.6, qualityDpr);
  return <Canvas
    camera={{ position: [2, 1.6, 8], fov: 37, near: 0.1, far: 40 }}
    dpr={dpr}
    frameloop={!active ? 'never' : reducedMotion ? 'demand' : 'always'}
    gl={{ antialias: !mobile, alpha: true, powerPreference: 'high-performance', stencil: false,
      toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.03 }}
    style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
    fallback={<span className="hh-sr-only">A stylized scalp section with healthy hair follicles.</span>}
  >
    <Lifecycle {...props} />
    <PerformanceMonitor onDecline={decline} onFallback={fallback} flipflops={3}
      bounds={() => [48, 58]} ms={500} iterations={5} />
    <Suspense fallback={null}><Scene {...props} /></Suspense>
  </Canvas>;
}

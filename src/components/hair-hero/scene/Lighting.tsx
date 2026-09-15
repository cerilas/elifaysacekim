import { useRef } from 'react';
import { Environment, Lightformer } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { PointLight } from 'three';
import type { SceneProps } from '../types';
import { TARGET } from './geometry';

export function Lighting({ animation, mobile }: SceneProps) {
  const local = useRef<PointLight>(null);
  useFrame(() => {
    if (local.current) local.current.intensity = animation.current.target * 0.17 + animation.current.graftBrightness * 0.65;
  });
  return <>
    <ambientLight intensity={0.24} color="#e9dac6" />
    <directionalLight position={[-3, 6, 5]} intensity={2.7} color="#fff2dc" />
    <directionalLight position={[4, 2, -3]} intensity={2.8} color="#d4c4ad" />
    <directionalLight position={[-4, 0, 1]} intensity={0.45} color="#bdbfc0" />
    <pointLight ref={local} position={[TARGET.x, -0.3, TARGET.z + 0.25]} color="#e4be86" distance={2.3} decay={2} intensity={0} />
    <Environment resolution={mobile ? 64 : 128} frames={1}>
      <Lightformer form="rect" intensity={2.5} color="#f9e9d0" position={[-3, 5, 2]} rotation={[Math.PI / 2, 0, 0]} scale={[7, 5, 1]} />
      <Lightformer form="rect" intensity={2} color="#ddd2c2" position={[3, 2, -4]} scale={[4, 5, 1]} />
      <Lightformer form="rect" intensity={0.7} color="#fff5e4" position={[0, 1, 5]} rotation={[0, Math.PI, 0]} scale={[3, 5, 1]} />
    </Environment>
  </>;
}

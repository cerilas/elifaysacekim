import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { SceneProps } from '../types';
import { seededRandom, surfaceHeight, TARGET } from './geometry';

/** A single point draw. Particle positions depend on scroll, never wall time. */
export function Particles({ animation, mobile, reducedMotion }: SceneProps) {
  const points = useRef<THREE.Points>(null);
  const resources = useMemo(() => {
    const count = mobile ? 12 : 36;
    const random = seededRandom(155);
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const theta = random() * Math.PI * 2;
      const radius = 0.12 + random() * 0.38;
      positions.set([Math.cos(theta) * radius, random() * 0.38 - 0.18, Math.sin(theta) * radius], i * 3);
      seeds[i] = random();
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    const material = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uProgress: { value: 0 }, uPixelRatio: { value: 1 } },
      vertexShader: `
        attribute float aSeed;
        uniform float uProgress;
        uniform float uPixelRatio;
        varying float vAlpha;
        void main() {
          vec3 p = position;
          p.xz *= 0.8 + uProgress * 2.4;
          p.y += uProgress * (0.38 + aSeed * 0.65);
          vec4 view = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * view;
          gl_PointSize = min(5.0, (9.0 + aSeed * 8.0) / -view.z) * uPixelRatio;
          vAlpha = sin(uProgress * 3.14159265) * 0.5;
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          if (d > 1.0) discard;
          gl_FragColor = vec4(0.88, 0.73, 0.49, (1.0 - smoothstep(0.1, 1.0, d)) * vAlpha);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `,
    });
    return { geometry, material };
  }, [mobile]);
  useEffect(() => () => { resources.geometry.dispose(); resources.material.dispose(); }, [resources]);
  useFrame(({ gl }) => {
    const progress = animation.current.particleProgress;
    if (points.current) points.current.visible = !reducedMotion && progress > 0 && progress < 1;
    resources.material.uniforms.uProgress.value = progress;
    resources.material.uniforms.uPixelRatio.value = gl.getPixelRatio();
  });
  return <points ref={points} geometry={resources.geometry} material={resources.material}
    position={[TARGET.x, surfaceHeight(TARGET.x, TARGET.z) - 0.42, TARGET.z]} frustumCulled={false} renderOrder={6} />;
}

export function TargetHalo({ animation, mobile, reducedMotion }: SceneProps) {
  const ring = useRef<THREE.MeshBasicMaterial>(null);
  const ripple = useRef<THREE.Mesh>(null);
  const rippleMaterial = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(() => {
    const state = animation.current;
    if (ring.current) ring.current.opacity = state.target * 0.36;
    if (ripple.current) ripple.current.scale.setScalar(1 + state.ripple * 4);
    if (rippleMaterial.current) rippleMaterial.current.opacity = reducedMotion ? 0 : Math.sin(state.ripple * Math.PI) * 0.16;
  });
  return <group position={[TARGET.x, surfaceHeight(TARGET.x, TARGET.z) + 0.012, TARGET.z]} rotation={[-Math.PI / 2, 0, 0]}>
    <mesh renderOrder={6}>
      <ringGeometry args={[0.125, 0.132, mobile ? 24 : 48]} />
      <meshBasicMaterial ref={ring} color="#e7c797" transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
    <mesh ref={ripple} renderOrder={6}>
      <ringGeometry args={[0.14, 0.149, mobile ? 24 : 48]} />
      <meshBasicMaterial ref={rippleMaterial} color="#e7c797" transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  </group>;
}

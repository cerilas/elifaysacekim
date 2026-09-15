import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { SceneProps } from '../types';
import { createNoiseTexture, createSurfaceGeometry, createTissueGeometry, SCALP, surfaceHeight, TARGET } from './geometry';

export function Scalp({ animation, mobile, reducedMotion }: SceneProps) {
  const surface = useRef<THREE.MeshPhysicalMaterial>(null);
  const tissue = useRef<THREE.MeshPhysicalMaterial>(null);
  const edge = useRef<THREE.MeshStandardMaterial>(null);
  const channel = useRef<THREE.MeshStandardMaterial>(null);
  const closure = useRef<THREE.MeshPhysicalMaterial>(null);
  const geometry = useMemo(() => createSurfaceGeometry(mobile), [mobile]);
  const body = useMemo(() => createTissueGeometry(mobile), [mobile]);
  const noise = useMemo(createNoiseTexture, []);
  const rippleUniform = useMemo(() => ({ value: 0 }), []);
  const skinShader = useCallback((shader: THREE.WebGLProgramParametersWithUniforms) => {
    shader.uniforms.uTissueRipple = rippleUniform;
    shader.vertexShader = 'uniform float uTissueRipple;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `
      #include <begin_vertex>
      float radius = length(position.xz - vec2(0.35, 0.72));
      float wave = sin(radius * 18.0 - uTissueRipple * 10.0);
      float envelope = sin(uTissueRipple * 3.14159265) * exp(-radius * 3.6);
      transformed.y += wave * envelope * 0.018;
    `);
  }, [rippleUniform]);
  const boundary = useMemo(() => {
    const points = Array.from({ length: 105 }, (_, index) => {
      const a = index / 104 * Math.PI * 2;
      const x = Math.cos(a) * SCALP.xRadius, z = Math.sin(a) * SCALP.zRadius;
      return new THREE.Vector3(x, surfaceHeight(x, z) - 0.045, z);
    });
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), mobile ? 64 : 104, 0.011, 5, true);
  }, [mobile]);
  useEffect(() => () => { geometry.dispose(); body.dispose(); boundary.dispose(); }, [geometry, body, boundary]);
  useEffect(() => () => noise.dispose(), [noise]);
  useFrame(() => {
    const state = animation.current;
    rippleUniform.value = reducedMotion ? 0 : state.ripple;
    if (surface.current) surface.current.opacity = state.skinOpacity;
    if (tissue.current) tissue.current.opacity = state.tissueOpacity;
    if (edge.current) edge.current.opacity = 0.16 + state.skinOpacity * 0.58;
    if (channel.current) {
      channel.current.emissiveIntensity = state.target * 0.28;
      channel.current.opacity = (0.12 + state.target * 0.28) * (1 - THREE.MathUtils.smoothstep(state.progress, 0.74, 0.81));
    }
    if (closure.current) closure.current.opacity = state.skinOpacity * THREE.MathUtils.smoothstep(state.progress, 0.75, 0.89);
  });
  return <group>
    <mesh geometry={body} renderOrder={3}>
      <meshPhysicalMaterial ref={tissue} vertexColors transparent opacity={0.64} depthWrite={false}
        roughness={0.68} metalness={0} side={THREE.FrontSide} />
    </mesh>
    <mesh geometry={geometry} renderOrder={4}>
      <meshPhysicalMaterial ref={surface} color="#b99b83" roughness={0.68} metalness={0.005}
        bumpMap={noise} bumpScale={0.04} transparent opacity={0.97} depthWrite={false}
        onBeforeCompile={skinShader}
        transmission={mobile ? 0 : 0.08} thickness={0.18} ior={1.37} clearcoat={0.13} clearcoatRoughness={0.55}
        side={THREE.DoubleSide} />
    </mesh>
    <mesh geometry={boundary} renderOrder={5}>
      <meshStandardMaterial ref={edge} color="#b99b83" roughness={0.65} transparent opacity={0.72} depthWrite={false} />
    </mesh>
    <mesh position={[TARGET.x, surfaceHeight(TARGET.x, TARGET.z) - 0.62, TARGET.z]} renderOrder={2}>
      <cylinderGeometry args={[0.117, 0.085, 1.25, mobile ? 12 : 24, 1, true]} />
      <meshStandardMaterial ref={channel} color="#927653" emissive="#d4ae72" emissiveIntensity={0}
        transparent opacity={0.32} roughness={0.65} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
    <mesh position={[TARGET.x, surfaceHeight(TARGET.x, TARGET.z), TARGET.z]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={4}>
      <ringGeometry args={[0.027, 0.117, mobile ? 18 : 32]} />
      <meshPhysicalMaterial ref={closure} color="#b99b83" roughness={0.68} metalness={0.005}
        bumpMap={noise} bumpScale={0.025} transparent opacity={0} depthWrite={false} />
    </mesh>
  </group>;
}

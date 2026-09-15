import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { FolliclePlacement, SceneProps } from '../types';
import { createHairGeometry } from './geometry';

type HairStrandProps = SceneProps & { placements?: FolliclePlacement[]; graft?: boolean };

/** One instanced draw for the field. Growth and a tiny bend run on the GPU. */
export function HairStrand({ animation, mobile, reducedMotion, placements, graft = false }: HairStrandProps) {
  const instance = useRef<THREE.InstancedMesh>(null);
  const geometry = useMemo(() => createHairGeometry(mobile), [mobile]);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uGrowth: { value: 1 }, uSway: { value: 0 } }), []);
  const material = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: graft ? '#776145' : '#45352a', roughness: 0.31, metalness: 0.12,
      clearcoat: 0.55, clearcoatRoughness: 0.28,
    });
    mat.onBeforeCompile = shader => {
      Object.assign(shader.uniforms, uniforms);
      shader.vertexShader = 'uniform float uTime; uniform float uGrowth; uniform float uSway;\n' + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `
        #include <begin_vertex>
        float influence = smoothstep(0.0, 2.52, position.y);
        transformed.y *= uGrowth;
        transformed.x *= mix(0.10, 1.0, uGrowth);
        transformed.x += sin(uTime * 0.42 + position.y * 0.8) * 0.009 * influence * uSway;
        transformed.z += cos(uTime * 0.31 + position.y) * 0.006 * influence * uSway;
      `);
    };
    mat.customProgramCacheKey = () => 'folia-strand-v1';
    return mat;
  }, [graft, uniforms]);
  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);
  useLayoutEffect(() => {
    if (!placements || !instance.current) return;
    const transform = new THREE.Object3D();
    placements.forEach((point, index) => {
      transform.position.set(point.x, point.height, point.z);
      transform.rotation.set(0, point.angle * 3, point.angle);
      transform.scale.set(point.width, point.length, point.width);
      transform.updateMatrix();
      instance.current!.setMatrixAt(index, transform.matrix);
    });
    instance.current.instanceMatrix.needsUpdate = true;
    instance.current.computeBoundingSphere();
  }, [placements]);
  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.elapsedTime;
    uniforms.uSway.value = reducedMotion || mobile ? 0 : 1;
    uniforms.uGrowth.value = graft ? animation.current.growth : 1;
  });
  return placements
    ? <instancedMesh ref={instance} args={[geometry, material, placements.length]} />
    : <mesh geometry={geometry} material={material} />;
}

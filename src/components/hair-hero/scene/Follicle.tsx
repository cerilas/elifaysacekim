import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { FolliclePlacement, SceneProps } from '../types';
import { createSheathGeometry, surfaceHeight, TARGET } from './geometry';
import { HairStrand } from './HairStrand';

export function FollicleField(props: SceneProps & { placements: FolliclePlacement[] }) {
  const { animation, mobile, placements } = props;
  const bulbs = useRef<THREE.InstancedMesh>(null);
  const shafts = useRef<THREE.InstancedMesh>(null);
  const sheaths = useRef<THREE.InstancedMesh>(null);
  const tissue = useRef<THREE.MeshPhysicalMaterial>(null);
  const bulbMaterial = useRef<THREE.MeshStandardMaterial>(null);
  const sheath = useMemo(() => createSheathGeometry(mobile), [mobile]);
  useEffect(() => () => sheath.dispose(), [sheath]);
  useLayoutEffect(() => {
    const transform = new THREE.Object3D();
    placements.forEach((point, index) => {
      transform.rotation.set(0, 0, 0);
      transform.position.set(point.x, point.height - 1.13, point.z);
      transform.scale.set(0.10 * point.width, 0.17, 0.10 * point.width);
      transform.updateMatrix(); bulbs.current!.setMatrixAt(index, transform.matrix);
      transform.position.set(point.x, point.height - 0.53, point.z);
      transform.scale.set(1, 1, 1);
      transform.updateMatrix(); shafts.current!.setMatrixAt(index, transform.matrix);
      transform.position.set(point.x, point.height, point.z);
      transform.scale.set(point.width, 1, point.width);
      transform.updateMatrix(); sheaths.current!.setMatrixAt(index, transform.matrix);
    });
    [bulbs, shafts, sheaths].forEach(ref => {
      ref.current!.instanceMatrix.needsUpdate = true;
      ref.current!.computeBoundingSphere();
    });
  }, [placements]);
  useFrame(() => {
    if (tissue.current) tissue.current.opacity = 0.16 + animation.current.reveal * 0.18;
    if (bulbMaterial.current) bulbMaterial.current.emissiveIntensity = 0.035 + animation.current.reveal * 0.10;
  });
  return <group>
    <instancedMesh ref={bulbs} args={[undefined, undefined, placements.length]}>
      <sphereGeometry args={[1, mobile ? 10 : 16, mobile ? 8 : 12]} />
      <meshStandardMaterial ref={bulbMaterial} color="#cfb392" roughness={0.4} metalness={0.03} emissive="#cda677" emissiveIntensity={0.035} />
    </instancedMesh>
    <instancedMesh ref={shafts} args={[undefined, undefined, placements.length]}>
      <cylinderGeometry args={[0.029, 0.045, 1.12, mobile ? 6 : 9]} />
      <meshStandardMaterial color="#8b6e4e" roughness={0.42} metalness={0.04} />
    </instancedMesh>
    <instancedMesh ref={sheaths} args={[sheath, undefined, placements.length]} renderOrder={1}>
      <meshPhysicalMaterial ref={tissue} color="#e2c9ad" roughness={0.42} transparent opacity={0.16}
        depthWrite={false} side={THREE.FrontSide} />
    </instancedMesh>
    <HairStrand {...props} />
  </group>;
}

/** The single transplant unit shares the same anatomy as the instanced field. */
export function Follicle(props: SceneProps) {
  const { animation, mobile } = props;
  const group = useRef<THREE.Group>(null);
  const bulb = useRef<THREE.MeshStandardMaterial>(null);
  const sheath = useMemo(() => createSheathGeometry(mobile), [mobile]);
  useEffect(() => () => sheath.dispose(), [sheath]);
  useFrame(() => {
    const state = animation.current;
    if (group.current) {
      group.current.position.y = surfaceHeight(TARGET.x, TARGET.z) + state.graftLift;
      group.current.visible = state.graftVisibility > 0.001;
      group.current.scale.setScalar(Math.min(1, state.graftVisibility));
    }
    if (bulb.current) bulb.current.emissiveIntensity = 0.12 + state.graftBrightness * 0.65;
  });
  return <group ref={group} position={[TARGET.x, surfaceHeight(TARGET.x, TARGET.z) + 3.1, TARGET.z]} visible={false}>
    <mesh position={[0, -1.13, 0]} scale={[0.10, 0.17, 0.10]}>
      <sphereGeometry args={[1, mobile ? 12 : 20, 12]} />
      <meshStandardMaterial ref={bulb} color="#e7c89c" roughness={0.36} emissive="#e4bd80" emissiveIntensity={0.12} />
    </mesh>
    <mesh position={[0, -0.53, 0]}>
      <cylinderGeometry args={[0.03, 0.045, 1.12, 10]} />
      <meshStandardMaterial color="#b4966b" roughness={0.4} />
    </mesh>
    <mesh geometry={sheath} renderOrder={2}>
      <meshPhysicalMaterial color="#eedec3" roughness={0.38} transparent opacity={0.40} depthWrite={false} />
    </mesh>
    <HairStrand {...props} graft />
  </group>;
}

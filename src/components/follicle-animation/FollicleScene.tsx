import React, { Suspense, useMemo, useRef, useEffect, type RefObject } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { smooth } from './story';
import {
  headGeometry,
  headPoint,
  headNormal,
  donorSite,
  donorNormal,
  recipientSite,
  recipientNormal,
  graftTransform,
} from './head';
import normalURL from './assets/head-normal.jpg';
import colorURL from './assets/head-color.jpg';

const rand = (i: number) => {
  const n = Math.sin(i * 127.1 + 31.7) * 43758.5453;
  return n - Math.floor(n);
};

const up = new THREE.Vector3(0, 1, 0);

function strand(): THREE.TubeGeometry {
  return new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(0, 0.15, 0),
      new THREE.Vector3(0.055, 0.34, 0.01),
      new THREE.Vector3(0.16, 0.47, 0.025),
      new THREE.Vector3(0.24, 0.5, 0.045),
    ]),
    12,
    0.006,
    5,
    false
  );
}

interface WorldProps {
  progress: RefObject<{ value: number; invalidate?: () => void }>;
  low: boolean;
  reduced?: boolean;
}

function World({ progress, low }: WorldProps) {
  const { camera, size, invalidate, gl } = useThree();
  const skin = useRef<THREE.Mesh>(null);
  const existing = useRef<THREE.InstancedMesh>(null);
  const newHair = useRef<THREE.InstancedMesh>(null);
  const graft = useRef<THREE.Group>(null);
  const tool = useRef<THREE.Group>(null);
  const rootUnits = useRef<THREE.InstancedMesh>(null);
  const fineHairs = useRef<THREE.InstancedMesh>(null);
  const donorZone = useRef<THREE.Mesh>(null);
  const recipientZone = useRef<THREE.Mesh>(null);
  const route = useRef<THREE.Line>(null);
  const headGroup = useRef<THREE.Group>(null);

  const [normalMap, colorMap] = useLoader(THREE.TextureLoader, [normalURL, colorURL]);

  useMemo(() => {
    normalMap.flipY = true;
    colorMap.flipY = true;
    colorMap.colorSpace = THREE.SRGBColorSpace;
  }, [normalMap, colorMap]);

  const cutaway = useMemo(() => ({ value: 0 }), []);

  const skinMaterial = useMemo(() => {
    const material = new THREE.MeshPhysicalMaterial({
      color: '#e6cdb7',
      map: colorMap,
      normalMap,
      normalScale: new THREE.Vector2(0.5, 0.5),
      roughness: 0.64,
      transparent: true,
      side: THREE.FrontSide,
    });
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uCutaway = cutaway;
      shader.uniforms.uDonor = { value: donorSite };
      shader.vertexShader = 'varying vec3 vHeadPosition;\n' + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        '#include <begin_vertex>\nvHeadPosition = position;'
      );
      shader.fragmentShader =
        'uniform float uCutaway; uniform vec3 uDonor; varying vec3 vHeadPosition;\n' +
        shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <color_fragment>',
        '#include <color_fragment>\ndiffuseColor.a *= 1.0 - uCutaway * (1.0 - smoothstep(0.55, 1.0, distance(vHeadPosition, uDonor)));'
      );
    };
    return material;
  }, [cutaway, normalMap, colorMap]);

  useEffect(() => () => skinMaterial.dispose(), [skinMaterial]);

  const n = low ? 1000 : 2400;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const stats = useRef({ n: 0, sum: 0, low: false });

  const geometry = useMemo(
    () => ({
      head: headGeometry(),
      hair: strand(),
      bulb: new THREE.SphereGeometry(1, 14, 12),
      sheath: new THREE.CylinderGeometry(0.035, 0.05, 0.28, 16),
      punch: new THREE.CylinderGeometry(0.065, 0.065, 0.53, 32, 1, true),
    }),
    []
  );

  const data = useMemo(
    () =>
      Array.from({ length: n }, (_, i) => {
        const theta = 0.93 + rand(i * 5) * 4.42;
        const y = -0.13 + rand(i * 5 + 1) * 1.6;
        return {
          p: headPoint(y, theta),
          normal: headNormal(y, theta),
          scale:
            (Math.abs(Math.sin(theta)) > 0.85 && y < 0.55) || (Math.cos(theta) > 0.2 && y < 0.8)
              ? 0
              : 0.35 + rand(i * 5 + 2) * 0.38,
        };
      }),
    [n]
  );

  const planted = useMemo(
    () =>
      Array.from({ length: n }, (_, i) => {
        const theta = (rand(i * 7 + 8) - 0.5) * Math.PI * 2;
        const y = 1.25 + rand(i * 7 + 9) * 0.93;
        const edge = 1.48 + 0.035 * Math.sin(theta * 17) + 0.06 * Math.abs(Math.sin(theta));
        const visible = Math.cos(theta) < 0.35 || y > edge;
        return {
          p: headPoint(y, theta),
          normal: headNormal(y, theta),
          scale: visible ? 0.65 + rand(i + 900) * 0.7 : 0,
        };
      }),
    [n]
  );

  const roots = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => {
        const y = -0.12 + (i % 4) * 0.18;
        const angle = 2.3 + Math.floor(i / 4) * 0.19;
        const p = headPoint(y, angle);
        const normal = headNormal(y, angle);
        return { p, normal };
      }),
    []
  );

  const routeLine = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(
      Array.from({ length: 70 }, (_, i) => graftTransform(0.51 + (i / 69) * 0.18).position)
    );
    const mat = new THREE.LineDashedMaterial({
      color: '#d8bb91',
      transparent: true,
      dashSize: 0.08,
      gapSize: 0.1,
    });
    const line = new THREE.Line(geo, mat);
    line.computeLineDistances();
    return line;
  }, []);

  useEffect(() => {
    if (progress.current) {
      progress.current.invalidate = invalidate;
    }
    gl.domElement.dataset.sceneReady = 'true';
    invalidate();
    return () => {
      if (progress.current) {
        progress.current.invalidate = () => {};
      }
      delete gl.domElement.dataset.sceneReady;
    };
  }, [invalidate, progress, gl]);

  useEffect(
    () => () => {
      Object.values(geometry).forEach((g) => g.dispose());
      routeLine.geometry.dispose();
      (routeLine.material as THREE.Material).dispose();
    },
    [geometry, routeLine]
  );

  useFrame((_, delta) => {
    const p = progress.current ? progress.current.value : 0;
    const mobile = size.width < 700;
    const macro = smooth(0.13, 0.25, p) * (1 - smooth(0.49, 0.56, p));
    const travel = smooth(0.5, 0.7, p);
    const finish = smooth(0.88, 1, p);
    const state = graftTransform(p);

    if (delta > 0.004 && delta < 0.12 && !stats.current.low) {
      stats.current.n++;
      stats.current.sum += delta;
      if (stats.current.n === 100 && stats.current.sum / 100 > 0.029) {
        stats.current.low = true;
        gl.setPixelRatio(1);
      }
    }

    cutaway.value = macro * 0.82;

    if (existing.current && newHair.current) {
      for (let i = 0; i < n; i++) {
        const h = data[i];
        dummy.position.copy(h.p);
        const down = new THREE.Vector3(0, -1, -0.15);
        down.addScaledVector(h.normal, -down.dot(h.normal)).normalize();
        dummy.quaternion.setFromUnitVectors(
          up,
          h.normal.clone().multiplyScalar(0.45).addScaledVector(down, 0.7).normalize()
        );
        const distance = h.p.distanceTo(donorSite);
        const clear = 1 - macro * (distance < 1.1 ? 0.92 : 0.25);
        dummy.scale.setScalar(h.scale * clear);
        dummy.updateMatrix();
        existing.current.setMatrixAt(i, dummy.matrix);

        const a = planted[i];
        const growth = smooth(0.82 + (i / n) * 0.085, 0.89 + (i / n) * 0.08, p);
        dummy.position.copy(a.p);
        const sweep = new THREE.Vector3(0.3, 0.1, -1);
        sweep.addScaledVector(a.normal, -sweep.dot(a.normal)).normalize();
        dummy.quaternion.setFromUnitVectors(
          up,
          a.normal.clone().multiplyScalar(0.6).addScaledVector(sweep, 0.75).normalize()
        );
        dummy.scale.setScalar(Math.max(0.000001, a.scale * growth));
        dummy.updateMatrix();
        newHair.current.setMatrixAt(i, dummy.matrix);
      }
      existing.current.count = stats.current.low ? Math.floor(n * 0.7) : n;
      newHair.current.count = existing.current.count;
      existing.current.instanceMatrix.needsUpdate = true;
      newHair.current.instanceMatrix.needsUpdate = true;
    }

    if (rootUnits.current && fineHairs.current) {
      rootUnits.current.visible = macro > 0.01;
      fineHairs.current.visible = macro > 0.01;
      for (let i = 0; i < 16; i++) {
        const r = roots[i];
        dummy.position.copy(r.p).addScaledVector(r.normal, -0.15);
        dummy.quaternion.setFromUnitVectors(up, r.normal);
        dummy.scale.set(0.024, 0.15, 0.024);
        dummy.updateMatrix();
        rootUnits.current.setMatrixAt(i, dummy.matrix);

        dummy.position.copy(r.p);
        dummy.scale.setScalar(0.52);
        dummy.updateMatrix();
        fineHairs.current.setMatrixAt(i, dummy.matrix);
      }
      rootUnits.current.instanceMatrix.needsUpdate = true;
      fineHairs.current.instanceMatrix.needsUpdate = true;
    }

    if (graft.current) {
      graft.current.position.copy(state.position);
      graft.current.quaternion.copy(state.quaternion);
      graft.current.scale.setScalar(1 + Math.sin(state.travel * Math.PI) * 0.7);
      if (graft.current.children[0]) {
        graft.current.children[0].scale.y = 1 + smooth(0.82, 0.95, p) * 0.7;
      }
    }

    if (tool.current) {
      const punchOffset = 0.85 - smooth(0.35, 0.415, p) * 0.57 + smooth(0.45, 0.52, p) * 1.3;
      tool.current.visible = p > 0.35 && p < 0.52;
      tool.current.position.copy(donorSite).addScaledVector(donorNormal, punchOffset);
      tool.current.quaternion.setFromUnitVectors(up, donorNormal);
    }

    if (donorZone.current) {
      const mat = donorZone.current.material as THREE.MeshBasicMaterial;
      mat.opacity = (1 - smooth(0.49, 0.56, p)) * (0.25 + macro * 0.3);
    }

    if (recipientZone.current) {
      const mat = recipientZone.current.material as THREE.MeshBasicMaterial;
      mat.opacity = smooth(0.61, 0.68, p) * (1 - smooth(0.83, 0.93, p)) * 0.48;
    }

    if (route.current) {
      route.current.visible = p > 0.51 && p < 0.72;
      const mat = route.current.material as THREE.LineDashedMaterial;
      mat.opacity = Math.sin(travel * Math.PI) * 0.22;
    }

    // The camera starts behind the ear, follows the graft over the crown, then reveals the forehead.
    const startTarget = donorSite.clone().multiplyScalar(macro * 0.78);
    startTarget.y += 0.16;
    const focus = state.position.clone().addScaledVector(up, 0.12);
    const follow = smooth(0.43, 0.54, p) * (1 - smooth(0.8, 0.96, p));
    const target = startTarget.lerp(focus, follow);
    target.lerp(new THREE.Vector3(0, 0.32, 0.18), finish);

    const azimuth = 2.52 * (1 - travel) + 0.52 * travel;
    const distance =
      THREE.MathUtils.lerp(11, 5.9, macro) - Math.sin(travel * Math.PI) * 2.4 + finish * 0.3;
    const height = 1.45 + Math.sin(travel * Math.PI) * 2.4;

    const offset = new THREE.Vector3(
      Math.sin(azimuth) * distance,
      height,
      Math.cos(azimuth) * distance
    );
    if (mobile) offset.multiplyScalar(1.35);
    camera.position.copy(target).add(offset);
    target.y += mobile ? 0.35 : 0;
    camera.lookAt(target);
    camera.updateProjectionMatrix();
  });

  const zoneQuaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    donorNormal
  );
  const recipientZoneQ = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    recipientNormal
  );

  return (
    <>
      <ambientLight intensity={0.8} />
      <hemisphereLight args={['#fffaf2', '#a89180', 1]} />
      <directionalLight position={[4, 7, -5]} intensity={1.9} />
      <directionalLight position={[-4, 3, 6]} intensity={2.3} />
      <directionalLight position={[1, 6, 5]} intensity={0.5} />
      <group ref={headGroup}>
        <mesh ref={skin} geometry={geometry.head} material={skinMaterial} />
        <instancedMesh ref={existing} args={[geometry.hair, undefined, n]} frustumCulled={false}>
          <meshStandardMaterial color="#30261f" roughness={0.58} />
        </instancedMesh>
        <instancedMesh ref={newHair} args={[geometry.hair, undefined, n]} frustumCulled={false}>
          <meshStandardMaterial color="#30261f" roughness={0.52} />
        </instancedMesh>
        <instancedMesh ref={fineHairs} args={[geometry.hair, undefined, 16]} frustumCulled={false}>
          <meshStandardMaterial color="#39271e" roughness={0.6} />
        </instancedMesh>
        <instancedMesh ref={rootUnits} args={[geometry.bulb, undefined, 16]} frustumCulled={false}>
          <meshPhysicalMaterial color="#986d51" roughness={0.48} />
        </instancedMesh>
        <mesh
          ref={donorZone}
          position={donorSite.clone().addScaledVector(donorNormal, 0.025)}
          quaternion={zoneQuaternion}
          scale={[0.47, 0.32, 1]}
        >
          <ringGeometry args={[0.96, 1, 64]} />
          <meshBasicMaterial
            color="#d8bb91"
            transparent
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh
          ref={recipientZone}
          position={recipientSite.clone().addScaledVector(recipientNormal, 0.018)}
          quaternion={recipientZoneQ}
          scale={[0.23, 0.16, 1]}
        >
          <ringGeometry args={[0.96, 1, 48]} />
          <meshBasicMaterial
            color="#c4ac85"
            transparent
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        <group ref={graft}>
          <group>
            <mesh geometry={geometry.hair} scale={[1.4, 1.3, 1.4]}>
              <meshStandardMaterial color="#2c201a" roughness={0.42} />
            </mesh>
            <mesh geometry={geometry.hair} rotation={[0, 0.9, 0.15]}>
              <meshStandardMaterial color="#39271d" roughness={0.44} />
            </mesh>
          </group>
          <mesh position={[0, -0.13, 0]} geometry={geometry.sheath}>
            <meshPhysicalMaterial color="#e4b88e" transparent opacity={0.8} roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.15, 0]} scale={[0.017, 0.15, 0.017]} geometry={geometry.bulb}>
            <meshStandardMaterial color="#795039" />
          </mesh>
          <mesh position={[0, -0.28, 0]} scale={[0.043, 0.056, 0.04]} geometry={geometry.bulb}>
            <meshPhysicalMaterial color="#b68054" roughness={0.42} />
          </mesh>
        </group>
        <group ref={tool}>
          <mesh geometry={geometry.punch}>
            <meshPhysicalMaterial
              color="#d8bb91"
              metalness={0.85}
              roughness={0.2}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.1, 0.074, 0.18, 24]} />
            <meshStandardMaterial color="#8f9897" metalness={0.8} roughness={0.25} />
          </mesh>
        </group>
        <primitive ref={route} object={routeLine} />
      </group>
    </>
  );
}

export interface FollicleSceneProps {
  progress: RefObject<{ value: number; invalidate?: () => void }>;
  reduced?: boolean;
}

export default function FollicleScene({ progress, reduced }: FollicleSceneProps) {
  const low = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const nav = navigator as unknown as { hardwareConcurrency?: number; deviceMemory?: number };
    return (
      (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency <= 4) ||
      (nav.deviceMemory !== undefined && nav.deviceMemory <= 4) ||
      window.matchMedia('(max-width:700px)').matches
    );
  }, []);

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, low ? 1.25 : 1.75]}
      camera={{ position: [6, 2, -8], fov: 38, near: 0.05, far: 60 }}
      gl={{ antialias: !low, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1;
      }}
      fallback={<div className="ht-fallback">Kalıcı ve doğal saç restorasyon aşamaları.</div>}
    >
      <Suspense fallback={null}>
        <World progress={progress} low={low} reduced={reduced} />
      </Suspense>
    </Canvas>
  );
}

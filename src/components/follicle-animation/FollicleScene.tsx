import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { pose, smooth } from './story';

const mix = THREE.MathUtils.lerp;
const rand = (i: number) => {
  const x = Math.sin(i * 127.1 + 31.7) * 43758.5453;
  return x - Math.floor(x);
};

function hairGeometry() {
  const c = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.035, 0.4, 0.02),
    new THREE.Vector3(0.18, 0.85, 0.07),
    new THREE.Vector3(0.42, 1.2, 0.11),
    new THREE.Vector3(0.7, 1.45, 0.15),
  ]);
  return new THREE.TubeGeometry(c, 14, 0.016, 5, false);
}

function patchGeometry() {
  const s = new THREE.Shape();
  const w = 3.5, h = 2.5, r = 0.48;
  s.moveTo(-w + r, -h);
  s.lineTo(w - r, -h);
  s.quadraticCurveTo(w, -h, w, -h + r);
  s.lineTo(w, h - r);
  s.quadraticCurveTo(w, h, w - r, h);
  s.lineTo(-w + r, h);
  s.quadraticCurveTo(-w, h, -w, h - r);
  s.lineTo(-w, -h + r);
  s.quadraticCurveTo(-w, -h, -w + r, -h);
  const g = new THREE.ExtrudeGeometry(s, {
    depth: 1.2,
    bevelEnabled: true,
    bevelSegments: 5,
    steps: 1,
    bevelSize: 0.15,
    bevelThickness: 0.15,
    curveSegments: 18,
  });
  g.rotateX(-Math.PI / 2);
  g.translate(0, -1.2, 0);
  return g;
}

interface SkinProps {
  meshRef?: RefObject<THREE.Mesh | null>;
  geometry: THREE.BufferGeometry;
  opacity?: number;
  color?: string;
  [key: string]: unknown;
}

function Skin({ meshRef, geometry, opacity = 1, color = '#ce9f88', ...props }: SkinProps) {
  const material = useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({
      color,
      roughness: 0.57,
      metalness: 0,
      clearcoat: 0.08,
      transparent: true,
      opacity,
    });
    m.onBeforeCompile = (s) => {
      s.fragmentShader = s.fragmentShader
        .replace(
          '#include <roughnessmap_fragment>',
          `#include <roughnessmap_fragment>\n float pore = fract(sin(dot(vViewPosition.xy * 115.0, vec2(12.9898,78.233))) * 43758.5453); roughnessFactor = clamp(roughnessFactor + (pore - .5) * .15, .1, 1.);`
        )
        .replace(
          '#include <color_fragment>',
          `#include <color_fragment>\nfloat grain = fract(sin(dot(vViewPosition.xy * 180.0, vec2(12.9898,78.233))) * 43758.5453); diffuseColor.rgb *= .97 + grain * .06;`
        );
    };
    return m;
  }, [color, opacity]);

  useEffect(() => () => material.dispose(), [material]);

  return <mesh ref={meshRef} geometry={geometry} material={material} {...props} />;
}

interface WorldProps {
  progress: RefObject<{ value: number; invalidate?: () => void }>;
  low: boolean;
  reduced: boolean;
}

function World({ progress, low }: WorldProps) {
  const { camera, size, invalidate, gl } = useThree();
  const donor = useRef<THREE.Group>(null);
  const recipient = useRef<THREE.Group>(null);
  const top = useRef<THREE.Group>(null);
  const skin = useRef<THREE.Mesh>(null);
  const graft = useRef<THREE.Group>(null);
  const tool = useRef<THREE.Group>(null);
  const hairs = useRef<THREE.InstancedMesh>(null);
  const newHairs = useRef<THREE.InstancedMesh>(null);
  const roots = useRef<THREE.InstancedMesh>(null);
  const guides = useRef<THREE.Mesh>(null);
  const particles = useRef<THREE.Points>(null);
  const keyLight = useRef<THREE.DirectionalLight>(null);

  const [adaptive, setAdaptive] = useState(false);
  const frameStats = useRef({ sum: 0, n: 0 });

  const geom = useMemo(
    () => ({
      patch: patchGeometry(),
      hair: hairGeometry(),
      root: new THREE.SphereGeometry(1, 12, 10),
      tube: new THREE.CylinderGeometry(0.15, 0.2, 0.95, 14),
      punch: new THREE.CylinderGeometry(0.22, 0.22, 1.55, 32, 1, true),
    }),
    []
  );

  const count = low ? 240 : 620;
  const placements = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const x = (rand(i * 3) - 0.5) * 6.6;
        const z = (rand(i * 3 + 1) - 0.5) * 4.6;
        return {
          x,
          z,
          s: 0.55 + rand(i * 3 + 2) * 0.65,
          rot: (rand(i + 999) - 0.5) * 0.6,
        };
      }),
    [count]
  );

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const target = useMemo(() => new THREE.Vector3(), []);

  const follicles = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => {
        const x = ((i % 8) - 3.5) * 0.76;
        const z = i < 8 ? -0.85 : 1.05;
        return { x, z };
      }),
    []
  );

  const rootMatrices = useMemo(
    () =>
      follicles.map(({ x, z }) => {
        const o = new THREE.Object3D();
        o.position.set(x, -0.58, z);
        o.scale.set(0.1, 0.53, 0.1);
        o.rotation.z = -0.14;
        o.updateMatrix();
        return o.matrix.clone();
      }),
    [follicles]
  );

  const particlePos = useMemo(
    () => new Float32Array(Array.from({ length: low ? 90 : 210 }, (_, i) => (rand(i + 900) - 0.5) * 11)),
    [low]
  );

  useEffect(() => {
    if (progress.current) {
      progress.current.invalidate = invalidate;
      invalidate();
    }
    return () => {
      if (progress.current) {
        progress.current.invalidate = undefined;
      }
    };
  }, [invalidate, progress]);

  useEffect(() => () => Object.values(geom).forEach((g) => g.dispose()), [geom]);

  useFrame((_, delta) => {
    if (!progress.current) return;
    const p = progress.current.value;
    const s = pose(p);
    const mobile = size.width < 700;

    if (delta < 0.12 && delta > 0.004 && !adaptive) {
      const f = frameStats.current;
      f.sum += delta;
      f.n++;
      if (f.n === 100 && f.sum / f.n > 0.029) {
        setAdaptive(true);
        gl.setPixelRatio(1);
      }
    }

    if (donor.current) {
      donor.current.visible = p < 0.565;
      donor.current.scale.setScalar(Math.max(0.001, s.donor));
      donor.current.position.y = -smooth(0.5, 0.59, p) * 2;
    }

    if (skin.current && skin.current.material instanceof THREE.MeshPhysicalMaterial) {
      skin.current.material.opacity = 1 - s.cut * 0.82;
      skin.current.material.depthWrite = s.cut < 0.5;
    }

    if (top.current) {
      top.current.scale.y = Math.max(0.025, 1 - s.cut * 0.97);
      top.current.position.y = -0.13;
    }

    if (recipient.current) {
      recipient.current.visible = s.recipient > 0.001;
      recipient.current.scale.setScalar(Math.max(0.001, s.recipient));
      recipient.current.position.set(1.3, -1.8 + 1.8 * s.recipient, 0);
    }

    if (graft.current) {
      graft.current.position.set(s.graftX, s.graftY, 0);
      graft.current.rotation.set(0, s.travel * 0.7, -s.graftAngle);
      graft.current.scale.setScalar(1 + smooth(0.51, 0.58, p) * 0.18 - smooth(0.65, 0.72, p) * 0.18);
      if (graft.current.children[0]) {
        graft.current.children[0].scale.y = 1 + s.growth * 0.8;
      }
    }

    if (tool.current) {
      const approach = smooth(0.35, 0.405, p);
      const withdraw = smooth(0.445, 0.505, p);
      tool.current.visible = p > 0.35 && p < 0.525;
      tool.current.position.set(0, 4 - approach * 3.1 + withdraw * 4.2, 0);
    }

    if (hairs.current && newHairs.current) {
      for (let i = 0; i < count; i++) {
        const h = placements[i];
        const dome = 0.7 * Math.sqrt(Math.max(0, 1 - (h.x / 3.5) ** 2 - (h.z / 2.5) ** 2)) * (1 - s.cut);
        dummy.position.set(h.x, dome, h.z);
        dummy.rotation.set(0, h.rot, -0.12);
        const macro = i < 16 ? 1 : 1 - s.cut;
        dummy.scale.set(h.s * macro, h.s * macro, h.s * macro);
        if (i < 16 && s.cut > 0.01) {
          const f = follicles[i];
          dummy.position.x = mix(h.x, f.x, s.cut);
          dummy.position.z = mix(h.z, f.z, s.cut);
        }
        dummy.updateMatrix();
        hairs.current.setMatrixAt(i, dummy.matrix);

        // Natural hairline leading edge
        const edge = -1.45 + 0.15 * Math.cos(h.x * 1.8) + 0.08 * Math.sin(h.x * 8);
        const available = h.z > edge;
        const g = smooth(0.82 + (i / count) * 0.09, 0.88 + (i / count) * 0.095, p);
        dummy.position.set(h.x, 0, h.z);
        dummy.rotation.set(0.1, h.rot, -0.48);
        dummy.scale.setScalar(available ? Math.max(0.00001, g) * h.s : 0.00001);
        dummy.updateMatrix();
        newHairs.current.setMatrixAt(i, dummy.matrix);
      }
      hairs.current.count = adaptive ? Math.floor(count * 0.65) : count;
      newHairs.current.count = hairs.current.count;
      hairs.current.instanceMatrix.needsUpdate = true;
      newHairs.current.instanceMatrix.needsUpdate = true;
    }

    if (roots.current) {
      roots.current.visible = p > 0.13 && p < 0.59;
      roots.current.scale.y = Math.max(0.001, s.cut);
    }

    if (guides.current && guides.current.material instanceof THREE.Material) {
      guides.current.visible = p > 0.65 && p < 0.83;
      guides.current.material.opacity = smooth(0.65, 0.69, p) * (1 - smooth(0.78, 0.83, p)) * 0.35;
    }

    if (particles.current && particles.current.material instanceof THREE.Material) {
      particles.current.visible = p > 0.49 && p < 0.68;
      particles.current.rotation.y = p * 0.5;
      particles.current.material.opacity = smooth(0.49, 0.54, p) * (1 - smooth(0.62, 0.68, p)) * 0.3;
    }

    const focus = smooth(0.08, 0.3, p);
    const journey = smooth(0.49, 0.58, p);
    const landing = smooth(0.61, 0.73, p);
    const finish = smooth(0.93, 1, p);
    const aimX = mix(0.0, 0.2, focus) + s.graftX * 0.65;
    const aimY = mix(0.2, 0.35, focus) + journey * 2.4 - landing * 2.4;
    const distance = mix(15, 12, focus) - journey * 1.0 + landing * 0.2 + finish * 3;

    target.set(aimX + (mobile ? 0.8 : 0), aimY + (mobile ? 1.35 : 0), 0);
    camera.position.set(
      target.x + 3.8 * (1 - journey * 0.45) + landing * 0.9,
      target.y + 4.7 - journey * 2 + landing * 1.4,
      distance * (mobile ? 1.33 : 1)
    );
    camera.lookAt(target);
    camera.updateProjectionMatrix();

    if (keyLight.current) {
      keyLight.current.intensity = 2.4 + journey * 0.6 - landing * 0.6;
    }
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <hemisphereLight args={['#fffaf1', '#aa8b77', 0.8]} />
      <directionalLight ref={keyLight} position={[-4, 8, 7]} intensity={3.8} color="#fff9f0" />
      <directionalLight position={[5, 3, -4]} intensity={1.4} color="#ffffff" />

      <group position={[0.3, 0, 0]} rotation={[0, -0.12, 0]}>
        <group ref={donor}>
          <Skin meshRef={skin} geometry={geom.patch} color="#c9957e" />
          <group ref={top}>
            <mesh position={[0, 0.08, 0]} scale={[3.48, 0.8, 2.48]}>
              <sphereGeometry args={[1, 48, 24]} />
              <meshPhysicalMaterial color="#d4ab94" roughness={0.62} />
            </mesh>
          </group>
          <instancedMesh ref={hairs} args={[geom.hair, undefined, count]} frustumCulled={false}>
            <meshStandardMaterial color="#30271f" roughness={0.43} />
          </instancedMesh>
          <group>
            <instancedMesh
              ref={(m) => {
                roots.current = m;
                if (m) {
                  rootMatrices.forEach((a, i) => m.setMatrixAt(i, a));
                  m.instanceMatrix.needsUpdate = true;
                }
              }}
              args={[geom.root, undefined, 16]}
            >
              <meshPhysicalMaterial color="#92624b" roughness={0.55} />
            </instancedMesh>
            <mesh position={[0, -1.07, 0]} scale={[3.48, 0.06, 2.47]}>
              <boxGeometry />
              <meshStandardMaterial color="#e6c2a4" />
            </mesh>
          </group>
        </group>

        <group ref={recipient}>
          <Skin geometry={geom.patch} color="#dbb29a" />
          <instancedMesh ref={newHairs} args={[geom.hair, undefined, count]} frustumCulled={false}>
            <meshStandardMaterial color="#30271f" roughness={0.45} />
          </instancedMesh>
          <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.11, 0.24, 1]}>
            <circleGeometry args={[1, 24]} />
            <meshBasicMaterial color="#986f59" transparent opacity={0.4} />
          </mesh>
          <mesh ref={guides} position={[0.1, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0.66]}>
            <ringGeometry args={[0.42, 0.43, 40, 1, 0, Math.PI * 1.3]} />
            <meshBasicMaterial color="#727863" transparent depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
        </group>

        <group ref={graft}>
          <group>
            <mesh geometry={geom.hair} scale={[1.15, 1.35, 1.15]}>
              <meshStandardMaterial color="#2b241d" roughness={0.34} />
            </mesh>
            <mesh geometry={geom.hair} rotation={[0, 0.7, 0.1]} scale={[0.9, 1.05, 0.9]}>
              <meshStandardMaterial color="#392b20" roughness={0.4} />
            </mesh>
          </group>
          <mesh geometry={geom.tube} position={[0, -0.47, 0]}>
            <meshPhysicalMaterial color="#ecc19c" roughness={0.35} transparent opacity={0.9} clearcoat={0.25} />
          </mesh>
          <mesh position={[0, -0.54, 0.012]} scale={[0.066, 0.49, 0.066]} geometry={geom.root}>
            <meshStandardMaterial color="#785240" roughness={0.45} />
          </mesh>
          <mesh position={[0, -0.98, 0]} scale={[0.15, 0.2, 0.14]} geometry={geom.root}>
            <meshPhysicalMaterial color="#ba825c" roughness={0.36} />
          </mesh>
          <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.26, 0.276, 48]} />
            <meshBasicMaterial color="#a88d4b" transparent opacity={0.7} side={THREE.DoubleSide} />
          </mesh>
        </group>

        <group ref={tool}>
          <mesh geometry={geom.punch}>
            <meshPhysicalMaterial color="#d9dedd" metalness={0.85} roughness={0.23} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0.94, 0]}>
            <cylinderGeometry args={[0.32, 0.26, 0.4, 32]} />
            <meshStandardMaterial color="#949e9d" metalness={0.8} roughness={0.25} />
          </mesh>
          <mesh position={[0, -0.78, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.22, 0.018, 8, 32]} />
            <meshStandardMaterial color="#e7ecec" metalness={0.85} roughness={0.19} />
          </mesh>
        </group>
      </group>

      <points ref={particles}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particlePos, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#b8a58e" size={0.026} transparent depthWrite={false} />
      </points>
    </>
  );
}

export interface FollicleSceneProps {
  progress: RefObject<{ value: number; invalidate?: () => void }>;
  reduced?: boolean;
}

export default function FollicleScene({ progress, reduced = false }: FollicleSceneProps) {
  const low = useMemo(
    () =>
      typeof navigator !== 'undefined' &&
      (navigator.hardwareConcurrency <= 4 ||
        ((navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 8) <= 4 ||
        (typeof window !== 'undefined' && window.matchMedia('(max-width: 700px)').matches)),
    []
  );

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, low ? 1.25 : 1.75]}
      camera={{ position: [3, 5, 12], fov: 38, near: 0.1, far: 60 }}
      gl={{ antialias: !low, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl, invalidate }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.12;
        if (progress.current) {
          progress.current.invalidate = invalidate;
        }
      }}
      fallback={<div className="ht-fallback">Adımları kullanarak saç restorasyon sürecini keşfedin.</div>}
    >
      <World progress={progress} low={Boolean(low)} reduced={reduced} />
    </Canvas>
  );
}

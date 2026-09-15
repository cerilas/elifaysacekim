import { Component, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import { createHairGeometry } from '../hair-hero/scene/geometry';

type Props = { progress: RefObject<{ value: number }>; active: boolean; reduced: boolean; selected: number };
class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

/* ═══════════════════════════════════════════════════════
   Surface shape definitions
   Coordinate system (world, inside the tilted group):
     X = horizontal (left / right)
     Y = up
     Z = depth (forward / backward)
   ═══════════════════════════════════════════════════════ */

const SEGS = 40;
const COLS = SEGS + 1;
const VERT_COUNT = COLS * COLS;

/** Build a BufferGeometry shell with indices & UVs ready for morphing */
function createMorphableGeo(): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(VERT_COUNT * 3);
  const uvs = new Float32Array(VERT_COUNT * 2);
  const indices: number[] = [];

  for (let row = 0; row < COLS; row++) {
    for (let col = 0; col < COLS; col++) {
      const i = row * COLS + col;
      uvs[i * 2]     = col / SEGS;
      uvs[i * 2 + 1] = row / SEGS;
      if (row < SEGS && col < SEGS) {
        const a = i, b = i + 1, c = i + COLS, d = i + COLS + 1;
        indices.push(a, c, b, b, c, d);
      }
    }
  }

  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  return geo;
}

/**
 * Pre-compute world-space vertex positions for each treatment mode.
 *   u = col / SEGS  (0 → 1, along primary axis)
 *   v = row / SEGS  (0 → 1, across thickness)
 */
function computeModeVerts(mode: number): Float32Array {
  const out = new Float32Array(VERT_COUNT * 3);

  for (let row = 0; row < COLS; row++) {
    for (let col = 0; col < COLS; col++) {
      const idx = (row * COLS + col) * 3;
      const u = col / SEGS;
      const v = row / SEGS;
      let x: number, y: number, z: number;

      if (mode === 0) {
        /* ─── SCALP: wide rounded dome (top of head) ─── */
        x = (u - 0.5) * 5.0;
        z = (v - 0.5) * 3.2;
        const r = Math.sqrt((x / 2.5) ** 2 + (z / 1.6) ** 2);
        y = r < 1 ? 0.55 * Math.cos(r * Math.PI / 2) : 0;

      } else if (mode === 1) {
        /* ─── EYEBROW: thin curved arch strip ─── */
        const cx = (u - 0.5) * 3.8;                                       // along brow
        const cz = -0.50 * Math.sin(u * Math.PI);                         // arch center (flipped)
        const thick = 0.32 * Math.pow(Math.sin(u * Math.PI) + 0.001, 0.45); // width varies

        x = cx;
        z = cz + (v - 0.5) * thick;

        const along = Math.pow(Math.sin(u * Math.PI) + 0.001, 0.25);
        const cross = Math.exp(-(((v - 0.5) * 5) ** 2));
        y = 0.28 * along * cross;

      } else {
        /* ─── BEARD: U-shaped jawline ─── */
        const cx = (u - 0.5) * 4.0;
        const cz = 0.9 * Math.pow(2 * (u - 0.5), 2) - 0.5; // U parabola
        const bandW = 0.45;

        x = cx;
        z = cz + (v - 0.5) * bandW;

        const cross = Math.exp(-(Math.pow((v - 0.5) * 4, 2)));
        const edgeFade = 1 - 0.12 * Math.pow(2 * (u - 0.5), 2);
        y = 0.24 * cross * edgeFade;
      }

      out[idx]     = x;
      out[idx + 1] = y;
      out[idx + 2] = z;
    }
  }
  return out;
}

/** Approximate surface Y at world (X, Z) for placing hairs on top */
function sampleSurface(px: number, pz: number, mode: number): number {
  if (mode === 0) {
    const r = Math.sqrt((px / 2.5) ** 2 + (pz / 1.6) ** 2);
    return r < 1 ? 0.55 * Math.cos(r * Math.PI / 2) : 0;
  } else if (mode === 1) {
    const u = THREE.MathUtils.clamp(px / 3.8 + 0.5, 0.01, 0.99);
    const cz = -0.50 * Math.sin(u * Math.PI);
    const thick = 0.32 * Math.pow(Math.sin(u * Math.PI) + 0.001, 0.45);
    const vNorm = thick > 0.01 ? (pz - cz) / thick : 0;
    const along = Math.pow(Math.sin(u * Math.PI) + 0.001, 0.25);
    const cross = Math.exp(-((vNorm * 5) ** 2));
    return 0.28 * along * cross;
  } else {
    // Beard: U-shaped band
    const u = THREE.MathUtils.clamp(px / 4.0 + 0.5, 0.01, 0.99);
    const cz = 0.9 * Math.pow(2 * (u - 0.5), 2) - 0.5;
    const vNorm = (pz - cz) / 0.45;
    const cross = Math.exp(-(Math.pow(vNorm * 4, 2)));
    const edgeFade = 1 - 0.12 * Math.pow(2 * (u - 0.5), 2);
    return 0.24 * cross * edgeFade;
  }
}

/* ═══════════════════════════════════════════════════════
   React Three Fiber components
   ═══════════════════════════════════════════════════════ */

function Field({ progress, reduced, selected, active }: Props) {
  const mesh  = useRef<THREE.InstancedMesh>(null);
  const bulbs = useRef<THREE.InstancedMesh>(null);
  const group = useRef<THREE.Group>(null);
  const { size, camera, invalidate } = useThree();

  const hairGeo        = useMemo(() => createHairGeometry(false), []);
  const transform      = useMemo(() => new THREE.Object3D(), []);
  const bulbTransform  = useMemo(() => new THREE.Object3D(), []);

  /* Pre-compute three shape vertex arrays + shared geometry shell */
  const [v0, v1, v2, surfGeo] = useMemo(() => {
    const geo = createMorphableGeo();
    const a = computeModeVerts(0);
    const b = computeModeVerts(1);
    const c = computeModeVerts(2);
    // Initialise to mode 0
    (geo.getAttribute('position') as THREE.BufferAttribute).array.set(a);
    geo.getAttribute('position').needsUpdate = true;
    geo.computeVertexNormals();
    return [a, b, c, geo] as const;
  }, []);

  /* Hair sway shader */
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uSway: { value: 0 } }), []);
  const hairMat = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: '#45352a', roughness: 0.31, metalness: 0.12,
      clearcoat: 0.55, clearcoatRoughness: 0.28,
    });
    mat.onBeforeCompile = shader => {
      Object.assign(shader.uniforms, uniforms);
      shader.vertexShader = 'uniform float uTime; uniform float uSway;\n' + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `
        #include <begin_vertex>
        float influence = smoothstep(0.0, 2.52, position.y);
        transformed.x += sin(uTime * 0.42 + position.y * 0.8) * 0.009 * influence * uSway;
        transformed.z += cos(uTime * 0.31 + position.y)        * 0.006 * influence * uSway;
      `);
    };
    mat.customProgramCacheKey = () => 'treatment-hair-v2';
    return mat;
  }, [uniforms]);

  /* Cleanup */
  useEffect(() => () => { hairGeo.dispose(); hairMat.dispose(); surfGeo.dispose(); }, [hairGeo, hairMat, surfGeo]);
  useEffect(() => { invalidate(); }, [selected, reduced, active, invalidate]);
  useLayoutEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.aspect = size.width / size.height;
      camera.position.z = Math.max(7.4, 7.4 / camera.aspect);
      camera.updateProjectionMatrix();
      camera.lookAt(0, 0.35, 0);
    }
  }, [camera, size]);

  /* ── Animation loop ── */
  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.elapsedTime;
    uniforms.uSway.value = reduced ? 0 : 1;
    if (!mesh.current || !bulbs.current) return;

    const value = THREE.MathUtils.clamp(progress.current.value, 0, 2);
    const from  = Math.floor(value);
    const to    = Math.min(2, from + 1);
    const t     = THREE.MathUtils.smoothstep(value - from, 0, 1);

    /* --- Morph surface vertices --- */
    const srcA = from === 0 ? v0 : from === 1 ? v1 : v2;
    const srcB = to   === 0 ? v0 : to   === 1 ? v1 : v2;
    const pos  = surfGeo.getAttribute('position') as THREE.BufferAttribute;
    const arr  = pos.array as Float32Array;
    for (let i = 0; i < arr.length; i++) {
      arr[i] = srcA[i] + (srcB[i] - srcA[i]) * t;
    }
    pos.needsUpdate = true;
    surfGeo.computeVertexNormals();

    /* --- Place hairs & bulbs --- */
    const placement = (mode: number, i: number) => {
      const col = i % 10, row = Math.floor(i / 10);
      if (mode === 0) return { x: (col - 4.5) * .33, z: (row - 2) * .34,   length: .56 + .12 * Math.sin(i * 1.7), rotation: -.07 + col * .015 };
      if (mode === 1) return { x: (col - 4.5) * .36, z: (row - 2) * .095 - Math.sin(col / 9 * Math.PI) * .45 - 0.08, length: .13 + .04 * Math.sin(col / 9 * Math.PI), rotation: -.5 + col / 9 * 1.4 };
      const uCol = Math.pow((col - 4.5) * 0.145, 2);
      return               { x: (col - 4.5) * .29, z: (row - 2) * .1 + 0.9 * uCol - 0.5,  length: .28 + row * .025, rotation: (col - 4.5) * .1 };
    };

    const lerp = THREE.MathUtils.lerp;
    for (let i = 0; i < 50; i++) {
      const a = placement(from, i), b = placement(to, i);
      const px  = lerp(a.x, b.x, t);
      const pz  = lerp(a.z, b.z, t);
      const rot = lerp(a.rotation, b.rotation, t);
      const len = lerp(a.length, b.length, t);

      /* Surface height at this hair's position */
      const hA   = sampleSurface(a.x, a.z, from);
      const hB   = sampleSurface(b.x, b.z, to);
      const sy   = lerp(hA, hB, t);

      transform.position.set(px, sy + 0.02, pz);
      transform.rotation.set(0.16, 0, rot);
      transform.scale.set(0.65, len, 0.65);
      transform.updateMatrix();
      mesh.current.setMatrixAt(i, transform.matrix);

      bulbTransform.position.set(px, sy - 0.01, pz);
      bulbTransform.rotation.set(0, 0, 0);
      bulbTransform.scale.set(0.045, 0.06, 0.045);
      bulbTransform.updateMatrix();
      bulbs.current.setMatrixAt(i, bulbTransform.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate  = true;
    bulbs.current.instanceMatrix.needsUpdate = true;

    if (group.current) group.current.rotation.y = -0.24 + value * 0.17;
  });

  return (
    <group ref={group} rotation={[0.2, -0.24, 0]}>
      {/* Skin surface — world-space geometry, no rotation */}
      <mesh geometry={surfGeo}>
        <meshPhysicalMaterial
          color="#dfc8af" roughness={0.38} metalness={0.04}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Hair root bulbs */}
      <instancedMesh ref={bulbs} args={[undefined, undefined, 50]} frustumCulled={false}>
        <sphereGeometry args={[1, 14, 10]} />
        <meshStandardMaterial color="#cfb392" roughness={0.4} emissive="#cda677" emissiveIntensity={0.04} />
      </instancedMesh>

      {/* Hair strands */}
      <instancedMesh ref={mesh} args={[hairGeo, hairMat, 50]} frustumCulled={false} />
    </group>
  );
}

export default function TreatmentScene(props: Props) {
  const [supported, setSupported] = useState(false);
  const [dpr, setDpr] = useState(1.25);
  useEffect(() => {
    try {
      const ctx = document.createElement('canvas').getContext('webgl2');
      setSupported(!!ctx);
      ctx?.getExtension('WEBGL_lose_context')?.loseContext();
    } catch { setSupported(false); }
  }, []);
  if (!supported) return <div className="treatment-fallback"><span /><span /><span /></div>;
  return (
    <Boundary>
      <Canvas
        dpr={dpr}
        frameloop={!props.active ? 'never' : props.reduced ? 'demand' : 'always'}
        camera={{ position: [0, 3.5, 7.4], fov: 36 }}
        gl={{ alpha: true, antialias: true }}
        onCreated={({ camera }) => camera.lookAt(0, 0.35, 0)}
      >
        <ambientLight intensity={0.65} />
        <directionalLight position={[-3, 6, 4]}  intensity={3.2} color="#ffedd5" />
        <directionalLight position={[4,  2, -4]} intensity={3.0} color="#d4bb92" />
        <PerformanceMonitor onDecline={() => setDpr(0.8)} bounds={() => [45, 58]} />
        <Field {...props} />
      </Canvas>
    </Boundary>
  );
}

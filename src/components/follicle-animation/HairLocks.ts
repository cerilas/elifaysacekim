import * as THREE from 'three';
import { headPoint, headNormal, donorSite } from './head';
import { HairCoverUniforms } from './HairCover';

const rnd = (i: number): number => {
  const x = Math.sin(i * 127.1 + 74.7) * 43758.5453;
  return x - Math.floor(x);
};

const smooth = (a: number, b: number, x: number): number => THREE.MathUtils.smoothstep(x, a, b);

export interface HairLocksResult {
  geometry: THREE.BufferGeometry;
  material: THREE.MeshPhysicalMaterial;
}

// Curved, overlapping tapered ribbons: one draw call for the whole groom.
export function createHairLocks(uniforms: HairCoverUniforms, low: boolean): HairLocksResult {
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const roots: number[] = [];
  const phases: number[] = [];
  const types: number[] = [];
  const indices: number[] = [];
  const count = low ? 4000 : 9000;
  const segments = 7;

  for (let i = 0; i < count; i++) {
    const angle = rnd(i * 9) * Math.PI * 2;
    const y = -0.12 + rnd(i * 9 + 1) * 2.28;
    const front = Math.cos(angle);
    const temple = Math.pow(Math.abs(Math.sin(angle)), 5);
    const edge = THREE.MathUtils.lerp(
      THREE.MathUtils.lerp(-0.15, 0.57, temple),
      1.43 + 0.32 * Math.pow(Math.abs(Math.sin(angle)), 1.8),
      smooth(-0.1, 0.65, front)
    );
    if (y < edge - 0.015) continue;

    const root = headPoint(y, angle);
    const normal = headNormal(y, angle);
    const top = 1 - (1 - smooth(1.05, 1.43, y)) * (1 - smooth(0.35, 0.76, front));
    const direction = new THREE.Vector3(top * 0.65, -0.85 * (1 - top) + 0.15 * top, -0.7);
    direction.addScaledVector(normal, -direction.dot(normal)).normalize();

    const length = (0.23 + top * 0.43) * (0.75 + rnd(i * 9 + 2) * 0.4);
    const width = (0.026 + top * 0.018) * (0.8 + rnd(i * 9 + 3) * 0.4);
    const phase = rnd(i * 9 + 4);
    const base = positions.length / 3;

    for (let j = 0; j <= segments; j++) {
      const t = j / segments;
      const candidate = root.clone().addScaledVector(direction, length * t);
      const a = Math.atan2(candidate.x, candidate.z + 0.45);
      const sy = Math.max(-0.28, Math.min(2.17, candidate.y));
      const center = headPoint(sy, a);
      const n = headNormal(sy, a);
      const side = new THREE.Vector3().crossVectors(direction, n).normalize();
      const height = 0.012 + (0.035 + top * 0.14) * Math.sin(Math.PI * t * 0.85) + top * 0.025;
      center.addScaledVector(n, height);
      const taper = Math.pow(1 - t, 0.55) * 0.9 + 0.06;

      for (let k = 0; k < 3; k++) {
        const u = k / 2;
        const point = center
          .clone()
          .addScaledVector(side, (u - 0.5) * width * taper)
          .addScaledVector(n, -Math.abs(u - 0.5) * 0.009);
        const vn = n.clone().addScaledVector(side, (u - 0.5) * 0.2).normalize();
        positions.push(...point.toArray());
        normals.push(...vn.toArray());
        uvs.push(u, t);
        roots.push(...root.toArray());
        phases.push(phase);
        types.push(top);
      }
    }

    for (let j = 0; j < segments; j++) {
      for (let k = 0; k < 2; k++) {
        const a = base + j * 3 + k;
        indices.push(a, a + 3, a + 1, a + 1, a + 3, a + 4);
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setAttribute('aRoot', new THREE.Float32BufferAttribute(roots, 3));
  geometry.setAttribute('aPhase', new THREE.Float32BufferAttribute(phases, 1));
  geometry.setAttribute('aTop', new THREE.Float32BufferAttribute(types, 1));
  geometry.setIndex(indices);

  const material = new THREE.MeshPhysicalMaterial({
    color: '#49382c',
    roughness: 0.82,
    metalness: 0,
    specularIntensity: 0.16,
    side: THREE.DoubleSide,
    alphaTest: 0.22,
    alphaToCoverage: true,
    transparent: false,
    clearcoat: 0,
    clearcoatRoughness: 1,
  });

  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader =
      'attribute vec3 aRoot; attribute float aPhase; attribute float aTop; varying vec2 vHairUV; varying vec3 vHairRoot; varying vec3 vHairPosition; varying float vPhase; varying float vVisible; uniform float uGrowth;\n' +
      shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>
    vHairUV=uv;vHairRoot=aRoot;vHairPosition=position;vPhase=aPhase;
    float wave=clamp((aRoot.z+1.9)/3.8,0.0,1.0)*.48;
    float growth=smoothstep(wave,wave+.5,uGrowth);
    vVisible=mix(1.0,growth,aTop);
    transformed=mix(aRoot,position,.05+.95*vVisible);
   `
    );
    shader.fragmentShader =
      'varying vec2 vHairUV; varying vec3 vHairRoot; varying vec3 vHairPosition; varying float vPhase; varying float vVisible; uniform float uCut;\n' +
      shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <color_fragment>',
      `#include <color_fragment>
    float u=vHairUV.x,v=vHairUV.y;
    float fiber=.5+.5*sin(u*105.0+vPhase*27.0+sin(v*7.0+vPhase)*.7);
    float edges=smoothstep(0.0,.12,u)*(1.0-smoothstep(.88,1.0,u));
    float tips=1.0-smoothstep(.68+.23*fiber,1.0,v);
    float donor=1.0-smoothstep(.5,1.04,distance(vHairRoot,vec3(${donorSite.toArray().map((val) => val.toFixed(6)).join(',')})));
    float angle=atan(vHairPosition.x,vHairPosition.z+.45),front=cos(angle);
    float boundary=mix(mix(-.15,.57,pow(abs(sin(angle)),5.0)),1.43+.32*pow(abs(sin(angle)),1.8),smoothstep(-.1,.65,front));
    float outline=smoothstep(boundary-.018,boundary+.035,vHairPosition.y);
    diffuseColor.a*=edges*tips*vVisible*(1.0-uCut*donor)*outline;
    diffuseColor.rgb*=.83+.10*vPhase+.045*fiber;
   `
    );
  };

  return { geometry, material };
}

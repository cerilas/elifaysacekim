import * as THREE from 'three';
import type { FolliclePlacement } from '../types';

export const TARGET = { x: 0.35, z: 0.72 };
export const SCALP = { xRadius: 2.48, zRadius: 1.56, depth: 1.52 };
export const surfaceHeight = (x: number, z: number) => 0.2 - 0.052 * x * x - 0.055 * z * z;

export function seededRandom(seed: number) {
  return () => {
    seed |= 0;
    seed = seed + 0x6D2B79F5 | 0;
    let value = Math.imul(seed ^ seed >>> 15, 1 | seed);
    value = value + Math.imul(value ^ value >>> 7, 61 | value) ^ value;
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

export function createPlacements(mobile: boolean): FolliclePlacement[] {
  const random = seededRandom(81);
  const points: FolliclePlacement[] = [];
  const count = mobile ? 11 : 19;
  // Rejection sampling with a minimum separation, including the graft site.
  for (let attempt = 0; points.length < count && attempt < 2000; attempt++) {
    const x = (random() - 0.5) * 4.42;
    const z = (random() - 0.5) * 2.65;
    if ((x / 2.25) ** 2 + (z / 1.36) ** 2 > 1) continue;
    if (Math.hypot(x - TARGET.x, z - TARGET.z) < 0.55) continue;
    if (points.some(point => Math.hypot(x - point.x, z - point.z) < 0.49)) continue;
    points.push({ x, z, height: surfaceHeight(x, z), angle: (random() - 0.5) * 0.2,
      length: 0.70 + random() * 0.40, width: 0.8 + random() * 0.38 });
  }
  return points;
}

/** A curved annulus with an actual recipient-channel hole, no texture mask. */
export function createSurfaceGeometry(mobile: boolean) {
  const radial = mobile ? 16 : 28;
  const angular = mobile ? 64 : 104;
  const positions: number[] = [], uvs: number[] = [], indices: number[] = [];
  const rx = SCALP.xRadius, rz = SCALP.zRadius;
  for (let row = 0; row <= radial; row++) {
    for (let col = 0; col <= angular; col++) {
      const theta = col / angular * Math.PI * 2;
      const dx = Math.cos(theta), dz = Math.sin(theta);
      const a = (dx / rx) ** 2 + (dz / rz) ** 2;
      const b = 2 * (TARGET.x * dx / (rx * rx) + TARGET.z * dz / (rz * rz));
      const c = (TARGET.x / rx) ** 2 + (TARGET.z / rz) ** 2 - 1;
      const boundary = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
      const distance = 0.115 + row / radial * (boundary - 0.115);
      const x = TARGET.x + dx * distance, z = TARGET.z + dz * distance;
      positions.push(x, surfaceHeight(x, z), z);
      uvs.push((x + rx) / (rx * 2), (z + rz) / (rz * 2));
      if (row < radial && col < angular) {
        const i = row * (angular + 1) + col;
        indices.push(i, i + 1, i + angular + 2, i, i + angular + 2, i + angular + 1);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function createTissueGeometry(mobile: boolean) {
  const segments = mobile ? 64 : 104;
  const rows = 12;
  const positions: number[] = [], colors: number[] = [], indices: number[] = [];
  const top = new THREE.Color('#b99b87');
  const bottom = new THREE.Color('#584036');
  for (let row = 0; row <= rows; row++) {
    const t = row / rows;
    // Rounded lower shoulder avoids the appearance of a hard-edged specimen box.
    const taper = 1 - 0.075 * Math.pow(t, 6);
    const color = top.clone().lerp(bottom, Math.pow(t, 0.62));
    for (let col = 0; col <= segments; col++) {
      const theta = col / segments * Math.PI * 2;
      const x = Math.cos(theta) * SCALP.xRadius * taper;
      const z = Math.sin(theta) * SCALP.zRadius * taper;
      positions.push(x, surfaceHeight(x, z) - t * SCALP.depth, z);
      colors.push(color.r, color.g, color.b);
      if (row < rows && col < segments) {
        const i = row * (segments + 1) + col;
        indices.push(i, i + 1, i + segments + 2, i, i + segments + 2, i + segments + 1);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function createSheathGeometry(mobile: boolean) {
  return new THREE.LatheGeometry([
    new THREE.Vector2(0, -1.34), new THREE.Vector2(0.08, -1.30),
    new THREE.Vector2(0.145, -1.17), new THREE.Vector2(0.155, -1.02),
    new THREE.Vector2(0.113, -0.82), new THREE.Vector2(0.078, -0.43),
    new THREE.Vector2(0.083, -0.09), new THREE.Vector2(0.108, 0.015),
  ], mobile ? 10 : 16);
}

export function createHairGeometry(mobile: boolean) {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -0.015, 0), new THREE.Vector3(0.055, 0.5, -0.035),
    new THREE.Vector3(0.16, 1.15, -0.10), new THREE.Vector3(0.37, 1.85, -0.15),
    new THREE.Vector3(0.68, 2.52, -0.12),
  ]);
  const segments = mobile ? 18 : 32, sides = mobile ? 5 : 7;
  const geometry = new THREE.TubeGeometry(curve, segments, 0.024, sides, false);
  const attribute = geometry.getAttribute('position');
  const point = new THREE.Vector3();
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const center = curve.getPointAt(t);
    const taper = 1 - 0.92 * Math.pow(t, 1.6);
    for (let j = 0; j <= sides; j++) {
      const index = i * (sides + 1) + j;
      point.fromBufferAttribute(attribute, index).sub(center).multiplyScalar(taper).add(center);
      attribute.setXYZ(index, point.x, point.y, point.z);
    }
  }
  geometry.computeVertexNormals();
  return geometry;
}

export function createNoiseTexture() {
  const size = 128, bytes = new Uint8Array(size * size * 4), random = seededRandom(902);
  for (let i = 0; i < size * size; i++) {
    const value = Math.floor(100 + random() * 145);
    bytes[i * 4] = value; bytes[i * 4 + 1] = value; bytes[i * 4 + 2] = value; bytes[i * 4 + 3] = 255;
  }
  const texture = new THREE.DataTexture(bytes, size, size);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = texture.minFilter = THREE.LinearFilter;
  texture.repeat.set(5, 5);
  texture.needsUpdate = true;
  return texture;
}

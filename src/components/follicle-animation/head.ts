import * as THREE from 'three';
import { smooth } from './story';
import scan from './assets/head-scan.json';
import scalp from './assets/scalp-surface.json';

interface ScalpSurface {
  rows: number;
  cols: number;
  min: number;
  max: number;
  radii: number[];
  centers: number[];
}

interface HeadScan {
  POSITION: number[];
  TEXCOORD_0: number[];
  indices: number[];
}

const scalpData = scalp as unknown as ScalpSurface;
const scanData = scan as unknown as HeadScan;

// Sample the actual scan surface, not a separate approximation of a head.
export function headPoint(y: number, theta: number): THREE.Vector3 {
  const { rows, cols, min, max, radii, centers } = scalpData;
  const yy = THREE.MathUtils.clamp(y, min, max);
  const v = ((yy - min) / (max - min)) * rows;
  const j = Math.min(rows - 1, Math.floor(v));
  const fy = v - j;
  const u = (((theta / (2 * Math.PI)) % 1 + 1) % 1) * cols;
  const i = Math.floor(u);
  const fx = u - i;
  const k = (i + 1) % cols;
  const r = THREE.MathUtils.lerp(
    THREE.MathUtils.lerp(radii[j * cols + i], radii[j * cols + k], fx),
    THREE.MathUtils.lerp(radii[(j + 1) * cols + i], radii[(j + 1) * cols + k], fx),
    fy
  );
  const center = THREE.MathUtils.lerp(centers[j], centers[j + 1], fy);
  return new THREE.Vector3(Math.sin(theta) * r, yy, Math.cos(theta) * r + center);
}

export function headNormal(y: number, theta: number): THREE.Vector3 {
  const e = 0.008;
  const a = headPoint(y + e, theta).sub(headPoint(y - e, theta));
  const b = headPoint(y, theta + e).sub(headPoint(y, theta - e));
  return b.cross(a).normalize();
}

export function headGeometry(): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(scanData.POSITION, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(scanData.TEXCOORD_0, 2));
  g.setIndex(scanData.indices);
  g.computeVertexNormals();
  return g;
}

export const donorSite: THREE.Vector3 = headPoint(0.12, 2.56);
export const donorNormal: THREE.Vector3 = headNormal(0.12, 2.56);
export const recipientSite: THREE.Vector3 = headPoint(1.53, 0.24);
export const recipientNormal: THREE.Vector3 = headNormal(1.53, 0.24);

const up = new THREE.Vector3(0, 1, 0);
export const donorQ = new THREE.Quaternion().setFromUnitVectors(up, donorNormal);

// 38 degrees above the local scalp tangent, swept toward the crown.
const tangent = new THREE.Vector3(0, 1, -1)
  .addScaledVector(recipientNormal, -new THREE.Vector3(0, 1, -1).dot(recipientNormal))
  .normalize();

const insertionAxis = recipientNormal
  .clone()
  .multiplyScalar(Math.sin((38 * Math.PI) / 180))
  .addScaledVector(tangent, Math.cos((38 * Math.PI) / 180))
  .normalize();

export const recipientQ = new THREE.Quaternion().setFromUnitVectors(up, insertionAxis);

export interface GraftTransform {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  release: number;
  travel: number;
  insert: number;
}

export function graftTransform(p: number): GraftTransform {
  const release = smooth(0.43, 0.51, p);
  const travel = smooth(0.51, 0.69, p);
  const insert = smooth(0.72, 0.815, p);
  const from = donorSite.clone().addScaledVector(donorNormal, release * 0.8);
  const to = recipientSite.clone().addScaledVector(recipientNormal, 1.0);
  const position = from.lerp(to, travel);
  position.y += Math.sin(travel * Math.PI) * 1.25;
  position.lerp(recipientSite, insert);
  return {
    position,
    quaternion: donorQ.clone().slerp(recipientQ, travel),
    release,
    travel,
    insert,
  };
}

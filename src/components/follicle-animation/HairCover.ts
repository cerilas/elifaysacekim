import * as THREE from 'three';
import { headGeometry, donorSite } from './head';

export interface HairCoverUniforms {
  uGrowth: { value: number };
  uCut: { value: number };
}

export interface HairCoverResult {
  geometry: THREE.BufferGeometry;
  material: THREE.MeshPhysicalMaterial;
  uniforms: HairCoverUniforms;
}

// A single groomed surface supplies the overall hair volume. Only the explanatory
// grafts remain individual strands, so the silhouette does not become wire-like.
export function createHairCover(): HairCoverResult {
  const geometry = headGeometry();
  const uniforms: HairCoverUniforms = { uGrowth: { value: 0 }, uCut: { value: 0 } };
  const material = new THREE.MeshPhysicalMaterial({
    color: '#3c3027',
    roughness: 0.88,
    metalness: 0,
    specularIntensity: 0.16,
    clearcoat: 0,
    clearcoatRoughness: 1,
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide,
  });

  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = 'varying vec3 vScalp; uniform float uGrowth;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>
    vScalp = position;
    float crown = smoothstep(.7, 1.8, position.y);
    float sweep = .5 + .5 * sin(position.x * 2.5 + position.z * 1.1);
    transformed += normal * (.008 + crown * (.008 + .015 * uGrowth) + .003 * sweep);
   `
    );
    shader.fragmentShader =
      'varying vec3 vScalp; uniform float uGrowth; uniform float uCut;\n' + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <color_fragment>',
      `#include <color_fragment>
    float angle = atan(vScalp.x, vScalp.z + .45);
    float front = cos(angle);
    float temple = pow(abs(sin(angle)), 5.0);
    float edge = mix(-.15, .57, temple);
    edge = mix(edge, 1.43 + .32 * pow(abs(sin(angle)), 1.8), smoothstep(-.1,.65,front));
    float edgeNoise = .003 * sin(angle * 137.0) + .002 * sin(angle * 251.0);
    float outline = smoothstep(edge-.018,edge+.035,vScalp.y+edgeNoise);
    float sides = (1.0-smoothstep(1.05,1.43,vScalp.y)) * (1.0-smoothstep(.35,.76,front));
    float wave = clamp((vScalp.z + 1.9)/3.8,0.0,1.0)*.48;
    float fill = smoothstep(wave, wave + .5, uGrowth);
    float cover = outline * max(sides,fill);
    // Subtle directional texture reads as combed locks rather than separate wires.
    float flow = angle * 175.0 + vScalp.y * 10.0 + sin(vScalp.y * 2.8 + angle) * 4.0;
    float fiber = .5 + .5 * sin(flow);
    float fineFiber = .5 + .5 * sin(flow * 3.17);
    float lock = .5 + .5 * sin(angle * 27.0 + vScalp.y * 4.0);
    diffuseColor.rgb *= .88 + .045*fiber + .012*fineFiber + .055*lock;
    float donorWindow = 1.0 - smoothstep(.50,1.04,distance(vScalp,vec3(${donorSite.x.toFixed(6)},${donorSite.y.toFixed(6)},${donorSite.z.toFixed(6)})));
    diffuseColor.a *= cover * (1.0-uCut*donorWindow);
    if(diffuseColor.a < .015) discard;
   `
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <normal_fragment_maps>',
      `#include <normal_fragment_maps>
    float hairAngle = atan(vScalp.x, vScalp.z + .45);
    float hairFlow = hairAngle * 175.0 + vScalp.y * 10.0 + sin(vScalp.y * 2.8 + hairAngle) * 4.0;
    float relief = .0015 * sin(hairFlow) + .0004 * sin(hairFlow * 3.17);
    vec3 q0 = dFdx(-vViewPosition), q1 = dFdy(-vViewPosition);
    vec3 r0 = cross(q1, normal), r1 = cross(normal, q0);
    float determinant = dot(q0,r0);
    normal = normalize(abs(determinant)*normal - sign(determinant)*(dFdx(relief)*r0+dFdy(relief)*r1));
   `
    );
  };
  return { geometry, material, uniforms };
}

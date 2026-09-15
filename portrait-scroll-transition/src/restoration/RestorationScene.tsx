import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
type Props={progress:RefObject<{value:number}>;active:boolean;reduced:boolean;mobile:boolean};
const ease=(p:number,a:number,b:number)=>THREE.MathUtils.smoothstep(p,a,b);
function seeded(seed:number){return()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};}
function hairGeometry(mobile:boolean){const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(0,0,0),new THREE.Vector3(-.13,.7,0),new THREE.Vector3(.05,1.7,-.07),new THREE.Vector3(.62,2.7,-.12),new THREE.Vector3(1.1,3.5,-.26)]);const segments=mobile?32:56,sides=mobile?5:7,g=new THREE.TubeGeometry(curve,segments,.028,sides,false),pos=g.getAttribute('position'),v=new THREE.Vector3();for(let i=0;i<=segments;i++){const center=curve.getPointAt(i/segments),taper=1-.95*Math.pow(i/segments,1.7);for(let j=0;j<=sides;j++){const n=i*(sides+1)+j;v.fromBufferAttribute(pos,n).sub(center).multiplyScalar(taper).add(center);pos.setXYZ(n,v.x,v.y,v.z);}}g.computeVertexNormals();return g;}
function SceneContent({progress,active,reduced,mobile}:Props){
 const root=useRef<THREE.Group>(null),graft=useRef<THREE.Group>(null),strand=useRef<THREE.Mesh>(null),field=useRef<THREE.InstancedMesh>(null),rootMat=useRef<THREE.MeshPhysicalMaterial>(null),rings=useRef<THREE.Group>(null),points=useRef<THREE.Points>(null),scalp=useRef<THREE.Mesh>(null);
 const {camera,size,invalidate}=useThree();
 const count=mobile?32:76;
 const resources=useMemo(()=>{
  const random=seeded(94),hair=hairGeometry(mobile),branches:THREE.BufferGeometry[]=[];
  for(let i=0;i<12;i++){const a=i/12*Math.PI*2;const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(0,-.96,0),new THREE.Vector3(Math.cos(a)*.17,-1.27,Math.sin(a)*.17),new THREE.Vector3(Math.cos(a)*.42,-1.6,Math.sin(a)*.42),new THREE.Vector3(Math.cos(a)*(.6+random()*.25),-1.83-random()*.2,Math.sin(a)*.64)]);branches.push(new THREE.TubeGeometry(curve,20,.008,4,false));}
  const roots=mergeGeometries(branches);branches.forEach(g=>g.dispose());
  const n=mobile?550:1700,cloud=new THREE.BufferGeometry(),positions=new Float32Array(n*3),targets=new Float32Array(n*3),seeds=new Float32Array(n);
  for(let i=0;i<n;i++){const a=random()*Math.PI*2,r=.65+random()*2.3;positions.set([Math.cos(a)*r,(random()-.5)*4,Math.sin(a)*r],i*3);const t=random(),b=random()*Math.PI*2,rad=.08+Math.sin(t*Math.PI)*.15;targets.set([Math.cos(b)*rad,-.95+t*.9,Math.sin(b)*rad],i*3);seeds[i]=random();}
  cloud.setAttribute('position',new THREE.BufferAttribute(positions,3));cloud.setAttribute('aTarget',new THREE.BufferAttribute(targets,3));cloud.setAttribute('aSeed',new THREE.BufferAttribute(seeds,1));
  const particles=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{uProgress:{value:0},uDpr:{value:1}},vertexShader:`attribute vec3 aTarget;attribute float aSeed;uniform float uProgress;uniform float uDpr;varying float vAlpha;varying float vSeed;void main(){float gather=smoothstep(.08,.36,uProgress);float release=smoothstep(.63,1.,uProgress);vec3 p=mix(position,aTarget,gather);float angle=uProgress*5.0*(1.-gather)+aSeed;mat2 turn=mat2(cos(angle),-sin(angle),sin(angle),cos(angle));p.xz=turn*p.xz;p+=position*release*.8;p.y+=release*1.6;vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=min(7.,(12.+aSeed*19.)/-mv.z)*uDpr;vAlpha=(.3+aSeed*.6)*(1.-gather*.8)*(1.-release*.4);vSeed=aSeed;}`,fragmentShader:`varying float vAlpha;varying float vSeed;void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;float glow=exp(-r*r*4.)*(1.-smoothstep(.65,1.,r));gl_FragColor=vec4(mix(vec3(.7,.40,.15),vec3(1.,.89,.66),vSeed),glow*vAlpha);#include <tonemapping_fragment>\n#include <colorspace_fragment>}`.replace(';#include',';\n#include')});
  const transforms=Array.from({length:count},(_,i)=>{const a=i*2.39996,r=.25+Math.sqrt(i/count)*1.9;return{x:Math.cos(a)*r,z:Math.sin(a)*r,length:.48+random()*.4,rotation:random()*.4-.2};});
  return{hair,roots,cloud,particles,transforms,object:new THREE.Object3D()};
 },[mobile,count]);
 useEffect(()=>()=>{resources.hair.dispose();resources.roots.dispose();resources.cloud.dispose();resources.particles.dispose();},[resources]);
 useEffect(()=>{if(active)invalidate();},[active,reduced,mobile,invalidate]);
 useFrame(({gl})=>{
  const p=progress.current.value,gather=ease(p,.12,.38),grow=ease(p,.38,.70),spread=ease(p,.66,.98);
  resources.particles.uniforms.uProgress.value=p;resources.particles.uniforms.uDpr.value=gl.getPixelRatio();
  if(root.current)root.current.rotation.y=-.25+p*.8;
  if(graft.current){graft.current.scale.setScalar(Math.max(.001,gather));graft.current.position.y=(1-gather)*.8;}
  if(rootMat.current)rootMat.current.emissiveIntensity=.18+Math.sin(grow*Math.PI)*.6;
  if(strand.current){strand.current.scale.set(.55+grow*.45,Math.max(.001,grow),1);strand.current.visible=grow>.001;}
  if(field.current){field.current.visible=spread>.001;resources.transforms.forEach((item,i)=>{const object=resources.object;object.position.set(item.x,0,item.z);object.rotation.set(.09,Math.sin(i)*.4,item.rotation+Math.sin(p*4+i*.3)*.10*spread);object.scale.set(.7,Math.max(.001,spread*item.length),.7);object.updateMatrix();field.current!.setMatrixAt(i,object.matrix);});field.current.instanceMatrix.needsUpdate=true;}
  if(rings.current){rings.current.scale.setScalar(.75+gather*.25+spread*.3);rings.current.rotation.y=p*.25;}
  if(scalp.current){(scalp.current.material as THREE.MeshPhysicalMaterial).opacity=.06+grow*.11+spread*.18;}
  const aspect=size.width/size.height,fit=Math.max(1,(mobile?.95:1.1)/aspect);camera.position.set(1.3-p*1.1,1.6+spread*.9,(8.5-gather*.9+spread*1.2)*fit);camera.lookAt(0,.4+spread*.25,0);
 });
 return <>
  <ambientLight intensity={.4}/><directionalLight position={[-3,5,4]} color="#fff1d9" intensity={3}/><directionalLight position={[4,3,-3]} color="#cf9d5b" intensity={4}/>
  <Environment frames={1} resolution={mobile?64:128}><Lightformer intensity={3} position={[-3,3,3]} scale={[4,6,1]} color="#ffe3b6"/><Lightformer intensity={2} position={[3,4,-3]} scale={[5,5,1]} color="#e3bf8b"/></Environment>
  <group ref={root}>
   <points ref={points} geometry={resources.cloud} material={resources.particles} frustumCulled={false}/>
   <group ref={graft}>
    <mesh position={[0,-.65,0]}><cylinderGeometry args={[.055,.095,.85,20]}/><meshPhysicalMaterial color="#c8a571" metalness={.45} roughness={.32}/></mesh>
    <mesh position={[0,-1.10,0]} scale={[.19,.29,.19]}><sphereGeometry args={[1,24,20]}/><meshPhysicalMaterial ref={rootMat} color="#e1bd86" emissive="#e4b875" emissiveIntensity={.18} metalness={.4} roughness={.3}/></mesh>
    <mesh geometry={resources.roots}><meshBasicMaterial color="#d8b279" transparent opacity={.44}/></mesh>
    <mesh position={[0,-.68,0]} scale={[.25,.8,.25]}><sphereGeometry args={[1,24,24]}/><meshPhysicalMaterial color="#dec296" transparent opacity={.10} roughness={.4} depthWrite={false}/></mesh>
   </group>
   <mesh ref={strand} geometry={resources.hair}><meshPhysicalMaterial color="#d6af73" metalness={.68} roughness={.23} clearcoat={.7}/></mesh>
   <instancedMesh ref={field} args={[resources.hair,undefined,count]} frustumCulled={false}><meshPhysicalMaterial color="#957244" metalness={.5} roughness={.34} clearcoat={.5}/></instancedMesh>
   <mesh ref={scalp} position={[0,-.06,0]} scale={[2.35,.07,1.65]}><sphereGeometry args={[1,48,16]}/><meshPhysicalMaterial color="#9b8260" metalness={.25} roughness={.6} transparent opacity={.06} depthWrite={false}/></mesh>
   <group ref={rings} position={[0,-.12,0]}>{[1.05,1.6,2.12].map((r,i)=><mesh key={r} rotation={[-Math.PI/2,0,0]} scale={[1,.72,1]}><ringGeometry args={[r,r+.004,96]}/><meshBasicMaterial color="#b99561" transparent opacity={.16-i*.025} side={THREE.DoubleSide} depthWrite={false}/></mesh>)}</group>
  </group>
 </>;
}
export default function RestorationScene(props:Props){const [quality,setQuality]=useState(1.4);return <Canvas dpr={Math.min(quality,props.mobile?1.1:1.5,typeof window==='undefined'?1:window.devicePixelRatio)} camera={{position:[1.3,1.6,8.5],fov:42}} frameloop={!props.active?'never':props.reduced?'demand':'always'} gl={{alpha:true,antialias:!props.mobile,powerPreference:'high-performance',toneMapping:THREE.ACESFilmicToneMapping,toneMappingExposure:1.2}}><PerformanceMonitor bounds={()=>[48,58]} onDecline={()=>setQuality(v=>Math.max(.8,v-.2))}/><SceneContent {...props}/></Canvas>;}

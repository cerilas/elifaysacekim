import React,{useEffect,useMemo,useRef,useState} from 'react';
import { Canvas,useFrame,useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {pose,smooth} from './story';
const mix=THREE.MathUtils.lerp;
const rand=i=>{const x=Math.sin(i*127.1+31.7)*43758.5453;return x-Math.floor(x)};
function hairGeometry(){const c=new THREE.CatmullRomCurve3([new THREE.Vector3(0,0,0),new THREE.Vector3(.035,.4,.02),new THREE.Vector3(.18,.85,.07),new THREE.Vector3(.42,1.2,.11),new THREE.Vector3(.7,1.45,.15)]);const g=new THREE.TubeGeometry(c,14,.016,5,false);return g}
function patchGeometry(){const s=new THREE.Shape();const w=3.5,h=2.5,r=.48;s.moveTo(-w+r,-h);s.lineTo(w-r,-h);s.quadraticCurveTo(w,-h,w,-h+r);s.lineTo(w,h-r);s.quadraticCurveTo(w,h,w-r,h);s.lineTo(-w+r,h);s.quadraticCurveTo(-w,h,-w,h-r);s.lineTo(-w,-h+r);s.quadraticCurveTo(-w,-h,-w+r,-h);const g=new THREE.ExtrudeGeometry(s,{depth:1.2,bevelEnabled:true,bevelSegments:5,steps:1,bevelSize:.15,bevelThickness:.15,curveSegments:18});g.rotateX(-Math.PI/2);g.translate(0,-1.2,0);return g}
function Skin({meshRef,geometry,opacity=1,color='#ce9f88',...props}){const material=useMemo(()=>{const m=new THREE.MeshPhysicalMaterial({color,roughness:.57,metalness:0,clearcoat:.08,transparent:true,opacity});m.onBeforeCompile=s=>{s.fragmentShader=s.fragmentShader.replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>\n float pore = fract(sin(dot(vViewPosition.xy * 115.0, vec2(12.9898,78.233))) * 43758.5453); roughnessFactor = clamp(roughnessFactor + (pore - .5) * .15, .1, 1.);`).replace('#include <color_fragment>',`#include <color_fragment>\nfloat grain = fract(sin(dot(vViewPosition.xy * 180.0, vec2(12.9898,78.233))) * 43758.5453); diffuseColor.rgb *= .97 + grain * .06;`)};return m},[color]);useEffect(()=>()=>material.dispose(),[material]);return <mesh ref={meshRef} geometry={geometry} material={material} {...props}/>}
function World({progress,low,reduced}){
 const {camera, size,invalidate,gl}=useThree(),donor=useRef(),recipient=useRef(),top=useRef(),skin=useRef(),graft=useRef(),tool=useRef(),hairs=useRef(),newHairs=useRef(),roots=useRef(),guides=useRef(),particles=useRef(),keyLight=useRef();
 const [adaptive,setAdaptive]=useState(false);const frameStats=useRef({sum:0,n:0});
 const geom=useMemo(()=>({patch:patchGeometry(),hair:hairGeometry(),root:new THREE.SphereGeometry(1,12,10),tube:new THREE.CylinderGeometry(.15,.2,.95,14),punch:new THREE.CylinderGeometry(.22,.22,1.55,32,1,true)}),[]);
 const count=low?240:620;
 const placements=useMemo(()=>Array.from({length:count},(_,i)=>{const x=(rand(i*3)-.5)*6.6,z=(rand(i*3+1)-.5)*4.6;return {x,z,s:.55+rand(i*3+2)*.65,rot:(rand(i+999)-.5)*.6}}),[count]);
 const dummy=useMemo(()=>new THREE.Object3D(),[]),target=useMemo(()=>new THREE.Vector3(),[]);
 useEffect(()=>{progress.current.invalidate=invalidate;invalidate();return()=>{progress.current.invalidate=()=>{}}},[invalidate,progress]);
 useEffect(()=>()=>Object.values(geom).forEach(g=>g.dispose()),[geom]);
 useFrame((_,delta)=>{
  const p=progress.current.value,s=pose(p),mobile=size.width<700;
  if(delta<.12&&delta>.004&&!adaptive){const f=frameStats.current;f.sum+=delta;f.n++;if(f.n===100&&f.sum/f.n>.029){setAdaptive(true);gl.setPixelRatio(1)}}
  donor.current.visible=p<.565;donor.current.scale.setScalar(Math.max(.001,s.donor));donor.current.position.y=-smooth(.50,.59,p)*2;
  skin.current.material.opacity=1-s.cut*.82;skin.current.material.depthWrite=s.cut<.5;top.current.scale.y=Math.max(.025,1-s.cut*.97);top.current.position.y=-.13;
  recipient.current.visible=s.recipient>.001;recipient.current.scale.setScalar(Math.max(.001,s.recipient));recipient.current.position.set(1.3,-1.8+1.8*s.recipient,0);
  graft.current.position.set(s.graftX,s.graftY,0);graft.current.rotation.set(0,s.travel*.7,-s.graftAngle);graft.current.scale.setScalar(1+smooth(.51,.58,p)*.18-smooth(.65,.72,p)*.18);
  const approach=smooth(.35,.405,p),withdraw=smooth(.445,.505,p);tool.current.visible=p>.35&&p<.525;tool.current.position.set(0,4-approach*3.1+withdraw*4.2,0);
  graft.current.children[0].scale.y=1+s.growth*.8;
  for(let i=0;i<count;i++){const h=placements[i];const dome=.7*Math.sqrt(Math.max(0,1-(h.x/3.5)**2-(h.z/2.5)**2))*(1-s.cut);dummy.position.set(h.x,dome,h.z);dummy.rotation.set(0,h.rot,-.12);const macro=i<16?1:1-s.cut;dummy.scale.set(h.s*macro,h.s*macro,h.s*macro);if(i<16&&s.cut>.01){const f=follicles[i];dummy.position.x=mix(h.x,f.x,s.cut);dummy.position.z=mix(h.z,f.z,s.cut);}dummy.updateMatrix();hairs.current.setMatrixAt(i,dummy.matrix);
   // An irregular leading edge forms the frontal hairline; density grows in waves.
   const edge=-1.45+.15*Math.cos(h.x*1.8)+.08*Math.sin(h.x*8);const available=h.z>edge;const g=smooth(.82+(i/count)*.09,.88+(i/count)*.095,p);dummy.position.set(h.x,0,h.z);dummy.rotation.set(.1,h.rot,-.48);dummy.scale.setScalar(available?Math.max(.00001,g)*h.s:.00001);dummy.updateMatrix();newHairs.current.setMatrixAt(i,dummy.matrix);
  }hairs.current.count=adaptive?Math.floor(count*.65):count;newHairs.current.count=hairs.current.count;hairs.current.instanceMatrix.needsUpdate=true;newHairs.current.instanceMatrix.needsUpdate=true;
  roots.current.visible=p>.13&&p<.59;roots.current.scale.y=Math.max(.001,s.cut);
  guides.current.visible=p>.65&&p<.83;guides.current.material.opacity=smooth(.65,.69,p)*(1-smooth(.78,.83,p))*.35;
  particles.current.visible=p>.49&&p<.68;particles.current.rotation.y=p*.5;particles.current.material.opacity=smooth(.49,.54,p)*(1-smooth(.62,.68,p))*.3;
  const focus=smooth(.08,.3,p),journey=smooth(.49,.58,p),landing=smooth(.61,.73,p),finish=smooth(.93,1,p);
  const aimX=mix(.0,.2,focus)+s.graftX*.65,aimY=mix(.2,.35,focus)+journey*2.4-landing*2.4;
  const distance=mix(15,12,focus)-journey*1.0+landing*.2+finish*3;
  // One continuous camera path. Mobile framing leaves room for the text above.
  target.set(aimX+(mobile?.8:0),aimY+(mobile?1.35:0),0);
  camera.position.set(target.x+3.8*(1-journey*.45)+landing*.9,target.y+4.7-journey*2+landing*1.4,distance*(mobile?1.33:1));camera.lookAt(target);camera.updateProjectionMatrix();
  keyLight.current.intensity=2.4+journey*.6-landing*.6;
 });
 const follicles=useMemo(()=>Array.from({length:16},(_,i)=>{const x=(i%8-3.5)*.76,z=i<8?-.85:1.05;return {x,z}}),[]);
 const rootMatrices=useMemo(()=>follicles.map(({x,z})=>{const o=new THREE.Object3D();o.position.set(x,-.58,z);o.scale.set(.1,.53,.1);o.rotation.z=-.14;o.updateMatrix();return o.matrix.clone()}),[follicles]);
 const particlePos=useMemo(()=>new Float32Array(Array.from({length:low?90:210},(_,i)=>(rand(i+900)-.5)*11)),[low]);
 return <>
  <ambientLight intensity={.7}/><hemisphereLight args={['#fffaf1','#aa8b77',.8]}/><directionalLight ref={keyLight} position={[-4,8,7]} intensity={3.8} color="#fff9f0"/><directionalLight position={[5,3,-4]} intensity={1.4} color="#ffffff"/>
  <group position={[.3,0,0]} rotation={[0,-.12,0]}>
   <group ref={donor}>
    <Skin meshRef={skin} geometry={geom.patch} color="#c9957e"/>
    <group ref={top}><mesh position={[0,.08,0]} scale={[3.48,.8,2.48]}><sphereGeometry args={[1,48,24]}/><meshPhysicalMaterial color="#d4ab94" roughness={.62}/></mesh></group>
    <instancedMesh ref={hairs} args={[geom.hair,null,count]} frustumCulled={false}><meshStandardMaterial color="#30271f" roughness={.43}/></instancedMesh>
    <group ref={roots}><instancedMesh args={[geom.root,null,16]} ref={m=>{if(m){rootMatrices.forEach((a,i)=>m.setMatrixAt(i,a));m.instanceMatrix.needsUpdate=true}}}><meshPhysicalMaterial color="#92624b" roughness={.55}/></instancedMesh><mesh position={[0,-1.07,0]} scale={[3.48,.06,2.47]}><boxGeometry/><meshStandardMaterial color="#e6c2a4"/></mesh></group>
   </group>
   <group ref={recipient}><Skin geometry={geom.patch} color="#dbb29a"/><instancedMesh ref={newHairs} args={[geom.hair,null,count]} frustumCulled={false}><meshStandardMaterial color="#30271f" roughness={.45}/></instancedMesh><mesh position={[0,.015,0]} rotation={[-Math.PI/2,0,0]} scale={[.11,.24,1]}><circleGeometry args={[1,24]}/><meshBasicMaterial color="#986f59" transparent opacity={.4}/></mesh><mesh ref={guides} position={[.1,.045,0]} rotation={[-Math.PI/2,0,.66]}><ringGeometry args={[.42,.43,40,1,0,Math.PI*1.3]}/><meshBasicMaterial color="#727863" transparent depthWrite={false} side={THREE.DoubleSide}/></mesh></group>
   <group ref={graft}>
    <group><mesh geometry={geom.hair} scale={[1.15,1.35,1.15]}><meshStandardMaterial color="#2b241d" roughness={.34}/></mesh><mesh geometry={geom.hair} rotation={[0,.7,.1]} scale={[.9,1.05,.9]}><meshStandardMaterial color="#392b20" roughness={.4}/></mesh></group>
    <mesh geometry={geom.tube} position={[0,-.47,0]}><meshPhysicalMaterial color="#ecc19c" roughness={.35} transparent opacity={.9} clearcoat={.25}/></mesh>
    <mesh position={[0,-.54,.012]} scale={[.066,.49,.066]} geometry={geom.root}><meshStandardMaterial color="#785240" roughness={.45}/></mesh>
    <mesh position={[0,-.98,0]} scale={[.15,.2,.14]} geometry={geom.root}><meshPhysicalMaterial color="#ba825c" roughness={.36}/></mesh>
    <mesh position={[0,.012,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.26,.276,48]}/><meshBasicMaterial color="#a88d4b" transparent opacity={.7} side={THREE.DoubleSide}/></mesh>
   </group>
   <group ref={tool}><mesh geometry={geom.punch}><meshPhysicalMaterial color="#d9dedd" metalness={.85} roughness={.23} side={THREE.DoubleSide}/></mesh><mesh position={[0,.94,0]}><cylinderGeometry args={[.32,.26,.4,32]}/><meshStandardMaterial color="#949e9d" metalness={.8} roughness={.25}/></mesh><mesh position={[0,-.78,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.22,.018,8,32]}/><meshStandardMaterial color="#e7ecec" metalness={.85} roughness={.19}/></mesh></group>
  </group>
  <points ref={particles}><bufferGeometry><bufferAttribute attach="attributes-position" args={[particlePos,3]}/></bufferGeometry><pointsMaterial color="#b8a58e" size={.026} transparent depthWrite={false}/></points>
 </>
}
export default function Scene({progress,reduced}){const low=useMemo(()=>navigator.hardwareConcurrency<=4||(navigator.deviceMemory&&navigator.deviceMemory<=4)||matchMedia('(max-width: 700px)').matches,[]);return <Canvas frameloop="demand" dpr={[1,low?1.25:1.75]} camera={{position:[3,5,12],fov:38,near:.1,far:60}} gl={{antialias:!low,alpha:true,powerPreference:'high-performance'}} onCreated={({gl,invalidate})=>{gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=1.12;progress.current.invalidate=invalidate}} fallback={<div className="ht-fallback">Explore the procedure using the chapters below.</div>}><World progress={progress} low={low} reduced={reduced}/></Canvas>}

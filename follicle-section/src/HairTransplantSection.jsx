import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { chapters, chapterAt, clamp } from './story';
import './style.css';
const Scene = lazy(() => import('./Scene'));
gsap.registerPlugin(ScrollTrigger);
class SceneBoundary extends React.Component {
 state={failed:false}; static getDerivedStateFromError(){return {failed:true}}
 render(){return this.state.failed?<div className="ht-fallback"><span>Precision. By nature.</span><p>The illustrated story is available in the chapter controls.</p></div>:this.props.children}
}
export default function HairTransplantSection({onAnalysisRequest,analysisHref='#hair-analysis',className=''}){
 const root=useRef(),view=useRef(),progress=useRef({value:0,invalidate:()=>{}}),trigger=useRef(),texts=useRef([]),meter=useRef(),percent=useRef();
 const [active,setActive]=useState(0),[ready,setReady]=useState(false),[reduced,setReduced]=useState(false);
 useEffect(()=>{const mq=matchMedia('(prefers-reduced-motion: reduce)');const sync=()=>setReduced(mq.matches);sync();mq.addEventListener('change',sync);return()=>mq.removeEventListener('change',sync)},[]);
 useEffect(()=>{const observer=new IntersectionObserver(([e])=>{if(e.isIntersecting){setReady(true);observer.disconnect()}},{rootMargin:'400px'});observer.observe(root.current);return()=>observer.disconnect()},[]);
 useEffect(()=>{
  const apply=()=>{const p=progress.current.value,i=chapterAt(p);setActive(i);if(meter.current)meter.current.style.transform=`scaleX(${p})`;if(percent.current)percent.current.textContent=String(Math.round(p*100)).padStart(2,'0');
   texts.current.forEach((el,j)=>{if(!el)return;const c=chapters[j],fade=j===0?1:clamp((p-c.start)/.016),out=j===6?1:clamp((c.end-p)/.016),o=j===i?Math.min(fade,out):0;el.style.opacity=o;el.style.transform=`translateY(${(1-o)*14}px)`;el.style.filter=`blur(${(1-o)*5}px)`;el.style.visibility=o>0?'visible':'hidden';el.inert=j!==i;});progress.current.invalidate();};
  const ctx=gsap.context(()=>{if(reduced){progress.current.value=.99;apply();return}progress.current.value=0;const tween=gsap.to(progress.current,{value:1,ease:'none',onUpdate:apply,scrollTrigger:{trigger:root.current,pin:view.current,start:'top top',end:()=>`+=${innerHeight*4}`,scrub:.65,invalidateOnRefresh:true}});trigger.current=tween.scrollTrigger;apply()},root);
  return()=>{trigger.current=null;ctx.revert()};
 },[reduced]);
 function navigate(i){const t=trigger.current;if(t){window.scrollTo({top:t.start+(t.end-t.start)*(chapters[i].start+.025),behavior:'instant'})}else{progress.current.value=chapters[i].start+.025;setActive(i);if(percent.current)percent.current.textContent=String(Math.round(progress.current.value*100));if(meter.current)meter.current.style.transform=`scaleX(${progress.current.value})`;texts.current.forEach((el,j)=>{el.style.opacity=j===i?1:0;el.style.visibility=j===i?'visible':'hidden';el.style.filter='none';el.style.transform='none';el.inert=j!==i});progress.current.invalidate()}}
 return <section ref={root} className={`ht-section ${className} ${reduced?'ht-reduced':''}`} aria-label="The art of hair restoration">
  <div ref={view} className="ht-viewport">
   <header className="ht-header"><div className="ht-wordmark"><span className="ht-mark">f.</span><span>FOLLICLE<span className="ht-wordmark-sub">THE SCIENCE OF NATURAL</span></span></div><span className="ht-header-note">HAIR RESTORATION, REFINED</span><button className="ht-skip" onClick={()=>navigate(6)}>Skip to result <span>↗</span></button></header>
   <div className="ht-scene"><SceneBoundary><Suspense fallback={<div className="ht-loading">Preparing the finer details<span>Procedural 3D experience</span></div>}>{ready&&<Scene progress={progress} reduced={reduced}/>}</Suspense></SceneBoundary></div>
   <div className="ht-editorial"><div className="ht-kicker"><span/> THE ART OF HAIR RESTORATION</div>{chapters.map((c,i)=><article key={c.label} ref={el=>texts.current[i]=el} className={`ht-copy ht-copy-${i}`} aria-hidden={active!==i}><div className="ht-chapter">0{i+1} <span>/</span> {c.label}</div><h1>{c.title}</h1><p>{c.subtitle}</p>{i===6&&(onAnalysisRequest?<button className="ht-cta" onClick={onAnalysisRequest}>Get Your Hair Analysis <span>↗</span></button>:<a className="ht-cta" href={analysisHref} onClick={e=>{if(analysisHref==='#hair-analysis')e.preventDefault()}}>Get Your Hair Analysis <span>↗</span></a>)}</article>)}</div>
   <div className={`ht-annotation ${active===3?'ht-annotation-floating':''}`}><span className="ht-cross">+</span><div>{['Donor region','Follicular unit','Precision FUE punch','One follicular graft','Natural growth angle','Progressive density','A considered hairline'][active]}<small>{['A foundation for natural growth','01 selected · structure preserved','Controlled, individual extraction','Hair shaft · follicle · bulb','38° · direction-led placement','An illustrative growth sequence','Individual by design'][active]}</small></div></div>
   <div className="ht-bottom"><div className="ht-scroll"><span>↓</span><div>{reduced?'EXPLORE AT YOUR PACE':'SCROLL TO EXPLORE'}<small>{reduced?'Select a chapter below':'A closer look. One graft at a time.'}</small></div></div><div className="ht-bottom-right">AN INTERACTIVE EXPLORATION <span ref={percent}>00</span><small>/ 100</small></div></div>
   <nav className="ht-nav" aria-label="Procedure chapters">{chapters.map((c,i)=><button key={c.label} onClick={()=>navigate(i)} aria-current={active===i?'step':undefined} aria-label={`Chapter ${i+1}: ${c.label}`}><span className="ht-nav-number">0{i+1}</span><span className="ht-nav-label">{['Beginning','Selection','Extraction','Journey','Placement','Growth','Result'][i]}</span><span className="ht-nav-dot"/></button>)}</nav>
   <div className="ht-progress"><div ref={meter}/></div><span className="ht-disclaimer">Conceptual visualization · not to scale</span>
  </div>
 </section>
}

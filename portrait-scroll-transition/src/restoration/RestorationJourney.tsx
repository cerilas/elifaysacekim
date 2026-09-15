import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './restoration.css';
const Scene = lazy(() => import('./RestorationScene'));
const chapters = [
  ['Bir olasılık.', 'Binlerce küçük detay. Tek bir yeni başlangıç.'],
  ['Kök salan\nbir başlangıç.', 'Işık, saç kökünün çevresinde bir araya geliyor.'],
  ['Hayat bulan\nbir tel.', 'Kökten yüzeye uzanan, incelikle şekillenen bir yol.'],
  ['Doğallığa uzanan\nbir hikâye.', 'Tek bir telden, birlikte hareket eden bir bütüne.'],
];
class Boundary extends Component<{children: ReactNode; onError: () => void}, {failed: boolean}> {
  state = { failed: false }; static getDerivedStateFromError() { return {failed:true}; }
  componentDidCatch() { this.props.onError(); } render() { return this.state.failed ? null : this.props.children; }
}
export default function RestorationJourney() {
  const root = useRef<HTMLElement>(null), stage = useRef<HTMLDivElement>(null);
  const progress = useRef({ value: 0 });
  const trigger = useRef<ScrollTrigger | null>(null);
  const [chapter, setChapter] = useState(0), [active, setActive] = useState(false);
  const [ready, setReady] = useState(false), [reduced, setReduced] = useState(false), [mobile, setMobile] = useState(false), [failed, setFailed] = useState(false);
  useEffect(() => {
    const query = matchMedia('(max-width: 767px)'); const resize = () => setMobile(query.matches);resize();query.addEventListener('change',resize);
    try { const context = document.createElement('canvas').getContext('webgl2'); if (!context) setFailed(true);context?.getExtension('WEBGL_lose_context')?.loseContext(); } catch {setFailed(true);}
    setReady(true);
    let inView=false;const visibility=()=>setActive(inView&&!document.hidden);
    const observer=new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;visibility();});if(stage.current)observer.observe(stage.current);
    document.addEventListener('visibilitychange',visibility);
    return()=>{observer.disconnect();query.removeEventListener('change',resize);document.removeEventListener('visibilitychange',visibility);};
  },[]);
  useEffect(()=>{
    if(!ready)return;
    gsap.registerPlugin(ScrollTrigger);
    const media=gsap.matchMedia();
    media.add({motion:'(prefers-reduced-motion: no-preference)',reduce:'(prefers-reduced-motion: reduce)'},context=>{
      const staticMode=Boolean(context.conditions?.reduce)||failed;setReduced(staticMode);
      if(staticMode){progress.current.value=1;setChapter(3);return;}
      progress.current.value=0;
      const timeline=gsap.to(progress.current,{value:1,duration:1,paused:true,ease:'none',onUpdate:()=>{
        const p=progress.current.value;setChapter(Math.min(3,Math.floor(p*4)));root.current?.style.setProperty('--journey-progress',String(p));
        if(root.current)root.current.dataset.progress=p.toFixed(3);
      }});
      trigger.current=ScrollTrigger.create({trigger:root.current,pin:stage.current,pinSpacing:false,start:'top top',end:'bottom bottom',animation:timeline,scrub:true,invalidateOnRefresh:true});
      return()=>{trigger.current?.kill();trigger.current=null;timeline.kill();};
    });
    return()=>media.revert();
  },[ready,failed]);
  return <section ref={root} id="restoration-journey" className={`rj-root ${reduced?'rj-static':''}`} aria-labelledby="rj-title" data-active={active}>
    <div ref={stage} className="rj-stage">
      <div className="rj-atmosphere" aria-hidden="true"/>
      <header className="rj-top"><span>FOLIA / GÖRÜNMEYENİN HİKÂYESİ</span><span>03 — BİR DÖNÜŞÜM</span></header>
      <div className="rj-copy"><p className="rj-eyebrow"><i/>KÖKTEN GELEN OLASILIK</p><div className="rj-headlines" id="rj-title">{chapters.map(([title],index)=><h2 key={title} aria-hidden={index!==chapter} className={index===chapter?'is-active':''}>{title.split('\n').map((line,i)=><span key={line}>{i===1?<em>{line}</em>:line}</span>)}</h2>)}</div><p className="rj-description" aria-live="polite">{chapters[chapter][1]}</p><span className="rj-micro">SAÇ RESTORASYONUNA SANATSAL BİR BAKIŞ</span></div>
      <div className="rj-scene" aria-hidden="true">{ready&&!failed?<Boundary onError={()=>setFailed(true)}><Suspense fallback={<div className="rj-fallback"/>}><Scene progress={progress} active={active} reduced={reduced} mobile={mobile}/></Suspense></Boundary>:<div className="rj-fallback"/>}</div>
      <div className="rj-figure"><span>0{chapter+1}</span><div>{['Olasılık alanı','Foliküler yapı','Yüzeye doğru','Birlikte büyümek'][chapter]}<small>MİKRO ÖLÇEKTE BİR YOLCULUK</small></div></div>
      <div className="rj-bottom"><span>{reduced?'Bir yeni başlangıç.':'Dönüşümü keşfetmek için kaydırın ↓'}</span><nav aria-label="Dönüşüm aşamaları">{['Olasılık','Kök','Büyüme','Bütünlük'].map((label,index)=><button type="button" key={label} aria-current={chapter===index?'step':undefined} onClick={()=>{const t=trigger.current;if(t)window.scrollTo({top:t.start+(t.end-t.start)*[0,.34,.62,1][index],behavior:'instant'});}} disabled={reduced}><span>0{index+1}</span>{label}</button>)}</nav></div>
      <div className="rj-progress" aria-hidden="true"/><p className="rj-note">Sanatsal görselleştirme; gerçek anatomi veya tedavi süresini temsil etmez.</p>
    </div>
  </section>;
}

import { StrictMode, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HairTransplantHero } from '../src/components/hair-hero';
import '../src/site.css';

declare global {
  interface Window {
    fixture: { triggerCount: () => number };
    heroDrawCalls: number;
  }
}

function Fixture() {
  const [shown, setShown] = useState(true);
  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const external = ScrollTrigger.create({ trigger: sentinel.current, start: 'top bottom', end: 'bottom top' });
    window.fixture = { triggerCount: () => ScrollTrigger.getAll().length };
    return () => external.kill();
  }, []);
  return <>
    <button style={{ position: 'fixed', top: 4, left: 4, zIndex: 20 }} onClick={() => setShown(value => !value)}>Toggle hero</button>
    {shown && <HairTransplantHero />}
    <div ref={sentinel} style={{ height: '110vh' }}>Independent scroll section</div>
  </>;
}
createRoot(document.getElementById('root')!).render(<StrictMode><Fixture /></StrictMode>);

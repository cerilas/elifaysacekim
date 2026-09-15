'use client';
import { useEffect, useId, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './portrait-scroll.css';

export interface PortraitScrollTransitionProps {
  name?: string;
  title?: string;
  portraitSrc?: string;
  portraitPosition?: string;
  className?: string;
}

/** One portrait moves between two measured anchors. No duplicate moving images,
 * pinned screens, wheel interception, or timers driving the transition. */
export function PortraitScrollTransition({ name = 'Elif Ay', title = 'Saç ekim uzmanı', portraitSrc, portraitPosition = '50% 35%', className = '' }: PortraitScrollTransitionProps) {
  const root = useRef<HTMLDivElement>(null);
  const start = useRef<HTMLSpanElement>(null);
  const end = useRef<HTMLDivElement>(null);
  const moving = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLElement>(null);
  const bio = useRef<HTMLElement>(null);
  const uid = useId().replace(/:/g, '');
  const profileId = `portrait-profile-${uid}`;
  useEffect(() => {
    if (!root.current || !start.current || !end.current || !moving.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const element = root.current!;
      const portrait = moving.current!;
      let first = { x: 0, y: 0, scale: 1, clip: '' };
      let last = { x: 0, y: 0, width: 0, height: 0 };
      const measure = () => {
        const r = element.getBoundingClientRect(), a = start.current!.getBoundingClientRect(), b = end.current!.getBoundingClientRect();
        const scale = 64 / b.width;
        last = { x: b.left - r.left, y: b.top - r.top, width: b.width, height: b.height };
        first = { x: a.left - r.left, y: a.top - r.top + 32 - b.height * scale / 2, scale,
          clip: `inset(${(b.height - b.width) / 2}px 0px round ${b.width / 2}px)` };
        gsap.set(portrait, { width: b.width, height: b.height });
      };
      measure();
      const context = gsap.context(() => {
        gsap.set(element, { '--portrait-enhanced': 1 });
        element.dataset.enhanced = 'true';
        gsap.set('.pt-profile-copy > *', { y: 45, opacity: 0 });
        gsap.set('.pt-picture-caption', { y: 16, opacity: 0 });
        gsap.set('.pt-profile-rule', { scaleX: 0 });
        const timeline = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
          trigger: intro.current, start: 'top top', endTrigger: bio.current, end: 'top top', scrub: true,
          invalidateOnRefresh: true, onRefreshInit: measure,
          onUpdate: self => { element.dataset.progress = self.progress.toFixed(3); },
        } });
        timeline.fromTo(portrait, {
          x: () => first.x, y: () => first.y, scale: () => first.scale, clipPath: () => first.clip,
        }, { x: () => last.x, y: () => last.y, scale: 1, clipPath: 'inset(0px 0px round 6px)', duration: 1, ease: 'power2.inOut' }, 0);
        timeline.fromTo('.pt-intro-content', { opacity: 1 }, { opacity: 0, duration: .43, ease: 'power1.in' }, 0);
        timeline.fromTo('.pt-profile-copy > *', { y: 45, opacity: 0 }, { y: 0, opacity: 1, stagger: .045, duration: .2, ease: 'power2.out' }, .63);
        timeline.fromTo('.pt-picture-caption', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .12 }, .88);
        timeline.fromTo('.pt-profile-rule', { scaleX: 0 }, { scaleX: 1, duration: .3 }, .65);
      }, element);
      let refreshFrame = 0;
      const resize = new ResizeObserver(() => {
        cancelAnimationFrame(refreshFrame);
        refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
      });
      resize.observe(end.current!);
      resize.observe(intro.current!);
      let disposed = false;
      document.fonts?.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); });
      return () => {
        disposed = true; resize.disconnect(); cancelAnimationFrame(refreshFrame);
        context.revert(); delete element.dataset.enhanced; delete element.dataset.progress;
      };
    });
    return () => media.revert();
  }, []);
  const portrait = (decorative = false, slot = 'moving') => portraitSrc
    ? <img src={portraitSrc} alt={decorative ? '' : name} decoding="async" style={{ objectPosition: portraitPosition }} />
    : <svg viewBox="0 0 500 650" role={decorative ? undefined : 'img'} aria-label={decorative ? undefined : 'Gerçek uzman fotoğrafı için hazırlanmış temsili portre alanı'} aria-hidden={decorative || undefined}>
      <defs><linearGradient id={`portrait-gradient-${uid}-${slot}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#c5b69b"/><stop offset="1" stopColor="#70604a"/></linearGradient></defs>
      <rect width="500" height="650" fill={`url(#portrait-gradient-${uid}-${slot})`}/><ellipse cx="250" cy="255" rx="150" ry="200" fill="none" stroke="#e1d3bb" opacity=".17"/>
      <path d="M45 650C62 484 153 439 202 422L213 369C168 324 165 263 182 212C206 141 268 125 310 171C360 225 340 320 282 372L294 423C355 447 437 508 457 650" fill="#d2c4ac" opacity=".48"/>
      <path d="M214 273C245 253 260 224 263 202M283 369C317 329 330 283 322 236" fill="none" stroke="#f0e2c6" opacity=".36"/>
    </svg>;
  return <div ref={root} className={`pt-root ${className}`}>
    <section ref={intro} className="pt-intro" aria-labelledby={`intro-${uid}`}>
      <div className="pt-topline"><span className="pt-brand">FOLIA</span><span>01 — BİR BAŞLANGIÇ</span></div>
      <div className="pt-intro-content">
        <p className="pt-eyebrow">SİZE ÖZGÜ BİR YAKLAŞIM</p>
        <h1 id={`intro-${uid}`}>Yeni bir başlangıç.<br /><em>Doğru kişiyle.</em></h1>
        <p className="pt-intro-description">Her hikâye, önce sizi dinlemekle başlar.</p>
        <a className="pt-author" href={`#${profileId}`}>
          <span ref={start} className="pt-avatar" aria-hidden="true">{portrait(true, 'avatar')}</span>
          <span><strong>{name}</strong><small>{title}</small></span><span className="pt-author-arrow" aria-hidden="true">↗</span>
        </a>
      </div>
      <div className="pt-intro-bottom"><a href={`#${profileId}`}>Uzmanınızla tanışmak için kaydırın <span aria-hidden="true">↓</span></a><span>ÖZEN, İNSANLA BAŞLAR.</span></div>
    </section>
    <section ref={bio} id={profileId} className="pt-profile" aria-labelledby={`profile-heading-${uid}`}>
      <div className="pt-profile-top"><span>02 — UZMANINIZLA TANIŞIN</span><span>HER DETAYDA İNSAN ODAĞI</span></div>
      <div className="pt-profile-rule" />
      <div className="pt-profile-layout">
        <div className="pt-profile-visual"><div ref={end} className="pt-portrait-anchor">{portrait(false, 'profile')}</div><p className="pt-picture-caption">{portraitSrc ? 'ÖNCE SİZİ DİNLİYORUZ.' : 'PORTRE ALANI · GERÇEK FOTOĞRAF EKLENECEK'}</p></div>
        <article className="pt-profile-copy">
          <p className="pt-eyebrow">{title}</p>
          <h2 id={`profile-heading-${uid}`}>{name}</h2>
          <p className="pt-profile-lead">Bir işlemden önce,<br /><em>bir insanı tanımak.</em></p>
          <p className="pt-profile-description">Beklentilerinizi anlamaya, sorularınızı dinlemeye ve size özgü bir yaklaşımı birlikte değerlendirmeye alan açıyoruz.</p>
          <div className="pt-principle"><span>01</span><p>Önce dinlemek.<small>Hikâyeniz ve beklentilerinizle başlamak.</small></p></div>
          <div className="pt-principle"><span>02</span><p>Birlikte planlamak.<small>Her adımı açık ve anlaşılır biçimde ele almak.</small></p></div>
          <span className="pt-signature" aria-hidden="true">{name}</span>
        </article>
      </div>
    </section>
    <div ref={moving} className="pt-moving-portrait" aria-hidden="true">{portrait(true)}</div>
  </div>;
}
export default PortraitScrollTransition;

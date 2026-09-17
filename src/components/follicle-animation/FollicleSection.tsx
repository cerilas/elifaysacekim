import React, { Suspense, lazy, useEffect, useRef, useState, type ComponentProps } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { type Language } from '../../i18n';
import { getChapters, chapterAt, clamp } from './story';
import './follicle.css';

const FollicleScene = lazy(() => import('./FollicleScene'));

// Preload the 3D scene module during idle time
if (typeof window !== 'undefined') {
  const preloadScene = () => {
    import('./FollicleScene');
  };
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(preloadScene);
  } else {
    setTimeout(preloadScene, 800);
  }
}

gsap.registerPlugin(ScrollTrigger);

class SceneBoundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="ht-fallback">
        <span>Kalıcı ve Doğal Sonuçlar</span>
        <p>Saç restorasyon sürecini aşağıdaki adımlarla inceleyebilirsiniz.</p>
      </div>
    ) : (
      this.props.children
    );
  }
}

export interface FollicleSectionProps extends ComponentProps<'section'> {
  onAnalysisRequest?: () => void;
  analysisHref?: string;
  currentLang?: Language;
}

export function FollicleSection({
  onAnalysisRequest,
  analysisHref = '#care',
  currentLang = 'tr',
  className = '',
  ...rest
}: FollicleSectionProps) {
  const activeChapters = getChapters(currentLang);
  const root = useRef<HTMLElement>(null);
  const view = useRef<HTMLDivElement>(null);
  const progress = useRef<{ value: number; invalidate?: () => void }>({
    value: 0,
    invalidate: () => { },
  });
  const trigger = useRef<ScrollTrigger | null>(null);
  const texts = useRef<(HTMLElement | null)[]>([]);
  const meter = useRef<HTMLDivElement>(null);
  const percent = useRef<HTMLSpanElement>(null);

  const [active, setActive] = useState<number>(0);
  const [ready, setReady] = useState<boolean>(true);
  const [reduced, setReduced] = useState<boolean>(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const apply = () => {
      const p = progress.current.value;
      const i = chapterAt(p);
      setActive(i);
      if (meter.current) {
        meter.current.style.transform = `scaleX(${p})`;
      }
      if (percent.current) {
        percent.current.textContent = String(Math.round(p * 100)).padStart(2, '0');
      }

      texts.current.forEach((el, j) => {
        if (!el) return;
        const c = activeChapters[j];
        if (!c) return;
        const fade = j === 0 ? 1 : clamp((p - c.start) / 0.016);
        const out = j === 6 ? 1 : clamp((c.end - p) / 0.016);
        const o = j === i ? Math.min(fade, out) : 0;
        el.style.opacity = String(o);
        el.style.transform = `translateY(${(1 - o) * 14}px)`;
        el.style.filter = `blur(${(1 - o) * 5}px)`;
        el.style.visibility = o > 0 ? 'visible' : 'hidden';
        el.inert = j !== i;
      });

      if (progress.current.invalidate) {
        progress.current.invalidate();
      }
    };

    const ctx = gsap.context(() => {
      if (reduced) {
        progress.current.value = 0.99;
        apply();
        return;
      }
      progress.current.value = 0;
      const tween = gsap.to(progress.current, {
        value: 1,
        ease: 'none',
        onUpdate: apply,
        scrollTrigger: {
          trigger: root.current,
          pin: view.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * 4}`,
          scrub: 0.65,
          invalidateOnRefresh: true,
        },
      });
      trigger.current = tween.scrollTrigger ?? null;
      apply();
    }, root);

    return () => {
      trigger.current = null;
      ctx.revert();
    };
  }, [reduced, activeChapters]);

  function navigate(i: number) {
    const t = trigger.current;
    if (t) {
      window.scrollTo({
        top: t.start + (t.end - t.start) * (activeChapters[i].start + 0.025),
        behavior: 'instant',
      });
    } else {
      progress.current.value = activeChapters[i].start + 0.025;
      setActive(i);
      if (percent.current) {
        percent.current.textContent = String(Math.round(progress.current.value * 100));
      }
      if (meter.current) {
        meter.current.style.transform = `scaleX(${progress.current.value})`;
      }
      texts.current.forEach((el, j) => {
        if (!el) return;
        el.style.opacity = j === i ? '1' : '0';
        el.style.visibility = j === i ? 'visible' : 'hidden';
        el.style.filter = 'none';
        el.style.transform = 'none';
        el.inert = j !== i;
      });
      if (progress.current.invalidate) {
        progress.current.invalidate();
      }
    }
  }

  const currentChapter = activeChapters[active] || activeChapters[0];

  const titles: Record<Language, React.ReactNode> = {
    tr: <>Kalıcı ve<br /><em>doğal sonuçlar.</em></>,
    en: <>Permanent &amp;<br /><em>natural results.</em></>,
    ar: <>نتائج دائمة<br /><em>وطبيعية تماماً.</em></>,
    de: <>Dauerhafte &amp;<br /><em>natürliche Ergebnisse.</em></>,
  };

  const wordmarkSubs: Record<Language, string> = {
    tr: 'SAÇ EKİM MERKEZİ',
    en: 'HAIR RESTORATION CENTER',
    ar: 'مركز زراعة الشعر',
    de: 'HAARTRANSPLANTATIONS-ZENTRUM',
  };

  const kickers: Record<Language, string> = {
    tr: '03 / SAÇ VE KAŞ RESTORASYON SÜRECİ',
    en: '03 / HAIR & EYEBROW RESTORATION PROCESS',
    ar: '03 / مراحل استعادة الشعر والحواجب',
    de: '03 / HAAR- & AUGENBRAUENRESTORATION',
  };

  return (
    <section
      ref={root}
      id="treatments"
      className={`treatments-section ht-section ${className} ${reduced ? 'treatments-reduced ht-reduced' : ''}`}
      aria-labelledby="treatments-title"
      {...rest}
    >
      <div ref={view} className="treatments-stage ht-viewport">
        {/* Header bar with title matching HeroSpecialistTransition selector */}
        <header className="ht-header">
          <div className="treatments-intro">
            <p className="clinic-eyebrow"></p>
            <h2 id="treatments-title">
              {titles[currentLang] || titles.tr}
            </h2>
          </div>

          <div className="ht-wordmark">
            <div className="ht-avatar-wrapper">
              <img
                src="/elif-ay-portrait.jpg"
                alt="Saç Ekim Uzmanı Elif Ay"
                className="ht-avatar-img"
              />
            </div>
            <div className="ht-wordmark-text">
              <span className="ht-wordmark-name">ELİF AY</span>
              <span className="ht-wordmark-sub">{wordmarkSubs[currentLang] || wordmarkSubs.tr}</span>
            </div>
          </div>

          <span className="ht-header-note"></span>
        </header>

        {/* 3D Scene */}
        <div className="ht-scene" aria-hidden="true">
          <SceneBoundary>
            <Suspense
              fallback={
                <div className="ht-loading">
                  {currentLang === 'en' ? 'Preparing details...' : currentLang === 'ar' ? 'جاري التحضير...' : currentLang === 'de' ? 'Details laden...' : 'Detaylar hazırlanıyor...'}
                  <span>{currentLang === 'en' ? 'Procedural 3D Hair Restoration Scene' : currentLang === 'ar' ? 'مشهد ثلاثي الأبعاد لترميم الشعر' : currentLang === 'de' ? 'Prozedurale 3D-Haarrestorationsszene' : 'Prosedürel 3D Saç Restorasyon Sahnesi'}</span>
                </div>
              }
            >
              {ready && <FollicleScene progress={progress} reduced={reduced} />}
            </Suspense>
          </SceneBoundary>
        </div>

        {/* Editorial Chapters Left Column */}
        <div className="ht-editorial">
          <div className="ht-kicker">
            <span /> {kickers[currentLang] || kickers.tr}
          </div>
          {activeChapters.map((c, i) => (
            <article
              key={c.label}
              ref={(el) => {
                texts.current[i] = el;
              }}
              className={`ht-copy ht-copy-${i}`}
              aria-hidden={active !== i}
            >
              <div className="ht-chapter">
                0{i + 1} <span>/</span> {c.label}
              </div>
              <h3>
                {c.title.split('\n').map((line, idx) => (
                  <React.Fragment key={idx}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </h3>
              <p>{c.subtitle}</p>
              {i === 6 && (
                onAnalysisRequest ? (
                  <button type="button" className="ht-cta" onClick={onAnalysisRequest}>
                    Ücretsiz Saç Analizi Alın <span>↗︎</span>
                  </button>
                ) : (
                  <a
                    className="ht-cta"
                    href="https://wa.me/905364916040?text=Merhaba%2C%20saç%20ekimi%20hakkında%20bilgi%20ve%20ücretsiz%20analiz%20almak%20istiyorum."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ücretsiz Saç Analizi Alın <span>↗︎</span>
                  </a>
                )
              )}
            </article>
          ))}
        </div>

        {/* Technical Callout Annotation */}
        <div className={`ht-annotation ${active === 3 ? 'ht-annotation-floating' : ''}`}>
          <span className="ht-cross">+</span>
          <div>
            <strong>{currentChapter.annotation}</strong>
            <small>{currentChapter.annotationDetail}</small>
          </div>
        </div>

        {/* Bottom Bar: Scroll Indicator and Percentage */}
        <div className="ht-bottom">
          <div className="ht-scroll">
            <span>↓</span>
            <div>
              {reduced ? 'ADIMLARI SEÇEREK KEŞFEDİN' : 'AŞAMALARI KEŞFETMEK İÇİN KAYDIRIN'}
              <small>
                {reduced
                  ? 'Aşağıdaki adımlara tıklayın'
                  : 'Kök kök, santim santim doğal restorasyon yolculuğu.'}
              </small>
            </div>
          </div>
          <div className="ht-bottom-right">
            İNTERAKTİF RESTORASYON SÜRECİ <span ref={percent}>00</span>
            <small>/ 100</small>
          </div>
        </div>

        {/* Chapter Navigation Buttons */}
        <nav
          className="ht-nav"
          aria-label={
            currentLang === 'en'
              ? 'Operation Phases'
              : currentLang === 'ar'
              ? 'مراحل العملية'
              : currentLang === 'de'
              ? 'Operationsphasen'
              : 'Operasyon Aşamaları'
          }
        >
          {activeChapters.map((c, i) => (
            <button
              key={c.label}
              type="button"
              onClick={() => navigate(i)}
              aria-current={active === i ? 'step' : undefined}
              aria-label={
                currentLang === 'en'
                  ? `Step ${i + 1}: ${c.label}`
                  : currentLang === 'ar'
                  ? `المرحلة ${i + 1}: ${c.label}`
                  : currentLang === 'de'
                  ? `Schritt ${i + 1}: ${c.label}`
                  : `Adım ${i + 1}: ${c.label}`
              }
            >
              <span className="ht-nav-number">0{i + 1}</span>
              <span className="ht-nav-label">{c.label}</span>
              <span className="ht-nav-dot" />
            </button>
          ))}
        </nav>

        {/* Bottom Progress Edge */}
        <div className="ht-progress">
          <div ref={meter} />
        </div>
        <span className="ht-disclaimer">
          {currentLang === 'en'
            ? 'Representative 3D biomedical visualization.'
            : currentLang === 'ar'
            ? 'رسم توضيحي ثلاثي الأبعاد تمثيلي.'
            : currentLang === 'de'
            ? 'Repräsentative biomedizinische 3D-Visualisierung.'
            : 'Temsili biyomedikal 3D görselleştirmedir.'}
          <span aria-hidden="true"> · </span>
          <a href="/model-credits.html" target="_blank" rel="noopener noreferrer">
            3D model credits
          </a>
        </span>
      </div>
    </section>
  );
}

export default FollicleSection;

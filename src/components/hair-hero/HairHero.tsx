'use client';

import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { PHASES } from './animation/timeline';
import { useScrollProgress } from './animation/useScrollProgress';
import { useHeroEnvironment } from './animation/useHeroEnvironment';
import { type Language } from '../../i18n';
import './hair-hero.css';

const HeroCanvas = lazy(() => import('./scene/HeroCanvas'));

export const HERO_I18N: Record<Language, {
  eyebrow: string;
  headline: ReactNode;
  description: string;
  ctaLabel: string;
  expertTitle: string;
  profileAria: string;
  sceneHeading: string;
  scrollHintStatic: string;
  scrollHintMotion: string;
  chapters: [string, string, string];
  microNote: string;
  srOnly: string;
}> = {
  tr: {
    eyebrow: 'Gaziantep Saç Ekimi · Hassasiyet, Özen ve Doğal Sonuçlar',
    headline: <>Köklerden gelen,<br /><em>özgüven.</em></>,
    description: 'Gaziantep en iyi saç ekim merkezi standartlarında; Safir FUE, DHI ve Gold FUE teknikleriyle kişiye özel saç, sakal ve kaş ekimi. Şanlıurfa, Diyarbakır ve çevre illerden kolay ulaşım.',
    ctaLabel: 'Süreci keşfedin',
    expertTitle: 'Saç Ekim Koordinatörü ve Danışmanı',
    profileAria: 'Saç Ekim Koordinatörü ve Danışmanı Elif Ay ile tanışın',
    sceneHeading: 'SAÇ EKİMİ BİLİMİ',
    scrollHintStatic: 'Keşfetmeye devam et',
    scrollHintMotion: 'Keşfetmek için kaydır',
    chapters: ['Temel', 'Yerleştirme', 'Büyüme'],
    microNote: 'MİKROSKOBİK BİR BAKIŞ AÇISI',
    srOnly: 'Kafa derisinin stilize edilmiş mikroskobik kesiti. Folikülleri görmek, boş bir kanala greft yerleştirmek ve yeni bir saç telinin büyümesini izlemek için kaydırın. Bu animasyon süreci hızlandırır ve gerçek bir tedavi zaman çizelgesini temsil etmez.',
  },
  en: {
    eyebrow: 'Gaziantep Hair Restoration · Precision, Care & Natural Results',
    headline: <>Confidence stemming,<br /><em>from the roots.</em></>,
    description: 'Personalized hair, beard, and eyebrow restoration in Gaziantep using Sapphire FUE and DHI methods. Central clinic location with convenient regional and international access.',
    ctaLabel: 'Explore the process',
    expertTitle: 'Hair Transplant Coordinator & Consultant',
    profileAria: 'Meet Hair Transplant Coordinator & Consultant Elif Ay',
    sceneHeading: 'THE SCIENCE OF RESTORATION',
    scrollHintStatic: 'Continue exploring',
    scrollHintMotion: 'Scroll to explore',
    chapters: ['Foundation', 'Placement', 'Growth'],
    microNote: 'A MICROSCOPIC PERSPECTIVE',
    srOnly: 'Stylized microscopic cross-section of the scalp. Scroll to observe follicles, place a graft into an open channel, and watch new hair grow.',
  },
  ar: {
    eyebrow: 'زراعة الشعر في غازي عنتاب · دقة وعناية فائقة ونتائج طبيعية',
    headline: <>ثقة حقيقية نابعة،<br /><em>من الجذور.</em></>,
    description: 'زراعة مخصصة للشعر واللحية والحواجب بأعلى المعايير الطبية في مركز غازي عنتاب باستخدام تقنيات السفير وDHI، مع سهولة الوصول من كافة المحافظات والبلدان المجاورة.',
    ctaLabel: 'استكشف المراحل',
    expertTitle: 'منسقة ومستشارة زراعة الشعر',
    profileAria: 'تعرف على منسقة ومستشارة زراعة الشعر إليف آي',
    sceneHeading: 'علم استعادة الشعر',
    scrollHintStatic: 'متابعة الاستكشاف',
    scrollHintMotion: 'مرر للأسفل للاستكشاف',
    chapters: ['الأساس', 'الزراعة', 'النمو'],
    microNote: 'منظور مجهري دقيق',
    srOnly: 'مقطع مجهري دقيق لفروة الرأس. مرر لرؤية البصيلات، وزراعة الطعم في القناة، ومتابعة نمو الشعرة الجديدة.',
  },
  de: {
    eyebrow: 'Haartransplantation Gaziantep · Präzision, Sorgfalt & Natürliche Ergebnisse',
    headline: <>Selbstvertrauen,<br /><em>das an den Wurzeln beginnt.</em></>,
    description: 'Maßgeschneiderte Haar-, Bart- und Augenbrauentransplantation nach höchsten Standards in Gaziantep mit Saphir FUE und DHI. Zentrale Lage mit bequemer Erreichbarkeit.',
    ctaLabel: 'Ablauf entdecken',
    expertTitle: 'Haartransplantations-Koordinatorin & Beraterin',
    profileAria: 'Lernen Sie Haartransplantations-Koordinatorin & Beraterin Elif Ay kennen',
    sceneHeading: 'WISSENSCHAFT DER RESTORATION',
    scrollHintStatic: 'Weiter entdecken',
    scrollHintMotion: 'Scrollen zum Entdecken',
    chapters: ['Grundlage', 'Platzierung', 'Wachstum'],
    microNote: 'EINE MIKROSKOPISCHE PERSPEKTIVE',
    srOnly: 'Mikroskopischer Querschnitt der Kopfhaut. Scrollen Sie, um Follikel zu sehen, ein Graft einzusetzen und das neue Haarwachstum zu beobachten.',
  },
};

export interface HairTransplantHeroProps {
  className?: string;
  header?: ReactNode;
  currentLang?: Language;
  /** Replace all default headline/CTA content with your own semantic HTML. */
  children?: ReactNode;
  eyebrow?: string;
  headline?: ReactNode;
  description?: string;
  ctaLabel?: string;
  /** Omit to use the built-in scroll-to-placement CTA. */
  ctaHref?: string;
  /** Called only for a renderer failure; never logs visitors' information. */
  onRenderError?: (error: Error) => void;
}

class SceneBoundary extends Component<{ children: ReactNode; onError?: (error: Error) => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error) { this.props.onError?.(error); }
  render() { return this.state.failed ? null : this.props.children; }
}

function SceneFallback() {
  return <div className="hh-fallback" aria-hidden="true">
    <div className="hh-fallback-surface" />
    {[0, 1, 2, 3, 4, 5, 6].map(index => <i key={index} style={{ '--strand': index } as React.CSSProperties} />)}
  </div>;
}

export function HairHero({
  className = '', header, children,
  currentLang = 'tr',
  eyebrow,
  headline,
  description,
  ctaLabel,
  ctaHref, onRenderError,
}: HairTransplantHeroProps) {
  const i18n = HERO_I18N[currentLang] || HERO_I18N.tr;
  const resolvedEyebrow = eyebrow ?? i18n.eyebrow;
  const resolvedHeadline = headline ?? i18n.headline;
  const resolvedDescription = description ?? i18n.description;
  const resolvedCtaLabel = ctaLabel ?? i18n.ctaLabel;
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const environment = useHeroEnvironment(stage);
  const [ready, setReady] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  const [failed, setFailed] = useState(false);
  const [canvasKey, setCanvasKey] = useState(0);
  const staticMode = environment.reducedMotion || failed;
  const { animation, phase, seek } = useScrollProgress(section, stage, environment.ready, staticMode);
  const onReady = useCallback(() => setReady(true), []);
  const onLost = useCallback(() => { setContextLost(true); setReady(false); }, []);
  const onRestored = useCallback(() => { setContextLost(false); setCanvasKey(key => key + 1); }, []);
  const onError = useCallback((error: Error) => {
    setFailed(true); setReady(false); onRenderError?.(error);
  }, [onRenderError]);
  useEffect(() => {
    if (environment.ready && !environment.webglSupported) onError(new Error('WebGL 2 is unavailable. Showing the static hero.'));
  }, [environment.ready, environment.webglSupported, onError]);
  const phaseInfo = PHASES[phase];
  return <section ref={section}
    className={`hh-root ${staticMode ? 'hh-reduced' : ''} ${className}`}
    aria-label="An interactive perspective on hair restoration"
    data-phase={phase} data-render-state={failed ? 'fallback' : contextLost ? 'lost' : ready ? 'ready' : 'loading'}
    data-render-active={environment.active && !contextLost ? 'true' : 'false'}
  >
    <div ref={stage} className="hh-stage">
      {header}
      <div className="hh-atmosphere" aria-hidden="true" />
      <div className={`hh-scene ${ready && !failed && !contextLost ? 'is-ready' : ''}`} aria-hidden="true">
        <SceneFallback />
        <div className="hh-webgl">
          <SceneBoundary onError={onError}>
            {environment.ready && environment.webglSupported && !failed && <Suspense fallback={null}>
              <HeroCanvas key={canvasKey} animation={animation} mobile={environment.mobile}
                reducedMotion={staticMode} active={environment.active && !contextLost}
                onReady={onReady} onContextLost={onLost} onContextRestored={onRestored} />
            </Suspense>}
          </SceneBoundary>
        </div>
      </div>
      <div className="hh-copy">
        {children ?? <>
          <p className="hh-eyebrow"><span />{resolvedEyebrow}</p>
          <h1>{resolvedHeadline}</h1>
          <p className="hh-description">{resolvedDescription}</p>
          <div className="hh-actions">
            {ctaHref
              ? <a className="hh-cta" href={ctaHref} aria-label={resolvedCtaLabel}>{resolvedCtaLabel}<span aria-hidden="true">↗︎</span></a>
              : <button className="hh-cta" type="button" aria-label={resolvedCtaLabel} onClick={() => {
                if (staticMode) window.scrollTo({ top: window.scrollY + (section.current?.getBoundingClientRect().bottom ?? window.innerHeight), behavior: 'instant' });
                else seek(0.45);
              }}>{resolvedCtaLabel}<span aria-hidden="true">↗︎</span></button>}
            <a className="hh-mini-profile" id="hero-mini-profile" href="#specialist" aria-label={i18n.profileAria}>
              <div className="hh-mini-profile-img-wrapper" id="hero-mini-profile-img-wrapper">
                <img src="/elif-ay-portrait.jpg" alt="Elif Ay" style={{ objectPosition: '50% 35%' }} />
              </div>
              <div className="hh-mini-profile-info">
                <strong>Elif Ay</strong>
                <span>{i18n.expertTitle}</span>
              </div>
              <span className="hh-mini-profile-arrow" aria-hidden="true">↗︎</span>
            </a>
          </div>
        </>}
      </div>
      <div className="hh-scene-heading" aria-hidden="true"><span className="hh-cross">+</span><span>{i18n.sceneHeading}</span><span className="hh-scene-index">FIG. 01</span></div>
      <div className="hh-scene-caption" aria-live="polite" aria-atomic="true">
        <span className="hh-caption-rule" aria-hidden="true" />
        <p><span className="hh-phase-number">0{phase + 1}</span>{phaseInfo.title}</p>
        <span>{phaseInfo.detail}</span>
      </div>
      <div className="hh-bottom">
        <a className="hh-scroll-hint" href="#specialist" onClick={event => {
          const next = section.current?.nextElementSibling;
          event.preventDefault();
          if (next) next.scrollIntoView({ behavior: 'instant' });
          else window.scrollTo({ top: window.scrollY + (section.current?.getBoundingClientRect().bottom ?? window.innerHeight), behavior: 'instant' });
        }}><span aria-hidden="true">↓</span><span>{staticMode ? i18n.scrollHintStatic : i18n.scrollHintMotion}</span></a>
        {!staticMode && <nav className="hh-chapters" aria-label="Restoration animation chapters">
          {[
            { label: i18n.chapters[0], progress: 0, active: phase < 3 },
            { label: i18n.chapters[1], progress: 0.665, active: phase === 3 },
            { label: i18n.chapters[2], progress: 0.86, active: phase >= 4 },
          ].map((chapter, index) => <button type="button" key={chapter.label}
            aria-current={chapter.active ? 'step' : undefined} onClick={() => seek(chapter.progress)}>
            <span>0{index + 1}</span>{chapter.label}
          </button>)}
        </nav>}
        <span className="hh-micro-note">{i18n.microNote}</span>
      </div>
      {!staticMode && <div className="hh-progress" aria-hidden="true"><span /></div>}
      <p className="hh-sr-only">{i18n.srOnly}</p>
    </div>
  </section>;
}

export const HairTransplantHero = HairHero;
export default HairTransplantHero;

import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { HairTransplantHero } from './components/hair-hero';
import './site.css';
import { HeroSpecialistTransition, SpecialistSection, TreatmentsSection } from './components/clinic-sections/ClinicSections';
import { KnowledgeBaseSection, openArticleBySlug, type Article } from './components/knowledge-base';
import { ElifAyGallerySection } from './components/gallery';
import { ArticlePage } from './components/article-page';
import { TreatmentPage } from './components/treatment-page';
import { BlogPage } from './components/blog-page';
import { SiteHeader, MobileStickyBar, SiteFooter } from './components/layout';
import articlesDataRaw from './data/articles.json';
import { getTreatmentBySlug } from './data/treatmentData';
import { type Language, type Theme, LANGUAGES } from './i18n';

const allArticles = articlesDataRaw as Article[];



const CARE_I18N = {
  tr: {
    overline: 'ELİF AY FARKI — GAZİANTEP SAÇ EKİMİ DOKTORLARI VE UZMAN KADROSU',
    title: <>Her detayda<br /><em>insan odağı.</em></>,
    desc: "Gaziantep en iyi saç ekim merkezi yaklaşımıyla; doğal ön saç çizgisi tasarımı, Gold FUE ve DHI Choi kalemiyle kişiye özel hassas planlama. Şanlıurfa, Diyarbakır, Kahramanmaraş, Mardin, Batman ve Adıyaman'dan gelen hastalarımıza iğnesiz ve ağrısız anesteziyle her şey dahil saç ekim paketi sunuyoruz.",
    s1Title: 'Doğal Ön Çizgi Tasarımı',
    s1Desc: 'Yüz oranlarınıza ve yaşınıza en uygun doğal saç çizgisi; Safir ve DHI teknikleriyle her bir greftin 38° doğal çıkış açısı titizlikle çizilir.',
    s2Title: 'İğnesiz Anestezi & Hassas Alım',
    s2Desc: 'Ağrısız lokal anesteziyle donör alandan toplanan tekli ve çoklu greftler; saç, sakal-bıyık ve kaş ekiminde doku hasarı olmadan özenle yerleştirilir.',
    s3Title: 'Ömür Boyu Kalıcı Sonuçlar',
    s3Desc: 'Genetik olarak dökülmeyen köklerle; şok dökülme evresinden tam uzamaya kadar 12 ay boyunca uzman takibiyle doğal ve gür saçlara kavuşursunuz.',
    waBtn: 'WhatsApp ile Ücretsiz Greft Analizi Başlatın ↗︎',
    waMsg: 'Merhaba, Gaziantep saç ekimi ve ücretsiz greft analizi almak istiyorum.',
    note: 'Temsili görselleştirmedir. Anatomi ve süre basitleştirilmiştir; kişiden kişiye saç ekimi, sakal ve kaş ekimi sonuçları farklılık gösterebilir.',
  },
  en: {
    overline: 'THE ELIF AY ADVANTAGE — SPECIALIST CLINICAL TEAM IN GAZIANTEP',
    title: <>Human-centered care<br /><em>in every detail.</em></>,
    desc: 'Top clinical excellence in Gaziantep: bespoke hairline design, Gold FUE and DHI Choi implanter precision planning. For our patients traveling from regional cities and abroad, we provide needle-free comfortable anesthesia and comprehensive treatment packages.',
    s1Title: 'Natural Hairline Architecture',
    s1Desc: 'Harmonized with facial symmetry and age; each graft is aligned at a natural 38° growth angle using Sapphire and DHI.',
    s2Title: 'Needle-Free Anesthesia & Gentle Extraction',
    s2Desc: 'Follicular units harvested painlessly from the donor area are implanted with zero tissue trauma for hair, beard, and eyebrows.',
    s3Title: 'Permanent Lifelong Results',
    s3Desc: 'Genetically permanent follicles; supported by 12 months of specialist medical follow-up from shock loss through full density.',
    waBtn: 'Start Free Graft Analysis on WhatsApp ↗︎',
    waMsg: 'Hello, I would like to get a free graft analysis for hair restoration in Gaziantep.',
    note: 'Representative visualization. Anatomy and timelines simplified; individual hair, beard, and eyebrow restoration results may vary.',
  },
  ar: {
    overline: 'بصمة الأخصائية إليف آي — كادر طبي تخصصي في غازي عنتاب',
    title: <>عناية ترتكز على الإنسان<br /><em>في كل تفصيل.</em></>,
    desc: 'بنهج المركز الرائد في غازي عنتاب؛ نقدم تصميماً طبيعياً لخط الشعر وتخطيطاً دقيقاً بأقلام تشوي DHI وغولد FUE. لمرضانا القادمين من المدن المجاورة ومختلف الدول، نوفر تخديراً مريحاً بدون إبر وباقات علاجية متكاملة.',
    s1Title: 'تصميم خط شعر طبيعي',
    s1Desc: 'متوافق مع أبعاد الوجه والعمر؛ وتوجيه دقيق لكل بصيلة بزاوية خروج طبيعية 38 درجة باستخدام السفير وDHI.',
    s2Title: 'تخدير بدون إبر واقتطاف لطيف',
    s2Desc: 'اقتطاف البصيلات الأحادية والمتعددة بتخدير بدون إبر وزراعتها بأقصى درجات العناية للشعر واللحية والحواجب دون إتلاف الأنسجة.',
    s3Title: 'نتائج دائمة مدى الحياة',
    s3Desc: 'بصيلات مقاومة وراثياً للتساقط؛ تنمو بكثافة طبيعية مع متابعة طبية تخصصية مستمرة على مدار 12 شهراً.',
    waBtn: 'ابدأ تحليل البصيلات المجاني عبر واتساب ↗︎',
    waMsg: 'مرحباً، أود الحصول على تحليل مجاني لزراعة الشعر لدى عيادة إليف آي في غازي عنتاب.',
    note: 'رسم توضيحي تمثيلي. قد تختلف نتائج زراعة الشعر واللحية والحواجب من شخص لآخر حسب جودة المنطقة المانحة وطبيعة الأنسجة.',
  },
  de: {
    overline: 'DER ELIF AY VORTEIL — GAZIANTEP EXPERTENTEAM',
    title: <>Der Mensch im Fokus<br /><em>in jedem Detail.</em></>,
    desc: 'Nach den Maßstäben führender Kliniken in Gaziantep: individuelles Haarliniendesign, Gold FUE und DHI Choi Implanter. Für Patienten aus der Region und dem Ausland bieten wir nadelfreie Anästhesie und transparente Behandlungspakete.',
    s1Title: 'Natürliches Haarliniendesign',
    s1Desc: 'Abgestimmt auf Gesichtsproportionen und Alter; präzise Platzierung jedes Grafts im natürlichen 38°-Winkel mit Saphir und DHI.',
    s2Title: 'Nadelfreie Anästhesie & Sanfte Entnahme',
    s2Desc: 'Schmerzfreie Entnahme von Einzel- und Mehrfach-Grafts aus dem Spenderbereich und gewebeschonende Implantation für Haar, Bart und Augenbrauen.',
    s3Title: 'Dauerhaftes Haarwachstum',
    s3Desc: 'Genetisch resistente Spenderwurzeln wachsen ein Leben lang; begleitet von 12 Monaten fachärztlicher Nachsorge.',
    waBtn: 'Kostenlose Graft-Analyse per WhatsApp starten ↗︎',
    waMsg: 'Hallo, ich möchte mich über die Haartransplantation und eine kostenlose Graft-Analyse in Gaziantep informieren.',
    note: 'Medizinische Veranschaulichung. Ergebnisse von Haar-, Bart- und Augenbrauentransplantationen können je nach Spenderqualität individuell variieren.',
  },
};



function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('elifay_theme') as Theme;
      if (saved === 'light' || saved === 'dark' || saved === 'med') return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
    }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('elifay_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : prev === 'light' ? 'med' : 'dark'));
  };

  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const langParam = urlParams.get('lang') as Language;
      if (langParam && ['tr', 'en', 'ar', 'de'].includes(langParam)) return langParam;

      const saved = localStorage.getItem('elifay_lang') as Language;
      if (saved && ['tr', 'en', 'ar', 'de'].includes(saved)) return saved;
    }
    return 'tr';
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = LANGUAGES[lang]?.dir || 'ltr';
    localStorage.setItem('elifay_lang', lang);
  }, [lang]);

  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname + window.location.search + window.location.hash;
    }
    return '/';
  });

  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(window.location.pathname + window.location.search + window.location.hash);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigateTo = (to: string) => {
    if (to.startsWith('/#') || to.startsWith('#')) {
      const hash = to.startsWith('/#') ? to.substring(1) : to;
      if (window.location.pathname !== '/') {
        window.history.pushState(null, '', '/' + hash);
        setCurrentPath('/' + hash);
        setTimeout(() => {
          const el = document.querySelector<HTMLElement>(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        window.history.pushState(null, '', hash);
        setCurrentPath('/' + hash);
        const el = document.querySelector<HTMLElement>(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    window.history.pushState(null, '', to);
    setCurrentPath(to);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Route matching: Check for /bilgi-bankasi (hub), /blog (hub), /bilgi-bankasi/:slug, /tedaviler/:slug or legacy #article-:slug
  const pathOnly = currentPath.split('?')[0].split('#')[0];
  let articleSlug = '';
  let treatmentSlug = '';

  const isBlogHub = pathOnly === '/bilgi-bankasi' || pathOnly === '/bilgi-bankasi/' || pathOnly === '/blog' || pathOnly === '/blog/';

  if (!isBlogHub && pathOnly.startsWith('/bilgi-bankasi/')) {
    articleSlug = pathOnly.replace(/^\/bilgi-bankasi\/?/, '').replace(/\/$/, '');
  } else if (pathOnly.startsWith('/tedaviler/')) {
    treatmentSlug = pathOnly.replace(/^\/tedaviler\/?/, '').replace(/\/$/, '');
  } else if (currentPath.includes('#article-')) {
    const match = currentPath.match(/#article-([^&?#]+)/);
    if (match && match[1]) {
      articleSlug = match[1];
      window.history.replaceState(null, '', `/bilgi-bankasi/${articleSlug}`);
    }
  }

  const activeArticle = articleSlug ? allArticles.find((a) => a.slug === articleSlug) : null;
  const activeTreatment = treatmentSlug ? getTreatmentBySlug(treatmentSlug) : null;

  useEffect(() => {
    if (activeArticle || activeTreatment || isBlogHub) return; // Dedicated subpage handles its own scroll/tween

    let activeTween: gsap.core.Tween | null = null;

    const stopScroll = () => {
      if (activeTween) {
        activeTween.kill();
        activeTween = null;
      }
    };

    window.addEventListener('wheel', stopScroll, { passive: true });
    window.addEventListener('touchmove', stopScroll, { passive: true });

    const handleAnchorClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement)?.closest('a[href^="#"]');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      if (href.startsWith('#article-')) {
        e.preventDefault();
        const slug = href.replace('#article-', '');
        navigateTo(`/bilgi-bankasi/${slug}`);
        return;
      }

      e.preventDefault();

      let targetY = 0;
      if (href !== '#top') {
        const targetEl = document.querySelector<HTMLElement>(href);
        if (targetEl) {
          const container = href === '#care' ? (targetEl.closest<HTMLElement>('section') || targetEl) : targetEl;
          const rect = container.getBoundingClientRect();
          targetY = rect.top + window.scrollY;
        } else {
          return;
        }
      }

      const currentY = window.scrollY;
      const distance = Math.abs(targetY - currentY);
      if (distance < 5) return;

      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
        window.scrollTo({ top: targetY, behavior: 'auto' });
        return;
      }

      // Slower, graceful scroll effect: 1.4s to 2.2s depending on travel distance
      const duration = Math.min(2.2, Math.max(1.4, 0.9 + distance / 3500));

      stopScroll();

      if (window.history?.pushState) {
        window.history.pushState(null, '', href);
      }

      const scrollState = { y: currentY };
      activeTween = gsap.to(scrollState, {
        y: targetY,
        duration,
        ease: 'power2.inOut',
        onUpdate: () => {
          window.scrollTo(0, scrollState.y);
        },
        onComplete: () => {
          activeTween = null;
        },
      });
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      stopScroll();
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('wheel', stopScroll);
      window.removeEventListener('touchmove', stopScroll);
    };
  }, [activeArticle, activeTreatment]);

  if (isBlogHub) {
    return (
      <BlogPage
        onNavigate={navigateTo}
        theme={theme}
        onToggleTheme={toggleTheme}
        onSelectTheme={setTheme}
        currentLang={lang}
        onLanguageChange={setLang}
      />
    );
  }

  if (activeArticle) {
    return (
      <ArticlePage
        article={activeArticle}
        onNavigate={navigateTo}
        theme={theme}
        onToggleTheme={toggleTheme}
        onSelectTheme={setTheme}
        currentLang={lang}
        onLanguageChange={setLang}
      />
    );
  }

  if (activeTreatment) {
    return (
      <TreatmentPage
        treatment={activeTreatment}
        onNavigate={navigateTo}
        theme={theme}
        onToggleTheme={toggleTheme}
        onSelectTheme={setTheme}
        currentLang={lang}
        onLanguageChange={setLang}
      />
    );
  }

  const headerContent = (
    <SiteHeader
      theme={theme}
      onToggleTheme={toggleTheme}
      onSelectTheme={setTheme}
      onNavigate={navigateTo}
      currentLang={lang}
      onLanguageChange={setLang}
    />
  );

  const care = CARE_I18N[lang] || CARE_I18N.tr;

  return <>
    <main id="top">
      <HeroSpecialistTransition portraitSrc="/elif-ay-portrait.jpg">
        <HairTransplantHero header={headerContent} currentLang={lang} />
        <SpecialistSection portraitSrc="/elif-ay-portrait.jpg" currentLang={lang} />
        <section className="care-section" id="after-hair-hero">
          <div className="care-intro" id="care">
            <p className="care-overline">{care.overline}</p>
            <h2>{care.title}</h2>
            <p>{care.desc}</p>
          </div>
          <div className="care-process" id="process">
            <article><span>01</span><div><h3>{care.s1Title}</h3><p>{care.s1Desc}</p></div></article>
            <article><span>02</span><div><h3>{care.s2Title}</h3><p>{care.s2Desc}</p></div></article>
            <article><span>03</span><div><h3>{care.s3Title}</h3><p>{care.s3Desc}</p></div></article>
            <div className="care-cta-bar">
              <a
                className="care-whatsapp-btn"
                href={`https://wa.me/905364916040?text=${encodeURIComponent(care.waMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/icons/whatsapp-icon.webp"
                  alt="WhatsApp"
                  width="20"
                  height="20"
                  style={{ display: 'block' }}
                />
                {care.waBtn}
              </a>
              <a className="care-phone-btn" href="tel:+905364916040">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                0 536 491 60 40
              </a>
            </div>
            <p className="illustration-note">{care.note}</p>
          </div>
        </section>
        <TreatmentsSection currentLang={lang} />
      </HeroSpecialistTransition>
      <ElifAyGallerySection currentLang={lang} />
      <KnowledgeBaseSection onNavigate={navigateTo} currentLang={lang} />
    </main>
    <SiteFooter currentLang={lang} onNavigate={navigateTo} />
    <MobileStickyBar currentLang={lang} />
  </>;
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);

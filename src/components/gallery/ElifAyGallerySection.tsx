import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { type Language } from '../../i18n';
import './gallery.css';

gsap.registerPlugin(ScrollTrigger);

export interface GallerySlide {
  id: string;
  image: string;
  tag: string;
  badge: string;
  kicker: string;
  title: string;
  description: string;
  metrics: string[];
}

export const GALLERY_SLIDES_I18N: Record<Language, GallerySlide[]> = {
  tr: [
    {
      id: 'expert-touch',
      image: '/gallery/elif-ay-portrait-yellow.webp',
      tag: '01 · UZMAN DOKUNUŞU',
      badge: 'Bireye Özel Yaklaşım',
      kicker: 'ELİF AY İLE YÜZ YÜZE PLANLAMA',
      title: 'Her Detayda Bireysel İlgi ve Estetik Vizyon',
      description:
        'Saç ekimi yalnızca bir cerrahi işlem değil, yüz simetrisi ve mimiklere uygun bir doku sanatıdır. Elif Ay, donör alan analizinden ekim aşamasına kadar tüm süreci bizzat sizinle planlar.',
      metrics: ['15+ Yıl Klinik Deneyim', 'Gold FUE & DHI Uzmanlığı', 'Birebir Uzman Danışmanlığı'],
    },
    {
      id: 'clinic-environment',
      image: '/gallery/elif-ay-clinic-standing.webp',
      tag: '02 · MODERN KLİNİK',
      badge: 'A+ Sterilizasyon',
      kicker: 'STERİL VE MODERN KLİNİK ORTAMI',
      title: 'Uluslararası Standartlarda Konfor ve Güven',
      description:
        'En güncel medikal cihazlarla donatılmış ferah operasyon odalarımız, hasta mahremiyetini ve konforunu merkezine alır. Gaziantep merkez kliniğimizde huzurlu bir atmosfer sunar.',
      metrics: ['Özel Operasyon Odası', 'A+ Hijyen Protokolü', 'Yüksek Hasta Memnuniyeti'],
    },
    {
      id: 'hairline-planning',
      image: '/gallery/elif-ay-examination.webp',
      tag: '03 · HASSAS PLANLAMA',
      badge: 'Milimetrik Tasarım',
      kicker: 'ÖN ÇİZGİ VE DONÖR ANALİZİ',
      title: 'Doğal Saç Çizgisi ve Greft Açı Analizi',
      description:
        'Alın yapınız, yüz oranlarınız ve saçınızın doğal çıkış yönü incelenerek milimetrik ön çizgi belirlenir. Ekildiği kesinlikle anlaşılmayan, ömür boyu doğal duran sonuçların anahtarı budur.',
      metrics: ['Kişiye Özel Çizim', '3D Açı Hesaplama', 'Donör Korumalı Alım'],
    },
    {
      id: 'follicle-care',
      image: '/gallery/elif-ay-treatment.webp',
      tag: '04 · DOKU & RESTORASYON',
      badge: 'Maksimum Tutunma',
      kicker: 'BİYOLOJİK KÖK DESTEĞİ',
      title: 'Canlı, Kalıcı ve Güçlü Saç Kökleri',
      description:
        'Ekim öncesi ve sonrasında uygulanan biyolojik kök besleme ve özel mezoterapi infüzyonlarıyla yeni greftlerin tutunma oranı maksimize edilir, iyileşme süreci hızlandırılır.',
      metrics: ['%98+ Tutunma Oranı', 'Biyolojik Kök Desteği', 'Hızlı İyileşme Protokolü'],
    },
  ],
  en: [
    {
      id: 'expert-touch',
      image: '/gallery/elif-ay-portrait-yellow.webp',
      tag: '01 · SPECIALIST TOUCH',
      badge: 'Personalized Care',
      kicker: 'FACE-TO-FACE PLANNING WITH ELIF AY',
      title: 'Individual Attention & Aesthetic Vision',
      description:
        'Hair restoration is an artistic blend of facial harmony, donor dynamics, and surgical precision. Specialist Elif Ay plans every single stage directly with you.',
      metrics: ['15+ Years Clinical Experience', 'Gold FUE & DHI Expertise', 'Direct Specialist Consultation'],
    },
    {
      id: 'clinic-environment',
      image: '/gallery/elif-ay-clinic-standing.webp',
      tag: '02 · MODERN CLINIC',
      badge: 'A+ Sterilization',
      kicker: 'STERILE & MODERN CLINICAL SUITE',
      title: 'International Comfort & Hygiene Protocols',
      description:
        'Equipped with the latest medical technology, our treatment suites prioritize patient privacy and safety in central Gaziantep.',
      metrics: ['Private Procedure Suite', 'A+ Hygiene Protocol', 'High Patient Satisfaction'],
    },
    {
      id: 'hairline-planning',
      image: '/gallery/elif-ay-examination.webp',
      tag: '03 · PRECISION DESIGN',
      badge: 'Millimetric Design',
      kicker: 'HAIRLINE & DONOR ARCHITECTURE',
      title: 'Natural Hairline & Angle Analysis',
      description:
        'Analyzing your forehead structure, facial symmetry, and natural growth vectors to design an undetectable, permanent hairline.',
      metrics: ['Custom Hairline Drawing', '3D Angle Calculation', 'Donor-Safe Extraction'],
    },
    {
      id: 'follicle-care',
      image: '/gallery/elif-ay-treatment.webp',
      tag: '04 · TISSUE & RESTORATION',
      badge: 'Maximum Retention',
      kicker: 'BIOLOGICAL ROOT SUPPORT',
      title: 'Vital, Permanent and Resilient Follicles',
      description:
        'Mesotherapy infusions and biological root care before and after placement maximize follicle survival and accelerate healing.',
      metrics: ['98%+ Retention Rate', 'Biological Root Care', 'Rapid Healing Protocol'],
    },
  ],
  ar: [
    {
      id: 'expert-touch',
      image: '/gallery/elif-ay-portrait-yellow.webp',
      tag: '01 · لمسة تخصصية',
      badge: 'عناية فردية مخصصة',
      kicker: 'تخطيط مباشر مع الأخصائية إليف آي',
      title: 'اهتمام شخصي ورؤية جمالية في كل تفصيل',
      description:
        'زراعة الشعر فن دقيق يعتمد على تناسق ملامح الوجه وحيوية البصيلات. تقوم الأخصائية إليف آي بتخطيط كل خطوة مباشرة معكم.',
      metrics: ['15+ عاماً من الخبرة السريرية', 'خبرة غولد FUE وDHI', 'استشارة مباشرة مع الأخصائية'],
    },
    {
      id: 'clinic-environment',
      image: '/gallery/elif-ay-clinic-standing.webp',
      tag: '02 · عيادة حديثة',
      badge: 'تعقيم A+',
      kicker: 'بيئة طبية معقمة ومتطورة',
      title: 'راحة وأمان وفق أعلى المعايير الدولية',
      description:
        'غرف عمليات رحبة ومجهزة بأحدث التقنيات الطبية في مركز غازي عنتاب تراعي خصوصية المرضى وتوفر أقصى درجات الراحة.',
      metrics: ['غرف عمليات خاصة', 'بروتوكول تعقيم متقدم', 'مستويات رضا مرتفعة'],
    },
    {
      id: 'hairline-planning',
      image: '/gallery/elif-ay-examination.webp',
      tag: '03 · تخطيط دقيق',
      badge: 'تصميم ميلمتري',
      kicker: 'تحليل خط الشعر والمنطقة المانحة',
      title: 'رسم خط شعر طبيعي وتحليل زوايا النمو',
      description:
        'دراسة ملامح الجبهة وأبعاد الوجه لتحديد خط شعر طبيعي مجهري يبدو طبيعياً مدى الحياة ولا يمكن تمييزه.',
      metrics: ['رسم مخصص لخط الشعر', 'حساب زوايا ثلاثي الأبعاد', 'حماية المنطقة المانحة'],
    },
    {
      id: 'follicle-care',
      image: '/gallery/elif-ay-treatment.webp',
      tag: '04 · ترميم الأنسجة',
      badge: 'أقصى درجات الثبات',
      kicker: 'دعم بيولوجي للبصيلات',
      title: 'بصيلات حية وقوية ودائمة',
      description:
        'تغذية بيولوجية وحقن ميزوثيرابي مخصصة قبل وبعد الزراعة لمضاعفة نسبة ثبات البصيلات وتسريع الشفاء.',
      metrics: ['نسبة ثبات 98%+', 'دعم بيولوجي للجذور', 'بروتوكول شفاء سريع'],
    },
  ],
  de: [
    {
      id: 'expert-touch',
      image: '/gallery/elif-ay-portrait-yellow.webp',
      tag: '01 · EXPERTIN-BETREUUNG',
      badge: 'Individueller Ansatz',
      kicker: 'PERSÖNLICHE PLANUNG MIT ELIF AY',
      title: 'Persönliche Betreuung und ästhetische Vision',
      description:
        'Haartransplantation ist die Verbindung aus Gesichtssymmetrie und chirurgischer Präzision. Spezialistin Elif Ay plant jeden Schritt direkt mit Ihnen.',
      metrics: ['15+ Jahre Klinikerfahrung', 'Gold FUE & DHI Spezialisierung', 'Persönliche Beratung'],
    },
    {
      id: 'clinic-environment',
      image: '/gallery/elif-ay-clinic-standing.webp',
      tag: '02 · MODERNE KLINIK',
      badge: 'A+ Sterilisation',
      kicker: 'STERILE & MODERNE KLINIKRÄUME',
      title: 'Internationaler Komfort und maximale Sicherheit',
      description:
        'Moderne Behandlungsräume mit neuester Medizintechnik in zentraler Lage in Gaziantep mit höchstem Fokus auf Privatsphäre.',
      metrics: ['Private Behandlungsräume', 'A+ Hygieneprotokoll', 'Hohe Patientenzufriedenheit'],
    },
    {
      id: 'hairline-planning',
      image: '/gallery/elif-ay-examination.webp',
      tag: '03 · PRÄZISE PLANUNG',
      badge: 'Millimetergenau',
      kicker: 'HAARLINIEN- & SPENDERANALYSE',
      title: 'Natürliche Haarlinie und präzise Winkelanalyse',
      description:
        'Analyse von Gesichtsform und natürlicher Wuchsrichtung für eine vollkommen natürliche, dauerhafte Haarlinie.',
      metrics: ['Individuelle Zeichnung', '3D-Winkelberechnung', 'Schonende Entnahme'],
    },
    {
      id: 'follicle-care',
      image: '/gallery/elif-ay-treatment.webp',
      tag: '04 · GEWEBE & REPAIR',
      badge: 'Maximale Anwachsrate',
      kicker: 'BIOLOGISCHE WURZELSTÄRKUNG',
      title: 'Vitale, widerstandsfähige Haarwurzeln',
      description:
        'Biologische Wurzelpflege und Mesotherapie vor und nach der Behandlung maximieren die Anwachsrate und beschleunigen die Regeneration.',
      metrics: ['98%+ Anwachsrate', 'Biologische Nährstoffpflege', 'Schnelle Wundheilung'],
    },
  ],
};

export const GALLERY_SLIDES = GALLERY_SLIDES_I18N.tr;

export interface ElifAyGallerySectionProps {
  className?: string;
  onCtaClick?: () => void;
  ctaHref?: string;
  currentLang?: Language;
}

export function ElifAyGallerySection({
  className = '',
  onCtaClick,
  ctaHref = '#care',
  currentLang = 'tr',
}: ElifAyGallerySectionProps) {
  const slides = GALLERY_SLIDES_I18N[currentLang] || GALLERY_SLIDES_I18N.tr;
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeModal, setActiveModal] = useState<GallerySlide | null>(null);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !viewportRef.current || !trackRef.current) return;
    if (reducedMotion) return;

    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;

    const ctx = gsap.context(() => {
      const getScrollAmount = () => {
        const trackWidth = track.scrollWidth;
        const viewportWidth = viewport.clientWidth;
        return -(trackWidth - viewportWidth + 60);
      };

      const tween = gsap.to(track, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: viewport,
          start: 'top top',
          end: () => `+=${window.innerHeight * 2.8}`,
          scrub: 0.75,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setScrollProgress(self.progress);
            const idx = Math.min(
              GALLERY_SLIDES.length - 1,
              Math.floor(self.progress * GALLERY_SLIDES.length)
            );
            setActiveIndex(idx);
          },
        },
      });

      // Subtle parallax on card images
      cardsRef.current.forEach((card) => {
        if (!card) return;
        const img = card.querySelector<HTMLElement>('.gallery-card-img');
        if (img) {
          gsap.fromTo(
            img,
            { x: -25 },
            {
              x: 25,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                containerAnimation: tween,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            }
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Handle keyboard escape for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveModal(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const headerI18n = {
    tr: {
      aria: 'Elif Ay Klinik ve Uygulama Galerisi',
      kicker: '04 / KLİNİK & DOKU SANATI',
      title: <>Özen, hassasiyet ve<br /><em>modern klinik standartları.</em></>,
      brandSub: 'ELİF AY SAÇ EKİM MERKEZİ',
      brandNote: 'Operasyon odalarımız, ön çizgi planlamamız ve doku uygulamalarımızın gerçek klinik kareleri.',
      zoomHint: 'Büyüt',
      detailBtn: 'Detaylı İncele',
      navLabel: 'Galeri Adımları',
      stagePrefix: 'AŞAMA',
      scrollHint: 'KEŞFETMEK İÇİN KAYDIRIN',
      modalClose: 'Kapat',
      modalAnalysis: 'Ücretsiz Analiz Alın ↗',
      modalWa: 'WhatsApp ile Danışın ↗',
    },
    en: {
      aria: 'Elif Ay Clinic & Restoration Gallery',
      kicker: '04 / CLINIC & ARTISTRY',
      title: <>Care, precision and<br /><em>modern clinical standards.</em></>,
      brandSub: 'ELİF AY HAIR RESTORATION CENTER',
      brandNote: 'Real clinical moments from our procedure suites, hairline design, and tissue care.',
      zoomHint: 'Zoom',
      detailBtn: 'View Details',
      navLabel: 'Gallery Steps',
      stagePrefix: 'STAGE',
      scrollHint: 'SCROLL TO EXPLORE',
      modalClose: 'Close',
      modalAnalysis: 'Get Free Analysis ↗',
      modalWa: 'Contact on WhatsApp ↗',
    },
    ar: {
      aria: 'معرض عيادة إليف آي وإجراءات الزراعة',
      kicker: '04 / فن العناية بالأنسجة والعيادة',
      title: <>عناية فائقة ودقة متناهية<br /><em>بأحدث المعايير الطبية.</em></>,
      brandSub: 'مركز إليف آي لزراعة الشعر',
      brandNote: 'لقطات حقيقية من غرف العمليات وتخطيط خط الشعر والعناية الدقيقة بالبصيلات.',
      zoomHint: 'تكبير',
      detailBtn: 'تفاصيل إضافية',
      navLabel: 'خطوات المعرض',
      stagePrefix: 'المرحلة',
      scrollHint: 'مرر للاستكشاف',
      modalClose: 'إغلاق',
      modalAnalysis: 'احصل على تحليل مجاني ↗',
      modalWa: 'استشر عبر واتساب ↗',
    },
    de: {
      aria: 'Elif Ay Klinik & Behandlungsgalerie',
      kicker: '04 / KLINIK & GEWEBEKUNST',
      title: <>Sorgfalt, Präzision und<br /><em>moderne Klinikstandards.</em></>,
      brandSub: 'ELİF AY HAARTRANSPLANTATIONS-ZENTRUM',
      brandNote: 'Authentische Einblicke in Behandlungsräume, Haarlinienplanung und Gewebebehandlung.',
      zoomHint: 'Vergrößern',
      detailBtn: 'Details ansehen',
      navLabel: 'Galerieschritte',
      stagePrefix: 'PHASE',
      scrollHint: 'SCROLLEN ZUM ENTDECKEN',
      modalClose: 'Schließen',
      modalAnalysis: 'Kostenlose Analyse erhalten ↗',
      modalWa: 'Über WhatsApp beraten ↗',
    },
  }[currentLang] || {
    aria: 'Elif Ay Klinik ve Uygulama Galerisi',
    kicker: '04 / KLİNİK & DOKU SANATI',
    title: <>Özen, hassasiyet ve<br /><em>modern klinik standartları.</em></>,
    brandSub: 'ELİF AY SAÇ EKİM MERKEZİ',
    brandNote: 'Operasyon odalarımız, ön çizgi planlamamız ve doku uygulamalarımızın gerçek klinik kareleri.',
    zoomHint: 'Büyüt',
    detailBtn: 'Detaylı İncele',
    navLabel: 'Galeri Adımları',
    stagePrefix: 'AŞAMA',
    scrollHint: 'KEŞFETMEK İÇİN KAYDIRIN',
    modalClose: 'Kapat',
    modalAnalysis: 'Ücretsiz Analiz Alın ↗',
    modalWa: 'WhatsApp ile Danışın ↗',
  };

  const jumpToSlide = (index: number) => {
    setActiveIndex(index);
    if (!sectionRef.current) return;

    const st = ScrollTrigger.getById('gallery-trigger') || ScrollTrigger.getAll().find((t) => t.trigger === sectionRef.current);
    if (st) {
      const targetScroll = st.start + (st.end - st.start) * (index / (slides.length - 1));
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className={`gallery-section ${reducedMotion ? 'gallery-reduced' : ''} ${className}`}
      aria-label={headerI18n.aria}
    >
      <div ref={viewportRef} className="gallery-viewport">
        {/* Top Header */}
        <header className="gallery-header">
          <div className="gallery-header-left">
            <div className="gallery-kicker">{headerI18n.kicker}</div>
            <h2 className="gallery-title">
              {headerI18n.title}
            </h2>
          </div>
          <div className="gallery-header-right">
            <span className="gallery-brand-sub">{headerI18n.brandSub}</span>
            <span className="gallery-brand-note">
              {headerI18n.brandNote}
            </span>
          </div>
        </header>

        {/* Gallery Stage & Track */}
        <div className="gallery-stage">
          <div ref={trackRef} className="gallery-track">
            {slides.map((slide, i) => (
              <article
                key={slide.id}
                ref={(el) => {
                  cardsRef.current[i] = el;
                }}
                className={`gallery-card ${activeIndex === i ? 'is-active' : ''}`}
              >
                {/* Visual Image Column */}
                <div
                  className="gallery-card-visual"
                  onClick={() => setActiveModal(slide)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${slide.title} ${headerI18n.zoomHint}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveModal(slide);
                    }
                  }}
                >
                  <div className="gallery-card-img-wrap">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="gallery-card-img"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="gallery-card-overlay" />
                  <span className="gallery-card-badge">{slide.badge}</span>
                  <div className="gallery-zoom-hint">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      <line x1="11" y1="8" x2="11" y2="14" />
                      <line x1="8" y1="11" x2="14" y2="11" />
                    </svg>
                    {headerI18n.zoomHint}
                  </div>
                </div>

                {/* Content Column */}
                <div className="gallery-card-content">
                  <div className="gallery-card-top">
                    <span className="gallery-card-num">0{i + 1}</span>
                    <span className="gallery-card-tag">{slide.tag}</span>
                  </div>

                  <div className="gallery-card-body">
                    <h3>{slide.title}</h3>
                    <p>{slide.description}</p>
                    <div className="gallery-card-metrics">
                      {slide.metrics.map((m) => (
                        <span key={m} className="gallery-metric-pill">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="gallery-card-btn"
                    onClick={() => setActiveModal(slide)}
                  >
                    {headerI18n.detailBtn} <span>↗</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Bottom Bar: Jump Controls & Progress */}
        <footer className="gallery-bottom">
          <nav className="gallery-nav-buttons" aria-label={headerI18n.navLabel}>
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                className={`gallery-nav-btn ${activeIndex === idx ? 'active' : ''}`}
                onClick={() => jumpToSlide(idx)}
              >
                <span>0{idx + 1}</span>
                <span>{slide.badge}</span>
              </button>
            ))}
          </nav>

          <div className="gallery-progress-wrap">
            <div className="gallery-progress-bar">
              <div
                className="gallery-progress-fill"
                style={{ width: `${Math.max(15, (scrollProgress || (activeIndex / (slides.length - 1))) * 100)}%` }}
              />
            </div>
            <div className="gallery-progress-text">
              <span>{headerI18n.stagePrefix} 0{activeIndex + 1}</span>
              <span>/ 04</span>
            </div>
          </div>

          <div className="gallery-scroll-hint">
            <span>↓</span>
            <span>{headerI18n.scrollHint}</span>
          </div>
        </footer>
      </div>

      {/* Lightbox Modal */}
      {activeModal && (
        <div
          className="gallery-modal-backdrop"
          onClick={() => setActiveModal(null)}
          role="dialog"
          aria-modal="true"
          aria-label={activeModal.title}
        >
          <div
            className="gallery-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="gallery-modal-close"
              onClick={() => setActiveModal(null)}
              aria-label={headerI18n.modalClose}
            >
              ✕
            </button>

            <div className="gallery-modal-image-col">
              <img
                src={activeModal.image}
                alt={activeModal.title}
                className="gallery-modal-image"
              />
            </div>

            <div className="gallery-modal-info-col">
              <div className="modal-info-top">
                <span className="modal-badge">{activeModal.kicker}</span>
                <h3 className="modal-title">{activeModal.title}</h3>
                <p className="modal-desc">{activeModal.description}</p>
              </div>

              <div className="gallery-card-metrics">
                {activeModal.metrics.map((m) => (
                  <span key={m} className="gallery-metric-pill">
                    {m}
                  </span>
                ))}
              </div>

              <div className="modal-cta-row">
                {onCtaClick ? (
                  <button type="button" className="modal-primary-btn" onClick={onCtaClick}>
                    {headerI18n.modalAnalysis}
                  </button>
                ) : (
                  <a
                    href="https://wa.me/905364916040?text=Merhaba%2C%20saç%20ekimi%20ve%20klinik%20hakkında%20bilgi%20almak%20istiyorum."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="modal-primary-btn"
                  >
                    {headerI18n.modalWa}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ElifAyGallerySection;

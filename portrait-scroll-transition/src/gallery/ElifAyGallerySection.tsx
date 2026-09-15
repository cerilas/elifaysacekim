import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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

const GALLERY_SLIDES: GallerySlide[] = [
  {
    id: 'expert-touch',
    image: '/gallery/elif-ay-portrait-yellow.webp',
    tag: '01 · UZMAN DOKUNUŞU',
    badge: 'Bireye Özel Yaklaşım',
    kicker: 'ELİF AY İLE YÜZ YÜZE PLANLAMA',
    title: 'Her Detayda Bireysel İlgi ve Estetik Vizyon',
    description:
      'Saç ekimi yalnızca bir cerrahi işlem değil, yüz simetrisi ve mimiklere uygun bir doku sanatıdır. Elif Ay, donör alan analizinden ekim aşamasına kadar tüm süreci bizzat sizinle planlar.',
    metrics: ['12+ Yıl Klinik Deneyim', 'Gold FUE Uzmanlığı', 'Birebir Danışmanlık'],
  },
  {
    id: 'clinic-environment',
    image: '/gallery/elif-ay-clinic-standing.webp',
    tag: '02 · MODERN KLİNİK',
    badge: 'A+ Sterilizasyon',
    kicker: 'STERİL VE VIP KLİNİK ORTAMI',
    title: 'Uluslararası Standartlarda Konfor ve Güven',
    description:
      'En güncel medikal cihazlarla donatılmış ferah operasyon odalarımız, hasta mahremiyetini ve konforunu merkezine alır. Gaziantep ve İstanbul kliniklerinde huzurlu bir atmosfer sunar.',
    metrics: ['VIP Operasyon Odası', 'A+ Hijyen Protokolü', 'Yüksek Hasta Memnuniyeti'],
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
];

export interface ElifAyGallerySectionProps {
  className?: string;
  onCtaClick?: () => void;
  ctaHref?: string;
}

export function ElifAyGallerySection({
  className = '',
  onCtaClick,
  ctaHref = '#care',
}: ElifAyGallerySectionProps) {
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

  const jumpToSlide = (index: number) => {
    setActiveIndex(index);
    if (!sectionRef.current) return;

    const st = ScrollTrigger.getById('gallery-trigger') || ScrollTrigger.getAll().find((t) => t.trigger === sectionRef.current);
    if (st) {
      const targetScroll = st.start + (st.end - st.start) * (index / (GALLERY_SLIDES.length - 1));
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className={`gallery-section ${reducedMotion ? 'gallery-reduced' : ''} ${className}`}
      aria-label="Elif Ay Klinik ve Uygulama Galerisi"
    >
      <div ref={viewportRef} className="gallery-viewport">
        {/* Top Header */}
        <header className="gallery-header">
          <div className="gallery-header-left">
            <div className="gallery-kicker">04 / KLİNİK & DOKU SANATI</div>
            <h2 className="gallery-title">
              Özen, hassasiyet ve<br />
              <em>modern klinik standartları.</em>
            </h2>
          </div>
          <div className="gallery-header-right">
            <span className="gallery-brand-sub">ELİF AY SAÇ EKİM MERKEZİ</span>
            <span className="gallery-brand-note">
              Operasyon odalarımız, ön çizgi planlamamız ve doku uygulamalarımızın gerçek klinik kareleri.
            </span>
          </div>
        </header>

        {/* Gallery Stage & Track */}
        <div className="gallery-stage">
          <div ref={trackRef} className="gallery-track">
            {GALLERY_SLIDES.map((slide, i) => (
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
                  aria-label={`${slide.title} görselini büyüt`}
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
                    Büyüt
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
                    Detaylı İncele <span>↗</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Bottom Bar: Jump Controls & Progress */}
        <footer className="gallery-bottom">
          <nav className="gallery-nav-buttons" aria-label="Galeri Adımları">
            {GALLERY_SLIDES.map((slide, idx) => (
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
                style={{ width: `${Math.max(15, (scrollProgress || (activeIndex / (GALLERY_SLIDES.length - 1))) * 100)}%` }}
              />
            </div>
            <div className="gallery-progress-text">
              <span>AŞAMA 0{activeIndex + 1}</span>
              <span>/ 04</span>
            </div>
          </div>

          <div className="gallery-scroll-hint">
            <span>↓</span>
            <span>KEŞFETMEK İÇİN KAYDIRIN</span>
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
              aria-label="Kapat"
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
                    Ücretsiz Analiz Alın ↗
                  </button>
                ) : (
                  <a
                    href="https://wa.me/905364916040?text=Merhaba%2C%20saç%20ekimi%20ve%20klinik%20hakkında%20bilgi%20almak%20istiyorum."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="modal-primary-btn"
                  >
                    WhatsApp ile Danışın ↗
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

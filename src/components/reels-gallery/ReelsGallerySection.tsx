import { useState, useEffect } from 'react';
import { ReelsCarousel } from './ReelsCarousel';
import type { ReelData } from './ReelCard';
import reelsRawData from '../../data/reels.json';
import type { Language } from '../../i18n';
import './reels.css';

const reelsData = (reelsRawData as ReelData[]).sort((a, b) => a.order - b.order);

const REELS_I18N: Record<
  Language,
  {
    badge: string;
    title: React.ReactNode;
    subtitle: string;
    viewInstagramBtn: string;
  }
> = {
  tr: {
    badge: '@elifay.hairdentcoordination',
    title: <>Öne Çıkan Sonuçlar & <em>Reels</em></>,
    subtitle: 'Elif Ay Hair & Dent Coordination uzmanlığında gerçek hasta operasyon süreçleri, canlı klinik uygulamaları ve sonuçlar.',
    viewInstagramBtn: "Tüm Videoları Instagram'da Gör ↗︎",
  },
  en: {
    badge: '@elifay.hairdentcoordination',
    title: <>Featured Results & <em>Reels</em></>,
    subtitle: 'Real patient restoration procedures, live clinical treatments, and natural results by Elif Ay Hair & Dent Coordination.',
    viewInstagramBtn: 'View All Reels on Instagram ↗︎',
  },
  ar: {
    badge: '@elifay.hairdentcoordination',
    title: <>النتائج المميزة و<em>فيديوهات ريلز</em></>,
    subtitle: 'عمليات ونتائج مرضانا الحقيقيين وجلسات العلاج السريري المباشرة تحت إشراف إليف آي.',
    viewInstagramBtn: 'شاهد جميع الفيديوهات على إنستغرام ↗︎',
  },
  de: {
    badge: '@elifay.hairdentcoordination',
    title: <>Ausgewählte Ergebnisse & <em>Reels</em></>,
    subtitle: 'Echte Patientenbehandlungen, klinische Abläufe und überzeugende Ergebnisse unter der Leitung von Elif Ay.',
    viewInstagramBtn: 'Alle Videos auf Instagram ansehen ↗︎',
  },
};

interface ReelsGallerySectionProps {
  currentLang?: Language;
}

export function ReelsGallerySection({ currentLang = 'tr' }: ReelsGallerySectionProps) {
  const content = REELS_I18N[currentLang] || REELS_I18N.tr;
  const [reels, setReels] = useState<ReelData[]>(() => reelsData);

  useEffect(() => {
    fetch("/api/reels?clinic=elifay")
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => {
        if (data.success && data.reels && data.reels.length > 0) {
          const mapped: ReelData[] = data.reels.map((r: any) => ({
            id: r.id,
            videoUrl: r.videoUrl,
            thumbnailUrl: r.thumbnailUrl,
            profileName: r.profileName || "elifay.hairdentcoordination",
            profilePic: r.profilePic || "/elif-ay-portrait.jpg",
            instagramUrl: "https://www.instagram.com/elifay.hairdentcoordination/",
            descriptions: {
              tr: r.description || "",
              en: r.description || "",
              ar: r.description || "",
              de: r.description || "",
            },
            altText: r.altText,
            likes: r.likes,
            comments: r.comments,
            order: r.order,
          }));
          setReels(mapped.sort((a, b) => a.order - b.order));
        }
      })
      .catch(() => {});
  }, []);

  if (!reels || reels.length === 0) {
    return null;
  }

  return (
    <section className="reels-section" id="reels-gallery">
      <div className="reels-container">
        <div className="reels-header">
          <a
            href="https://www.instagram.com/elifay.hairdentcoordination/"
            target="_blank"
            rel="noopener noreferrer"
            className="reels-badge"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            <span>{content.badge}</span>
          </a>

          <h2 className="reels-title">{content.title}</h2>
          <p className="reels-subtitle">{content.subtitle}</p>
        </div>
      </div>

      {/* Reels Carousel */}
      <ReelsCarousel reels={reels} currentLang={currentLang} />

      {/* Bottom CTA to Instagram */}
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <a
          href="https://www.instagram.com/elifay.hairdentcoordination/"
          target="_blank"
          rel="noopener noreferrer"
          className="reels-badge"
          style={{
            fontSize: '13px',
            padding: '10px 24px',
            background: 'rgba(194, 165, 130, 0.16)',
            borderColor: 'var(--accent-gold-bright)',
            color: 'var(--text-primary)',
          }}
        >
          {content.viewInstagramBtn}
        </a>
      </div>
    </section>
  );
}

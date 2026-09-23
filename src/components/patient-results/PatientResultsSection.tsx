import { useRef } from 'react';
import CircularGallery from './CircularGallery';
import './patient-results.css';

interface PatientResultsSectionProps {
  currentLang: string;
}

type Gender = 'male' | 'female';

const RESULTS_I18N: Record<string, any> = {
  tr: {
    title: 'Gerçek Sonuçlar',
    subtitle: 'Hastalarımızın değişim hikayeleri',
  },
  en: {
    title: 'Real Results',
    subtitle: 'Transformation stories of our patients',
  },
  de: {
    title: 'Echte Ergebnisse',
    subtitle: 'Transformationsgeschichten unserer Patienten',
  },
  ar: {
    title: 'نتائج حقيقية',
    subtitle: 'قصص تحول مرضانا',
  },
};

const extraResults = [
  {
    image: '/results/kas-ekimi-oncesi-sonrasi-gaziantep-1.jpg',
    text: '',
    alt: 'Gaziantep kaş ekimi öncesi sonrası doğal görünüm sonucu 1'
  },
  {
    image: '/results/kas-ekimi-oncesi-sonrasi-gaziantep-2.jpg',
    text: '',
    alt: 'Gaziantep kaş ekimi öncesi sonrası doğal görünüm sonucu 2'
  }
];

// 8 females, 4 males. Ratio 2:1. Pattern: F, F, M
const resultsData = [
  ...Array.from({ length: 4 }).flatMap((_, i) => [
    {
      image: `/results/female-${i * 2 + 1}.jpg`,
      text: '',
      alt: 'Gaziantep kadın saç ekimi öncesi ve sonrası sonuçları'
    },
    {
      image: `/results/female-${i * 2 + 2}.jpg`,
      text: '',
      alt: 'Gaziantep kadın saç ekimi öncesi ve sonrası sonuçları'
    },
    {
      image: `/results/male-${i + 1}.jpg`,
      text: '',
      alt: 'Gaziantep erkek saç ekimi öncesi ve sonrası sonuçları'
    }
  ]),
  ...extraResults
];

export function PatientResultsSection({ currentLang }: PatientResultsSectionProps) {
  const t = RESULTS_I18N[currentLang] || RESULTS_I18N.tr;
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section className="patient-results-section" ref={sectionRef}>
      <div className="results-header">
        <h2 className="results-title">{t.title}</h2>
        <p className="results-subtitle">{t.subtitle}</p>
      </div>

      <div className="gallery-wrapper">
        <CircularGallery
          items={resultsData}
          bend={2}
          textColor="#ffffff"
          borderRadius={0.05}
          scrollEase={0.02}
          fontUrl="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap"
          font="bold 30px Orbitron"
          scrollSpeed={2}
        />
        
        {/* Hidden images for SEO indexing since WebGL Canvas is opaque to bots */}
        <div style={{ display: 'none' }} aria-hidden="true">
          {resultsData.map((item, i) => (
            <img key={i} src={item.image} alt={item.alt} />
          ))}
        </div>
      </div>
    </section>
  );
}

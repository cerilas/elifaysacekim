import React, { useRef } from 'react';
import './clinic-sections.css';
import { FollicleSection } from '../follicle-animation';
import { type Language } from '../../i18n';

export { HeroSpecialistTransition } from './HeroSpecialistTransition';

export interface SpecialistSectionProps {
  name?: string;
  portraitSrc?: string;
  currentLang?: Language;
}

const SPECIALIST_I18N: Record<Language, {
  kickerNum: string;
  kickerLabel: string;
  portraitCaption: string;
  eyebrow: string;
  title: React.ReactNode;
  bio: string;
  p1Title: string;
  p1Desc: string;
  p2Title: string;
  p2Desc: string;
  linkText: string;
  imageAlt: string;
}> = {
  tr: {
    kickerNum: '02 / SAÇ EKİM UZMANI',
    kickerLabel: 'GAZİANTEP EN İYİ SAÇ EKİM MERKEZİ & KİŞİYE ÖZEL GOLD FUE',
    portraitCaption: 'ÖNCE SİZİ DİNLİYORUZ.',
    eyebrow: 'GAZİANTEP EN İYİ SAÇ EKİM MERKEZİ & GÜNEYDOĞU BÖLGE UZMANLIĞI',
    title: <>Her detayda<br /><em>insan odağı.</em></>,
    bio: 'Gaziantep en iyi saç ekim merkezi standartlarında; Saç Ekim Uzmanı Elif Ay güvencesiyle Safir FUE, DHI saç ekimi, sakal ve kadınlara özel kaş ekimi alanında 15 yılı aşkın klinik tecrübemizle yanınızdayız. Şanlıurfa, Diyarbakır, Kahramanmaraş, Adıyaman, Mardin, Batman ve Kilis başta olmak üzere tüm çevre illerden gelen danışanlarımıza merkezi konumumuzla kolay ulaşım ve kişiye özel doğal saç çizgisi tasarımı sunuyoruz.',
    p1Title: 'Önce Dinlemek & Greft Analizi.',
    p1Desc: 'Beklentilerinizi, donör kapasitenizi ve 3000-5000 greft ihtiyacınızı bilimsel olarak değerlendiriyoruz.',
    p2Title: 'Doğal Ön Çizgi & Ağrısız Uygulama.',
    p2Desc: 'İğnesiz lokal anestezi ve Safir / DHI teknikleriyle ömür boyu kalıcı, doğal açılı saç ekimi planlıyoruz.',
    linkText: 'Gaziantep Saç, Sakal ve Kaş Ekimi Uygulamalarımız ↗︎',
    imageAlt: 'Saç Ekim Uzmanı Elif Ay - Gaziantep Saç Ekim Merkezi',
  },
  en: {
    kickerNum: '02 / HAIR TRANSPLANT SPECIALIST',
    kickerLabel: 'GAZİANTEP CLINICAL EXCELLENCE & PERSONALIZED GOLD FUE',
    portraitCaption: 'WE LISTEN TO YOU FIRST.',
    eyebrow: 'GAZİANTEP TOP CLINIC & REGIONAL RESTORATION EXPERTISE',
    title: <>Human-centered care<br /><em>in every detail.</em></>,
    bio: 'With over 15 years of dedicated clinical experience, Hair Transplant Specialist Elif Ay delivers international gold standards in Sapphire FUE, DHI hair restoration, beard design, and eyebrow transplantation. Our central Gaziantep clinic provides smooth access for domestic and international patients, ensuring completely natural, age-appropriate hairline planning.',
    p1Title: 'Active Listening & Graft Analysis.',
    p1Desc: 'We scientifically assess your aesthetic aspirations, donor density, and custom 3,000–5,000 graft requirement.',
    p2Title: 'Natural Hairline & Painless Care.',
    p2Desc: 'With needle-free comfort anesthesia and precision Sapphire / DHI tools, we deliver lifelong, natural-density hair restoration.',
    linkText: 'Explore Our Hair, Beard and Eyebrow Procedures ↗︎',
    imageAlt: 'Hair Transplant Specialist Elif Ay - Gaziantep Clinic',
  },
  ar: {
    kickerNum: '02 / أخصائية زراعة الشعر',
    kickerLabel: 'المركز الرائد في غازي عنتاب وتخطيط غولد FUE المخصص',
    portraitCaption: 'نستمع إليك أولاً.',
    eyebrow: 'التميز الطبي في غازي عنتاب والخبرة الإقليمية الموثوقة',
    title: <>عناية ترتكز على الإنسان<br /><em>في كل تفصيل.</em></>,
    bio: 'بأكثر من 15 عاماً من الخبرة الطبية المتخصصة، تقدم أخصائية زراعة الشعر إليف آي أعلى معايير الجودة في تقنيات السفير FUE وزراعة DHI واللحية والحواجب للنساء. توفر عيادتنا المركزية في غازي عنتاب سهولة الوصول لمرضانا من مختلف المدن والدول، مع ضمان رسم خط شعر طبيعي متناسق تماماً مع ملامح الوجه.',
    p1Title: 'الاستماع أولاً وتحليل البصيلات.',
    p1Desc: 'نقيم أهدافكم الجمالية، وطاقة المنطقة المانحة، واحتياجكم الدقيق من 3000 إلى 5000 بصيلة وفق أسس علمية.',
    p2Title: 'خط شعر طبيعي وإجراء بدون ألم.',
    p2Desc: 'نضمن لكم زراعة شعر دائمة مدى الحياة بزوايا نمو طبيعية 38 درجة وتخدير مريح بدون إبر.',
    linkText: 'استكشف إجراءات زراعة الشعر واللحية والحواجب ↗︎',
    imageAlt: 'أخصائية زراعة الشعر إليف آي - مركز غازي عنتاب',
  },
  de: {
    kickerNum: '02 / HAARTRANSPLANTATIONS-SPEZIALISTIN',
    kickerLabel: 'KLINISCHE EXZELLENZ IN GAZIANTEP & GOLD FUE',
    portraitCaption: 'WIR HÖREN IHNEN ZU.',
    eyebrow: 'FÜHRENDE KLINIK IN GAZIANTEP & REGIONALE EXPERTISE',
    title: <>Der Mensch im Fokus<br /><em>in jedem Detail.</em></>,
    bio: 'Mit mehr als 15 Jahren klinischer Erfahrung steht Haartransplantations-Spezialistin Elif Ay für erstklassige Ergebnisse mit Saphir FUE, DHI Haartransplantation, Bart- und Augenbrauentransplantation für Frauen. Unsere zentral gelegene Klinik in Gaziantep bietet bequeme Anreise und individuelle, natürliche Haarlinien-Konzepte.',
    p1Title: 'Zuhören & Präzise Graft-Analyse.',
    p1Desc: 'Wir analysieren Ihre Erwartungen, die Spenderhaardichte und Ihren Bedarf von 3.000–5.000 Grafts wissenschaftlich exakt.',
    p2Title: 'Natürlicher Haaransatz & Schmerzfreie Methode.',
    p2Desc: 'Mit nadelfreier Lokalanästhesie und modernen Saphir / DHI Methoden planen wir ein dauerhaftes, natürliches Ergebnis.',
    linkText: 'Unsere Behandlungen für Haar, Bart und Augenbrauen ↗︎',
    imageAlt: 'Haartransplantations-Spezialistin Elif Ay - Klinik Gaziantep',
  },
};

export function SpecialistSection({
  name = 'Elif Ay',
  portraitSrc,
  currentLang = 'tr',
}: SpecialistSectionProps) {
  const root = useRef<HTMLElement>(null);
  const i18n = SPECIALIST_I18N[currentLang] || SPECIALIST_I18N.tr;

  return (
    <section className="specialist-section" ref={root} id="specialist" aria-labelledby="specialist-title">
      <div className="section-kicker">
        <span>{i18n.kickerNum}</span>
        <span>{i18n.kickerLabel}</span>
      </div>
      <div className="specialist-layout">
        <div className="specialist-visual">
          <div className="specialist-orbit" aria-hidden="true" />
          <div className="specialist-portrait">
            {portraitSrc ? (
              <img
                className="specialist-image"
                src={portraitSrc}
                alt={i18n.imageAlt}
                loading="lazy"
                decoding="async"
                width="900"
                height="1100"
                style={{ objectPosition: '50% 35%' }}
              />
            ) : (
              <div className="specialist-image specialist-empty" role="img" aria-label="Elif Ay portre alanı">
                <svg viewBox="0 0 500 650" aria-hidden="true">
                  <defs>
                    <linearGradient id="portrait-light" x1="0" y1="0" x2="1" y2="1">
                      <stop stopColor="#dccbb3" />
                      <stop offset="1" stopColor="#80715d" />
                    </linearGradient>
                  </defs>
                  <ellipse cx="260" cy="290" rx="134" ry="190" fill="none" stroke="#d4c3a6" strokeOpacity=".25" />
                  <path d="M83 650C90 479 164 440 207 421L216 371C178 340 169 293 177 246C187 165 232 132 281 156C324 177 340 235 324 292C315 328 299 354 276 372L288 419C354 449 409 498 425 650" fill="url(#portrait-light)" opacity=".5" />
                  <path d="M204 270C213 255 238 237 248 211M278 365C310 328 326 283 318 230" fill="none" stroke="#eadcc4" strokeWidth="1" opacity=".4" />
                </svg>
                <span className="portrait-pending">ELİF AY · PORTRE ALANI</span>
              </div>
            )}
            <span className="portrait-caption">{i18n.portraitCaption}</span>
          </div>
          <span className="specialist-signature" aria-hidden="true">Elif Ay</span>
        </div>
        <div className="specialist-copy">
          <p className="clinic-eyebrow">{i18n.eyebrow}</p>
          <h2 id="specialist-title">{i18n.title}</h2>
          <h3>{name}</h3>
          <p>{i18n.bio}</p>
          <div className="specialist-principle">
            <span>01</span>
            <div>
              <strong>{i18n.p1Title}</strong>
              <p>{i18n.p1Desc}</p>
            </div>
          </div>
          <div className="specialist-principle">
            <span>02</span>
            <div>
              <strong>{i18n.p2Title}</strong>
              <p>{i18n.p2Desc}</p>
            </div>
          </div>
          <a className="specialist-link" href="#treatments">
            {i18n.linkText} <span aria-hidden="true">↗︎</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export interface TreatmentsSectionProps {
  currentLang?: Language;
}

export function TreatmentsSection({ currentLang = 'tr' }: TreatmentsSectionProps = {}) {
  return <FollicleSection currentLang={currentLang} />;
}

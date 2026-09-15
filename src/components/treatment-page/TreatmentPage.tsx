import React, { useState, useEffect } from 'react';
import type { Treatment } from '../../data/treatmentData';
import { MobileStickyBar } from '../layout/MobileStickyBar';
import { SiteFunctionBar } from '../layout/SiteFunctionBar';
import { SiteFooter } from '../layout/SiteFooter';
import { type Language, type Theme, TRANSLATIONS } from '../../i18n';
import './treatment-page.css';

interface TreatmentPageProps {
  treatment: Treatment;
  onNavigate: (to: string) => void;
  theme: Theme;
  onToggleTheme: () => void;
  onSelectTheme?: (theme: Theme) => void;
  currentLang?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export function TreatmentPage({
  treatment,
  onNavigate,
  theme,
  onToggleTheme,
  onSelectTheme,
  currentLang = 'tr',
  onLanguageChange,
}: TreatmentPageProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.tr;

  const displayTitle = (currentLang === 'en' && treatment.titleEn)
    ? treatment.titleEn
    : (currentLang === 'ar' && treatment.titleAr)
    ? treatment.titleAr
    : (currentLang === 'de' && treatment.titleDe)
    ? treatment.titleDe
    : treatment.title;

  const displayBadge = (currentLang === 'en' && treatment.badgeEn)
    ? treatment.badgeEn
    : (currentLang === 'ar' && treatment.badgeAr)
    ? treatment.badgeAr
    : (currentLang === 'de' && treatment.badgeDe)
    ? treatment.badgeDe
    : treatment.badge;

  const displaySummary = (currentLang === 'en' && treatment.summaryEn)
    ? treatment.summaryEn
    : (currentLang === 'ar' && treatment.summaryAr)
    ? treatment.summaryAr
    : (currentLang === 'de' && treatment.summaryDe)
    ? treatment.summaryDe
    : treatment.summary;

  const displayMetaTitle = (currentLang === 'en' && treatment.metaTitleEn)
    ? treatment.metaTitleEn
    : (currentLang === 'ar' && treatment.metaTitleAr)
    ? treatment.metaTitleAr
    : (currentLang === 'de' && treatment.metaTitleDe)
    ? treatment.metaTitleDe
    : (treatment.metaTitle || `${displayTitle} | Elif Ay Saç Ekim Merkezi`);

  const displayMetaDescription = (currentLang === 'en' && treatment.metaDescriptionEn)
    ? treatment.metaDescriptionEn
    : (currentLang === 'ar' && treatment.metaDescriptionAr)
    ? treatment.metaDescriptionAr
    : (currentLang === 'de' && treatment.metaDescriptionDe)
    ? treatment.metaDescriptionDe
    : treatment.metaDescription;

  const displayHighlights = (currentLang === 'en' && treatment.highlightsEn && treatment.highlightsEn.length > 0)
    ? treatment.highlightsEn
    : (currentLang === 'ar' && treatment.highlightsAr && treatment.highlightsAr.length > 0)
    ? treatment.highlightsAr
    : (currentLang === 'de' && treatment.highlightsDe && treatment.highlightsDe.length > 0)
    ? treatment.highlightsDe
    : treatment.highlights;

  const displayCandidates = (currentLang === 'en' && treatment.candidatesEn && treatment.candidatesEn.length > 0)
    ? treatment.candidatesEn
    : (currentLang === 'ar' && treatment.candidatesAr && treatment.candidatesAr.length > 0)
    ? treatment.candidatesAr
    : (currentLang === 'de' && treatment.candidatesDe && treatment.candidatesDe.length > 0)
    ? treatment.candidatesDe
    : treatment.candidates;

  const displaySteps = (currentLang === 'en' && treatment.stepsEn && treatment.stepsEn.length > 0)
    ? treatment.stepsEn
    : (currentLang === 'ar' && treatment.stepsAr && treatment.stepsAr.length > 0)
    ? treatment.stepsAr
    : (currentLang === 'de' && treatment.stepsDe && treatment.stepsDe.length > 0)
    ? treatment.stepsDe
    : treatment.steps;

  const displayFaq = (currentLang === 'en' && treatment.faqEn && treatment.faqEn.length > 0)
    ? treatment.faqEn
    : (currentLang === 'ar' && treatment.faqAr && treatment.faqAr.length > 0)
    ? treatment.faqAr
    : (currentLang === 'de' && treatment.faqDe && treatment.faqDe.length > 0)
    ? treatment.faqDe
    : treatment.faq;

  const displayContent = (currentLang === 'en' && treatment.contentHtmlEn)
    ? treatment.contentHtmlEn
    : (currentLang === 'ar' && treatment.contentHtmlAr)
    ? treatment.contentHtmlAr
    : (currentLang === 'de' && treatment.contentHtmlDe)
    ? treatment.contentHtmlDe
    : treatment.contentHtml;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.title = displayMetaTitle;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && displayMetaDescription) {
      metaDesc.setAttribute('content', displayMetaDescription);
    }
  }, [treatment, displayMetaTitle, displayMetaDescription]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    e.preventDefault();
    onNavigate(to);
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const whatsappMsg = currentLang === 'en'
    ? `Hello, I would like to get a free preliminary consultation and graft analysis regarding ${displayTitle}.`
    : currentLang === 'ar'
    ? `مرحباً، أود الحصول على تقييم أولي مجاني وتحليل للبصيلات بخصوص ${displayTitle}.`
    : currentLang === 'de'
    ? `Hallo, ich möchte eine kostenlose Voruntersuchung und Graft-Analyse für ${displayTitle} anfordern.`
    : `Merhaba, ${treatment.title} hakkında ücretsiz ön değerlendirme ve greft analizi almak istiyorum.`;

  const whatsappUrl = `https://wa.me/905364916040?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="treatment-page-root" data-theme={theme}>
      {/* Ultra-thin Top Function Bar */}
      <SiteFunctionBar
        currentLang={currentLang}
        onLanguageChange={onLanguageChange}
        theme={theme}
        onToggleTheme={onToggleTheme}
        onSelectTheme={onSelectTheme}
      />

      {/* Subpage Header */}
      <header className="treatment-page-header">
        <div className="treatment-header-left">
          <a
            href="/"
            className="treatment-brand-link"
            onClick={(e) => handleLinkClick(e, '/')}
            aria-label={t.breadcrumbHome}
          >
            <span className="brand-symbol" aria-hidden="true">
              <i></i><i></i><i></i>
            </span>
            ELİF AY
          </a>
          <span className="treatment-brand-badge">GAZİANTEP SAÇ EKİMİ</span>
        </div>

        <div className="header-actions">
          <a
            className="header-icon-btn header-phone-btn"
            href="tel:+905364916040"
            aria-label="0 536 491 60 40"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            <span className="header-contact-text">0 536 491 60 40</span>
          </a>

          <a
            className="header-icon-btn header-whatsapp-btn"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.ctaWhatsApp}
          >
            <img
              src="/icons/whatsapp-icon.webp"
              alt="WhatsApp"
              className="header-whatsapp-icon"
              width="20"
              height="20"
            />
            <span className="header-contact-text">WhatsApp</span>
          </a>

          <a
            className="header-cta"
            href="/#care"
            onClick={(e) => handleLinkClick(e, '/#care')}
          >
            {t.ctaAnalysis}
          </a>
        </div>
      </header>

      {/* Breadcrumb Navigation */}
      <nav className="treatment-breadcrumb-container" aria-label="Ekmek Kırıntısı">
        <ol className="treatment-breadcrumbs">
          <li>
            <a href="/" onClick={(e) => handleLinkClick(e, '/')}>{t.breadcrumbHome}</a> /
          </li>
          <li>
            <a href="/#treatments" onClick={(e) => handleLinkClick(e, '/#treatments')}>{t.breadcrumbTreatments}</a> /
          </li>
          <li className="treatment-breadcrumb-current">{displayTitle.split('—')[0].trim()}</li>
        </ol>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="treatment-hero">
          <div>
            <span className="treatment-badge">{displayBadge}</span>
            <h1 className="treatment-title">{displayTitle}</h1>
            <p className="treatment-lead">{displaySummary}</p>
            <div className="treatment-hero-actions">
              <a
                className="treatment-cta-wa"
                href={whatsappUrl}
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
                {t.ctaSendPhoto}
              </a>
              <a className="treatment-cta-phone" href="tel:+905364916040">
                0 536 491 60 40
              </a>
            </div>
          </div>

          <div className="treatment-hero-card">
            <h3>{t.highlightsTitle}</h3>
            <ul className="treatment-highlights-list">
              {displayHighlights.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Step-by-Step Procedure */}
        <section className="treatment-steps-section">
          <p className="treatment-section-kicker">{t.stepsKicker}</p>
          <h2 className="treatment-section-title">{t.stepsTitle}</h2>
          <div className="treatment-steps-grid">
            {displaySteps.map((step) => (
              <div key={step.number} className="treatment-step-card">
                <span className="treatment-step-num">{step.number}</span>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Suitable Candidates Section */}
        <section className="treatment-candidates-section">
          <div className="treatment-candidates-box">
            <h3>{t.candidatesTitle}</h3>
            <div className="treatment-candidates-grid">
              {displayCandidates.map((c, i) => (
                <div key={i} className="treatment-candidate-item">
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed Medical Body Content */}
        <section className="treatment-content-body">
          <div dangerouslySetInnerHTML={{ __html: displayContent }} />
        </section>

        {/* FAQ Accordion */}
        {displayFaq && displayFaq.length > 0 && (
          <section className="treatment-faq-section">
            <p className="treatment-section-kicker">{t.faqKicker}</p>
            <h2 className="treatment-section-title">{t.faqTitle}</h2>
            <div className="treatment-faq-list">
              {displayFaq.map((item, idx) => (
                <div
                  key={idx}
                  className={`treatment-faq-item ${openFaqIndex === idx ? 'open' : ''}`}
                >
                  <button
                    type="button"
                    className="treatment-faq-q"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={openFaqIndex === idx}
                  >
                    <span>{item.question}</span>
                    <span className="treatment-faq-icon">+</span>
                  </button>
                  {openFaqIndex === idx && (
                    <div className="treatment-faq-a">
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom Fast Evaluation Banner */}
        <section className="treatment-bottom-cta">
          <div className="treatment-bottom-card">
            <div className="treatment-bottom-info">
              <h3>{t.bottomCtaTitle}</h3>
              <p>{t.bottomCtaDesc}</p>
            </div>
            <a
              className="treatment-cta-wa"
              href={whatsappUrl}
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
              {t.bottomCtaBtn}
            </a>
          </div>
        </section>
      </main>
      <SiteFooter
        currentLang={currentLang}
        onNavigate={onNavigate}
        isSubpage={true}
      />

      {/* Mobile Sticky Bar */}
      <MobileStickyBar whatsappMessage={whatsappMsg} currentLang={currentLang} />
    </div>
  );
}

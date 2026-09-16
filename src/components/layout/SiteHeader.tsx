import React from 'react';
import { SiteFunctionBar } from './SiteFunctionBar';
import { type Language, type Theme, TRANSLATIONS } from '../../i18n';

export interface SiteHeaderProps {
  isSubpage?: boolean;
  onNavigate?: (to: string) => void;
  whatsappMessage?: string;
  theme?: Theme;
  onToggleTheme?: () => void;
  onSelectTheme?: (theme: Theme) => void;
  currentLang?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export function SiteHeader({
  isSubpage = false,
  onNavigate,
  whatsappMessage,
  theme = 'dark',
  onToggleTheme,
  onSelectTheme,
  currentLang = 'tr',
  onLanguageChange,
}: SiteHeaderProps) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.tr;
  const defaultWaMsg = currentLang === 'en'
    ? 'Hello, I would like to get information about Elif Ay hair transplant and free analysis.'
    : currentLang === 'ar'
    ? 'مرحباً، أود الحصول على معلومات حول زراعة الشعر والتحليل المجاني لدى إليف آي.'
    : currentLang === 'de'
    ? 'Hallo, ich möchte mich über die Haartransplantation bei Elif Ay und die kostenlose Analyse informieren.'
    : 'Merhaba, Elif Ay saç ekimi ve ücretsiz analiz hakkında bilgi almak istiyorum.';

  const messageToUse = whatsappMessage || defaultWaMsg;
  const whatsappUrl = `https://wa.me/905364916040?text=${encodeURIComponent(messageToUse)}`;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(target);
    }
  };

  const brandSubtitle = currentLang === 'en'
    ? 'HAIR TRANSPLANT CENTER'
    : currentLang === 'ar'
    ? 'مركز زراعة الشعر'
    : currentLang === 'de'
    ? 'HAARTRANSPLANTATIONSZENTRUM'
    : 'SAÇ EKİM MERKEZİ';

  return (
    <div className={`site-header-wrapper ${isSubpage ? 'site-header-wrapper--subpage' : ''}`}>
      <SiteFunctionBar
        currentLang={currentLang}
        onLanguageChange={onLanguageChange}
        theme={theme}
        onToggleTheme={onToggleTheme}
        onSelectTheme={onSelectTheme}
      />
      <header className={`site-header ${isSubpage ? 'site-header--subpage' : ''}`}>
      <a
        className="wordmark"
        href={isSubpage ? '/' : '#top'}
        onClick={(e) => handleLinkClick(e, '/')}
        aria-label="Elif Ay home"
      >
        <span className="brand-symbol" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        ELİF AY
        <span className="brand-description">{brandSubtitle}</span>
      </a>

      <nav aria-label="Main navigation">
        <a
          href={isSubpage ? '/#care' : '#care'}
          onClick={(e) => handleLinkClick(e, '/#care')}
        >
          {t.navPhilosophy}
        </a>
        <a
          href={isSubpage ? '/#specialist' : '#specialist'}
          onClick={(e) => handleLinkClick(e, '/#specialist')}
        >
          {t.navSpecialist}
        </a>
        <a
          href={isSubpage ? '/#treatments' : '#treatments'}
          onClick={(e) => handleLinkClick(e, '/#treatments')}
        >
          {t.navTreatments}
        </a>
        <a
          href={isSubpage ? '/#gallery' : '#gallery'}
          onClick={(e) => handleLinkClick(e, '/#gallery')}
        >
          {t.navGallery}
        </a>
        <a
          href={isSubpage ? '/#knowledge-base' : '#knowledge-base'}
          onClick={(e) => handleLinkClick(e, '/#knowledge-base')}
        >
          {t.navKnowledge}
        </a>
      </nav>

      <div className="header-actions">
        <a
          className="header-icon-btn header-phone-btn"
          href="tel:+905364916040"
          title="Elif Ay Saç Ekimi Telefon Hattı: 0 536 491 60 40"
          aria-label="Telefonla ara: 0 536 491 60 40"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span className="header-contact-text">0 536 491 60 40</span>
        </a>

        <a
          className="header-icon-btn header-whatsapp-btn"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Elif Ay Saç Ekimi WhatsApp Danışma ve Ön Analiz Hattı"
          aria-label="WhatsApp ile Danışın"
        >
          <img
            src="/icons/whatsapp-icon.webp"
            alt="Elif Ay Saç Ekimi WhatsApp Danışma ve Ücretsiz Analiz Hattı"
            className="header-whatsapp-icon"
            width="20"
            height="20"
          />
          <span className="header-contact-text">WhatsApp</span>
        </a>

        <a
          className="header-cta"
          href={isSubpage ? '/#care' : '#care'}
          onClick={(e) => handleLinkClick(e, '/#care')}
        >
          Ücretsiz Analiz <span aria-hidden="true">↗︎</span>
        </a>
      </div>
    </header>
  </div>
  );
}

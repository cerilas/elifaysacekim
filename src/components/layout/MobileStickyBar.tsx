import { type Language, TRANSLATIONS } from '../../i18n';

export interface MobileStickyBarProps {
  whatsappMessage?: string;
  currentLang?: Language;
}

export function MobileStickyBar({ whatsappMessage, currentLang = 'tr' }: MobileStickyBarProps) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.tr;
  const defaultMsg = currentLang === 'en'
    ? 'Hello, I would like to get information about Elif Ay hair transplant and free analysis.'
    : currentLang === 'ar'
    ? 'مرحباً، أود الحصول على معلومات حول زراعة الشعر والتحليل المجاني لدى إليف آي.'
    : currentLang === 'de'
    ? 'Hallo, ich möchte mich über die Haartransplantation bei Elif Ay und die kostenlose Analyse informieren.'
    : 'Merhaba, Elif Ay saç ekimi ve ücretsiz analiz hakkında bilgi almak istiyorum.';

  const msg = whatsappMessage || defaultMsg;
  const whatsappUrl = `https://wa.me/905364916040?text=${encodeURIComponent(msg)}`;

  return (
    <aside className="mobile-sticky-bar mobile-cta-bar" aria-label="Hızlı İletişim">
      <a
        className="sticky-btn sticky-btn-call"
        href="tel:+905364916040"
        aria-label="Telefon ile ara: 0 536 491 60 40"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
        <div className="sticky-btn-text">
          <strong>{t.stickyCall}</strong>
          <small>{t.stickySubtitleCall}</small>
        </div>
      </a>

      <a
        className="sticky-btn sticky-btn-whatsapp mobile-cta-wa"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.stickyWhatsApp}
      >
        <img
          src="/icons/whatsapp-icon.webp"
          alt="WhatsApp"
          width="22"
          height="22"
          style={{ display: 'block' }}
        />
        <div className="sticky-btn-text">
          <strong>{t.stickyWhatsApp}</strong>
          <small>{t.stickySubtitleWA}</small>
        </div>
      </a>
    </aside>
  );
}

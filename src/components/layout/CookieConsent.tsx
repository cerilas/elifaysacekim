import React, { useEffect, useState } from 'react';
import './cookie-consent.css';

export interface CookieConsentProps {
  currentLang: string;
}

const CONSENT_I18N: Record<string, any> = {
  tr: {
    message: 'Sitemizde en iyi deneyimi yaşamanız için çerezler kullanıyoruz. Sitemizi kullanarak çerez politikamızı kabul etmiş sayılırsınız.',
    accept: 'Kabul Et',
  },
  en: {
    message: 'We use cookies to ensure you get the best experience on our website. By using our site, you accept our cookie policy.',
    accept: 'Accept',
  },
  de: {
    message: 'Wir verwenden Cookies, um Ihnen das beste Erlebnis auf unserer Website zu bieten. Durch die Nutzung unserer Website stimmen Sie unserer Cookie-Richtlinie zu.',
    accept: 'Akzeptieren',
  },
  ar: {
    message: 'نحن نستخدم ملفات تعريف الارتباط لضمان حصولك على أفضل تجربة على موقعنا. باستخدام موقعنا، فإنك توافق على سياسة ملفات تعريف الارتباط الخاصة بنا.',
    accept: 'قبول',
  },
};

export function CookieConsent({ currentLang }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('elifay_cookie_consent');
    if (!consent) {
      // Small delay for UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isVisible) return null;

  const t = CONSENT_I18N[currentLang] || CONSENT_I18N.tr;

  const handleAccept = () => {
    localStorage.setItem('elifay_cookie_consent', 'true');
    setIsVisible(false);
  };

  return (
    <div className="cookie-consent-overlay" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="cookie-consent-content">
        <p>{t.message}</p>
        <button className="cookie-consent-btn" onClick={handleAccept}>
          {t.accept}
        </button>
      </div>
    </div>
  );
}

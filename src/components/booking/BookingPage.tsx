import React, { useEffect } from 'react';
import { SiteHeader } from '../layout/SiteHeader';
import { SiteFooter } from '../layout/SiteFooter';
import { MobileStickyBar } from '../layout/MobileStickyBar';
import { CookieConsent } from '../layout/CookieConsent';
import { BookingView } from './BookingView';
import { type Language, type Theme } from '../../i18n';
import './booking.css';

interface BookingPageProps {
  onNavigate: (to: string) => void;
  theme: Theme;
  onToggleTheme: () => void;
  onSelectTheme?: (theme: Theme) => void;
  currentLang?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export function BookingPage({
  onNavigate,
  theme,
  onToggleTheme,
  onSelectTheme,
  currentLang = 'tr',
  onLanguageChange,
}: BookingPageProps) {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = currentLang === 'en'
      ? 'Online Appointment & Hair Analysis | Elif Ay Gaziantep'
      : currentLang === 'ar'
      ? 'حجز موعد وتحليل الشعر أونلاين | إليف آي غازي عنتاب'
      : currentLang === 'de'
      ? 'Online Termin & Haaranalyse | Elif Ay Gaziantep'
      : 'Online Randevu & Saç Analizi | Elif Ay Gaziantep';

    window.scrollTo({ top: 0, behavior: 'instant' });

    return () => {
      document.title = originalTitle;
    };
  }, [currentLang]);

  return (
    <>
      <SiteHeader
        isSubpage={true}
        onNavigate={onNavigate}
        theme={theme}
        onToggleTheme={onToggleTheme}
        onSelectTheme={onSelectTheme}
        currentLang={currentLang}
        onLanguageChange={onLanguageChange}
      />

      <main className="booking-page-container">
        <BookingView currentLang={currentLang} onNavigateHome={() => onNavigate('/')} />
      </main>

      <SiteFooter currentLang={currentLang} onNavigate={onNavigate} />
      <MobileStickyBar currentLang={currentLang} onOpenBooking={() => onNavigate('/randevu')} />
      <CookieConsent currentLang={currentLang} />
    </>
  );
}

import React from 'react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { type Language, type Theme, TRANSLATIONS } from '../../i18n';
import './site-function-bar.css';

export interface SiteFunctionBarProps {
  currentLang?: Language;
  onLanguageChange?: (lang: Language) => void;
  theme?: Theme;
  onToggleTheme?: () => void;
  onSelectTheme?: (theme: Theme) => void;
}

export function SiteFunctionBar({
  currentLang = 'tr',
  onLanguageChange,
  theme = 'dark',
  onToggleTheme,
  onSelectTheme,
}: SiteFunctionBarProps) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.tr;

  const statusText: Record<Language, string> = {
    tr: 'Hasta Kabul & Ücretsiz Ön Analiz',
    en: 'Patient Admissions & Free Analysis',
    ar: 'استقبال المرضى والتحليل المجاني',
    de: 'Patientenaufnahme & Kostenlose Analyse',
  };

  const clinicNameText: Record<Language, string> = {
    tr: 'Gaziantep Merkez Klinik',
    en: 'Gaziantep Central Clinic',
    ar: 'عيادة غازي عنتاب المركزية',
    de: 'Gaziantep Zentralklinik',
  };

  const phoneTitle: Record<Language, string> = {
    tr: 'Elif Ay Saç Ekimi Telefon: 0 536 491 60 40',
    en: 'Elif Ay Hair Transplant Clinic: +90 536 491 60 40',
    ar: 'عيادة إليف آي لزراعة الشعر: 40 60 491 536 90+',
    de: 'Elif Ay Haartransplantation Telefon: +90 536 491 60 40',
  };

  const regionLabel: Record<Language, string> = {
    tr: 'Hızlı Ayarlar ve Klinik Bilgisi',
    en: 'Quick Settings and Clinic Information',
    ar: 'الإعدادات السريعة ومعلومات العيادة',
    de: 'Schnelleinstellungen und Klinikinformationen',
  };

  const handleThemeClick = (targetTheme: Theme) => {
    if (onSelectTheme) {
      onSelectTheme(targetTheme);
    } else if (onToggleTheme) {
      onToggleTheme();
    }
  };

  return (
    <div className="site-function-bar" role="region" aria-label={regionLabel[currentLang]}>
      <div className="function-bar-inner">
        <div className="function-bar-left">
          <span className="function-bar-status">
            <span className="function-bar-pulse" aria-hidden="true" />
            {statusText[currentLang]}
          </span>
          <span className="function-bar-sep" aria-hidden="true">•</span>
          <span className="function-bar-clinic">{clinicNameText[currentLang]}</span>
          <span className="function-bar-sep function-bar-desktop" aria-hidden="true">•</span>
          <a
            href="tel:+905364916040"
            className="function-bar-phone function-bar-desktop"
            title={phoneTitle[currentLang]}
          >
            0 536 491 60 40
          </a>
        </div>

        <div className="function-bar-right">
          {onLanguageChange && (
            <LanguageSwitcher
              currentLang={currentLang}
              onLanguageChange={onLanguageChange}
            />
          )}

          {(onToggleTheme || onSelectTheme) && (
            <span className="function-bar-divider" aria-hidden="true" />
          )}

          {(onToggleTheme || onSelectTheme) && (
            <div
              className="function-bar-theme-group"
              role="group"
              aria-label="Tema Seçimi (Dark, Light, Med)"
            >
              <button
                type="button"
                className={`function-bar-theme-btn ${theme === 'dark' ? 'is-active' : ''}`}
                onClick={() => handleThemeClick('dark')}
                title={t.themeToggleDark}
                aria-label={t.themeToggleDark}
                aria-pressed={theme === 'dark'}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              </button>

              <button
                type="button"
                className={`function-bar-theme-btn ${theme === 'light' ? 'is-active' : ''}`}
                onClick={() => handleThemeClick('light')}
                title={t.themeToggleLight}
                aria-label={t.themeToggleLight}
                aria-pressed={theme === 'light'}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              </button>

              <button
                type="button"
                className={`function-bar-theme-btn function-bar-theme-btn--med ${theme === 'med' ? 'is-active' : ''}`}
                onClick={() => handleThemeClick('med')}
                title={t.themeToggleMed}
                aria-label={t.themeToggleMed}
                aria-pressed={theme === 'med'}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" strokeWidth="1.8" />
                  <line x1="12" y1="7" x2="12" y2="17" strokeWidth="3" />
                  <line x1="7" y1="12" x2="17" y2="12" strokeWidth="3" />
                </svg>
                <span className="theme-med-text">Med</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

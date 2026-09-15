import { useState, useRef, useEffect } from 'react';
import { LANGUAGES, type Language } from '../../i18n';
import './language-switcher.css';

interface LanguageSwitcherProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export function LanguageSwitcher({ currentLang, onLanguageChange }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (lang: Language) => {
    onLanguageChange(lang);
    setIsOpen(false);
  };

  const activeConfig = LANGUAGES[currentLang] || LANGUAGES.tr;

  return (
    <div className="lang-switcher-container" ref={dropdownRef}>
      <button
        type="button"
        className="lang-switcher-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Dil Değiştir (Mevcut: ${activeConfig.name})`}
        title={`Dil Değiştir / Change Language (${activeConfig.name})`}
      >
        <span className="lang-flag">{activeConfig.flag}</span>
        <span className="lang-code">{activeConfig.code.toUpperCase()}</span>
        <span className="lang-caret">▾</span>
      </button>

      {isOpen && (
        <div className="lang-dropdown-menu" role="listbox">
          {(Object.keys(LANGUAGES) as Language[]).map((code) => {
            const config = LANGUAGES[code];
            const isSelected = code === currentLang;
            return (
              <button
                key={code}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`lang-option-btn ${isSelected ? 'active' : ''}`}
                onClick={() => handleSelect(code)}
              >
                <span className="lang-option-flag">{config.flag}</span>
                <span className="lang-option-name">{config.nativeName}</span>
                {isSelected && <span className="lang-option-check">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

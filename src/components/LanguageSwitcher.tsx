import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';
import { supportedLanguages, type SupportedLanguage } from '../lib/i18n';

interface LanguageSwitcherProps {
  variant?: 'desktop' | 'mobile';
}

export default function LanguageSwitcher({ variant = 'desktop' }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = supportedLanguages.find(
    (lang) => lang.code === i18n.language
  ) || supportedLanguages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update html lang attribute when language changes
  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const handleLanguageChange = (langCode: SupportedLanguage) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  if (variant === 'mobile') {
    return (
      <div className="w-full">
        <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {t('languageSwitcher.selectLanguage')}
        </div>
        <div className="flex flex-wrap gap-2 px-3">
          {supportedLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px] ${
                i18n.language === lang.code
                  ? 'bg-brandFuchsia text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-primary-50 hover:text-brandFuchsia'
              }`}
              aria-label={`Switch to ${lang.name}`}
              aria-current={i18n.language === lang.code ? 'true' : undefined}
            >
              <span className="text-lg" aria-hidden="true">{lang.flag}</span>
              <span>{lang.code.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 hover:text-brandFuchsia bg-gray-100 hover:bg-primary-50 rounded-lg transition-all duration-200 min-h-[44px]"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={t('languageSwitcher.selectLanguage')}
      >
        <Globe size={18} className="text-brandFuchsia" aria-hidden="true" />
        <span className="hidden sm:inline">{currentLanguage.flag}</span>
        <span>{currentLanguage.code.toUpperCase()}</span>
        <ChevronDown 
          size={14} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          aria-hidden="true" 
        />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
          role="listbox"
          aria-label={t('languageSwitcher.selectLanguage')}
        >
          {supportedLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                i18n.language === lang.code
                  ? 'bg-primary-50 text-brandFuchsia font-medium'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-brandFuchsia'
              }`}
              role="option"
              aria-selected={i18n.language === lang.code}
            >
              <span className="text-lg" aria-hidden="true">{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files from src/locales for bundling
import enTranslation from '../locales/en/translation.json';
import elTranslation from '../locales/el/translation.json';
import bgTranslation from '../locales/bg/translation.json';
import itTranslation from '../locales/it/translation.json';
import ruTranslation from '../locales/ru/translation.json';
import srTranslation from '../locales/sr/translation.json';
import hrTranslation from '../locales/hr/translation.json';
import sqTranslation from '../locales/sq/translation.json';

const resources = {
  en: { translation: enTranslation },
  el: { translation: elTranslation },
  bg: { translation: bgTranslation },
  it: { translation: itTranslation },
  ru: { translation: ruTranslation },
  sr: { translation: srTranslation },
  hr: { translation: hrTranslation },
  sq: { translation: sqTranslation },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'el', 'bg', 'it', 'ru', 'sr', 'hr', 'sq'],
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    react: {
      useSuspense: false, // Disable suspense for better UX
    },
  });

export default i18n;

// Export supported languages for use in components
export const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'bg', name: 'Български', flag: '🇧🇬' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'sr', name: 'Српски', flag: '🇷🇸' },
  { code: 'hr', name: 'Hrvatski', flag: '🇭🇷' },
  { code: 'sq', name: 'Shqip', flag: '🇦🇱' },
] as const;

export type SupportedLanguage = typeof supportedLanguages[number]['code'];

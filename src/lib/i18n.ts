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
import esTranslation from '../locales/es/translation.json';

// Import common namespace files
import enCommon from '../locales/en/common.json';
import elCommon from '../locales/el/common.json';
import bgCommon from '../locales/bg/common.json';
import itCommon from '../locales/it/common.json';
import ruCommon from '../locales/ru/common.json';
import srCommon from '../locales/sr/common.json';
import hrCommon from '../locales/hr/common.json';
import sqCommon from '../locales/sq/common.json';
import esCommon from '../locales/es/common.json';
import frCommon from '../locales/fr/common.json';

// Import products namespace files
import enProducts from '../locales/en/products.json';
import elProducts from '../locales/el/products.json';
import bgProducts from '../locales/bg/products.json';
import itProducts from '../locales/it/products.json';
import ruProducts from '../locales/ru/products.json';
import srProducts from '../locales/sr/products.json';
import hrProducts from '../locales/hr/products.json';
import sqProducts from '../locales/sq/products.json';
import esProducts from '../locales/es/products.json';
import frProducts from '../locales/fr/products.json';

// Import privateLabel namespace files
import enPrivateLabel from '../locales/en/privateLabel.json';
import elPrivateLabel from '../locales/el/privateLabel.json';
import bgPrivateLabel from '../locales/bg/privateLabel.json';
import itPrivateLabel from '../locales/it/privateLabel.json';
import ruPrivateLabel from '../locales/ru/privateLabel.json';
import srPrivateLabel from '../locales/sr/privateLabel.json';
import hrPrivateLabel from '../locales/hr/privateLabel.json';
import sqPrivateLabel from '../locales/sq/privateLabel.json';
import esPrivateLabel from '../locales/es/privateLabel.json';
import frPrivateLabel from '../locales/fr/privateLabel.json';

const resources = {
  en: { translation: enTranslation, common: enCommon, products: enProducts, privateLabel: enPrivateLabel },
  el: { translation: elTranslation, common: elCommon, products: elProducts, privateLabel: elPrivateLabel },
  bg: { translation: bgTranslation, common: bgCommon, products: bgProducts, privateLabel: bgPrivateLabel },
  it: { translation: itTranslation, common: itCommon, products: itProducts, privateLabel: itPrivateLabel },
  ru: { translation: ruTranslation, common: ruCommon, products: ruProducts, privateLabel: ruPrivateLabel },
  sr: { translation: srTranslation, common: srCommon, products: srProducts, privateLabel: srPrivateLabel },
  hr: { translation: hrTranslation, common: hrCommon, products: hrProducts, privateLabel: hrPrivateLabel },
  sq: { translation: sqTranslation, common: sqCommon, products: sqProducts, privateLabel: sqPrivateLabel },
  es: { translation: esTranslation, common: esCommon, products: esProducts, privateLabel: esPrivateLabel },
  fr: { common: frCommon, products: frProducts, privateLabel: frPrivateLabel },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'el', 'bg', 'it', 'ru', 'sr', 'hr', 'sq', 'es', 'fr'],
    ns: ['translation', 'common', 'products', 'privateLabel'],
    defaultNS: 'translation',
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
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
] as const;

export type SupportedLanguage = typeof supportedLanguages[number]['code'];

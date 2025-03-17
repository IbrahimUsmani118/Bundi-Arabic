import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'react-native-localize';

import en from './en.json';
import ar from './ar.json';

// Detect user language
const fallback = { languageTag: 'en', isRTL: false };
const { languageTag } = Localization.getLocales()[0] || fallback;

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3', // for react-native compatibility
    resources: {
      en: { translation: en },
      ar: { translation: ar }
    },
    lng: languageTag, // Set default language based on user’s locale
    fallbackLng: 'en', // Default to English if translation is missing
    interpolation: { escapeValue: false },
  });

export default i18n;

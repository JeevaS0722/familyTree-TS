import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from '../en/en';
import es from '../es/es';

void i18n
  // Enable the language detector plugin
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // This will be the languages that the application can use
    supportedLngs: ['en', 'es'],
    // Fallback language is English
    fallbackLng: 'en',
    debug: true,
    ns: ['translations'],
    defaultNS: 'translations',

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
      formatSeparator: ',',
    },

    react: {
      useSuspense: true,
    },

    resources: {
      en: {
        ...en,
      },
      es: {
        ...es,
      },
    },
    // Define the order and from where user language should be detected
    detection: {
      // The order and from where user language should be detected
      order: [
        'querystring',
        'navigator',
        'cookie',
        'localStorage',
        'sessionStorage',
        'htmlTag',
      ],
      // keys or params to lookup language from
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      lookupSessionStorage: 'i18nextLng',

      // Cache user language on
      caches: ['localStorage', 'cookie'],
      excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)
    },
  });

export default i18n;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

import locales from 'res/dayjs_locales';

i18n
  .use(LanguageDetector)
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: Object.keys(locales),
    ns: 'common',
    defaultNS: 'common',
    debug: process.env.NODE_ENV !== 'production',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/i18n/{{lng}}/{{ns}}.json',
    },
  }).then(() => document.documentElement.setAttribute('lang', i18n.language));

export default i18n;

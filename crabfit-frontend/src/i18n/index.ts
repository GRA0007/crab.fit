import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(LanguageDetector)
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en-US',
    debug: true,
    load: 'currentOnly',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/i18n/{{lng}}/{{ns}}.json',
      requestOptions: {
        cache: 'no-cache'
      },
      customHeaders: {
        pragma: 'no-cache',
      },
    },
  });

export default i18n;

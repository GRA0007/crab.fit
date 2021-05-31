const locales = {
  de: () => import('dayjs/locale/de'), // German
  en: () => import('dayjs/locale/en'), // English
  es: () => import('dayjs/locale/es'), // Spanish
  fr: () => import('dayjs/locale/fr'), // French
  hi: () => import('dayjs/locale/hi'), // Hindi
  id: () => import('dayjs/locale/id'), // Indonesian
  ko: () => import('dayjs/locale/ko'), // Korean
  ru: () => import('dayjs/locale/ru'), // Russian
};

export default locales;

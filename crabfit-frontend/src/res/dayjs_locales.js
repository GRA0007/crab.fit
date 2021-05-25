const locales = {
  en: () => import('dayjs/locale/en'),
  de: () => import('dayjs/locale/de'),
  es: () => import('dayjs/locale/es'),
  ko: () => import('dayjs/locale/ko'),
};

export default locales;

const locales = {
  'de': { // German
    name: 'Deutsch',
    import: () => import('dayjs/locale/de'),
    weekStart: 1,
    timeFormat: '24h',
    separator: ':',
  },
  'en': { // English (US)
    name: 'English (US)',
    import: () => import('dayjs/locale/en'),
    weekStart: 0,
    timeFormat: '12h',
    separator: ':',
  },
  'en-GB': { // English (UK)
    name: 'English (UK)',
    import: () => import('dayjs/locale/en-gb'),
    weekStart: 1,
    timeFormat: '12h',
    separator: ':',
  },
  'es': { // Spanish
    name: 'Español',
    import: () => import('dayjs/locale/es'),
    weekStart: 1,
    timeFormat: '24h',
    separator: ':',
  },
  'fr': { // French
    name: 'Français',
    import: () => import('dayjs/locale/fr'),
    weekStart: 1,
    timeFormat: '24h',
    separator: ':',
  },
  'hi': { // Hindi
    name: 'हिंदी',
    import: () => import('dayjs/locale/hi'),
    weekStart: 1,
    timeFormat: '12h',
    separator: ':',
  },
  'id': { // Indonesian
    name: 'Indonesia',
    import: () => import('dayjs/locale/id'),
    weekStart: 1,
    timeFormat: '24h',
    separator: '.',
  },
  'ko': { // Korean
    name: '한국어',
    import: () => import('dayjs/locale/ko'),
    weekStart: 0,
    timeFormat: '24h',
    separator: ':',
  },
  'ru': { // Russian
    name: 'Pусский',
    import: () => import('dayjs/locale/ru'),
    weekStart: 1,
    timeFormat: '24h',
    separator: ':',
  },
};

export default locales;

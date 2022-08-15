const locales = {
  'de': { // German
    name: 'Deutsch',
    import: () => import('dayjs/locale/de'),
    weekStart: 1,
    timeFormat: '24h',
  },
  'en': { // English (US)
    name: 'English (US)',
    import: () => import('dayjs/locale/en'),
    weekStart: 0,
    timeFormat: '12h',
  },
  'en-GB': { // English (UK)
    name: 'English (UK)',
    import: () => import('dayjs/locale/en-gb'),
    weekStart: 1,
    timeFormat: '12h',
  },
  'es': { // Spanish
    name: 'Español',
    import: () => import('dayjs/locale/es'),
    weekStart: 1,
    timeFormat: '24h',
  },
  'fr': { // French
    name: 'Français',
    import: () => import('dayjs/locale/fr'),
    weekStart: 1,
    timeFormat: '24h',
  },
  'hi': { // Hindi
    name: 'हिंदी',
    import: () => import('dayjs/locale/hi'),
    weekStart: 1,
    timeFormat: '12h',
  },
  'id': { // Indonesian
    name: 'Indonesia',
    import: () => import('dayjs/locale/id'),
    weekStart: 1,
    timeFormat: '24h',
    separator: '.',
  },
  'ja': { // Japanese
    name: '日本語',
    import: () => import('dayjs/locale/ja'),
    weekStart: 0,
    timeFormat: '12h',
  },
  'ko': { // Korean
    name: '한국어',
    import: () => import('dayjs/locale/ko'),
    weekStart: 0,
    timeFormat: '24h',
  },
  'pl': { // Polish
    name: 'Polskie',
    import: () => import('dayjs/locale/pl'),
    weekStart: 1,
    timeFormat: '12h',
  },
  'pt-BR': { // Portuguese (Brazil)
    name: 'Português (do Brasil)',
    import: () => import('dayjs/locale/pt-br'),
    weekStart: 0,
    timeFormat: '24h',
  },
  'ru': { // Russian
    name: 'Pусский',
    import: () => import('dayjs/locale/ru'),
    weekStart: 1,
    timeFormat: '24h',
  },
  // 'zh-CN': { // Chinese
  //   name: '中文',
  //   import: () => import('dayjs/locale/zh-cn'),
  //   weekStart: 1,
  //   timeFormat: '12h',
  // },
};

export default locales;

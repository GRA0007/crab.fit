import { InitOptions } from 'i18next'

export const fallbackLng = 'en'
export const defaultNS = 'common'
export const cookieName = 'i18next'
export const languages = [
  fallbackLng,
  'en-GB', 'de', 'es', 'fr', 'hi', 'id', 'it', 'ja', 'ko', 'pl', 'pt-PT', 'pt-BR', 'ru',
] as const

export const getOptions = (lng = fallbackLng, ns: InitOptions['ns'] = defaultNS): InitOptions => ({
  lng,
  fallbackLng,
  supportedLngs: languages,
  ns,
  fallbackNS: defaultNS,
  defaultNS,
  // debug: true,
  interpolation: {
    escapeValue: false,
  },
})

interface LanguageDetails {
  /** Name of the language in it's own language */
  name: string
  /** 0: Sunday, 1: Monday */
  weekStart: 0 | 1
  timeFormat: '12h' | '24h'
}

export const languageDetails: Record<typeof languages[number], LanguageDetails> = {
  'en': { // English (US)
    name: 'English (US)',
    weekStart: 0,
    timeFormat: '12h',
  },
  'en-GB': { // English (UK)
    name: 'English (UK)',
    weekStart: 1,
    timeFormat: '12h',
  },
  'de': { // German
    name: 'Deutsch',
    weekStart: 1,
    timeFormat: '24h',
  },
  'es': { // Spanish
    name: 'Español',
    weekStart: 1,
    timeFormat: '24h',
  },
  'fr': { // French
    name: 'Français',
    weekStart: 1,
    timeFormat: '24h',
  },
  'hi': { // Hindi
    name: 'हिंदी',
    weekStart: 1,
    timeFormat: '12h',
  },
  'id': { // Indonesian
    name: 'Indonesia',
    weekStart: 1,
    timeFormat: '24h',
  },
  'it': { // Italian
    name: 'Italiano',
    weekStart: 1,
    timeFormat: '24h',
  },
  'ja': { // Japanese
    name: '日本語',
    weekStart: 0,
    timeFormat: '12h',
  },
  'ko': { // Korean
    name: '한국어',
    weekStart: 0,
    timeFormat: '24h',
  },
  'pl': { // Polish
    name: 'Polskie',
    weekStart: 1,
    timeFormat: '12h',
  },
  'pt-PT': { // Portuguese (Portugal)
    name: 'Português (do Portugal)',
    weekStart: 0,
    timeFormat: '24h',
  },
  'pt-BR': { // Portuguese (Brazil)
    name: 'Português (do Brasil)',
    weekStart: 0,
    timeFormat: '24h',
  },
  'ru': { // Russian
    name: 'Pусский',
    weekStart: 1,
    timeFormat: '24h',
  },
  // 'zh-CN': { // Chinese
  //   name: '中文',
  //   weekStart: 1,
  //   timeFormat: '12h',
  // },
}

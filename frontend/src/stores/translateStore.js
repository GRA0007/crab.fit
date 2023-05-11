import create from 'zustand'
import { persist } from 'zustand/middleware'

import locales from '/src/i18n/locales'

const useTranslateStore = create(persist(
  set => ({
    navigatorLang: navigator.language,
    navigatorSupported: Object.keys(locales).includes(navigator.language.substring(0, 2)),
    translateDialogDismissed: false,

    setDialogDismissed: value => set({ translateDialogDismissed: value }),
  }),
  {
    name: 'crabfit-translate',
    blacklist: [
      'navigatorLang',
      'navigatorSupported',
    ],
  },
))

export default useTranslateStore

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import locales from '/src/i18n/locales'

interface TranslateStore {
  navigatorLang: string
  navigatorSupported: boolean
  translateDialogDismissed: boolean

  setDialogDismissed: (isDismissed: boolean) => void
}

const useTranslateStore = create<TranslateStore>()(persist(
  set => ({
    navigatorLang: navigator.language,
    navigatorSupported: Object.keys(locales).includes(navigator.language.substring(0, 2)),
    translateDialogDismissed: false,

    setDialogDismissed: isDismissed => set({ translateDialogDismissed: isDismissed }),
  }),
  {
    name: 'crabfit-translate',
    partialize: state => ({ translateDialogDismissed: state.translateDialogDismissed }),
  },
))

export default useTranslateStore

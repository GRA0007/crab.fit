import { create } from 'zustand'

interface LocaleUpdateStore {
  locale: string
  setLocale: (locale: string) => void
}

const useLocaleUpdateStore = create<LocaleUpdateStore>()(set => ({
  locale: 'en',
  setLocale: locale => set({ locale }),
}))

export default useLocaleUpdateStore

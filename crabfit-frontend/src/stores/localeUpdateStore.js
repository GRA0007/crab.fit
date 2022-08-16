import create from 'zustand'

const useLocaleUpdateStore = create(set => ({
  locale: 'en',
  setLocale: locale => set({ locale }),
}))

export default useLocaleUpdateStore

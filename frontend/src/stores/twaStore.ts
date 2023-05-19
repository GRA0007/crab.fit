import { create } from 'zustand'

interface TWAStore {
  /** Is the site running in a trusted web activity? */
  isTWA: boolean | undefined
  setIsTWA: (isTWA: boolean | undefined) => void
}

const useTWAStore = create<TWAStore>()(set => ({
  isTWA: undefined,
  setIsTWA: isTWA => set({ isTWA }),
}))

export default useTWAStore

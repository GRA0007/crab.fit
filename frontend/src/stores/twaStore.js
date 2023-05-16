import create from 'zustand'

const useTWAStore = create(set => ({
  TWA: undefined,
  setTWA: TWA => set({ TWA }),
}))

export default useTWAStore

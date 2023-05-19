import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface RecentEvent {
  id: string
  name: string
  created_at: number
}

interface RecentsStore {
  recents: RecentEvent[]

  addRecent: (event: RecentEvent) => void
  removeRecent: (id: string) => void
  clearRecents: () => void
}

const useRecentsStore = create<RecentsStore>()(persist(
  set => ({
    recents: [],

    addRecent: event => set(state => {
      const recents = state.recents.filter(e => e.id !== event.id)
      recents.unshift(event)
      recents.length = Math.min(recents.length, 5)
      return { recents }
    }),
    removeRecent: id => set(state => {
      const recents = state.recents.filter(e => e.id !== id)
      return { recents }
    }),
    clearRecents: () => set({ recents: [] }),
  }),
  {
    name: 'crabfit-recent',
    version: 1,
    migrate: (persistedState, version) => {
      if (version === 0) {
        return {
          ...persistedState as RecentsStore,
          recents: (persistedState as { recents: {id: string, name: string, created: number }[] }).recents.map(ev => ({
            id: ev.id,
            name: ev.name,
            created_at: ev.created, // Field renamed
          })),
        }
      }
      return persistedState as RecentsStore
    },
  },
))

export default useRecentsStore

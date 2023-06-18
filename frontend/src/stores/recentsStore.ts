import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface RecentEvent {
  id: string
  name: string
  created_at: number
  user?: {
    name: string
    availability: string[]
  }
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

    addRecent: event => set(state => ({
      recents: [{ ...state.recents.find(e => e.id === event.id), ...event }, ...state.recents.filter(e => e.id !== event.id)],
    })),
    removeRecent: id => set(state => ({
      recents: state.recents.filter(e => e.id !== id),
    })),
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

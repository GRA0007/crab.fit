import create from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(persist(
  set => ({
    weekStart: 0,
    timeFormat: '12h',
    theme: 'System',

    setWeekStart: weekStart => set({ weekStart }),
    setTimeFormat: timeFormat => set({ timeFormat }),
    setTheme: theme => set({ theme }),
  }),
  { name: 'crabfit-settings' },
));

export const useRecentsStore = create(persist(
  set => ({
    recents: [],

    addRecent: event => set(state => {
      const recents = state.recents.filter(e => e.id !== event.id);
      recents.unshift(event);
      recents.length = Math.min(recents.length, 5);
      return { recents };
    }),
    removeRecent: id => set(state => {
      const recents = state.recents.filter(e => e.id !== id);
      return { recents };
    }),
    clearRecents: () => set({ recents: [] }),
  }),
  { name: 'crabfit-recent' },
));

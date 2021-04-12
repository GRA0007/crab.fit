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

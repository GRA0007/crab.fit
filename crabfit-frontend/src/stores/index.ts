import create from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(persist(
  set => ({
    weekStart: 0,
    timeFormat: '12h',

    setWeekStart: weekStart => set({ weekStart }),
    setTimeFormat: timeFormat => set({ timeFormat }),
  }),
  { name: 'crabfit-settings' },
));

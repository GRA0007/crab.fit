import create from 'zustand'
import { persist } from 'zustand/middleware'

const useSettingsStore = create(persist(
  set => ({
    weekStart: 0,
    timeFormat: '12h',
    theme: 'System',
    highlight: false,

    setWeekStart: weekStart => set({ weekStart }),
    setTimeFormat: timeFormat => set({ timeFormat }),
    setTheme: theme => set({ theme }),
    setHighlight: highlight => set({ highlight }),
  }),
  { name: 'crabfit-settings' },
))

export default useSettingsStore

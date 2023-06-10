import { MapKey } from 'hue-map/dist/maps'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type TimeFormat = '12h' | '24h'
type Theme = 'System' | 'Light' | 'Dark'

interface SettingsStore {
  /** 0: Sunday, 1: Monday */
  weekStart: 0 | 1
  timeFormat: TimeFormat
  theme: Theme
  highlight: boolean
  colormap: 'crabfit' | MapKey

  setWeekStart: (weekStart: 0 | 1) => void
  setTimeFormat: (timeFormat: TimeFormat) => void
  setTheme: (theme: Theme) => void
  setHighlight: (highlight: boolean) => void
  setColormap: (colormap: 'crabfit' | MapKey) => void
}

const useSettingsStore = create<SettingsStore>()(persist(
  set => ({
    weekStart: 0,
    timeFormat: '12h',
    theme: 'System',
    highlight: false,
    colormap: 'crabfit',

    setWeekStart: weekStart => set({ weekStart }),
    setTimeFormat: timeFormat => set({ timeFormat }),
    setTheme: theme => set({ theme }),
    setHighlight: highlight => set({ highlight }),
    setColormap: colormap => set({ colormap }),
  }),
  { name: 'crabfit-settings' },
))

export default useSettingsStore

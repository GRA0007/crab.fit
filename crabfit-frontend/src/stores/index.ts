import create from 'zustand';
import { persist } from 'zustand/middleware';
import locales from 'res/dayjs_locales';

export const useSettingsStore = create(persist(
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

export const useTWAStore = create(set => ({
  TWA: undefined,
  setTWA: TWA => set({ TWA }),
}));

export const useLocaleUpdateStore = create(set => ({
  locale: 'en',
  setLocale: locale => set({ locale }),
}));

export const useTranslateStore = create(persist(
  set => ({
    navigatorLang: navigator.language,
    navigatorSupported: Object.keys(locales).includes(navigator.language.substring(0, 2)),
    translateDialogDismissed: false,

    setDialogDismissed: value => set({ translateDialogDismissed: value }),
  }),
  {
    name: 'crabfit-translate',
    blacklist: [
      'navigatorLang',
      'navigatorSupported',
    ],
  },
));

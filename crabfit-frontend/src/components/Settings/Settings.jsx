import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { Settings as SettingsIcon } from 'lucide-react'
import { maps } from 'hue-map'

import { ToggleField, SelectField } from '/src/components'

import { useSettingsStore, useLocaleUpdateStore } from '/src/stores'

import {
  OpenButton,
  Modal,
  Heading,
  Cover,
} from './Settings.styles'

import locales from '/src/i18n/locales'
import { unhyphenate } from '/src/utils'

// Language specific options
const setDefaults = (lang, store) => {
  if (locales[lang]) {
    store.setWeekStart(locales[lang].weekStart)
    store.setTimeFormat(locales[lang].timeFormat)
  }
}

const Settings = () => {
  const { pathname } = useLocation()
  const store = useSettingsStore()
  const [isOpen, _setIsOpen] = useState(false)
  const { t, i18n } = useTranslation('common')
  const setLocale = useLocaleUpdateStore(state => state.setLocale)
  const firstControlRef = useRef()

  const onEsc = e => {
    if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const setIsOpen = open => {
    _setIsOpen(open)

    if (open) {
      window.setTimeout(() => firstControlRef.current?.focus(), 150)
      document.addEventListener('keyup', onEsc, true)
    } else {
      document.removeEventListener('keyup', onEsc)
    }
  }

  useEffect(() => {
    if (Object.keys(locales).includes(i18n.language)) {
      locales[i18n.language].import().then(() => {
        dayjs.locale(i18n.language)
        setLocale(dayjs.locale())
        document.documentElement.setAttribute('lang', i18n.language)
      })
    } else {
      setLocale('en')
      document.documentElement.setAttribute('lang', 'en')
    }
  }, [i18n.language, setLocale])

  if (!i18n.options.storedLang) {
    setDefaults(i18n.language, store)
    i18n.options.storedLang = i18n.language
  }

  i18n.on('languageChanged', lang => {
    setDefaults(lang, store)
  })

  // Reset scroll on navigation
  useEffect(() => window.scrollTo(0, 0), [pathname])

  return (
    <>
      <OpenButton
        $isOpen={isOpen}
        type="button"
        onClick={() => setIsOpen(!isOpen)} title={t('options.name')}
      ><SettingsIcon /></OpenButton>

      <Cover $isOpen={isOpen} onClick={() => setIsOpen(false)} />
      <Modal $isOpen={isOpen}>
        <Heading>{t('options.name')}</Heading>

        <ToggleField
          label={t('options.weekStart.label')}
          name="weekStart"
          id="weekStart"
          options={{
            'Sunday': t('options.weekStart.options.Sunday'),
            'Monday': t('options.weekStart.options.Monday'),
          }}
          value={store.weekStart === 0 ? 'Sunday' : 'Monday'}
          onChange={value => store.setWeekStart(value === 'Sunday' ? 0 : 1)}
          inputRef={firstControlRef}
        />

        <ToggleField
          label={t('options.timeFormat.label')}
          name="timeFormat"
          id="timeFormat"
          options={{
            '12h': t('options.timeFormat.options.12h'),
            '24h': t('options.timeFormat.options.24h'),
          }}
          value={store.timeFormat}
          onChange={value => store.setTimeFormat(value)}
        />

        <ToggleField
          label={t('options.theme.label')}
          name="theme"
          id="theme"
          options={{
            'System': t('options.theme.options.System'),
            'Light': t('options.theme.options.Light'),
            'Dark': t('options.theme.options.Dark'),
          }}
          value={store.theme}
          onChange={value => store.setTheme(value)}
        />

        <SelectField
          label={t('options.colormap.label')}
          name="colormap"
          id="colormap"
          options={{
            'crabfit': t('options.colormap.classic'),
            ...Object.fromEntries(Object.keys(maps).sort().map(palette => [
              palette,
              unhyphenate(palette)
            ])),
          }}
          small
          value={store.colormap}
          onChange={event => store.setColormap(event.target.value)}
        />

        <ToggleField
          label={t('options.highlight.label')}
          name="highlight"
          id="highlight"
          title={t('options.highlight.title')}
          options={{
            'Off': t('options.highlight.options.Off'),
            'On': t('options.highlight.options.On'),
          }}
          value={store.highlight ? 'On' : 'Off'}
          onChange={value => store.setHighlight(value === 'On')}
        />

        <SelectField
          label={t('options.language.label')}
          name="language"
          id="language"
          options={{
            ...Object.keys(locales).reduce((ls, l) => {
              ls[l] = locales[l].name
              return ls
            }, {}),
            ...process.env.NODE_ENV !== 'production' && { 'cimode': 'DEV' },
          }}
          small
          value={i18n.language}
          onChange={event => i18n.changeLanguage(event.target.value)}
        />
      </Modal>
    </>
  )
}

export default Settings

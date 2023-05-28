'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { maps } from 'hue-map'
import { MapKey } from 'hue-map/dist/maps'
import { Settings as SettingsIcon } from 'lucide-react'

import SelectField from '/src/components/SelectField/SelectField'
import ToggleField from '/src/components/ToggleField/ToggleField'
import { useTranslation } from '/src/i18n/client'
import { languageDetails } from '/src/i18n/options'
import { useStore } from '/src/stores'
import useSettingsStore from '/src/stores/settingsStore'
import { makeClass, unhyphenate } from '/src/utils'

import styles from './Settings.module.scss'

const Settings = () => {
  const { t, i18n } = useTranslation('common')
  const router = useRouter()

  const store = useStore(useSettingsStore, state => state)

  const modalRef = useRef<HTMLDialogElement>(null)
  const [isOpen, _setIsOpen] = useState(false)
  const setIsOpen = useCallback((shouldOpen: boolean) => {
    if (shouldOpen) {
      modalRef.current?.showModal()
      _setIsOpen(true)
    } else {
      modalRef.current?.close()
      _setIsOpen(false)
    }
  }, [])

  // Use user theme preference
  useEffect(() => {
    document.body.classList.toggle('light', store?.theme === 'Light')
    document.body.classList.toggle('dark', store?.theme === 'Dark')
  }, [store?.theme])

  return <>
    <button
      type="button"
      className={makeClass(styles.openButton, isOpen && styles.open)}
      onClick={() => setIsOpen(!isOpen)}
      title={t<string>('options.name')}
    ><SettingsIcon /></button>

    <dialog
      className={styles.modal}
      ref={modalRef}
      onClose={() => _setIsOpen(false)}
      onClick={() => modalRef.current?.close()}
    >
      <div onClick={e => e.stopPropagation()}>
        <span className={styles.heading}>{t('options.name')}</span>

        {store && <>
          <ToggleField
            label={t('options.weekStart.label')}
            name="weekStart"
            options={{
              'Sunday': t('options.weekStart.options.Sunday'),
              'Monday': t('options.weekStart.options.Monday'),
            }}
            value={store?.weekStart === 1 ? 'Sunday' : 'Monday'}
            onChange={value => store?.setWeekStart(value === 'Sunday' ? 1 : 0)}
          />

          <ToggleField
            label={t('options.timeFormat.label')}
            name="timeFormat"
            options={{
              '12h': t('options.timeFormat.options.12h'),
              '24h': t('options.timeFormat.options.24h'),
            }}
            value={store?.timeFormat ?? '12h'}
            onChange={value => store?.setTimeFormat(value)}
          />

          <ToggleField
            label={t('options.theme.label')}
            name="theme"
            options={{
              'System': t('options.theme.options.System'),
              'Light': t('options.theme.options.Light'),
              'Dark': t('options.theme.options.Dark'),
            }}
            value={store?.theme ?? 'System'}
            onChange={value => store?.setTheme(value)}
          />

          <SelectField
            label={t('options.colormap.label')}
            name="colormap"
            options={{
              'crabfit': t('options.colormap.classic'),
              ...Object.fromEntries(Object.keys(maps).sort().map(palette => [
                palette,
                unhyphenate(palette)
              ])),
            }}
            isSmall
            value={store?.colormap}
            onChange={event => store?.setColormap(event.target.value as MapKey)}
          />

          <ToggleField
            label={t('options.highlight.label')}
            name="highlight"
            description={t('options.highlight.title')}
            options={{
              'Off': t('options.highlight.options.Off'),
              'On': t('options.highlight.options.On'),
            }}
            value={store?.highlight ? 'On' : 'Off'}
            onChange={value => store?.setHighlight(value === 'On')}
          />

          <SelectField
            label={t('options.language.label')}
            name="language"
            id="language"
            options={{
              ...Object.fromEntries(Object.entries(languageDetails).map(([id, details]) => [id, details.name])),
              ...process.env.NODE_ENV !== 'production' && { 'cimode': 'DEV' },
            }}
            isSmall
            value={i18n.language}
            onChange={e => i18n.changeLanguage(e.target.value).then(() => router.refresh())}
          />
        </>}
      </div>
    </dialog>
  </>
}

export default Settings

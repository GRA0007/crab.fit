import { useCallback, useState } from 'react'
import { isKeyOfObject } from '@giraugh/tools'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isToday from 'dayjs/plugin/isToday'
import localeData from 'dayjs/plugin/localeData'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import updateLocale from 'dayjs/plugin/updateLocale'
import utc from 'dayjs/plugin/utc'

import { useTranslation } from '/src/i18n/client'
import { languageDetails } from '/src/i18n/options'
import { useStore } from '/src/stores'
import useSettingsStore from '/src/stores/settingsStore'

dayjs.extend(customParseFormat)
dayjs.extend(isToday)
dayjs.extend(localeData)
dayjs.extend(relativeTime)
dayjs.extend(timezone)
dayjs.extend(updateLocale)
dayjs.extend(utc)

export const useDayjs = () => {
  const { i18n } = useTranslation()
  const store = useStore(useSettingsStore, state => state)
  const [updateInstance, setUpdateInstance] = useState(0)

  const instance = useCallback(dayjs, [updateInstance, dayjs])

  const handleLanguageChange = useCallback((lng: string) => {
    if (isKeyOfObject(lng, languageDetails)) {
      store?.setWeekStart(languageDetails[lng].weekStart)
      store?.setTimeFormat(languageDetails[lng].timeFormat)

      languageDetails[lng]?.import().then(() => {
        dayjs.locale(lng)
        setUpdateInstance(updateInstance + 1)
      })
    }
  }, [store])

  i18n.on('languageChanged', handleLanguageChange)

  return instance
}

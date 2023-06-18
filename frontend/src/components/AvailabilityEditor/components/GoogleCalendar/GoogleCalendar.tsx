import { useCallback, useEffect, useMemo, useState } from 'react'
import Script from 'next/script'
import { Temporal } from '@js-temporal/polyfill'

import Button from '/src/components/Button/Button'
import { useTranslation } from '/src/i18n/client'
import GoogleIcon from '/src/res/GoogleIcon'
import { allowUrlToWrap, parseSpecificDate } from '/src/utils'

import styles from './GoogleCalendar.module.scss'

const [clientId, apiKey] = [process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID, process.env.NEXT_PUBLIC_GOOGLE_API_KEY]

interface Calendar {
  id: string
  name: string
  description?: string
  color?: string
  isChecked: boolean
}

const login = (callback: (tokenResponse: google.accounts.oauth2.TokenResponse) => void) => {
  if (!clientId) return

  const client = google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: 'https://www.googleapis.com/auth/calendar.readonly',
    callback,
  })
  if (gapi?.client?.getToken()) {
    // Skip dialog for existing session
    client.requestAccessToken({ prompt: '' })
  } else {
    client.requestAccessToken()
  }
}

interface GoogleCalendarProps {
  timezone: string
  timeStart: Temporal.ZonedDateTime
  timeEnd: Temporal.ZonedDateTime
  times: string[]
  onImport: (availability: string[]) => void
}

const GoogleCalendar = ({ timezone, timeStart, timeEnd, times, onImport }: GoogleCalendarProps) => {
  if (!clientId || !apiKey) return null

  const { t } = useTranslation('event')

  // Prevent Google scripts from loading until button pressed
  const [canLoad, setCanLoad] = useState(false)
  const [calendars, setCalendars] = useState<Calendar[]>()

  // Clear calendars if logged out
  useEffect(() => {
    if (!canLoad) setCalendars(undefined)
  }, [canLoad])

  const fetchCalendars = useCallback((res: google.accounts.oauth2.TokenResponse) => {
    if (res.error !== undefined) return setCanLoad(false)
    if ('gapi' in window) {
      gapi.client.calendar.calendarList.list({
        'minAccessRole': 'freeBusyReader'
      })
        .then(res => setCalendars(res.result.items.map(item => ({
          id: item.id,
          name: item.summary,
          description: item.description,
          color: item.backgroundColor,
          isChecked: item.primary === true,
        }))))
        .catch(console.warn)
    } else {
      setCanLoad(false)
    }
  }, [])

  // Process times so they can be checked quickly
  const epochTimes = useMemo(() => times.map(t => parseSpecificDate(t).epochMilliseconds), [times])

  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false)
  const importAvailability = useCallback(() => {
    if (!calendars) return

    setIsLoadingAvailability(true)
    gapi.client.calendar.freebusy.query({
      timeMin: timeStart.toPlainDateTime().toString({ smallestUnit: 'millisecond' }) + 'Z',
      timeMax: timeEnd.toPlainDateTime().toString({ smallestUnit: 'millisecond' }) + 'Z',
      timeZone: timezone,
      items: calendars.filter(c => c.isChecked).map(c => ({ id: c.id })),
    })
      .then(response => {
        const availabilities = response.result.calendars ? Object.values(response.result.calendars).flatMap(cal => cal.busy.map(a => ({
          start: new Date(a.start).valueOf(),
          end: new Date(a.end).valueOf(),
        }))) : []

        onImport(times.filter((_, i) => !availabilities.some(a => epochTimes[i] >= a.start && epochTimes[i] < a.end)))
        setIsLoadingAvailability(false)
      }, e => {
        console.error(e)
        setIsLoadingAvailability(false)
      })
  }, [calendars])

  return <>
    {!calendars && <Button
      onClick={() => {
        if (!canLoad) {
          setCanLoad(true)
          if ('google' in window) {
            login(fetchCalendars)
          }
        } else {
          setCanLoad(false)
        }
      }}
      isLoading={canLoad}
      surfaceColor="#4286F5"
      shadowColor="#3367BD"
      icon={<GoogleIcon aria-hidden="true" />}
    >
      {t('you.google_cal')}
    </Button>}

    {calendars && <div className={styles.wrapper}>
      <p className={styles.title}>
        <GoogleIcon className={styles.icon} />
        <strong>{t('you.google_cal')}</strong>
        (<button
          className={styles.linkButton}
          type="button"
          onClick={() => setCanLoad(false)}
        >{t('you.integration.logout')}</button>)
      </p>

      <div className={styles.options}>
        {!calendars.every(c => c.isChecked) && <button
          className={styles.linkButton}
          type="button"
          onClick={() => setCalendars(calendars.map(c => ({ ...c, isChecked: true })))}
        >{t('you.select_all')}</button>}
        {calendars.every(c => c.isChecked) && <button
          className={styles.linkButton}
          type="button"
          onClick={() => setCalendars(calendars.map(c => ({ ...c, isChecked: false })))}
        >{t('you.select_none')}</button>}
      </div>

      {calendars.map(calendar => <div key={calendar.id} className={styles.item}>
        <input
          type="checkbox"
          id={calendar.id}
          style={{ accentColor: calendar.color }}
          checked={calendar.isChecked}
          onChange={() => setCalendars(calendars.map(c => c.id === calendar.id ? { ...c, isChecked: !c.isChecked } : c))}
        />
        <label className={styles.name} htmlFor={calendar.id} title={calendar.description}>{allowUrlToWrap(calendar.name)}</label>
      </div>)}

      <div className={styles.info}>{t('you.integration.info')}</div>
      <Button
        isSmall
        isLoading={isLoadingAvailability}
        disabled={isLoadingAvailability}
        onClick={() => importAvailability()}
      >{t('you.integration.button')}</Button>
    </div>}

    {/* Load google api scripts */}
    {canLoad && <>
      <Script
        src="https://accounts.google.com/gsi/client"
        onError={() => setCanLoad(false)}
        onLoad={() => login(fetchCalendars)}
      />
      <Script
        src="https://apis.google.com/js/api.js"
        onError={() => setCanLoad(false)}
        onLoad={() => gapi.load('client', () => {
          gapi.client.init({
            apiKey,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
          }).catch(() => setCanLoad(false))
        })}
      />
    </>}
  </>
}

export default GoogleCalendar

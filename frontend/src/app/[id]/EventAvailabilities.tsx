'use client'

import { useMemo, useState } from 'react'
import { Trans } from 'react-i18next/TransWithoutContext'

import AvailabilityViewer from '/src/components/AvailabilityViewer/AvailabilityViewer'
import Content from '/src/components/Content/Content'
import Login from '/src/components/Login/Login'
import Section from '/src/components/Section/Section'
import SelectField from '/src/components/SelectField/SelectField'
import { EventResponse, PersonResponse } from '/src/config/api'
import { useTranslation } from '/src/i18n/client'
import timezones from '/src/res/timezones.json'
import { expandTimes, makeClass } from '/src/utils'

import styles from './page.module.scss'

const EventAvailabilities = ({ event, people }: { event: EventResponse, people: PersonResponse[] }) => {
  const { t, i18n } = useTranslation('event')

  const expandedTimes = useMemo(() => expandTimes(event.times), [event.times])

  const [user, setUser] = useState<PersonResponse>()
  const [password, setPassword] = useState<string>()

  const [tab, setTab] = useState<'group' | 'you'>('group')
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone)

  return <>
    <Section id="login">
      <Content>
        <Login eventId={event.id} user={user} onChange={(u, p) => {
          setUser(u)
          setPassword(p)
        }} />

        <SelectField
          label={t('form.timezone')}
          name="timezone"
          id="timezone"
          isInline
          value={timezone}
          onChange={event => setTimezone(event.currentTarget.value)}
          options={timezones}
        />

        {event?.timezone && event.timezone !== timezone && <p>
          <Trans i18nKey="form.created_in_timezone" t={t} i18n={i18n}>
            {/* eslint-disable-next-line */}
            {/* @ts-ignore */}
            _<strong>{{timezone: event.timezone}}</strong>
            _<a href="#" onClick={e => {
              e.preventDefault()
              setTimezone(event.timezone)
            }}>_</a>_
          </Trans>
        </p>}

        {((
          Intl.DateTimeFormat().resolvedOptions().timeZone !== timezone
          && (event?.timezone && event.timezone !== Intl.DateTimeFormat().resolvedOptions().timeZone)
        ) || (
          event?.timezone === undefined
          && Intl.DateTimeFormat().resolvedOptions().timeZone !== timezone
        )) && (
          <p>
            <Trans i18nKey="form.local_timezone" t={t} i18n={i18n}>
              {/* eslint-disable-next-line */}
              {/* @ts-ignore */}
              _<strong>{{timezone: Intl.DateTimeFormat().resolvedOptions().timeZone}}</strong>
              _<a href="#" onClick={e => {
                e.preventDefault()
                setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)
              }}>_</a>_
            </Trans>
          </p>
        )}
      </Content>
    </Section>

    <Content>
      <div className={styles.tabs}>
        <button
          className={makeClass(
            styles.tab,
            tab === 'you' && styles.tabSelected,
            !user && styles.tabDisabled,
          )}
          type="button"
          onClick={() => {
            if (user) {
              setTab('you')
            } else {
              document.dispatchEvent(new CustomEvent('focusName'))
            }
          }}
          title={user ? '' : t<string>('tabs.you_tooltip')}
        >{t('tabs.you')}</button>
        <button
          className={makeClass(
            styles.tab,
            tab === 'group' && styles.tabSelected,
          )}
          type="button"
          onClick={() => setTab('group')}
        >{t('tabs.group')}</button>
      </div>
    </Content>

    {tab === 'group' && <AvailabilityViewer
      times={expandedTimes}
      people={people}
      timezone={timezone}
    />}
  </>
}

export default EventAvailabilities

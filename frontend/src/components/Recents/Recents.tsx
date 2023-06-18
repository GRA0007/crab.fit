'use client'

import Link from 'next/link'
import { Temporal } from '@js-temporal/polyfill'

import Content from '/src/components/Content/Content'
import Section from '/src/components/Section/Section'
import { useTranslation } from '/src/i18n/client'
import { useStore } from '/src/stores'
import useRecentsStore from '/src/stores/recentsStore'
import { relativeTimeFormat } from '/src/utils'

import styles from './Recents.module.scss'

const Recents = () => {
  const recents = useStore(useRecentsStore, state => state.recents)
  const { t, i18n } = useTranslation(['home', 'common'])

  return recents?.length ? <Section id="recents">
    <Content>
      <h2>{t('home:recently_visited')}</h2>
      {recents.slice(0, 5).map(event => (
        <Link className={styles.recent} href={`/${event.id}`} key={event.id}>
          <span className={styles.name}>{event.name}</span>
          <span
            className={styles.date}
            title={Temporal.Instant.fromEpochSeconds(event.created_at).toLocaleString(i18n.language, { dateStyle: 'long' })}
          >{t('common:created', { date: relativeTimeFormat(Temporal.Instant.fromEpochSeconds(event.created_at), i18n.language) })}</span>
        </Link>
      ))}
    </Content>
  </Section> : null
}

export default Recents

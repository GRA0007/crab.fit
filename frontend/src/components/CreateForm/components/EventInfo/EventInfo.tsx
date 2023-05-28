import { useState } from 'react'
import { Trans } from 'react-i18next/TransWithoutContext'

import { EventResponse } from '/src/config/api'
import { useTranslation } from '/src/i18n/client'
import { makeClass } from '/src/utils'

import styles from './EventInfo.module.scss'

interface EventInfoProps {
  event: EventResponse
}

const EventInfo = ({ event }: EventInfoProps) => {
  const { t, i18n } = useTranslation('event')

  const [copied, setCopied] = useState<React.ReactNode>()

  return <div className={styles.wrapper}>
    <h2>{event.name}</h2>
    <p
      className={makeClass(styles.info, styles.copyable)}
      onClick={() => navigator.clipboard?.writeText(`https://crab.fit/${event.id}`)
        .then(() => {
          setCopied(t('nav.copied'))
          setTimeout(() => setCopied(undefined), 1000)
        })
        .catch(e => console.error('Failed to copy', e))
      }
      title={navigator.clipboard ? t<string>('nav.title') : undefined}
    >{copied ?? `https://crab.fit/${event.id}`}</p>
    <p className={styles.info}>
      <Trans i18nKey="event:nav.shareinfo_alt" t={t} i18n={i18n}>_<a href={`mailto:?subject=${encodeURIComponent(t<string>('nav.email_subject', { event_name: event.name }))}&body=${encodeURIComponent(`${t('nav.email_body')} https://crab.fit/${event.id}`)}`} target="_blank">_</a>_</Trans>
    </p>
  </div>
}

export default EventInfo

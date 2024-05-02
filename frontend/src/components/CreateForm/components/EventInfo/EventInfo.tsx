import { Trans } from 'react-i18next/TransWithoutContext'

import Copyable from '/src/components/Copyable/Copyable'
import { EventResponse } from '/src/config/api'
import { useTranslation } from '/src/i18n/client'

import styles from './EventInfo.module.scss'

if (process.env.NEXT_PUBLIC_DOMAIN_FRONT === undefined) {
  throw new Error('Expected front domain name environment variable')
}
const DOMAIN_FRONT = process.env.NEXT_PUBLIC_DOMAIN_FRONT

interface EventInfoProps {
  event: EventResponse
}

const EventInfo = ({ event }: EventInfoProps) => {
  const { t, i18n } = useTranslation('event')

  return <div className={styles.wrapper}>
    <h2>{event.name}</h2>
    <Copyable className={styles.info}>
      {`https://${DOMAIN_FRONT}/${event.id}`}
    </Copyable>
    <p className={styles.info}>
      <Trans i18nKey="event:nav.shareinfo_alt" t={t} i18n={i18n}>_<a href={`mailto:?subject=${encodeURIComponent(t('nav.email_subject', { event_name: event.name }))}&body=${encodeURIComponent(`${t('nav.email_body')} https://${DOMAIN_FRONT}/${event.id}`)}`} target="_blank">_</a>_</Trans>
    </p>
  </div>
}

export default EventInfo

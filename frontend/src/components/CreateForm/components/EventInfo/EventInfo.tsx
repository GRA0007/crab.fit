import { Trans } from 'react-i18next/TransWithoutContext'

import Copyable from '/src/components/Copyable/Copyable'
import { EventResponse } from '/src/config/api'
import { useTranslation } from '/src/i18n/client'

import styles from './EventInfo.module.scss'

interface EventInfoProps {
  event: EventResponse
}

const EventInfo = ({ event }: EventInfoProps) => {
  const { t, i18n } = useTranslation('event')

  return <div className={styles.wrapper}>
    <h2>{event.name}</h2>
    <Copyable className={styles.info}>
      {`https://crab.fit/${event.id}`}
    </Copyable>
    <p className={styles.info}>
      <Trans i18nKey="event:nav.shareinfo_alt" t={t} i18n={i18n}>_<a href={`mailto:?subject=${encodeURIComponent(t('nav.email_subject', { event_name: event.name }))}&body=${encodeURIComponent(`${t('nav.email_body')} https://crab.fit/${event.id}`)}`} target="_blank">_</a>_</Trans>
    </p>
  </div>
}

export default EventInfo

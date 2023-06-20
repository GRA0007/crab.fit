import { useCallback, useMemo, useState } from 'react'
import { Temporal } from '@js-temporal/polyfill'

import Button from '/src/components/Button/Button'
import { useTranslation } from '/src/i18n/client'
import CrabIcon from '/src/res/CrabIcon'
import { useStore } from '/src/stores'
import useRecentsStore, { RecentEvent } from '/src/stores/recentsStore'
import { relativeTimeFormat } from '/src/utils'

import styles from '../GoogleCalendar/GoogleCalendar.module.scss'

interface RecentEventsProps {
  eventId?: string
  times: string[]
  onImport: (availability: string[]) => void
}

const hasAvailability = (event: RecentEvent): event is Required<RecentEvent> => event.user !== undefined

const RecentEvents = ({ eventId, times, onImport }: RecentEventsProps) => {
  const { t, i18n } = useTranslation('event')

  const allRecents = useStore(useRecentsStore, state => state.recents)
  const recents = useMemo(() => allRecents
    ?.filter(hasAvailability)
    .filter(e => e.id !== eventId && e.user.availability.some(a => times.includes(a))) ?? [],
  [allRecents])

  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<string>()

  const importAvailability = useCallback(() => {
    if (selected === undefined || recents.length === 0) return

    const selectedRecent = recents.find(r => r.id === selected)
    if (!selectedRecent) return

    onImport(selectedRecent.user.availability.filter(a => times.includes(a)))
  }, [selected, recents])

  // No recents
  if (recents.length === 0) return null

  return <>
    {!isOpen && <Button
      onClick={() => setIsOpen(true)}
      icon={<CrabIcon aria-hidden="true" />}
    >
      {t('you.recent_event')}
    </Button>}

    {isOpen && <div className={styles.wrapper}>
      <p className={styles.title}>
        <CrabIcon className={styles.icon} />
        <strong>{t('you.recent_event')}</strong>
        (<button
          className={styles.linkButton}
          type="button"
          onClick={() => setIsOpen(false)}
        >{t('you.integration.close')}</button>)
      </p>

      {recents.map(recent => <div
        key={recent.id}
        title={Temporal.Instant.fromEpochSeconds(recent.created_at).toLocaleString(i18n.language, { dateStyle: 'long' })}
        className={styles.item}
      >
        <input type="radio" name="recents" value={recent.id} id={recent.id} onChange={() => setSelected(recent.id)} checked={selected === recent.id} />
        <label
          htmlFor={recent.id}
          className={styles.name}
        >
          <span>{recent.name} ({recent.user.name})</span>
          <span style={{ opacity: .7, fontSize: '.7em' }}>{relativeTimeFormat(Temporal.Instant.fromEpochSeconds(recent.created_at), i18n.language)}</span>
        </label>
      </div>)}

      <div className={styles.info}>{t('you.integration.info')}</div>
      <Button
        isSmall
        disabled={selected === undefined}
        onClick={importAvailability}
      >{t('you.integration.button')}</Button>
    </div>}
  </>
}

export default RecentEvents

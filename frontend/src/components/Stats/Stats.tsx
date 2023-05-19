import { API_BASE, StatsResponse } from '/src/config/api'
import { useTranslation } from '/src/i18n/server'

import styles from './Stats.module.scss'

const getStats = async () => {
  const res = await fetch(new URL('/stats', API_BASE))
    .catch(console.warn)
  if (!res?.ok) return
  return StatsResponse.parse(await res.json())
}

const Stats = async () => {
  const stats = await getStats()
  const { t } = await useTranslation('home')

  return <div className={styles.wrapper}>
    <div>
      <span className={styles.number}>
        {new Intl.NumberFormat().format(stats?.event_count || 17000)}{!stats?.event_count && '+'}
      </span>
      <span className={styles.label}>{t('about.events')}</span>
    </div>
    <div>
      <span className={styles.number}>
        {new Intl.NumberFormat().format(stats?.person_count || 65000)}{!stats?.person_count && '+'}
      </span>
      <span className={styles.label}>{t('about.availabilities')}</span>
    </div>
  </div>
}

export default Stats

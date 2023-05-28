import { getStats } from '/src/config/api'
import { useTranslation } from '/src/i18n/server'

import styles from './Stats.module.scss'

const Stats = async () => {
  const stats = await getStats().catch(() => undefined)
  const { t } = await useTranslation('home')

  return stats ? <div className={styles.wrapper}>
    <div>
      <span className={styles.number}>
        {new Intl.NumberFormat().format(stats.event_count)}
      </span>
      <span className={styles.label}>{t('about.events')}</span>
    </div>
    <div>
      <span className={styles.number}>
        {new Intl.NumberFormat().format(stats.person_count)}
      </span>
      <span className={styles.label}>{t('about.availabilities')}</span>
    </div>
  </div> : null
}

export default Stats

'use client'

import { useEffect } from 'react'

import Content from '/src/components/Content/Content'
import { useTranslation } from '/src/i18n/client'
import useRecentsStore from '/src/stores/recentsStore'

import styles from './page.module.scss'

const NotFound = () => {
  const { t } = useTranslation('event')

  // Remove this event from recents if it was in there
  const removeRecent = useRecentsStore(state => state.removeRecent)
  useEffect(() => {
    // Note: Next.js doesn't expose path params to the 404 page
    removeRecent(window.location.pathname.replace('/', ''))
  }, [removeRecent])

  return <Content>
    <div style={{ marginBlock: 100 }}>
      <h1 className={styles.name}>{t('error.title')}</h1>
      <p className={styles.info}>{t('error.body')}</p>
    </div>
  </Content>
}

export default NotFound

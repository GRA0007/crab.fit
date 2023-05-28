import Content from '/src/components/Content/Content'
import { useTranslation } from '/src/i18n/server'

import styles from './page.module.scss'

const NotFound = async () => {
  const { t } = await useTranslation('event')

  return <Content>
    <div style={{ marginBlock: 100 }}>
      <h1 className={styles.name}>{t('error.title')}</h1>
      <p className={styles.info}>{t('error.body')}</p>
    </div>
  </Content>
}

export default NotFound

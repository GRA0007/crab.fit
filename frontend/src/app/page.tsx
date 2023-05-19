import { Button, Footer, Header, Recents } from '/src/components'
import { useTranslation } from '/src/i18n/server'

import styles from './home.module.scss'

const Page = async () => {
  const { t } = await useTranslation('home')

  return <div>
    <Header isFull />

    <nav className={styles.nav}>
      <a href="#about">{t('home:nav.about')}</a>
      {' / '}
      <a href="#donate">{t('home:nav.donate')}</a>
    </nav>

    <Recents />
    <Button>Hey there!</Button>
    <Footer />
  </div>
}

export default Page

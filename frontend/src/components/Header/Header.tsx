import Link from 'next/link'

import { useTranslation } from '/src/i18n/server'
import logo from '/src/res/logo.svg'
import { makeClass } from '/src/utils'

import styles from './Header.module.scss'

interface HeaderProps {
  /** Show the full header */
  isFull?: boolean
  isSmall?: boolean
}

const Header = async ({ isFull, isSmall }: HeaderProps) => {
  const { t } = await useTranslation(['common', 'home'])

  return <header className={styles.header} data-small={isSmall}>
    {isFull ? <>
      {!isSmall && <img className={styles.bigLogo} src={logo.src} alt="" />}
      <span className={makeClass(styles.subtitle, !/^[A-Za-z ]+$/.test(t('home:create')) && styles.hasAltChars)}>{t('home:create')}</span>
      <h1 className={styles.bigTitle}>CRAB FIT</h1>
    </> : <Link href="/" className={styles.link}>
      <div className={styles.top}>
        <img className={styles.logo} src={logo.src} alt="" />
        <span className={styles.title}>CRAB FIT</span>
      </div>
      <span className={styles.tagline}>{t('common:tagline')}</span>
    </Link>}
  </header>
}

export default Header

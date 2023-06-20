import { headers } from 'next/headers'

import Button from '/src/components/Button/Button'
import { useTranslation } from '/src/i18n/server'
import { makeClass } from '/src/utils'

import styles from './Footer.module.scss'

interface FooterProps {
  isSmall?: boolean
}

const Footer = async ({ isSmall }: FooterProps) => {
  const { t } = await useTranslation('common')
  const isRunningInApp = headers().get('referer')?.includes('android-app://fit.crab')

  return isRunningInApp
    ? null // Cannot show external donation link in an Android app
    : <footer
      id="donate" // Required to allow scrolling directly to the footer
      className={makeClass(styles.footer, isSmall && styles.small)}
    >
      <span>{t('donate.info')}</span>
      <Button
        isSmall
        title={t('donate.title')}
        href="https://ko-fi.com/A06841WZ"
        target="_blank"
        rel="noreferrer noopener payment"
        style={{ whiteSpace: 'nowrap' }}
      >{t('donate.button')}</Button>
    </footer>
}

export default Footer

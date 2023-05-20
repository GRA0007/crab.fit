import { Trans } from 'react-i18next/TransWithoutContext'
import Link from 'next/link'

import Button from '/src/components/Button/Button'
import Content from '/src/components/Content/Content'
import DownloadButtons from '/src/components/DownloadButtons/DownloadButtons'
import Footer from '/src/components/Footer/Footer'
import Header from '/src/components/Header/Header'
import { default as P } from '/src/components/Paragraph/Paragraph'
import Recents from '/src/components/Recents/Recents'
import Section from '/src/components/Section/Section'
import Stats from '/src/components/Stats/Stats'
import Video from '/src/components/Video/Video'
import { useTranslation } from '/src/i18n/server'

import styles from './home.module.scss'

const Page = async () => {
  const { t } = await useTranslation('home')

  return <>
    <Content>
      {/* @ts-expect-error Async Server Component */}
      <Header isFull />

      <nav className={styles.nav}>
        <a href="#about">{t('nav.about')}</a>
        {' / '}
        <a href="#donate">{t('nav.donate')}</a>
      </nav>
    </Content>

    <Recents />

    <Content>
      <span>Form here</span>
      <Button>Create</Button>
    </Content>

    <Section id="about">
      <Content>
        <h2>{t('about.name')}</h2>

        {/* @ts-expect-error Async Server Component */}
        <Stats />

        <P><Trans i18nKey="about.content.p1" t={t}>Crab Fit helps you fit your event around everyone's schedules. Simply create an event above and send the link to everyone that is participating. Results update live and you will be able to see a heat-map of when everyone is free.<br /><Link href="/how-to" rel="help">Learn more about how to Crab Fit</Link>.</Trans></P>

        <Video />

        <DownloadButtons />

        <P><Trans i18nKey="about.content.p3" t={t}>Created by <a href="https://bengrant.dev" target="_blank" rel="noreferrer noopener author">Ben Grant</a>, Crab Fit is the modern-day solution to your group event planning debates.</Trans></P>
        <P><Trans i18nKey="about.content.p4" t={t}>The code for Crab Fit is open source, if you find any issues or want to contribute, you can visit the <a href="https://github.com/GRA0007/crab.fit" target="_blank" rel="noreferrer noopener">repository</a>. By using Crab Fit you agree to the <Link href="/privacy" rel="license">privacy policy</Link>.</Trans></P>
        <P>{t('about.content.p6')}</P>
        <P>{t('about.content.p5')}</P>
      </Content>
    </Section>

    {/* @ts-expect-error Async Server Component */}
    <Footer />
  </>
}

export default Page

import { Metadata } from 'next'

import Egg from '/src/components/Egg/Egg'
import Settings from '/src/components/Settings/Settings'
import TranslateDialog from '/src/components/TranslateDialog/TranslateDialog'
import { fallbackLng } from '/src/i18n/options'
import { useTranslation } from '/src/i18n/server'

import './global.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://crab.fit'),
  title: 'Crab Fit',
  keywords: ['crab', 'fit', 'crabfit', 'schedule', 'availability', 'availabilities', 'when2meet', 'doodle', 'meet', 'plan', 'time', 'timezone'],
  description: 'Enter your availability to find a time that works for everyone!',
  themeColor: '#F79E00',
  manifest: 'manifest.json',
  openGraph: {
    title: 'Crab Fit',
    description: 'Enter your availability to find a time that works for everyone!',
    url: '/',
  },
  icons: {
    icon: 'favicon.ico',
    apple: 'logo192.png',
  },
}

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const { resolvedLanguage } = await useTranslation([])

  return <html lang={resolvedLanguage ?? fallbackLng}>
    <body>
      <Settings />
      {children}
      <Egg />
      <TranslateDialog />
    </body>
  </html>
}

export default RootLayout
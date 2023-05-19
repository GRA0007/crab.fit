import { Metadata } from 'next'

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
  const { i18n } = await useTranslation([])

  return <html lang={i18n.resolvedLanguage ?? fallbackLng}>
    <body>
      {children}
    </body>
  </html>
}

export default RootLayout

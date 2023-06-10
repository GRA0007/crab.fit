'use client'

import { useEffect, useState } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import Button from '/src/components/Button/Button'
import { languages } from '/src/i18n/options'
import { useStore } from '/src/stores'

import styles from './TranslateDialog.module.scss'

interface TranslateStore {
  translateDialogDismissed: boolean
  dismissDialog: () => void
}

const useTranslateStore = create<TranslateStore>()(persist(
  set => ({
    translateDialogDismissed: false,
    dismissDialog: () => set({ translateDialogDismissed: true }),
  }),
  { name: 'crabfit-translate' },
))

const TranslateDialog = () => {
  const [isSupported, setIsSupported] = useState(true)
  const store = useStore(useTranslateStore, state => state)

  // Check if current language has translations
  useEffect(() => {
    setIsSupported((languages as readonly string[]).includes(navigator.language.substring(0, 2)))
  }, [])

  return (store?.translateDialogDismissed === false && !isSupported) ? <div className={styles.popup}>
    <div>
      <h2>Translate Crab Fit</h2>
      <p>Crab Fit hasn't been translated to your language yet.</p>
    </div>

    <div className={styles.buttons}>
      <Button
        target="_blank"
        rel="noreferrer noopener"
        href="https://explore.transifex.com/crab-fit/crab-fit/"
      >Help translate!</Button>
      <Button isSecondary onClick={() => store.dismissDialog()}>Close</Button>
    </div>
  </div> : null
}

export default TranslateDialog

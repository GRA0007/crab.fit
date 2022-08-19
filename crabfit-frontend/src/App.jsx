import { useState, useEffect, useCallback, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import * as Pages from '/src/pages'
import { Settings, Loading, Egg, TranslateDialog } from '/src/components'

import { useSettingsStore, useTranslateStore } from '/src/stores'

const EGG_PATTERN = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

const App = () => {
  const [eggCount, setEggCount] = useState(0)
  const [eggVisible, setEggVisible] = useState(false)
  const [eggKey, setEggKey] = useState(0)

  const languageSupported = useTranslateStore(state => state.navigatorSupported)
  const translateDialogDismissed = useTranslateStore(state => state.translateDialogDismissed)

  const eggHandler = useCallback(e => {
    if (EGG_PATTERN.indexOf(e.key) < 0 || e.key !== EGG_PATTERN[eggCount]) return setEggCount(0)
    setEggCount(eggCount+1)
    if (EGG_PATTERN.length === eggCount+1) {
      setEggKey(eggKey+1)
      setEggCount(0)
      setEggVisible(true)
    }
  }, [eggCount, eggKey])

  useEffect(() => {
    document.addEventListener('keyup', eggHandler, false)
    return () => document.removeEventListener('keyup', eggHandler, false)
  }, [eggHandler])

  // Use user theme preference
  const theme = useSettingsStore(state => state.theme)
  useEffect(() => {
    document.body.classList.toggle('light', theme === 'Light')
    document.body.classList.toggle('dark', theme === 'Dark')
  }, [theme])

  return (
    <>
      {!languageSupported && !translateDialogDismissed && <TranslateDialog />}

      <Suspense fallback={<Loading />}>
        <Settings />

        <Routes>
          <Route path="/" element={<Pages.Home />} />
          <Route path="/how-to" element={<Pages.Help />} />
          <Route path="/privacy" element={<Pages.Privacy />} />
          <Route path="/create" element={<Pages.Create />} />
          <Route path="/:id" element={<Pages.Event />} />
        </Routes>
      </Suspense>

      {eggVisible && <Egg eggKey={eggKey} onClose={() => setEggVisible(false)} />}
    </>
  )
}

export default App

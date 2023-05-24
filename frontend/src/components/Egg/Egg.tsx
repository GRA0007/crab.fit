'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import styles from './Egg.module.scss'

const PATTERN = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
const API_URL = 'https://us-central1-flour-app-services.cloudfunctions.net/charliAPI?v='

const Egg = () => {
  const ref = useRef<HTMLDialogElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [patternCompletion, setPatternCompletion] = useState(0)
  const [url, setUrl] = useState('')
  const [key, setKey] = useState(0)

  const keyHandler = useCallback((e: KeyboardEvent) => {
    // Key pressed not next in pattern
    if (PATTERN.indexOf(e.key) < 0 || e.key !== PATTERN[patternCompletion]) {
      return setPatternCompletion(0)
    }

    setPatternCompletion(patternCompletion + 1)

    // Pattern completed
    if (PATTERN.length === patternCompletion + 1) {
      setUrl(`${API_URL}${key}`)
      setKey(key + 1)
      setPatternCompletion(0)
      setIsLoading(true)
      ref.current?.showModal()
    }
  }, [patternCompletion, key])

  // Listen to key presses
  useEffect(() => {
    document.addEventListener('keyup', keyHandler)
    return () => document.removeEventListener('keyup', keyHandler)
  }, [keyHandler])

  return <dialog
    onClick={e => {
      e.currentTarget.close()
      setUrl('')
    }}
    className={styles.modal}
    ref={ref}
  >
    <img
      className={styles.image}
      src={url}
      alt="A cute picture of Charli"
      onLoadStart={() => setIsLoading(true)}
      onLoad={() => setIsLoading(false)}
    />
    {isLoading && <div className={styles.loader} />}
  </dialog>
}

export default Egg

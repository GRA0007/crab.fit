'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/** Check if the current page is running in an iframe, otherwise redirect home */
const Redirect = () => {
  const router = useRouter()

  useEffect(() => {
    if (window.self === window.top) {
      router.replace('/')
    }
  }, [])

  return null
}

export default Redirect

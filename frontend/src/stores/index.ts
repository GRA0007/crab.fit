import { useEffect, useState } from 'react'

/** Helper to use a persisted store in zustand with Next js without causing a hydration error */
export const useStore = <T, F>(
  store: (callback?: (state: T) => unknown) => unknown,
  callback?: (state: T) => F
) => {
  const result = store(callback) as F
  const [data, setData] = useState<F>()

  useEffect(() => {
    setData(result)
  }, [result])

  return data
}

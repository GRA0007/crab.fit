'use client'

import { useEffect, useState } from 'react'

import { useTranslation } from '/src/i18n/client'
import { makeClass } from '/src/utils'

import styles from './Copyable.module.scss'

interface CopyableProps extends Omit<React.ComponentProps<'p'>, 'children'> {
  children: string
}

const Copyable = ({ children, className, ...props }: CopyableProps) => {
  const { t } = useTranslation('event')

  const [copied, setCopied] = useState<React.ReactNode>()

  const [canCopy, setCanCopy] = useState(false)
  useEffect(() => { setCanCopy('clipboard' in navigator) }, [])

  return <p
    onClick={() => navigator.clipboard?.writeText(children)
      .then(() => {
        setCopied(t('nav.copied'))
        setTimeout(() => setCopied(undefined), 1000)
      })
      .catch(e => console.error('Failed to copy', e))
    }
    title={canCopy ? t('nav.title') : undefined}
    className={makeClass(className, canCopy && styles.copyable)}
    {...props}
  >{copied ?? children}</p>
}

export default Copyable

'use client'

import { useState } from 'react'

import { useTranslation } from '/src/i18n/client'
import { makeClass } from '/src/utils'

import styles from './Copyable.module.scss'

interface CopyableProps extends Omit<React.ComponentProps<'p'>, 'children'> {
  children: string
}

const Copyable = ({ children, className, ...props }: CopyableProps) => {
  const { t } = useTranslation('event')

  const [copied, setCopied] = useState<React.ReactNode>()

  return <p
    onClick={() => navigator.clipboard?.writeText(children)
      .then(() => {
        setCopied(t('nav.copied'))
        setTimeout(() => setCopied(undefined), 1000)
      })
      .catch(e => console.error('Failed to copy', e))
    }
    title={'clipboard' in navigator ? t<string>('nav.title') : undefined}
    className={makeClass(className, 'clipboard' in navigator && styles.copyable)}
    {...props}
  >{copied ?? children}</p>
}

export default Copyable

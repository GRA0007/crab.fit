'use client'

import { X } from 'lucide-react'

import { makeClass } from '/src/utils'

import styles from './Error.module.scss'

interface ErrorProps {
  children?: React.ReactNode
  onClose: () => void
}

const Error = ({ children, onClose }: ErrorProps) =>
  <div role="alert" className={makeClass(styles.error, children && styles.open)}>
    {children}
    <button
      className={styles.closeButton}
      type="button"
      onClick={onClose}
      title="Dismiss error"
    ><X /></button>
  </div>

export default Error

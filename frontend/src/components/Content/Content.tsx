import { makeClass } from '/src/utils'

import styles from './Content.module.scss'

interface ContentProps {
  children: React.ReactNode
  isCentered?: boolean
  isSlim?: boolean
}

const Content = ({ isCentered, isSlim, ...props }: ContentProps) =>
  <div
    className={makeClass(
      styles.content,
      isCentered && styles.centered,
      isSlim && styles.slim,
    )}
    {...props}
  />

export default Content

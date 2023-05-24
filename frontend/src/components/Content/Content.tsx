import { makeClass } from '/src/utils'

import styles from './Content.module.scss'

interface ContentProps {
  children: React.ReactNode
  isCentered?: boolean
}

const Content = ({ isCentered, ...props }: ContentProps) =>
  <div className={makeClass(styles.content, isCentered && styles.centered)} {...props} />

export default Content

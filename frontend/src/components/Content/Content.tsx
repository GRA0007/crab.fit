import styles from './Content.module.scss'

interface ContentProps {
  children: React.ReactNode
}

const Content = (props: ContentProps) =>
  <div className={styles.content} {...props} />

export default Content

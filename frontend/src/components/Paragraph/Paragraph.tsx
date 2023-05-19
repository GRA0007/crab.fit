import styles from './Paragraph.module.scss'

interface ParagraphProps {
  children: React.ReactNode
}

const Paragraph = (props: ParagraphProps) =>
  <p className={styles.p} {...props} />

export default Paragraph

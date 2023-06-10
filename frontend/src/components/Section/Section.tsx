import styles from './Section.module.scss'

interface SectionProps {
  children: React.ReactNode
  id?: string
}

const Section = (props: SectionProps) =>
  <section className={styles.section} {...props} />

export default Section

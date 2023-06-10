import styles from './Field.module.scss'

interface WrapperProps {
  children: React.ReactNode
  style?: React.CSSProperties
}

export const Wrapper = (props: WrapperProps) =>
  <div className={styles.wrapper} {...props} />

interface LabelProps {
  htmlFor?: string
  children: React.ReactNode
  style?: React.CSSProperties
  title?: string
}

export const Label = (props: LabelProps) =>
  <label className={styles.label} {...props} />

export const Description = (props: LabelProps) =>
  <label className={styles.description} {...props} />

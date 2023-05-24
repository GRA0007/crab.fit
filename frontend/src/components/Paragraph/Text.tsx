import styles from './Text.module.scss'

interface TextProps {
  children: React.ReactNode
}

export const P = (props: TextProps) =>
  <p className={styles.text} {...props} />

export const Ul = (props: TextProps) =>
  <ul className={styles.text} {...props} />

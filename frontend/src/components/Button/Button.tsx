import Link from 'next/link'

import { makeClass } from '/src/utils'

import styles from './Button.module.scss'

type ButtonProps = {
  /** If provided, will render a link that looks like a button */
  href?: string
  icon?: React.ReactNode
  children?: React.ReactNode
  isSecondary?: boolean
  isSmall?: boolean
  isLoading?: boolean
  /** Override the surface color of the button. Will force the text to #FFFFFF. */
  surfaceColor?: string
  /** Override the shadow color of the button */
  shadowColor?: string
} & Omit<React.ComponentProps<'button'> & React.ComponentProps<'a'>, 'ref'>

const Button: React.FC<ButtonProps> = ({
  href,
  type = 'button',
  icon,
  children,
  isSecondary,
  isSmall,
  isLoading,
  surfaceColor,
  shadowColor,
  style,
  ...props
}) => {
  const sharedProps = {
    className: makeClass(
      styles.button,
      isSecondary && styles.secondary,
      isSmall && styles.small,
      isLoading && styles.loading,
      !children && icon && styles.iconButton,
    ),
    style: {
      ...surfaceColor && { '--override-surface-color': surfaceColor, '--override-text-color': '#FFFFFF' },
      ...shadowColor && { '--override-shadow-color': shadowColor },
      ...style,
    },
    children: <div>{icon}{children}</div>,
    ...props,
  }

  return href
    ? <Link href={href} {...sharedProps} />
    : <button type={type} {...sharedProps} />
}

export default Button

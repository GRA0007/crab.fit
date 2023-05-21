import { forwardRef } from 'react'

import { Description, Label, Wrapper } from '/src/components/Field/Field'

import styles from './TextField.module.scss'

interface TextFieldProps extends React.ComponentProps<'input'> {
  label?: React.ReactNode
  description?: React.ReactNode
  isInline?: boolean
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(({
  label,
  description,
  isInline,
  ...props
}, ref) => (
  <Wrapper style={isInline ? { margin: 0 } : undefined}>
    {label && <Label
      htmlFor={props.name}
      style={isInline ? { fontSize: '16px' } : undefined}
    >{label}</Label>}

    {description && <Description htmlFor={props.name}>{description}</Description>}

    <input className={styles.input} id={props.name} ref={ref} {...props} />
  </Wrapper>
))

export default TextField

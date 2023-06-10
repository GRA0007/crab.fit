import { forwardRef } from 'react'

import { Description, Label, Wrapper } from '/src/components/Field/Field'

import styles from './SelectField.module.scss'

interface SelectFieldProps extends React.ComponentProps<'select'> {
  label?: React.ReactNode
  description?: React.ReactNode
  options: Record<string, React.ReactNode> | string[]
  isInline?: boolean
  isSmall?: boolean
  defaultOption?: React.ReactNode
}

const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(({
  label,
  description,
  options = [],
  isInline = false,
  isSmall = false,
  defaultOption,
  ...props
}, ref) => <Wrapper style={isInline ? { margin: 0 } : (isSmall ? { marginBlock: '10px' } : undefined)}>
  {label && <Label
    htmlFor={props.name}
    style={isInline ? { fontSize: '16px' } : (isSmall ? { fontSize: '.9rem' } : undefined)}
  >{label}</Label>}

  {description && <Description htmlFor={props.name}>{description}</Description>}

  <select
    className={styles.select}
    id={props.name}
    style={isSmall ? { padding: '6px 8px' } : undefined}
    ref={ref}
    {...props}
  >
    {defaultOption && <option value="">{defaultOption}</option>}
    {Array.isArray(options) ? (
      options.map(value =>
        <option key={value} value={value}>{value}</option>
      )
    ) : (
      Object.entries(options).map(([key, value]) =>
        <option key={key} value={key}>{value}</option>
      )
    )}
  </select>
</Wrapper>)

export default SelectField

import { Info } from 'lucide-react'

import { Label, Wrapper } from '/src/components/Field/Field'

import styles from './ToggleField.module.scss'

interface ToggleFieldProps<TValue extends string> {
  label?: React.ReactNode
  description?: React.ReactNode
  name: string
  value: TValue
  onChange: (value: TValue) => void
  options: Record<TValue, React.ReactNode>
}

const ToggleField = <TValue extends string>({
  label,
  description,
  name,
  options,
  value,
  onChange,
}: ToggleFieldProps<TValue>) => <Wrapper style={{ marginBlock: '10px' }}>
    {/* TODO: Better description viewer */}
    {label && <Label style={{ fontSize: '.9em' }} title={description as string}>
      {label} {description && <Info size="1em" style={{ verticalAlign: 'middle' }} />}
    </Label>}

    <div className={styles.toggleContainer}>
      {Object.entries(options).map(([key, label]) =>
        <div className={styles.option} key={key}>
          <input
            className={styles.hiddenInput}
            type="radio"
            name={name}
            value={key}
            id={`${name}-${key}`}
            checked={value === key}
            onChange={() => onChange(key as TValue)}
            onClick={() => onChange(key as TValue)}
          />
          <label className={styles.button} htmlFor={`${name}-${key}`}>{label as React.ReactNode}</label>
        </div>
      )}
    </div>
  </Wrapper>

export default ToggleField

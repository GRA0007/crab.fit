import { useEffect, useState } from 'react'
import { FieldValues, useController, UseControllerProps } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Temporal } from '@js-temporal/polyfill'

import { Description, Label, Wrapper } from '/src/components/Field/Field'
import ToggleField from '/src/components/ToggleField/ToggleField'

import Month from './components/Month/Month'
import Weekdays from './components/Weekdays/Weekdays'

interface CalendarFieldProps<TValues extends FieldValues> extends UseControllerProps<TValues> {
  label?: React.ReactNode
  description?: React.ReactNode
}

const CalendarField = <TValues extends FieldValues>({
  label,
  description,
  ...props
}: CalendarFieldProps<TValues>) => {
  const { t } = useTranslation('home')

  const { field } = useController(props)

  const [type, setType] = useState<'specific' | 'week'>('specific')

  const [innerValue, setInnerValue] = useState({
    specific: [],
    week: [],
  } satisfies Record<typeof type, Temporal.PlainDate[]>)

  useEffect(() => {
    setInnerValue({ ...innerValue, [type]: field.value })
  }, [type, field.value])

  return <Wrapper>
    {label && <Label htmlFor={props.name}>{label}</Label>}
    {description && <Description htmlFor={props.name}>{description}</Description>}

    <ToggleField
      name="calendarMode"
      options={{
        specific: t('form.dates.options.specific'),
        week: t('form.dates.options.week'),
      }}
      value={type}
      onChange={t => {
        setType(t)
        field.onChange(innerValue[t])
      }}
    />

    {type === 'specific' ? (
      <Month value={innerValue.specific} onChange={field.onChange} />
    ) : (
      <Weekdays value={innerValue.week} onChange={field.onChange} />
    )}
  </Wrapper>
}

export default CalendarField

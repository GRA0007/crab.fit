'use client'

import { useRef } from 'react'
import { FieldValues, useController, UseControllerProps } from 'react-hook-form'
import { Temporal } from '@js-temporal/polyfill'

import { Description, Label, Wrapper } from '/src/components/Field/Field'
import { useTranslation } from '/src/i18n/client'
import { useStore } from '/src/stores'
import useSettingsStore from '/src/stores/settingsStore'

import styles from './TimeRangeField.module.scss'

const times = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'] as const

interface TimeRangeFieldProps<TValues extends FieldValues> extends UseControllerProps<TValues> {
  label?: React.ReactNode
  description?: React.ReactNode
  staticValue?: {
    start: number
    end: number
  }
}

const TimeRangeField = <TValues extends FieldValues>({
  label,
  description,
  staticValue,
  ...props
}: TimeRangeFieldProps<TValues>) => {
  const { field: { value, onChange } } = !staticValue
    ? useController(props)
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    : { field: { value: staticValue, onChange: () => {} } }

  if (!('start' in value) || !('end' in value)) return null

  return <Wrapper>
    {label && <Label>{label}</Label>}
    {description && <Description>{description}</Description>}

    <div className={styles.range}>
      <Selection
        start={value.start}
        end={value.start > value.end ? 24 : value.end}
      />
      {value.start > value.end && <Selection
        start={value.start > value.end ? 0 : value.start}
        end={value.end}
      />}

      <Handle
        value={value.start}
        onChange={start => onChange({ ...value, start })}
        labelPadding={value.end - value.start === 1 ? '0 20px' : (value.start - value.end === 1 ? '20px 0' : '0')}
      />

      <Handle
        value={value.end}
        onChange={end => onChange({ ...value, end })}
        labelPadding={value.end - value.start === 1 ? '20px 0' : (value.start - value.end === 1 ? '0 20px' : '0')}
      />
    </div>
  </Wrapper>
}

export default TimeRangeField

const Selection = ({ start, end }: { start: number, end: number }) => <div
  className={styles.selected}
  style={{
    left: `${start * 4.166}%`,
    right: `calc(100% - ${end * 4.166}%)`,
  }}
/>

interface HandleProps {
  value: number
  onChange: (value: number) => void
  labelPadding: string
}

const Handle = ({ value, onChange, labelPadding }: HandleProps) => {
  const timeFormat = useStore(useSettingsStore, state => state.timeFormat)
  const { i18n } = useTranslation()

  const isMoving = useRef(false)
  const rangeRect = useRef({ left: 0, width: 0 })

  const handleMouseMove = (e: MouseEvent) => {
    if (isMoving.current) {
      let step = Math.round(((e.pageX - rangeRect.current.left) / rangeRect.current.width) * 24)
      if (step < 0) step = 0
      if (step > 24) step = 24
      step = Math.abs(step)

      onChange(step)
    }
  }

  return <div
    ref={el => {
      const bb = el?.parentElement?.getBoundingClientRect()
      rangeRect.current = { left: bb?.left ?? 0, width: bb?.width ?? 0 }
    }}
    className={styles.handle}
    style={{
      left: `calc(${value * 4.166}% - 11px)`,
      '--extra-padding': labelPadding,
    } as React.CSSProperties}
    data-label={Temporal.PlainTime.from({ hour: Number(times[value] === '24' ? '00' : times[value]) }).toLocaleString(i18n.language, { hour: 'numeric', hourCycle: timeFormat === '12h' ? 'h12' : 'h24' })}
    onMouseDown={() => {
      document.addEventListener('mousemove', handleMouseMove)
      isMoving.current = true

      document.addEventListener('mouseup', () => {
        isMoving.current = false
        document.removeEventListener('mousemove', handleMouseMove)
      }, { once: true })
    }}
    onTouchMove={e => {
      const touch = e.targetTouches[0]

      let step = Math.round(((touch.pageX - rangeRect.current.left) / rangeRect.current.width) * 24)
      if (step < 0) step = 0
      if (step > 24) step = 24
      step = Math.abs(step)
      onChange(step)
    }}
    tabIndex={0}
    onKeyDown={e => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        onChange(Math.max(value - 1, 0))
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        onChange(Math.min(value + 1, 24))
      }
    }}
  />
}

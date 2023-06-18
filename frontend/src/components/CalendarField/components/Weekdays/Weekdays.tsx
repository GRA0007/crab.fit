import { useCallback, useMemo, useRef, useState } from 'react'
import { range, rotateArray } from '@giraugh/tools'
import { Temporal } from '@js-temporal/polyfill'

import { useTranslation } from '/src/i18n/client'
import { useStore } from '/src/stores'
import useSettingsStore from '/src/stores/settingsStore'
import { makeClass } from '/src/utils'

// Use styles from Month picker
import styles from '../Month/Month.module.scss'

interface WeekdaysProps {
  /** dayOfWeek 1-7 as a string */
  value: string[]
  onChange: (value: string[]) => void
}

const Weekdays = ({ value, onChange }: WeekdaysProps) => {
  const { t, i18n } = useTranslation('home')

  const weekStart = useStore(useSettingsStore, state => state.weekStart) ?? 0

  const weekdays = useMemo(() => rotateArray(range(1, 7).map(i => Temporal.Now.plainDateISO().add({ days: i - Temporal.Now.plainDateISO().dayOfWeek })), weekStart ? 0 : 1), [weekStart])

  // Ref and state required to rerender but also access static version in callbacks
  const selectingRef = useRef<string[]>([])
  const [selecting, _setSelecting] = useState<string[]>([])
  const setSelecting = useCallback((v: string[]) => {
    selectingRef.current = v
    _setSelecting(v)
  }, [])

  const startPos = useRef(0)
  const mode = useRef<'add' | 'remove'>()

  const handleFinishSelection = useCallback(() => {
    if (mode.current === 'add') {
      onChange([...value, ...selectingRef.current])
    } else {
      onChange(value.filter(d => !selectingRef.current.includes(d)))
    }
    mode.current = undefined
  }, [value])

  return <div className={styles.grid}>
    {weekdays.map((day, i) =>
      <button
        type="button"
        className={makeClass(
          styles.date,
          day.equals(Temporal.Now.plainDateISO()) && styles.today,
          (
            (!(mode.current === 'remove' && selecting.includes(day.dayOfWeek.toString())) && value.includes(day.dayOfWeek.toString()))
            || (mode.current === 'add' && selecting.includes(day.dayOfWeek.toString()))
          ) && styles.selected,
        )}
        key={day.toString()}
        title={day.equals(Temporal.Now.plainDateISO()) ? t('form.dates.tooltips.today') : undefined}
        onKeyDown={e => {
          if (e.key === ' ' || e.key === 'Enter') {
            if (value.includes(day.dayOfWeek.toString())) {
              onChange(value.filter(d => d !== day.dayOfWeek.toString()))
            } else {
              onChange([...value, day.dayOfWeek.toString()])
            }
          }
        }}
        onPointerDown={e => {
          startPos.current = i
          mode.current = value.includes(day.dayOfWeek.toString()) ? 'remove' : 'add'
          setSelecting([day.dayOfWeek.toString()])
          e.currentTarget.releasePointerCapture(e.pointerId)

          document.addEventListener('pointerup', handleFinishSelection, { once: true })
        }}
        onPointerEnter={() => {
          if (mode.current) {
            const found = []
            for (let ci = Math.min(startPos.current, i); ci < Math.max(startPos.current, i) + 1; ci++) {
              found.push(weekdays[ci].dayOfWeek.toString())
            }
            setSelecting(found)
          }
        }}
      >{day.toLocaleString(i18n.language, { weekday: 'short' })}</button>
    )}
  </div>
}

export default Weekdays

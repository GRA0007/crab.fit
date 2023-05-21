import { useCallback, useMemo, useRef, useState } from 'react'

import dayjs from '/src/config/dayjs'
import { useTranslation } from '/src/i18n/client'
import useSettingsStore from '/src/stores/settingsStore'
import { makeClass } from '/src/utils'

// Use styles from Month picker
import styles from '../Month/Month.module.scss'

// TODO: use from giraugh tools
export const rotateArray = <T,>(arr: T[], amount = 1): T[] =>
  arr.map((_, i) => arr[((( -amount + i ) % arr.length) + arr.length) % arr.length])

interface WeekdaysProps {
  /** Array of weekdays as numbers from 0-6 (as strings) */
  value: string[]
  onChange: (value: string[]) => void
}

const Weekdays = ({ value, onChange }: WeekdaysProps) => {
  const { t } = useTranslation('home')

  const weekStart = useSettingsStore(state => state.weekStart)

  const weekdays = useMemo(() => rotateArray(dayjs.weekdaysShort().map((name, i) => ({
    name,
    isToday: dayjs().day() === i,
    str: String(i),
  })), -weekStart), [weekStart])

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
          day.isToday && styles.today,
          (
            (!(mode.current === 'remove' && selecting.includes(day.str)) && value.includes(day.str))
            || (mode.current === 'add' && selecting.includes(day.str))
          ) && styles.selected,
        )}
        key={day.name}
        title={day.isToday ? t<string>('form.dates.tooltips.today') : undefined}
        onKeyDown={e => {
          if (e.key === ' ' || e.key === 'Enter') {
            if (value.includes(day.str)) {
              onChange(value.filter(d => d !== day.str))
            } else {
              onChange([...value, day.str])
            }
          }
        }}
        onPointerDown={e => {
          startPos.current = i
          mode.current = value.includes(day.str) ? 'remove' : 'add'
          setSelecting([day.str])
          e.currentTarget.releasePointerCapture(e.pointerId)

          document.addEventListener('pointerup', handleFinishSelection, { once: true })
        }}
        onPointerEnter={() => {
          if (mode.current) {
            const found = []
            for (let ci = Math.min(startPos.current, i); ci < Math.max(startPos.current, i) + 1; ci++) {
              found.push(weekdays[ci].str)
            }
            setSelecting(found)
          }
        }}
      >{day.name}</button>
    )}
  </div>
}

export default Weekdays

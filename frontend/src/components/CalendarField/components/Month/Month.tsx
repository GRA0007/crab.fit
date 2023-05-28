import { useCallback, useMemo, useRef, useState } from 'react'
import { rotateArray } from '@giraugh/tools'
import { Temporal } from '@js-temporal/polyfill'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import Button from '/src/components/Button/Button'
import { useTranslation } from '/src/i18n/client'
import { useStore } from '/src/stores'
import useSettingsStore from '/src/stores/settingsStore'
import { getWeekdayNames, makeClass } from '/src/utils'

import styles from './Month.module.scss'

interface MonthProps {
  /** Stringified PlainDate `YYYY-MM-DD` */
  value: string[]
  onChange: (value: string[]) => void
}

const Month = ({ value, onChange }: MonthProps) => {
  const { t, i18n } = useTranslation('home')

  const weekStart = useStore(useSettingsStore, state => state.weekStart) ?? 1

  const [page, setPage] = useState<Temporal.PlainYearMonth>(Temporal.Now.plainDateISO().toPlainYearMonth())
  const dates = useMemo(() => calculateMonth(page, weekStart), [page, weekStart])

  // Ref and state required to rerender but also access static version in callbacks
  const selectingRef = useRef<string[]>([])
  const [selecting, _setSelecting] = useState<string[]>([])
  const setSelecting = useCallback((v: string[]) => {
    selectingRef.current = v
    _setSelecting(v)
  }, [])

  const startPos = useRef({ x: 0, y: 0 })
  const mode = useRef<'add' | 'remove'>()

  const handleFinishSelection = useCallback(() => {
    if (mode.current === 'add') {
      onChange([...value, ...selectingRef.current])
    } else {
      onChange(value.filter(d => !selectingRef.current.includes(d)))
    }
    mode.current = undefined
  }, [value])

  return <>
    <div className={styles.header}>
      <Button
        title={t<string>('form.dates.tooltips.previous')}
        onClick={() => setPage(page.subtract({ months: 1 }))}
        icon={<ChevronLeft />}
      />
      <span>{page.toPlainDate({ day: 1 }).toLocaleString(i18n.language, { month: 'long', year: 'numeric' })}</span>
      <Button
        title={t<string>('form.dates.tooltips.next')}
        onClick={() => setPage(page.add({ months: 1 }))}
        icon={<ChevronRight />}
      />
    </div>

    <div className={styles.dayLabels}>
      {(rotateArray(getWeekdayNames(i18n.language, 'short'), weekStart)).map(name =>
        <label key={name}>{name}</label>
      )}
    </div>

    <div className={styles.grid}>
      {dates.length > 0 && dates.map((dateRow, y) =>
        dateRow.map((date, x) => <button
          type="button"
          className={makeClass(
            styles.date,
            date.month !== page.month && styles.otherMonth,
            date.equals(Temporal.Now.plainDateISO()) && styles.today,
            (
              (!(mode.current === 'remove' && selecting.includes(date.toString())) && value.includes(date.toString()))
              || (mode.current === 'add' && selecting.includes(date.toString()))
            ) && styles.selected,
          )}
          key={date.toString()}
          title={`${date.toLocaleString(i18n.language, { day: 'numeric', month: 'long' })}${date.equals(Temporal.Now.plainDateISO()) ? ` (${t('form.dates.tooltips.today')})` : ''}`}
          onKeyDown={e => {
            if (e.key === ' ' || e.key === 'Enter') {
              if (value.includes(date.toString())) {
                onChange(value.filter(d => d !== date.toString()))
              } else {
                onChange([...value, date.toString()])
              }
            }
          }}
          onPointerDown={e => {
            startPos.current = { x, y }
            mode.current = value.includes(date.toString()) ? 'remove' : 'add'
            setSelecting([date.toString()])
            e.currentTarget.releasePointerCapture(e.pointerId)

            document.addEventListener('pointerup', handleFinishSelection, { once: true })
          }}
          onPointerEnter={() => {
            if (mode) {
              const found = []
              for (let cy = Math.min(startPos.current.y, y); cy < Math.max(startPos.current.y, y) + 1; cy++) {
                for (let cx = Math.min(startPos.current.x, x); cx < Math.max(startPos.current.x, x) + 1; cx++) {
                  found.push({ y: cy, x: cx })
                }
              }
              setSelecting(found.map(d => dates[d.y][d.x].toString()))
            }
          }}
        >{date.toLocaleString(i18n.language, { day: 'numeric' })}</button>)
      )}
    </div>
  </>
}

export default Month

/** Calculate the dates to show for the month in a 2d array */
const calculateMonth = (month: Temporal.PlainYearMonth, weekStart: 0 | 1) => {
  const daysBefore = month.toPlainDate({ day: 1 }).dayOfWeek - (weekStart ? 0 : 1)
  const daysAfter = 6 - month.toPlainDate({ day: month.daysInMonth }).dayOfWeek + (weekStart ? 0 : 1)

  const dates: Temporal.PlainDate[][] = []
  let curDate = month.toPlainDate({ day: 1 }).subtract({ days: daysBefore })
  let y = 0
  let x = 0
  for (let i = 0; i < daysBefore + month.daysInMonth + daysAfter; i++) {
    if (x === 0) dates[y] = []
    dates[y][x] = curDate
    curDate = curDate.add({ days: 1 })
    x++
    if (x > 6) {
      x = 0
      y++
    }
  }

  return dates
}

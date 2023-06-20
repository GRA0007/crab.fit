import { useCallback, useMemo, useRef, useState } from 'react'
import { rotateArray } from '@giraugh/tools'
import { Temporal } from '@js-temporal/polyfill'
import { AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react'

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

  const weekStart = useStore(useSettingsStore, state => state.weekStart) ?? 0

  const now = useMemo(() => Temporal.Now.plainDateISO(), [])
  const [page, setPage] = useState<Temporal.PlainYearMonth>(now.toPlainYearMonth())
  const dates = useMemo(() => calculateMonth(page, weekStart, i18n.language), [page, weekStart, i18n.language])

  // Ref and state required to rerender but also access static version in callbacks
  const selectingRef = useRef<string[]>([])
  const [selecting, _setSelecting] = useState<string[]>([])
  const setSelecting = useCallback((v: string[]) => {
    selectingRef.current = v
    _setSelecting(v)
  }, [])

  const startPos = useRef({ x: 0, y: 0 })
  const mode = useRef<'add' | 'remove'>()

  // Is 1 or more of the selected dates in the past?
  const hasPastDates = useMemo(() => value
    .some(plainDate => Temporal.PlainDate.compare(
      now, Temporal.PlainDate.from(plainDate)
    ) > 0), [value])

  const handleFinishSelection = useCallback(() => {
    if (mode.current === 'add') {
      onChange([...value, ...selectingRef.current])
    } else {
      onChange(value.filter(d => !selectingRef.current.includes(d)))
    }
    mode.current = undefined
  }, [value])

  return <>
    {useMemo(() => <div className={styles.header}>
      <Button
        title={t('form.dates.tooltips.previous')}
        onClick={() => setPage(page.subtract({ months: 1 }))}
        icon={<ChevronLeft />}
      />
      <span>{page.toPlainDate({ day: 1 }).toLocaleString(i18n.language, { month: 'long', year: 'numeric' })}</span>
      <Button
        title={t('form.dates.tooltips.next')}
        onClick={() => setPage(page.add({ months: 1 }))}
        icon={<ChevronRight />}
      />
    </div>, [page, i18n.language])}

    {useMemo(() => <div className={styles.dayLabels}>
      {(rotateArray(getWeekdayNames(i18n.language, 'short'), weekStart ? 0 : 1)).map(name =>
        <label key={name}>{name}</label>
      )}
    </div>, [i18n.language, weekStart])}

    <div className={styles.grid}>
      {dates.length > 0 && dates.map((dateRow, y) =>
        dateRow.map((date, x) => <button
          type="button"
          className={makeClass(
            styles.date,
            date.month !== page.month && styles.otherMonth,
            date.isToday && styles.today,
            (
              (!(mode.current === 'remove' && selecting.includes(date.string)) && value.includes(date.string))
              || (mode.current === 'add' && selecting.includes(date.string))
            ) && styles.selected,
          )}
          key={date.string}
          title={`${date.title}${date.isToday ? ` (${t('form.dates.tooltips.today')})` : ''}`}
          onKeyDown={e => {
            if (e.key === ' ' || e.key === 'Enter') {
              if (value.includes(date.string)) {
                onChange(value.filter(d => d !== date.string))
              } else {
                onChange([...value, date.string])
              }
            }
          }}
          onPointerDown={e => {
            startPos.current = { x, y }
            mode.current = value.includes(date.string) ? 'remove' : 'add'
            setSelecting([date.string])
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
              setSelecting(found.map(d => dates[d.y][d.x].string))
            }
          }}
        >{date.label}</button>)
      )}
    </div>

    {hasPastDates && <div className={styles.warningLabel}>
      <AlertTriangle size="1.2em" />
      <span>{t('form.dates.warnings.date_in_past')}</span>
    </div>}
  </>
}

export default Month

interface Day {
  month: number
  isToday: boolean
  string: string
  title: string
  label: string
}

/** Calculate the dates to show for the month in a 2d array */
const calculateMonth = (month: Temporal.PlainYearMonth, weekStart: 0 | 1, locale: string) => {
  const today = Temporal.Now.plainDateISO()
  const daysBefore = month.toPlainDate({ day: 1 }).dayOfWeek - weekStart
  const daysAfter = 6 - month.toPlainDate({ day: month.daysInMonth }).dayOfWeek + weekStart

  const dates: Day[][] = []
  let curDate = month.toPlainDate({ day: 1 }).subtract({ days: daysBefore })
  let y = 0
  let x = 0
  for (let i = 0; i < daysBefore + month.daysInMonth + daysAfter; i++) {
    if (x === 0) dates[y] = []
    dates[y][x] = {
      month: curDate.month,
      isToday: curDate.equals(today),
      string: curDate.toString(),
      title: curDate.toLocaleString(locale, { day: 'numeric', month: 'long' }),
      label: curDate.toLocaleString(locale, { day: 'numeric' }),
    }
    curDate = curDate.add({ days: 1 })
    x++
    if (x > 6) {
      x = 0
      y++
    }
  }

  return dates
}

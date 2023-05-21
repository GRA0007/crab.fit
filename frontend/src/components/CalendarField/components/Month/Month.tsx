import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import Button from '/src/components/Button/Button'
import dayjs from '/src/config/dayjs'
import { useTranslation } from '/src/i18n/client'
import { useStore } from '/src/stores'
import useSettingsStore from '/src/stores/settingsStore'
import { makeClass } from '/src/utils'

import styles from './Month.module.scss'

// TODO: use from giraugh tools
export const rotateArray = <T, >(arr: T[], amount = 1): T[] =>
  arr.map((_, i) => arr[((( -amount + i ) % arr.length) + arr.length) % arr.length])

interface MonthProps {
  /** Array of dates in `DDMMYYYY` format */
  value: string[]
  onChange: (value: string[]) => void
}

const Month = ({ value, onChange }: MonthProps) => {
  const { t } = useTranslation('home')

  const weekStart = useStore(useSettingsStore, state => state.weekStart) ?? 0

  const [page, setPage] = useState({
    month: dayjs().month(),
    year: dayjs().year(),
  })
  const [dates, setDates] = useState(calculateMonth(page, weekStart))

  // Ref and state required to rerender but also access static version in callbacks
  const selectingRef = useRef<string[]>([])
  const [selecting, _setSelecting] = useState<string[]>([])
  const setSelecting = useCallback((v: string[]) => {
    selectingRef.current = v
    _setSelecting(v)
  }, [])

  const startPos = useRef({ x: 0, y: 0 })
  const mode = useRef<'add' | 'remove'>()

  // Update month view
  useEffect(() => {
    dayjs.updateLocale(dayjs.locale(), { weekStart })
    setDates(calculateMonth(page, weekStart))
  }, [weekStart, page])

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
        onClick={() => {
          if (page.month - 1 < 0) {
            setPage({ month: 11, year: page.year - 1 })
          } else {
            setPage({ ...page, month: page.month - 1 })
          }
        }}
        icon={<ChevronLeft />}
      />
      <span>{dayjs.months()[page.month]} {page.year}</span>
      <Button
        title={t<string>('form.dates.tooltips.next')}
        onClick={() => {
          if (page.month + 1 > 11) {
            setPage({ month: 0, year: page.year + 1 })
          } else {
            setPage({ ...page, month: page.month + 1 })
          }
        }}
        icon={<ChevronRight />}
      />
    </div>

    <div className={styles.dayLabels}>
      {(rotateArray(dayjs.weekdaysShort(), -weekStart)).map(name =>
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
            date.isToday && styles.today,
            (
              (!(mode.current === 'remove' && selecting.includes(date.str)) && value.includes(date.str))
              || (mode.current === 'add' && selecting.includes(date.str))
            ) && styles.selected,
          )}
          key={date.str}
          title={`${date.day} ${dayjs.months()[date.month]}${date.isToday ? ` (${t('form.dates.tooltips.today')})` : ''}`}
          onKeyDown={e => {
            if (e.key === ' ' || e.key === 'Enter') {
              if (value.includes(date.str)) {
                onChange(value.filter(d => d !== date.str))
              } else {
                onChange([...value, date.str])
              }
            }
          }}
          onPointerDown={e => {
            startPos.current = { x, y }
            mode.current = value.includes(date.str) ? 'remove' : 'add'
            setSelecting([date.str])
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
              setSelecting(found.map(d => dates[d.y][d.x].str))
            }
          }}
        >{date.day}</button>)
      )}
    </div>
  </>
}

export default Month

interface Date {
  str: string
  day: number
  month: number
  isToday: boolean
}

/** Calculate the dates to show for the month in a 2d array */
const calculateMonth = ({ month, year }: { month: number, year: number }, weekStart: 0 | 1) => {
  const date = dayjs().month(month).year(year)
  const daysInMonth = date.daysInMonth()
  const daysBefore = date.date(1).day() - weekStart
  const daysAfter = 6 - date.date(daysInMonth).day() + weekStart

  const dates: Date[][] = []
  let curDate = date.date(1).subtract(daysBefore, 'day')
  let y = 0
  let x = 0
  for (let i = 0; i < daysBefore + daysInMonth + daysAfter; i++) {
    if (x === 0) dates[y] = []
    dates[y][x] = {
      str: curDate.format('DDMMYYYY'),
      day: curDate.date(),
      month: curDate.month(),
      isToday: curDate.isToday(),
    }
    curDate = curDate.add(1, 'day')
    x++
    if (x > 6) {
      x = 0
      y++
    }
  }

  return dates
}

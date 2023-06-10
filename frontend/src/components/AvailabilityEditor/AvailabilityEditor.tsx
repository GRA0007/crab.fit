import { Fragment, useCallback, useMemo, useRef, useState } from 'react'

import Content from '/src/components/Content/Content'
import GoogleCalendar from '/src/components/GoogleCalendar/GoogleCalendar'
import { usePalette } from '/src/hooks/usePalette'
import { useTranslation } from '/src/i18n/client'
import { useStore } from '/src/stores'
import useSettingsStore from '/src/stores/settingsStore'
import { calculateTable, makeClass, parseSpecificDate } from '/src/utils'

import styles from '../AvailabilityViewer/AvailabilityViewer.module.scss'

interface AvailabilityEditorProps {
  times: string[]
  timezone: string
  value: string[]
  onChange: (value: string[]) => void
}

const AvailabilityEditor = ({
  times,
  timezone,
  value = [],
  onChange,
}: AvailabilityEditorProps) => {
  const { t, i18n } = useTranslation('event')

  const timeFormat = useStore(useSettingsStore, state => state.timeFormat) ?? '12h'

  // Calculate table
  const { rows, columns } = useMemo(() =>
    calculateTable(times, i18n.language, timeFormat, timezone),
  [times, i18n.language, timeFormat, timezone])

  // Ref and state required to rerender but also access static version in callbacks
  const selectingRef = useRef<string[]>([])
  const [selecting, _setSelecting] = useState<string[]>([])
  const setSelecting = useCallback((v: string[]) => {
    selectingRef.current = v
    _setSelecting(v)
  }, [])

  const startPos = useRef({ x: 0, y: 0 })
  const mode = useRef<'add' | 'remove'>()

  // Create the colour palette
  const palette = usePalette(2)

  return <>
    <Content isCentered>{t('you.info')}</Content>
    {times[0].length === 13 && <Content>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <GoogleCalendar
          timezone={timezone}
          timeStart={parseSpecificDate(times[0])}
          timeEnd={parseSpecificDate(times[times.length - 1]).add({ minutes: 15 })}
          times={times}
          onImport={onChange}
        />
      </div>
    </Content>}

    <div className={styles.wrapper}>
      <div>
        <div className={styles.heatmap}>
          <div className={styles.timeLabels}>
            {rows.map((row, i) =>
              <div className={styles.timeSpace} key={i}>
                {row && <label className={styles.timeLabel}>
                  {row.label}
                </label>}
              </div>
            )}
          </div>

          {columns.map((column, x) => <Fragment key={x}>
            {column ? <div className={styles.dateColumn}>
              {column.header.dateLabel && <label className={styles.dateLabel}>{column.header.dateLabel}</label>}
              <label className={styles.dayLabel}>{column.header.weekdayLabel}</label>

              <div
                className={styles.times}
                data-border-left={x === 0 || columns.at(x - 1) === null}
                data-border-right={x === columns.length - 1 || columns.at(x + 1) === null}
              >
                {column.cells.map((cell, y) => {
                  if (y === column.cells.length - 1) return null

                  if (!cell) return <div
                    className={makeClass(styles.timeSpace, styles.grey)}
                    key={y}
                    title={t<string>('greyed_times')}
                  />

                  const isSelected = (
                    (!(mode.current === 'remove' && selecting.includes(cell.serialized)) && value.includes(cell.serialized))
                    || (mode.current === 'add' && selecting.includes(cell.serialized))
                  )

                  return <div
                    key={y}
                    className={makeClass(styles.time, selecting.length === 0 && styles.editable)}
                    style={{
                      backgroundColor: isSelected ? palette[1].string : palette[0].string,
                      '--hover-color': isSelected ? palette[0].highlight : palette[1].highlight,
                      ...cell.minute !== 0 && cell.minute !== 30 && { borderTopColor: 'transparent' },
                      ...cell.minute === 30 && { borderTopStyle: 'dotted' },
                    } as React.CSSProperties}
                    onPointerDown={e => {
                      e.preventDefault()
                      startPos.current = { x, y }
                      mode.current = value.includes(cell.serialized) ? 'remove' : 'add'
                      setSelecting([cell.serialized])
                      e.currentTarget.releasePointerCapture(e.pointerId)

                      document.addEventListener('pointerup', () => {
                        if (mode.current === 'add') {
                          onChange([...value, ...selectingRef.current])
                        } else if (mode.current === 'remove') {
                          onChange(value.filter(t => !selectingRef.current.includes(t)))
                        }
                        setSelecting([])
                        mode.current = undefined
                      }, { once: true })
                    }}
                    onPointerEnter={() => {
                      if (mode.current) {
                        const found = []
                        for (let cy = Math.min(startPos.current.y, y); cy < Math.max(startPos.current.y, y) + 1; cy++) {
                          for (let cx = Math.min(startPos.current.x, x); cx < Math.max(startPos.current.x, x) + 1; cx++) {
                            found.push({ y: cy, x: cx })
                          }
                        }
                        setSelecting(found.flatMap(d => {
                          const serialized = columns[d.x]?.cells[d.y]?.serialized
                          if (serialized && times.includes(serialized)) {
                            return [serialized]
                          }
                          return []
                        }))
                      }
                    }}
                  />
                })}
              </div>
            </div> : <div className={styles.columnSpacer} />}
          </Fragment>)}
        </div>
      </div>
    </div>
  </>
}

export default AvailabilityEditor

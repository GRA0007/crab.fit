import { Fragment, useCallback, useMemo, useRef, useState } from 'react'
import { createPalette } from 'hue-map'

import Content from '/src/components/Content/Content'
import { useTranslation } from '/src/i18n/client'
import { useStore } from '/src/stores'
import useSettingsStore from '/src/stores/settingsStore'
import { calculateColumns, calculateRows, convertTimesToDates, makeClass, serializeTime } from '/src/utils'

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

  const timeFormat = useStore(useSettingsStore, state => state.timeFormat)
  const colormap = useStore(useSettingsStore, state => state.colormap)

  // Calculate rows and columns
  const [dates, rows, columns] = useMemo(() => {
    const dates = convertTimesToDates(times, timezone)
    return [dates, calculateRows(dates), calculateColumns(dates)]
  }, [times, timezone])

  // Ref and state required to rerender but also access static version in callbacks
  const selectingRef = useRef<string[]>([])
  const [selecting, _setSelecting] = useState<string[]>([])
  const setSelecting = useCallback((v: string[]) => {
    selectingRef.current = v
    _setSelecting(v)
  }, [])

  const startPos = useRef({ x: 0, y: 0 })
  const mode = useRef<'add' | 'remove'>()

  // Is specific dates or just days of the week
  const isSpecificDates = useMemo(() => times[0].length === 13, [times])

  const palette = useMemo(() => createPalette({
    map: colormap !== 'crabfit' ? colormap : [[0, [247, 158, 0, 0]], [1, [247, 158, 0, 255]]],
    steps: 2,
  }).format(), [colormap])

  return <>
    <Content isCentered>{t('you.info')}</Content>
    {/* {isSpecificDates && (
      <StyledMain>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <Suspense fallback={<Loader />}>
            <GoogleCalendar
              timeMin={dayjs(times[0], 'HHmm-DDMMYYYY').toISOString()}
              timeMax={dayjs(times[times.length - 1], 'HHmm-DDMMYYYY').add(15, 'm').toISOString()}
              timeZone={timezone}
              onImport={busyArray => onChange(
                times.filter(time => !busyArray.some(busy =>
                  dayjs(time, 'HHmm-DDMMYYYY').isBetween(busy.start, busy.end, null, '[)')
                ))
              )}
            />
            <OutlookCalendar
              timeMin={dayjs(times[0], 'HHmm-DDMMYYYY').toISOString()}
              timeMax={dayjs(times[times.length - 1], 'HHmm-DDMMYYYY').add(15, 'm').toISOString()}
              timeZone={timezone}
              onImport={busyArray => onChange(
                times.filter(time => !busyArray.some(busy =>
                  dayjs(time, 'HHmm-DDMMYYYY').isBetween(dayjs.tz(busy.start.dateTime, busy.start.timeZone), dayjs.tz(busy.end.dateTime, busy.end.timeZone), null, '[)')
                ))
              )}
            />
          </Suspense>
        </div>
      </StyledMain>
    )} */}

    <div className={styles.wrapper}>
      <div>
        <div className={styles.heatmap}>
          <div className={styles.timeLabels}>
            {rows.map((row, i) =>
              <div className={styles.timeSpace} key={i}>
                {row && row.minute === 0 && <label className={styles.timeLabel}>
                  {row.toLocaleString(i18n.language, { hour: 'numeric', hour12: timeFormat === '12h' })}
                </label>}
              </div>
            )}
          </div>

          {columns.map((column, x) => <Fragment key={x}>
            {column ? <div className={styles.dateColumn}>
              {isSpecificDates && <label className={styles.dateLabel}>{column.toLocaleString(i18n.language, { month: 'short', day: 'numeric' })}</label>}
              <label className={styles.dayLabel}>{column.toLocaleString(i18n.language, { weekday: 'short' })}</label>

              <div
                className={styles.times}
                data-border-left={x === 0 || columns.at(x - 1) === null}
                data-border-right={x === columns.length - 1 || columns.at(x + 1) === null}
              >
                {rows.map((row, y) => {
                  if (y === rows.length - 1) return null

                  if (!row || rows.at(y + 1) === null || dates.every(d => !d.equals(column.toZonedDateTime({ timeZone: timezone, plainTime: row })))) {
                    return <div
                      className={makeClass(styles.timeSpace, styles.grey)}
                      key={y}
                      title={t<string>('greyed_times')}
                    />
                  }

                  const date = column.toZonedDateTime({ timeZone: timezone, plainTime: row })

                  return <div
                    key={y}
                    className={styles.time}
                    style={{
                      backgroundColor: (
                        (!(mode.current === 'remove' && selecting.includes(serializeTime(date, isSpecificDates))) && value.includes(serializeTime(date, isSpecificDates)))
                        || (mode.current === 'add' && selecting.includes(serializeTime(date, isSpecificDates)))
                      ) ? palette[1] : palette[0],
                      ...date.minute !== 0 && date.minute !== 30 && { borderTopColor: 'transparent' },
                      ...date.minute === 30 && { borderTopStyle: 'dotted' },
                    }}
                    onPointerDown={e => {
                      e.preventDefault()
                      startPos.current = { x, y }
                      mode.current = value.includes(serializeTime(date, isSpecificDates)) ? 'remove' : 'add'
                      setSelecting([serializeTime(date, isSpecificDates)])
                      e.currentTarget.releasePointerCapture(e.pointerId)

                      document.addEventListener('pointerup', () => {
                        if (mode.current === 'add') {
                          onChange([...value, ...selectingRef.current])
                        } else if (mode.current === 'remove') {
                          onChange(value.filter(t => !selectingRef.current.includes(t)))
                        }
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
                          const [time, date] = [rows[d.y], columns[d.x]]
                          if (time !== null && date !== null) {
                            const str = serializeTime(date.toZonedDateTime({ timeZone: timezone, plainTime: time }), isSpecificDates)
                            if (times.includes(str)) {
                              return [str]
                            }
                            return []
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

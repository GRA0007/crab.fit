'use client'

import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { Temporal } from '@js-temporal/polyfill'
import { createPalette } from 'hue-map'

import Content from '/src/components/Content/Content'
import Legend from '/src/components/Legend/Legend'
import { PersonResponse } from '/src/config/api'
import { useTranslation } from '/src/i18n/client'
import { useStore } from '/src/stores'
import useSettingsStore from '/src/stores/settingsStore'
import { calculateAvailability, calculateColumns, calculateRows, convertTimesToDates, makeClass, relativeTimeFormat } from '/src/utils'

import styles from './AvailabilityViewer.module.scss'

interface AvailabilityViewerProps {
  times: string[]
  timezone: string
  people: PersonResponse[]
}

const AvailabilityViewer = ({ times, timezone, people }: AvailabilityViewerProps) => {
  const { t, i18n } = useTranslation('event')

  const timeFormat = useStore(useSettingsStore, state => state.timeFormat)
  const highlight = useStore(useSettingsStore, state => state.highlight)
  const colormap = useStore(useSettingsStore, state => state.colormap)
  const [filteredPeople, setFilteredPeople] = useState(people.map(p => p.name))
  const [tempFocus, setTempFocus] = useState<string>()
  const [focusCount, setFocusCount] = useState<number>()

  const wrapperRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<{
    x: number
    y: number
    available: string
    date: string
    people: string[]
  }>()

  // Calculate rows and columns
  const [dates, rows, columns] = useMemo(() => {
    const dates = convertTimesToDates(times, timezone)
    return [dates, calculateRows(dates), calculateColumns(dates)]
  }, [times, timezone])

  // Calculate availabilities
  const { availabilities, min, max } = useMemo(() => calculateAvailability(dates, people
    .filter(p => filteredPeople.includes(p.name))
    .map(p => ({
      ...p,
      availability: convertTimesToDates(p.availability, timezone),
    }))
  ), [dates, filteredPeople, people, timezone])

  // Is specific dates or just days of the week
  const isSpecificDates = useMemo(() => times[0].length === 13, [times])

  // Create the colour palette
  const [palette, setPalette] = useState<string[]>([])
  useEffect(() => {
    setPalette(createPalette({
      map: colormap !== 'crabfit' ? colormap : [[0, [247, 158, 0, 0]], [1, [247, 158, 0, 255]]],
      steps: Math.max((max - min) + 1, 2),
    }).format())
  }, [min, max, colormap])

  const heatmap = useMemo(() => (
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

      {columns.map((column, i) => <Fragment key={i}>
        {column ? <div className={styles.dateColumn}>
          {isSpecificDates && <label className={styles.dateLabel}>{column.toLocaleString(i18n.language, { month: 'short', day: 'numeric' })}</label>}
          <label className={styles.dayLabel}>{column.toLocaleString(i18n.language, { weekday: 'short' })}</label>

          <div
            className={styles.times}
            data-border-left={i === 0 || columns.at(i - 1) === null}
            data-border-right={i === columns.length - 1 || columns.at(i + 1) === null}
          >
            {rows.map((row, i) => {
              if (i === rows.length - 1) return null

              if (!row || rows.at(i + 1) === null || dates.every(d => !d.equals(column.toZonedDateTime({ timeZone: timezone, plainTime: row })))) {
                return <div
                  className={makeClass(styles.timeSpace, styles.grey)}
                  key={i}
                  title={t<string>('greyed_times')}
                />
              }

              const date = column.toZonedDateTime({ timeZone: timezone, plainTime: row })
              let peopleHere = availabilities.find(a => a.date.equals(date))?.people ?? []
              if (tempFocus) {
                peopleHere = peopleHere.filter(p => p === tempFocus)
              }

              return <div
                key={i}
                className={makeClass(
                  styles.time,
                  (focusCount === undefined || focusCount === peopleHere.length) && highlight && (peopleHere.length === max || tempFocus) && peopleHere.length > 0 && styles.highlight,
                )}
                style={{
                  backgroundColor: (focusCount === undefined || focusCount === peopleHere.length) ? palette[tempFocus && peopleHere.length ? max : peopleHere.length] : 'transparent',
                  ...date.minute !== 0 && date.minute !== 30 && { borderTopColor: 'transparent' },
                  ...date.minute === 30 && { borderTopStyle: 'dotted' },
                }}
                aria-label={peopleHere.join(', ')}
                onMouseEnter={e => {
                  const cellBox = e.currentTarget.getBoundingClientRect()
                  const wrapperBox = wrapperRef.current?.getBoundingClientRect() ?? { x: 0, y: 0 }
                  setTooltip({
                    x: Math.round(cellBox.x - wrapperBox.x + cellBox.width / 2),
                    y: Math.round(cellBox.y - wrapperBox.y + cellBox.height) + 6,
                    available: `${peopleHere.length} / ${filteredPeople.length} ${t('available')}`,
                    date: isSpecificDates
                      ? date.toLocaleString(i18n.language, { dateStyle: 'long', timeStyle: 'short', hour12: timeFormat === '12h' })
                      : `${date.toLocaleString(i18n.language, { timeStyle: 'short', hour12: timeFormat === '12h' })}, ${date.toLocaleString(i18n.language, { weekday: 'long' })}`,
                    people: peopleHere,
                  })
                }}
                onMouseLeave={() => setTooltip(undefined)}
              />
            })}
          </div>
        </div> : <div className={styles.columnSpacer} />}
      </Fragment>)}
    </div>
  ), [
    availabilities,
    dates,
    isSpecificDates,
    rows,
    columns,
    highlight,
    max,
    t,
    timeFormat,
    palette,
    tempFocus,
    focusCount,
    filteredPeople,
    i18n.language,
    timezone,
  ])

  return <>
    <Content>
      <Legend
        min={min}
        max={max}
        total={filteredPeople.length}
        palette={palette}
        onSegmentFocus={setFocusCount}
      />

      <span className={styles.info}>{t('group.info1')}</span>

      {people.length > 1 && <>
        <span className={styles.info}>{t('group.info2')}</span>
        <div className={styles.people}>
          {people.map(person =>
            <button
              type="button"
              className={makeClass(
                styles.person,
                filteredPeople.includes(person.name) && styles.personSelected,
              )}
              key={person.name}
              onClick={() => {
                setTempFocus(undefined)
                if (filteredPeople.includes(person.name)) {
                  setFilteredPeople(filteredPeople.filter(n => n !== person.name))
                } else {
                  setFilteredPeople([...filteredPeople, person.name])
                }
              }}
              onMouseOver={() => setTempFocus(person.name)}
              onMouseOut={() => setTempFocus(undefined)}
              title={relativeTimeFormat(Temporal.Instant.fromEpochSeconds(person.created_at), i18n.language)}
            >{person.name}</button>
          )}
        </div>
      </>}
    </Content>

    <div className={styles.wrapper} ref={wrapperRef}>
      <div>
        {heatmap}

        {tooltip && <div
          className={styles.tooltip}
          style={{ top: tooltip.y, left: tooltip.x }}
        >
          <h3>{tooltip.available}</h3>
          <span>{tooltip.date}</span>
          {!!filteredPeople.length && <div>
            {tooltip.people.map(person => <span key={person}>{person}</span>)}
            {filteredPeople.filter(p => !tooltip.people.includes(p)).map(person =>
              <span key={person} data-disabled>{person}</span>
            )}
          </div>}
        </div>}
      </div>
    </div>
  </>
}

export default AvailabilityViewer

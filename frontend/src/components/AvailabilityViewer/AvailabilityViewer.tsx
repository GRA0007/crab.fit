'use client'

import { Fragment, useEffect, useMemo, useState } from 'react'
import { Temporal } from '@js-temporal/polyfill'
import { createPalette } from 'hue-map'

import Content from '/src/components/Content/Content'
import Legend from '/src/components/Legend/Legend'
import { PersonResponse } from '/src/config/api'
import { useTranslation } from '/src/i18n/client'
import { useStore } from '/src/stores'
import useSettingsStore from '/src/stores/settingsStore'
import { calculateAvailability, calculateColumns, calculateRows, convertTimesToDates, makeClass } from '/src/utils'

import styles from './AvailabilityViewer.module.scss'

interface AvailabilityViewerProps {
  times: string[]
  timezone: string
  people: PersonResponse[]
}

const AvailabilityViewer = ({ times, timezone, people }: AvailabilityViewerProps) => {
  const { t, i18n } = useTranslation('event')

  // const [tooltip, setTooltip] = useState(null)
  const timeFormat = useStore(useSettingsStore, state => state.timeFormat)
  const highlight = useStore(useSettingsStore, state => state.highlight)
  const colormap = useStore(useSettingsStore, state => state.colormap)
  const [filteredPeople, setFilteredPeople] = useState(people.map(p => p.name))
  // const [tempFocus, setTempFocus] = useState(null)
  // const [focusCount, setFocusCount] = useState(null)

  // const wrapper = useRef()

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
      steps: (max - min) + 1,
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
              const peopleHere = availabilities.find(a => a.date.equals(date))?.people ?? []

              return <div
                key={i}
                className={makeClass(
                  styles.time,
                  highlight && peopleHere.length === max && peopleHere.length > 0 && styles.highlight,
                )}
                style={{
                  backgroundColor: palette[peopleHere.length],
                  ...date.minute !== 0 && date.minute !== 30 && { borderTopColor: 'transparent' },
                  ...date.minute === 30 && { borderTopStyle: 'dotted' },
                }}
                aria-label={peopleHere.join(', ')}
                // onMouseEnter={e => {
                //   const cellBox = e.currentTarget.getBoundingClientRect()
                //   const wrapperBox = wrapper?.current?.getBoundingClientRect() ?? { x: 0, y: 0 }
                //   const timeText = timeFormat === '12h' ? `h${locales[locale]?.separator ?? ':'}mma` : `HH${locales[locale]?.separator ?? ':'}mm`
                //   setTooltip({
                //     x: Math.round(cellBox.x - wrapperBox.x + cellBox.width / 2),
                //     y: Math.round(cellBox.y - wrapperBox.y + cellBox.height) + 6,
                //     available: `${peopleHere.length} / ${filteredPeople.length} ${t('event:available')}`,
                //     date: parsedDate.hour(time.slice(0, 2)).minute(time.slice(2, 4)).format(isSpecificDates ? `${timeText} ddd, D MMM YYYY` : `${timeText} ddd`),
                //     people: peopleHere,
                //   })
                // }}
                // onMouseLeave={() => {
                //   setTooltip(null)
                // }}
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
  ])

  return <>
    <Content>
      <Legend
        min={min}
        max={max}
        total={filteredPeople.length}
        palette={palette}
        onSegmentFocus={console.log}
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
              // onClick={() => {
              //   setTempFocus(null)
              //   if (filteredPeople.includes(person.name)) {
              //     if (!touched) {
              //       setTouched(true)
              //       setFilteredPeople([person.name])
              //     } else {
              //       setFilteredPeople(filteredPeople.filter(n => n !== person.name))
              //     }
              //   } else {
              //     setFilteredPeople([...filteredPeople, person.name])
              //   }
              // }}
              // onMouseOver={() => setTempFocus(person.name)}
              // onMouseOut={() => setTempFocus(null)}
              title={Temporal.Instant.fromEpochSeconds(person.created_at).until(Temporal.Now.instant()).toLocaleString()}
            >{person.name}</button>
          )}
        </div>
      </>}
    </Content>

    <div className={styles.wrapper}>
      <div>
        {heatmap}

        {/* {tooltip && (
          <Tooltip
            $x={tooltip.x}
            $y={tooltip.y}
          >
            <TooltipTitle>{tooltip.available}</TooltipTitle>
            <TooltipDate>{tooltip.date}</TooltipDate>
            {!!filteredPeople.length && (
              <TooltipContent>
                {tooltip.people.map(person =>
                  <TooltipPerson key={person}>{person}</TooltipPerson>
                )}
                {filteredPeople.filter(p => !tooltip.people.includes(p)).map(person =>
                  <TooltipPerson key={person} disabled>{person}</TooltipPerson>
                )}
              </TooltipContent>
            )}
          </Tooltip>
        )} */}
      </div>
    </div>
  </>
}

export default AvailabilityViewer

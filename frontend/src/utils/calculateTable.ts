import { calculateColumns } from '/src/utils/calculateColumns'
import { calculateRows } from '/src/utils/calculateRows'
import { convertTimesToDates } from '/src/utils/convertTimesToDates'
import { serializeTime } from '/src/utils/serializeTime'

export interface CalculateTableArgs {
  /** As `HHmm-DDMMYYYY` or `HHmm-d` strings */
  times: string[]
  locale: string
  timeFormat: '12h' | '24h'
  timezone: string
}

/**
 * Take rows and columns and turn them into a data structure representing an availability table
 */
export const calculateTable = ({
  /** As `HHmm-DDMMYYYY` or `HHmm-d` strings */
  times,
  locale,
  timeFormat,
  timezone,
}: CalculateTableArgs) => {
  const dates = convertTimesToDates(times, timezone)
  const rows = calculateRows(dates)
  const columns = calculateColumns(dates)

  // Is specific dates or just days of the week
  const isSpecificDates = times[0]?.length === 13

  return {
    rows: rows.map(row => row && row.minute === 0 ? {
      label: row.toLocaleString(locale, { hour: 'numeric', hourCycle: timeFormat === '12h' ? 'h12' : 'h24' }),
      string: row.toString(),
    } : null),

    columns: columns.map(column => column ? {
      header: {
        dateLabel: isSpecificDates ? column.toLocaleString(locale, { month: 'short', day: 'numeric' }) : undefined,
        weekdayLabel: column.toLocaleString(locale, { weekday: 'short' }),
        string: column.toString(),
      },
      cells: rows.map(row => {
        if (!row) return null
        const date = column.toZonedDateTime({ timeZone: timezone, plainTime: row })
        const serialized = serializeTime(date, isSpecificDates)

        // Cell not in dates
        if (!times.includes(serialized)) return null

        return {
          serialized,
          minute: date.minute,
          label: isSpecificDates
            ? date.toLocaleString(locale, { dateStyle: 'long', timeStyle: 'short', hourCycle: timeFormat === '12h' ? 'h12' : 'h24' })
            : `${date.toLocaleString(locale, { timeStyle: 'short', hourCycle: timeFormat === '12h' ? 'h12' : 'h24' })}, ${date.toLocaleString(locale, { weekday: 'long' })}`,
        }
      })
    } : null)
  }
}

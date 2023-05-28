import { Temporal } from '@js-temporal/polyfill'

/**
 * Take times as strings in UTC and convert to ZonedDateTime objects in the timezone supplied
 * @param times An array of strings in `HHmm-d` or `HHmm-DDMMYYYY` format
 * @param timezone The target timezone
 */
export const convertTimesToDates = (times: string[], timezone: string): Temporal.ZonedDateTime[] => {
  const isSpecificDates = times[0].length === 13

  return times.map(time => isSpecificDates ?
    parseSpecificDate(time).withTimeZone(timezone)
    : parseWeekdayDate(time).withTimeZone(timezone)
  )
}

// Parse from UTC `HHmm-DDMMYYYY` format into a ZonedDateTime in UTC
const parseSpecificDate = (str: string): Temporal.ZonedDateTime => {
  if (str.length !== 13) {
    throw new Error('String must be in HHmm-DDMMYYYY format')
  }

  // Extract values
  const [hour, minute] = [Number(str.substring(0, 2)), Number(str.substring(2, 4))]
  const [day, month, year] = [Number(str.substring(5, 7)), Number(str.substring(7, 9)), Number(str.substring(9))]

  // Construct PlainDateTime
  return Temporal.ZonedDateTime.from({
    hour, minute, day, month, year,
    timeZone: 'UTC',
  })
}

// Parse from UTC `HHmm-d` format into a ZonedDateTime in UTC based on the current date
const parseWeekdayDate = (str: string): Temporal.ZonedDateTime => {
  if (str.length !== 6) {
    throw new Error('String must be in HHmm-d format')
  }

  // Extract values
  const [hour, minute] = [Number(str.substring(0, 2)), Number(str.substring(2, 4))]
  let dayOfWeek = Number(str.substring(5))
  if (dayOfWeek === 0) {
    dayOfWeek = 7 // Sunday is 7 in ISO8601
  }

  // Construct PlainDateTime from today
  const today = Temporal.Now.zonedDateTimeISO('UTC').round('day')
  const currentDayOfWeek = today.dayOfWeek
  return today.with({
    hour, minute,
    day: today.day + (dayOfWeek - currentDayOfWeek), // Set day of week
  })
}

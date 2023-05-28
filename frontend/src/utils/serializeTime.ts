import { Temporal } from '@js-temporal/polyfill'

/**
 * Takes a ZonedDateTime in any timezone, and serializes it in UTC
 * @param isSpecificDates Whether to format at `HHmm-DDMMYYYY` or `HHmm-d`
 * @returns Time serialized to UTC
 */
export const serializeTime = (time: Temporal.ZonedDateTime, isSpecificDates: boolean) => {
  const t = time.withTimeZone('UTC')
  const [hour, minute, day, month] = [t.hour, t.minute, t.day, t.month].map(x => x.toString().padStart(2, '0'))
  const [year, dayOfWeek] = [t.year.toString().padStart(4, '0'), (t.dayOfWeek === 7 ? 0 : t.dayOfWeek).toString()]

  return isSpecificDates
    ? `${hour}${minute}-${day}${month}${year}`
    : `${hour}${minute}-${dayOfWeek}`
}

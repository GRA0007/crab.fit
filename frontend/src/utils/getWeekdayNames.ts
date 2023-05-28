import { Temporal } from '@js-temporal/polyfill'

/**
 * Get the days of the week in a chosen locale.
 * Note, this is brittle and will not work for additional calendars.
 */
export const getWeekdayNames = (locale: string, fmt: Intl.DateTimeFormatOptions['weekday'] = 'long') => {
  // In ISO8601 (proleptic gregorian)
  const knownMonday = Temporal.PlainDate.from({ year: 2023, month: 1, day: 2 })

  return Array.from({ length: 7 })
    .map((_, i) => knownMonday.add({ days: i }).toLocaleString(locale, { weekday: fmt }))
}

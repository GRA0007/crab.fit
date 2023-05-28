import { Temporal } from '@js-temporal/polyfill'

const units = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'] as const

export const relativeTimeFormat = (instant: Temporal.Instant, locale: string, fmtOptions: Intl.RelativeTimeFormatOptions = { style: 'long' }) => {
  const fmt = new Intl.RelativeTimeFormat(locale, fmtOptions)
  const duration = instant.since(Temporal.Now.instant(), { smallestUnit: 'seconds' })
    .round({ largestUnit: 'years', relativeTo: instant.toZonedDateTimeISO(Temporal.Now.timeZoneId()) })

  // Format to the largest unit
  const unit = units.find(u => Math.abs(duration[u]) > 0) ?? units[units.length - 1]
  return fmt.format(duration[unit], unit)
}

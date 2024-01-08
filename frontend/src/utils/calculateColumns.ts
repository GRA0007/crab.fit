import { splitArrayBy } from '@giraugh/tools'
import { Temporal } from '@js-temporal/polyfill'

/**
 * Calculates the columns required for an availability grid
 * @returns An array of PlainDate or null, where null indicates a spacer column between dates
 */
export const calculateColumns = (dates: Temporal.ZonedDateTime[], isSpecificDates: Boolean): (Temporal.PlainDate | null)[] => {
  // Dedupe dates by date and sort
  let sortedDates = Array.from(new Map(dates.map(d => {
    const plain = d.toPlainDate()
    return [plain.toString(), plain]
  })).values())
    .sort(Temporal.PlainDate.compare)


  // Dedupe days of the week
  if (!isSpecificDates) {
    const dayOfWeekMapping: Record<number, Temporal.PlainDate> = {};
    sortedDates.forEach((d)  => {
      let weekday = d.dayOfWeek
      if (!dayOfWeekMapping[weekday]) {
        dayOfWeekMapping[weekday] = d
      }
    })

    sortedDates = Object.values(dayOfWeekMapping);
  }

  // Partition by distance
  const partitionedDates = splitArrayBy(sortedDates, (a, b) => !a.add({ days: 1 }).equals(b))

  // Join
  return partitionedDates.reduce((columns, partition, i) => [
    ...columns,
    ...partition,
    ...i < partitionedDates.length - 1 ? [null] : [], // Add spacer in between partitions
  ], [] as (Temporal.PlainDate | null)[])
}

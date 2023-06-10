import { splitArrayBy } from '@giraugh/tools'
import { Temporal } from '@js-temporal/polyfill'

/**
 * Calculates the rows required for an availability grid
 * @returns An array of PlainTime or null, where null indicates a spacer row in gaps
 */
export const calculateRows = (dates: Temporal.ZonedDateTime[]): (Temporal.PlainTime | null)[] => {
  // Dedupe dates by time and sort
  const sortedDates = [...new Map(dates.map(d => {
    const plain = d.toPlainTime()
    return [plain.toString({ smallestUnit: 'minute' }), plain]
  })).values()]
    .sort(Temporal.PlainTime.compare)

  // Partition by distance
  const partitionedDates = splitArrayBy(sortedDates, (a, b) => !a.add({ minutes: 15 }).equals(b))

  // Add end cap time and join
  return partitionedDates.reduce((rows, partition, i) => [
    ...rows,
    ...partition,
    partition[partition.length - 1].add({ minutes: 15 }),
    ...i < partitionedDates.length - 1 ? [null, null] : [], // Add spacer in between partitions
  ], [] as (Temporal.PlainTime | null)[])
}

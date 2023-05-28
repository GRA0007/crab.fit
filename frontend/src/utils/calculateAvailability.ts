import { Temporal } from '@js-temporal/polyfill'

interface Person {
  name: string
  availability: Temporal.ZonedDateTime[]
}

interface Availability {
  date: Temporal.ZonedDateTime
  /** Names of everyone who is available at this date */
  people: string[]
}

interface AvailabilityInfo {
  availabilities: Availability[]
  /** The amount of people available in the date with lowest availability */
  min: number
  /** The amount of people available in the date with highest availability */
  max: number
}

/**
 * Takes an array of dates and an array of people,
 * where each person has a name and availability array, and returns the
 * group availability for each date passed in.
 */
export const calculateAvailability = (dates: Temporal.ZonedDateTime[], people: Person[]): AvailabilityInfo => {
  let min = Infinity
  let max = -Infinity

  const availabilities: Availability[] = dates.map(date => {
    const names = people.flatMap(p => p.availability.some(d => d.equals(date)) ? [p.name] : [])
    if (names.length < min) {
      min = names.length
    }
    if (names.length > max) {
      max = names.length
    }
    return { date, people: names }
  })

  return { availabilities, min, max }
}

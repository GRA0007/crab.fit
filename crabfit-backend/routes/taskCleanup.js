import dayjs from 'dayjs'
import { Event, Person } from '../model'

const taskCleanup = async (req, res) => {
  if (req.header('X-Appengine-Cron') === undefined) {
    return res.status(400).send({ error: 'This task can only be run from a cron job' })
  }

  const threeMonthsAgo = dayjs().subtract(3, 'month').unix()

  console.log(`Running cleanup task at ${dayjs().format('h:mma D MMM YYYY')}`)

  try {
    // Fetch events that haven't been visited in over 3 months
    const oldEvents = await Event.findOlderThan(threeMonthsAgo)

    if (oldEvents && oldEvents.length > 0) {
      console.log(`Found ${oldEvents.length} events to remove`)

      // Fetch availabilities linked to the events discovered
      let peopleDiscovered = 0
      await Promise.all(oldEvents.map(async event => {
        const oldPeople = await event.findPeople()

        if (oldPeople && oldPeople.length > 0) {
          peopleDiscovered += oldPeople.length
          await Person.deleteAll(oldPeople)
        }
      }))

      await Event.deleteAll(oldEvents)

      console.log(`Cleanup successful: ${oldEvents.length} events and ${peopleDiscovered} people removed`)

      res.sendStatus(200)
    } else {
      console.log('Found 0 events to remove, ending cleanup')
      res.sendStatus(404)
    }
  } catch (e) {
    console.error(e)
    res.sendStatus(404)
  }
}

export default taskCleanup

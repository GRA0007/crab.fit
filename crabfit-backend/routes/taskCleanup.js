import dayjs from 'dayjs'
import { deleteEvents, deletePeople, findOldEvents, findPeopleOfEvent, getEventIds } from '../model/methods'

const taskCleanup = async (req, res) => {
  if (req.header('X-Appengine-Cron') === undefined) {
    return res.status(400).send({ error: 'This task can only be run from a cron job' })
  }

  const threeMonthsAgo = dayjs().subtract(3, 'month').unix()

  console.log(`Running cleanup task at ${dayjs().format('h:mma D MMM YYYY')}`)

  try {
    // Fetch events that haven't been visited in over 3 months
    const oldEvents = await findOldEvents(threeMonthsAgo)

    if (oldEvents && oldEvents.length > 0) {
      const oldEventIds = getEventIds(oldEvents)
      console.log(`Found ${oldEventIds.length} events to remove`)

      // Fetch availabilities linked to the events discovered
      let peopleDiscovered = 0
      await Promise.all(oldEventIds.map(async eventId => {
        const oldPeople = findPeopleOfEvent(eventId)

        if (oldPeople && oldPeople.length > 0) {
          peopleDiscovered += oldPeople.length
          await deletePeople(oldPeople)
        }
      }))

      await deleteEvents(oldEvents)

      console.log(`Cleanup successful: ${oldEventIds.length} events and ${peopleDiscovered} people removed`)

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

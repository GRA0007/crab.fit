import dayjs from 'dayjs'

const taskCleanup = async (req, res) => {
  if (req.header('X-Appengine-Cron') === undefined) {
    return res.status(400).send({ error: 'This task can only be run from a cron job' })
  }

  const threeMonthsAgo = dayjs().subtract(3, 'month').unix()

  console.log(`Running cleanup task at ${dayjs().format('h:mma D MMM YYYY')}`)

  try {
    // Fetch events that haven't been visited in over 3 months
    const eventQuery = req.datastore.createQuery(req.types.event).filter('visited', '<', threeMonthsAgo)
    const oldEvents = (await req.datastore.runQuery(eventQuery))[0]

    if (oldEvents && oldEvents.length > 0) {
      const oldEventIds = oldEvents.map(e => e[req.datastore.KEY].name)
      console.log(`Found ${oldEventIds.length} events to remove`)

      // Fetch availabilities linked to the events discovered
      let peopleDiscovered = 0
      await Promise.all(oldEventIds.map(async eventId => {
        const peopleQuery = req.datastore.createQuery(req.types.person).filter('eventId', eventId)
        const oldPeople = (await req.datastore.runQuery(peopleQuery))[0]

        if (oldPeople && oldPeople.length > 0) {
          peopleDiscovered += oldPeople.length
          await req.datastore.delete(oldPeople.map(person => person[req.datastore.KEY]))
        }
      }))

      await req.datastore.delete(oldEvents.map(event => event[req.datastore.KEY]))

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

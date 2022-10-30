import dayjs from 'dayjs'
import { Event } from '../model'

const getEvent = async (req, res) => {
  const { eventId } = req.params

  try {
    const event = await Event.get(eventId)

    if (event) {
      res.send({
        id: event.id,
        name: event.name,
        created: event.created,
        times: event.times,
        timezone: event.timezone,
        visited: event.visited
      })

      // Update last visited time
      event.visited = dayjs().unix()
      await event.save()
    } else {
      res.status(404).send({ error: 'Event not found' })
    }
  } catch (e) {
    console.error(e)
    res.status(404).send({ error: 'Event not found' })
  }
}

export default getEvent

import dayjs from 'dayjs'
import { loadEvent, upsertEvent } from '../model/methods'

const getEvent = async (req, res) => {
  const { eventId } = req.params

  try {
    const event = await loadEvent(eventId)

    if (event) {
      res.send({
        id: eventId,
        ...event,
      })

      // Update last visited time
      await upsertEvent(event, dayjs().unix())
    } else {
      res.status(404).send({ error: 'Event not found' })
    }
  } catch (e) {
    console.error(e)
    res.status(404).send({ error: 'Event not found' })
  }
}

export default getEvent

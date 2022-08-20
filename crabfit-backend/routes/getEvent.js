import dayjs from 'dayjs'

const getEvent = async (req, res) => {
  const { eventId } = req.params

  try {
    const event = (await req.datastore.get(req.datastore.key([req.types.event, eventId])))[0]

    if (event) {
      res.send({
        id: eventId,
        ...event,
      })

      // Update last visited time
      await req.datastore.upsert({
        ...event,
        visited: dayjs().unix()
      })
    } else {
      res.status(404).send({ error: 'Event not found' })
    }
  } catch (e) {
    console.error(e)
    res.status(404).send({ error: 'Event not found' })
  }
}

export default getEvent

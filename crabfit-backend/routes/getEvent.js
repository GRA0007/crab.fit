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
      res.sendStatus(404)
    }
  } catch (e) {
    console.error(e)
    res.sendStatus(404)
  }
}

export default getEvent

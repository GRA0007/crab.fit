import dayjs from 'dayjs'
import bcrypt from 'bcrypt'

const createPerson = async (req, res) => {
  const { eventId } = req.params
  const { person } = req.body

  try {
    const event = (await req.datastore.get(req.datastore.key([req.types.event, eventId])))[0]
    const query = req.datastore.createQuery(req.types.person)
      .filter('eventId', eventId)
      .filter('name', person.name)
    const personResult = (await req.datastore.runQuery(query))[0][0]

    if (event) {
      if (person && personResult === undefined) {
        const currentTime = dayjs().unix()

        // If password
        let hash = null
        if (person.password) {
          hash = await bcrypt.hash(person.password, 10)
        }

        const entity = {
          key: req.datastore.key(req.types.person),
          data: {
            name: person.name.trim(),
            password: hash,
            eventId: eventId,
            created: currentTime,
            availability: [],
          },
        }

        await req.datastore.insert(entity)

        res.sendStatus(201)

        // Update stats
        const personCountResult = (await req.datastore.get(req.datastore.key([req.types.stats, 'personCount'])))[0] || null
        if (personCountResult) {
          await req.datastore.upsert({
            ...personCountResult,
            value: personCountResult.value + 1,
          })
        } else {
          await req.datastore.insert({
            key: req.datastore.key([req.types.stats, 'personCount']),
            data: { value: 1 },
          })
        }
      } else {
        res.sendStatus(400)
      }
    } else {
      res.sendStatus(404)
    }
  } catch (e) {
    console.error(e)
    res.sendStatus(400)
  }
}

export default createPerson

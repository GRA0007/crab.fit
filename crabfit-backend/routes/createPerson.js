import dayjs from 'dayjs'
import bcrypt from 'bcrypt'

import { Event, Person, Stat } from '../model'

const createPerson = async (req, res) => {
  const { eventId } = req.params
  const { person } = req.body

  try {
    const event = await Event.get(eventId)
    const personResult = await Person.find(eventId, person.name)

    if (event) {
      if (person && personResult === undefined) {
        const currentTime = dayjs().unix()

        // If password
        let hash = null
        if (person.password) {
          hash = await bcrypt.hash(person.password, 10)
        }

        await Person.create(person.name, hash, eventId, currentTime)

        res.status(201).send({ success: 'Created' })

        // Update stats
        const personCountResult = await Stat.get('personCount')
        if (personCountResult) {
          personCountResult.value += 1
          await personCountResult.save()
        } else {
          await Stat.create('personCount', 1)
        }
      } else {
        res.status(400).send({ error: 'Unable to create person' })
      }
    } else {
      res.status(404).send({ error: 'Event does not exist' })
    }
  } catch (e) {
    console.error(e)
    res.status(400).send({ error: 'An error occurred while creating the person' })
  }
}

export default createPerson

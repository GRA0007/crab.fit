import { findPeopleOfEvent } from "../model/methods"

const getPeople = async (req, res) => {
  const { eventId } = req.params

  try {
    let people = await findPeopleOfEvent(eventId)
    people = people.map(person => ({
      name: person.name,
      availability: person.availability,
      created: person.created,
    }))

    res.send({ people })
  } catch (e) {
    console.error(e)
    res.status(404).send({ error: 'Person not found' })
  }
}

export default getPeople

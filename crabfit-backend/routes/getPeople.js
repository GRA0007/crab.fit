const getPeople = async (req, res) => {
  const { eventId } = req.params

  try {
    const query = req.datastore.createQuery(req.types.person).filter('eventId', eventId)
    let people = (await req.datastore.runQuery(query))[0]
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

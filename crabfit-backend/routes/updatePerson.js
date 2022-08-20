import bcrypt from 'bcrypt'

const updatePerson = async (req, res) => {
  const { eventId, personName } = req.params
  const { person } = req.body

  try {
    const query = req.datastore.createQuery(req.types.person)
      .filter('eventId', eventId)
      .filter('name', personName)
    const personResult = (await req.datastore.runQuery(query))[0][0]

    if (personResult) {
      if (person && person.availability) {
        if (personResult.password) {
          const passwordsMatch = person.password && await bcrypt.compare(person.password, personResult.password)
          if (!passwordsMatch) {
            return res.status(401).send('Incorrect password')
          }
        }

        await req.datastore.upsert({
          ...personResult,
          availability: person.availability,
        })

        res.sendStatus(200)
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

export default updatePerson

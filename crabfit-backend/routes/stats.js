import packageJson from '../package.json'

const stats = async (req, res) => {
  let eventCount = null
  let personCount = null

  try {
    const eventResult = (await req.datastore.get(req.datastore.key([req.types.stats, 'eventCount'])))[0] || null
    const personResult = (await req.datastore.get(req.datastore.key([req.types.stats, 'personCount'])))[0] || null

    if (eventResult) {
      eventCount = eventResult.value
    }
    if (personResult) {
      personCount = personResult.value
    }

  } catch (e) {
    console.error(e)
  }

  res.send({
    eventCount,
    personCount,
    version: packageJson.version,
  })
}

export default stats

import dayjs from 'dayjs'
import punycode from 'punycode/'

import adjectives from '../res/adjectives.json'
import crabs from '../res/crabs.json'
import { Event, Stat } from '../model'

const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1)

// Generate a random name based on an adjective and a crab species
const generateName = () =>
  `${capitalize(adjectives[Math.floor(Math.random() * adjectives.length)])} ${crabs[Math.floor(Math.random() * crabs.length)]} Crab`

// Generate a slug for the crab fit
const generateId = name => {
  let id = punycode.encode(name.trim().toLowerCase()).trim().replace(/[^A-Za-z0-9 ]/g, '').replace(/\s+/g, '-')
  if (id.replace(/-/g, '') === '') {
    id = generateName().trim().toLowerCase().replace(/[^A-Za-z0-9 ]/g, '').replace(/\s+/g, '-')
  }
  const number = Math.floor(100000 + Math.random() * 900000)
  return `${id}-${number}`
}

const createEvent = async (req, res) => {
  const { event } = req.body

  try {
    const name = event.name.trim() === '' ? generateName() : event.name.trim()
    let eventId = generateId(name)
    const currentTime = dayjs().unix()

    // Check if the event ID already exists, and if so generate a new one
    let eventResult
    do {
      eventResult = await Event.get(eventId)

      if (eventResult !== undefined) {
        eventId = generateId(name)
      }
    } while (eventResult !== undefined)

    await Event.create(eventId, name, currentTime, event.times, event.timezone)

    res.status(201).send({
      id: eventId,
      name: name,
      created: currentTime,
      times: event.times,
      timezone: event.timezone,
    })

    // Update stats
    const eventCountResult = await Stat.get('eventCount')
    if (eventCountResult) {
      eventCountResult.value += 1
      await eventCountResult.save()
    } else {
      await Stat.create('eventCount', 1)
    }
  } catch (e) {
    console.error(e)
    res.status(400).send({ error: 'An error occurred while creating the event' })
  }
}

export default createEvent

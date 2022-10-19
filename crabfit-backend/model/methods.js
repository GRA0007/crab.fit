import { Datastore } from '@google-cloud/datastore'

const TYPES = {
  event: process.env.NODE_ENV === 'production' ? 'Event' : 'DevEvent',
  person: process.env.NODE_ENV === 'production' ? 'Person' : 'DevPerson',
  stats: process.env.NODE_ENV === 'production' ? 'Stats' : 'DevStats',
}

const datastore = new Datastore({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
})

export async function findEvent(eventId) {
  const query = datastore.createQuery(TYPES.event)
    .select('__key__')
    .filter('__key__', datastore.key([TYPES.event, eventId]))

  return (await datastore.runQuery(query))[0][0]
}

export async function findOldPeople(threeMonthsAgo) {
  const peopleQuery = datastore.createQuery(TYPES.person).filter('created', '<', threeMonthsAgo)
  const oldPeople = (await datastore.runQuery(peopleQuery))[0]
  return oldPeople
}

export async function findOldEvents(threeMonthsAgo) {
  const eventQuery = datastore.createQuery(TYPES.event).filter('visited', '<', threeMonthsAgo)
  const oldEvents = (await datastore.runQuery(eventQuery))[0]
  return oldEvents
}

export async function findPeopleOfEvent(eventId) {
  const query = datastore.createQuery(TYPES.person).filter('eventId', eventId)
  let people = (await datastore.runQuery(query))[0]
  return people
}

export async function loadEvent(eventId) {
  return (await datastore.get(datastore.key([TYPES.event, eventId])))[0]
}

export async function loadPerson(eventId, personName) {
  const query = datastore.createQuery(TYPES.person)
    .filter('eventId', eventId)
    .filter('name', personName)

  return (await datastore.runQuery(query))[0][0]
}

export async function loadStats(statName) {
  return (await datastore.get(datastore.key([TYPES.stats, statName])))[0] || null
}

export async function storeEvent(eventId, name, currentTime, event) {
  const entity = {
    key: datastore.key([TYPES.event, eventId]),
    data: {
      name: name,
      created: currentTime,
      times: event.times,
      timezone: event.timezone,
    },
  }

  await datastore.insert(entity)
}

export async function storePerson(person, hash, eventId, currentTime) {
  const entity = {
    key: datastore.key(TYPES.person),
    data: {
      name: person.name.trim(),
      password: hash,
      eventId: eventId,
      created: currentTime,
      availability: [],
    },
  }

  await datastore.insert(entity)
}

export async function storeStats(statName, value) {
  await datastore.insert({
    key: datastore.key([TYPES.stats, statName]),
    data: { value },
  })
}

export async function upsertEvent(entity, visited) {
  await datastore.upsert({
    ...entity,
    visited: visited
  })
}

export async function upsertPerson(entity, availability) {
  await datastore.upsert({
    ...entity,
    availability: availability
  })
}

export async function upsertStats(entity, value) {
  await datastore.upsert({
    ...entity,
    value: value,
  })
}

export async function deleteEvents(events) {
  await datastore.delete(events.map(event => event[datastore.KEY]))
}

export async function deletePeople(people) {
  await datastore.delete(people.map(person => person[datastore.KEY]))
}

export async function deletePerson(person) {
  await datastore.delete(person[datastore.KEY])
}

export function getEventIds(events) {
  return events.map(e => e[datastore.KEY].name)
}

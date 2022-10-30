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
}

export async function loadEvent(eventId) {
}

export async function loadPerson(eventId, personName) {
}

export async function loadStats(statName) {
}

export async function storeEvent(eventId, name, currentTime, event) {
}

export async function storePerson(person, hash, eventId, currentTime) {
}

export async function storeStats(statName, value) {
}

export async function upsertEvent(entity, visited) {
}

export async function upsertPerson(entity, availability) {
}

export async function upsertStats(entity, value) {
}

export async function deleteEvents(events) {
  await datastore.delete(events.map(event => event[datastore.KEY]))
}

export async function deletePeople(people) {
  await datastore.delete(people.map(person => person[datastore.KEY]))
}

export async function deletePerson(person) {
}

export function getEventIds(events) {
  return events.map(e => e[datastore.KEY].name)
}

export async function findEvent(eventId) {
  // TODO Find out if this can be replaced by Event.get(eventId)
  const query = datastore.createQuery(TYPES.event)
    .select('__key__')
    .filter('__key__', datastore.key([TYPES.event, eventId]))

  return (await datastore.runQuery(query))[0][0]
}

export async function findOldPeople(threeMonthsAgo) {
}

export async function findOldEvents(threeMonthsAgo) {
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
}

export async function deletePeople(people) {
}

export async function deletePerson(person) {
}

export function getEventIds(events) {
}

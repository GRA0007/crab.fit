/**
 * Concrete, storage-aware implementations of the base types as defined in base.js.
 *
 * These implementations use Google's Datastore to store the data.
 */
import { BaseEvent, BasePerson, BaseStat } from "../base"
import { Datastore } from '@google-cloud/datastore'

const datastore = new Datastore({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
})

const isProduction = process.env.NODE_ENV === 'production'

const TYPES = {
  event: isProduction ? 'Event' : 'DevEvent',
  person: isProduction ? 'Person' : 'DevPerson',
  stats: isProduction ? 'Stats' : 'DevStats',
}

export class Event extends BaseEvent {

  static async create(eventId, name, created, times, timezone, visited) {
    // TODO Return Event instance
    // TODO Handle the "visited" parameter (currently simply ignored)
    const entity = {
      key: datastore.key([TYPES.event, eventId]),
      data: {
        name: name,
        created: created,
        times: times,
        timezone: timezone,
      },
    }
  
    await datastore.insert(entity)
  }

  static async get(eventId) {
    // TODO Return Event instance
    return (await datastore.get(datastore.key([TYPES.event, eventId])))[0]
  }

  async save() {
    // TODO Use "this" instead of entity, integrate the "visited" property somehow
    await datastore.upsert({
      ...entity,
      visited: visited
    })
  }

  async delete() {
    // TODO Use "this" instead of person, integrate the KEY somehow
    await datastore.delete(person[datastore.KEY])
  }

}

export class Person extends BasePerson {

  static async create(name, password, eventId, created, availability) {
    // TODO Return Person instance
    // TODO Handle the "availability" parameter (currently simply ignored)
    const entity = {
      key: datastore.key(TYPES.person),
      data: {
        name: name.trim(),
        password: password,
        eventId: eventId,
        created: created,
        availability: [],
      },
    }
  
    await datastore.insert(entity)
  }

  static async find(eventId, name) {
    // TODO Return Person instance
    const query = datastore.createQuery(TYPES.person)
    .filter('eventId', eventId)
    .filter('name', name)

    return (await datastore.runQuery(query))[0][0]
  }

  async save() {
    // TODO Use "this" instead of entity, integrate the "availability" property somehow
    await datastore.upsert({
      ...entity,
      availability: availability
    })
  }

}

export class Stat extends BaseStat {

  static async create(statId, value) {
    // TODO Return Stat instance
    await datastore.insert({
      key: datastore.key([TYPES.stats, statId]),
      data: { value },
    })
  }

  static async get(statId) {
    // TODO Return Stat instance
    return (await datastore.get(datastore.key([TYPES.stats, statId])))[0] || null
  }

  async save() {
    // TODO Use "this" instead of entity, integrate the "value" property somehow
    await datastore.upsert({
      ...entity,
      value: value,
    })
  }

}

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

export class Event extends BaseEvent {

  static #datastoreKind = isProduction ? 'Event' : 'DevEvent'

  static async create(eventId, name, created, times, timezone, visited) {
    const entityData = { name, created, times, timezone, visited }
    const entity = {
      key: datastore.key([this.#datastoreKind, eventId]),
      data: entityData
    }

    await datastore.insert(entity)
    return new Event(eventId, entityData)
  }

  static async get(eventId) {
    const [entityData] = await datastore.get(datastore.key([this.#datastoreKind, eventId]))
    return new Event(eventId, entityData)
  }

  async save() {
    const entityData = {
      name: this.name,
      created: this.created,
      times: this.times,
      timezone: this.timezone,
      visited: this.visited
    }
    const entity = {
      key: datastore.key([this.#datastoreKind, this.id]),
      data: entityData
    }

    await datastore.upsert(entity)
  }

  async delete() {
    // TODO Use "this" instead of person, integrate the KEY somehow
    await datastore.delete(person[datastore.KEY])
  }

}

export class Person extends BasePerson {

  static #datastoreKind = isProduction ? 'Person' : 'DevPerson'

  static async create(name, password, eventId, created, availability) {
    // TODO Return Person instance
    // TODO Handle the "availability" parameter (currently simply ignored)
    const entity = {
      key: datastore.key(this.#datastoreKind),
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
    const query = datastore.createQuery(this.#datastoreKind)
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

  static #datastoreKind = isProduction ? 'Stats' : 'DevStats'

  static async create(statId, value) {
    // TODO Return Stat instance
    await datastore.insert({
      key: datastore.key([this.#datastoreKind, statId]),
      data: { value },
    })
  }

  static async get(statId) {
    // TODO Return Stat instance
    return (await datastore.get(datastore.key([this.#datastoreKind, statId])))[0] || null
  }

  async save() {
    // TODO Use "this" instead of entity, integrate the "value" property somehow
    await datastore.upsert({
      ...entity,
      value: value,
    })
  }

}

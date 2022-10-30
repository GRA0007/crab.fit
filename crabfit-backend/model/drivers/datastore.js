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

// TODO (for all three classes): Maybe integrate the datastoreKey somehow, so it doesn't have to be generated every time

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
    return entityData ? new Event(eventId, entityData) : null
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
    await datastore.delete(datastore.key([this.#datastoreKind, this.id]))
  }

}

export class Person extends BasePerson {

  static #datastoreKind = isProduction ? 'Person' : 'DevPerson'

  static async create(name, password, eventId, created, availability) {
    const entityData = { 
      name: name.trim(), 
      password, 
      eventId, 
      created, 
      availability: availability || [] 
    }

    // Don't specify a name (and also no numeric id), so a numeric id is automatically generated for us
    const key = datastore.key(this.#datastoreKind)
    const entity = {
      key,
      data: entityData
    }
    await datastore.insert(entity)

    return new Person(key.id, entityData)
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
    const entityData = { value }
    await datastore.insert({
      key: datastore.key([this.#datastoreKind, statId]),
      data: entityData,
    })

    return new Stat(statId, entityData)
  }

  static async get(statId) {
    const [entityData] = await datastore.get(datastore.key([this.#datastoreKind, statId]))
    return entityData ? new Stat(statId, entityData) : null
  }

  async save() {
    const entityData = {
      value: this.value
    }
    const entity = {
      key: datastore.key([this.#datastoreKind, this.id]),
      data: entityData
    }

    await datastore.upsert(entity)
  }

}

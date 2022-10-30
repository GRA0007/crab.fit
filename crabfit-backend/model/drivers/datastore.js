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

  static async findOlderThan(timestamp) {
    const eventQuery = datastore.createQuery(this.#datastoreKind).filter('visited', '<', timestamp)

    const queryResults = (await datastore.runQuery(eventQuery))[0].map(
      queryResult => new Event(queryResult[datastore.KEY].id, queryResult)
    )

    return queryResults
  }

  static async deleteAll(events) {
    await datastore.delete(events.map(event => datastore.key([this.#datastoreKind, event.id])))
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

  async findPeople() {
    return await Person.find(this.id)
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

  /**
   * @param {string} eventId Id of the event whose participants we're looking for
   * @param {string?} name Optional: Name of the participant
   * @returns If a name is specified, the one person with that name, otherwise a list of persons
   */
  static async find(eventId, name) {
    const query = datastore.createQuery(this.#datastoreKind).filter('eventId', eventId)
    if(name !== undefined) {
      query.filter('name', name)
    }

    const queryResults = (await datastore.runQuery(query))[0].map(
      queryResult => new Person(queryResult[datastore.KEY].id, queryResult)
    )

    return name !== undefined ? queryResults[0] : queryResults
  }

  static async findOlderThan(timestamp) {
    const peopleQuery = datastore.createQuery(this.#datastoreKind).filter('created', '<', timestamp)

    const queryResults = (await datastore.runQuery(peopleQuery))[0].map(
      queryResult => new Person(queryResult[datastore.KEY].id, queryResult)
    )

    return queryResults
  }

  static async deleteAll(people) {
    await datastore.delete(people.map(person => datastore.key([this.#datastoreKind, person.id])))
  }

  async save() {
    const entityData = {
      name: this.name,
      password: this.password,
      eventId: this.eventId,
      created: this.created,
      availability: this.availability
    }
    const entity = {
      key: datastore.key([this.#datastoreKind, this.id]),
      data: entityData
    }

    await datastore.upsert(entity)
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

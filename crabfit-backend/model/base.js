/**
 * A storage-agnostic base for the data types used by crab.fit.
 *
 * Storage-aware sub-classes of them can be found in the drivers/ folder.
 */

export class BaseEvent {
  id
  name
  created
  times
  timezone
  visited

  /**
   * "Private" constructor. Should only be called from factory methods (create, get).
   *
   * @param {String} eventId An arbitrary string uniquely identifying the event
   * @param {Object} data An object to initialize the new event's fields from
   */
  constructor(eventId, data) {
    this.id = eventId
    this.name = data.name
    this.created = data.created
    this.times = data.times
    this.timezone = data.timezone
    this.visited = data.visited
  }

  /**
   * Create a new event with the given parameters and save it in storage.
   */
  static async create(eventId, name, created, times, timezone, visited) {
    throw new Error("Not implemented")
  }

  /**
   * Retrieve the event with the given id from storage. Might return null.
   *
   * @param {String} eventId An arbitrary string uniquely identifying the event
   */
  static async get(eventId) {
    throw new Error("Not implemented")
  }

  /**
   * Save the event to storage.
   */
  async save() {
    throw new Error("Not implemented")
  }

  /**
   * Remove the event from storage.
   */
  async delete() {
    throw new Error("Not implemented")
  }
}

export class BasePerson {
  id
  name
  password
  eventId
  created
  availability

  /**
   * "Private" constructor. Should only be called from factory methods (create, get).
   *
   * @param {String} eventId An arbitrary string uniquely identifying the event
   * @param {Object} data An object to initialize the new event's fields from
   */
  constructor(personId, data) {
    this.id = personId
    this.name = data.name
    this.password = data.password
    this.eventId = data.eventId
    this.created = data.created
    this.availability = data.availability
  }

  /**
   * Create a new person with the given parameters and save it in storage.
   * A unique personId is generated automatically.
   */
   static async create(name, password, eventId, created, availability) {
    throw new Error("Not implemented")
  }

  /**
   * Find the person with the given name participating in the event with the given id. Might return null.
   *
   * @param {String} eventId An arbitrary string uniquely identifying an event
   * @param {String} name The name of the person to find
   */
  static async find(eventId, name) {
    throw new Error("Not implemented")
  }

  /**
   * Save the person to storage.
   */
  async save() {
    throw new Error("Not implemented")
  }

  /**
   * Remove the person from storage.
   */
  async delete() {
    throw new Error("Not implemented")
  }
}

export class BaseStat {
  id
  value

  /**
   * "Private" constructor. Should only be called from factory methods (create, get).
   *
   * @param {String} statId An arbitrary string uniquely identifying the stat
   * @param {Object} data An object to initialize the new stat's fields from
   */
  constructor(statId, data) {
    this.id = statId
    this.value = data.value
  }

  /**
   * Create a new stat with the given parameters and save it in storage.
   *
   * @param {String} statId An arbitrary string uniquely identifying the stat
   * @param {any} value The value of the stat
   */
  static async create(statId, value) {
    throw new Error("Not implemented")
  }

  /**
   * Retrieve the stat with the given id from storage. Might return null.
   *
   * @param {String} statId An arbitrary string uniquely identifying the stat
   */
  static async get(statId) {
    throw new Error("Not implemented")
  }

  /**
   * Save the stat to storage.
   */
  async save() {
    throw new Error("Not implemented")
  }
}

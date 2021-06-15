const dayjs = require('dayjs');
const punycode = require('punycode/');

const adjectives = require('../res/adjectives.json');
const crabs = require('../res/crabs.json');

const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

// Generate a random name based on an adjective and a crab species
const generateName = () => {
	return `${capitalize(adjectives[Math.floor(Math.random() * adjectives.length)])} ${crabs[Math.floor(Math.random() * crabs.length)]} Crab`;
};

// Generate a slug for the crab fit
const generateId = name => {
	let id = punycode.encode(name.trim().toLowerCase()).trim().replace(/[^A-Za-z0-9 ]/g, '').replace(/\s+/g, '-');
  if (id.replace(/-/g, '') === '') {
    id = generateName().trim().toLowerCase().replace(/[^A-Za-z0-9 ]/g, '').replace(/\s+/g, '-');
  }
	const number = Math.floor(100000 + Math.random() * 900000);
	return `${id}-${number}`;
};

module.exports = async (req, res) => {
	const { event } = req.body;

	try {
		const name = event.name.trim() === '' ? generateName() : event.name.trim();
		let eventId = generateId(name);
		const currentTime = dayjs().unix();

    // Check if the event ID already exists, and if so generate a new one
    let eventResult;
    do {
      const query = req.datastore.createQuery(req.types.event)
        .select('__key__')
        .filter('__key__', req.datastore.key([req.types.event, eventId]));

      eventResult = (await req.datastore.runQuery(query))[0][0];

      if (eventResult !== undefined) {
        eventId = generateId(name);
      }
    } while (eventResult !== undefined);

    const entity = {
			key: req.datastore.key([req.types.event, eventId]),
			data: {
				name: name,
				created: currentTime,
				times: event.times,
				timezone: event.timezone,
			},
		};

		await req.datastore.insert(entity);

		res.status(201).send({
			id: eventId,
			name: name,
			created: currentTime,
			times: event.times,
      timezone: event.timezone,
		});

    // Update stats
    let eventCountResult = (await req.datastore.get(req.datastore.key([req.types.stats, 'eventCount'])))[0] || null;
    if (eventCountResult) {
      eventCountResult.value++;
      await req.datastore.upsert(eventCountResult);
    } else {
  		await req.datastore.insert({
  			key: req.datastore.key([req.types.stats, 'eventCount']),
  			data: { value: 1 },
  		});
    }
	} catch (e) {
		console.error(e);
		res.sendStatus(400);
	}
};

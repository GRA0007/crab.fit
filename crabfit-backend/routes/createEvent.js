const dayjs = require('dayjs');

const adjectives = require('../res/adjectives.json');
const crabs = require('../res/crabs.json');

String.prototype.capitalize = () => this.charAt(0).toUpperCase() + this.slice(1);

const generateId = (name) => {
	const id = name.trim().toLowerCase().replace(/[^A-Za-z0-9 ]/g, '').replace(/\s+/g, '-');
	const number = Math.floor(100000 + Math.random() * 900000);
	return `${id}-${number}`;
};

const generateName = () => {
	return `${adjectives[Math.floor(Math.random() * adjectives.length)].capitalize()} ${crabs[Math.floor(Math.random() * crabs.length)]} Crab`;
};

module.exports = async (req, res) => {
	const { event } = req.body;

	try {
		const name = event.name.trim() === '' ? generateName() : event.name.trim();
		const eventId = generateId(name);
		const currentTime = dayjs().unix();

		const entity = {
			key: req.datastore.key(['Event', eventId]),
			data: {
				name: name,
				created: currentTime,
				startTime: event.startTime,
				endTime: event.endTime,
				dates: event.dates,
			},
		};

		await req.datastore.insert(entity);

		res.status(201).send({
			id: eventId,
			name: name,
			created: currentTime,
			startTime: event.startTime,
			endTime: event.endTime,
			dates: event.dates,
		});
	} catch (e) {
		console.error(e);
		res.sendStatus(400);
	}
};

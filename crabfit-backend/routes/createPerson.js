const dayjs = require('dayjs');
const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
	const { eventId } = req.params;
	const { person } = req.body;

	try {
		const event = (await req.datastore.get(req.datastore.key([req.types.event, eventId])))[0];
		const query = req.datastore.createQuery(req.types.person)
			.filter('eventId', eventId)
			.filter('name', person.name);
		let personResult = (await req.datastore.runQuery(query))[0][0];

		if (event) {
			if (person && personResult === undefined) {
				const currentTime = dayjs().unix();

				// If password
				let hash = null;
				if (person.password) {
					hash = await bcrypt.hash(person.password, 10);
				}

				const entity = {
					key: req.datastore.key(req.types.person),
					data: {
						name: person.name.trim(),
						password: hash,
						eventId: eventId,
						created: currentTime,
						availability: [],
					},
				};

				await req.datastore.insert(entity);

				res.sendStatus(201);
			} else {
				res.sendStatus(400);
			}
		} else {
			res.sendStatus(404);
		}
	} catch (e) {
		console.error(e);
		res.sendStatus(400);
	}
};

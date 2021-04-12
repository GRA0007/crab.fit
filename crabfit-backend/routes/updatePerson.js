const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
	const { eventId, personName } = req.params;
	const { person } = req.body;

	try {
		const query = req.datastore.createQuery(req.types.person)
			.filter('eventId', eventId)
			.filter('name', personName);
		let personResult = (await req.datastore.runQuery(query))[0][0];

		if (personResult) {
			if (person && person.availability) {
				if (personResult.password) {
					const passwordsMatch = person.password && await bcrypt.compare(person.password, personResult.password);
					if (!passwordsMatch) {
						return res.status(401).send('Incorrect password');
					}
				}

				personResult.availability = person.availability;

				await req.datastore.upsert(personResult);

				res.sendStatus(200);
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

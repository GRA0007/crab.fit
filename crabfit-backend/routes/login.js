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
			if (personResult.password) {
				const passwordsMatch = person && person.password && await bcrypt.compare(person.password, personResult.password);
				if (!passwordsMatch) {
					return res.status(401).send('Incorrect password');
				}
			}

			res.send({
				name: personName,
				availability: personResult.availability,
				created: personResult.created,
			});
		} else {
			res.sendStatus(404);
		}
	} catch (e) {
		console.error(e);
		res.sendStatus(404);
	}
};

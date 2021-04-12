const package = require('../package.json');

module.exports = async (req, res) => {
	let eventCount = null;
	let personCount = null;

	try {
		const eventQuery = req.datastore.createQuery(['__Stat_Kind__']).filter('kind_name', req.types.event);
		const personQuery = req.datastore.createQuery(['__Stat_Kind__']).filter('kind_name', req.types.person);

		eventCount = (await req.datastore.runQuery(eventQuery))[0][0].count;
		personCount = (await req.datastore.runQuery(personQuery))[0][0].count;
	} catch (e) {
		console.error(e);
	}

	res.send({
		eventCount: eventCount || null,
		personCount: personCount || null,
		version: package.version,
	});
};

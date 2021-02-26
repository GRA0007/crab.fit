const package = require('../package.json');

module.exports = async (req, res) => {
	let eventCount = null;
	let personCount = null;

	try {
		const query = req.datastore.createQuery(['__Stat_Kind__']);

		eventCount = (await req.datastore.runQuery(query.filter('kind_name', 'Event')))[0].count;
		personCount = (await req.datastore.runQuery(query.filter('kind_name', 'Person')))[0].count;
	} catch (e) {
		console.error(e);
	}

	res.send({
		eventCount: eventCount || null,
		personCount: personCount || null,
		version: package.version,
	});
};

const package = require('../package.json');

module.exports = (req, res) => {
	res.send({
		eventCount: 0,
		personCount: 0,
		version: package.version,
	});
};

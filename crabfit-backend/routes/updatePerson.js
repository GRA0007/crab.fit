module.exports = (req, res) => {
	const { eventId, personId } = req.params;
	const { person } = req.body;

	if (eventId) {
		if (personId) {
			if (person) {
				res.send(person);
			} else {
				res.sendStatus(400);
			}
		} else {
			res.sendStatus(404);
		}
	} else {
		res.sendStatus(404);
	}
};

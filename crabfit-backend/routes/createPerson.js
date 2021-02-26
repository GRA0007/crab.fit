module.exports = (req, res) => {
	const { eventId } = req.params;
	const { person } = req.body;

	if (eventId) {
		if (person) {
			console.log(person);
			res.sendStatus(201);
		} else {
			res.sendStatus(400);
		}
	} else {
		res.sendStatus(404);
	}
};

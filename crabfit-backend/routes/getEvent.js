module.exports = async (req, res) => {
	const { eventId } = req.params;

	try {
		const event = (await req.datastore.get(req.datastore.key([req.types.event, eventId])))[0];

		if (event) {
			res.send({
				id: eventId,
				...event,
			});
		} else {
			res.sendStatus(404);
		}
	} catch (e) {
		console.error(e);
		res.sendStatus(404);
	}
};

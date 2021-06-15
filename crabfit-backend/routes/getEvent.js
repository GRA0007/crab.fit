const dayjs = require('dayjs');

module.exports = async (req, res) => {
	const { eventId } = req.params;

	try {
		const event = (await req.datastore.get(req.datastore.key([req.types.event, eventId])))[0];

		if (event) {
			res.send({
				id: eventId,
				...event,
			});

      // Update last visited time
      event.visited = dayjs().unix();
      await req.datastore.upsert(event);
		} else {
			res.sendStatus(404);
		}
	} catch (e) {
		console.error(e);
		res.sendStatus(404);
	}
};

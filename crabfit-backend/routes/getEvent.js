module.exports = (req, res) => {
	const { eventId } = req.params;

	if (eventId) {
		res.send({
			id: 'event-name-4701240',
			name: 'Event name',
			eventCreated: 379642017932,
			timezone: '247',
			startTime: 0900,
			endTime: 1700,
			dates: [
				'26022021',
				'27022021',
				'28022021',
			],
		});
	} else {
		res.sendStatus(404);
	}
};

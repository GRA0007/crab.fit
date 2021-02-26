module.exports = (req, res) => {
	const { eventId } = req.params;

	if (eventId) {
		res.send({
			people: [
				{
					name: 'Laura',
					password: null,
					eventId: 'event-name-4701240',
					availability: [
						[
							'START',
							'END',
						],
						[
							'START',
							'END',
						],
					],
				},
			],
		});
	} else {
		res.sendStatus(404);
	}
};

module.exports = (req, res) => {
	const { event } = req.body;

	if (event) {
		console.log(event);
		res.sendStatus(201);
	} else {
		res.sendStatus(400);
	}
};

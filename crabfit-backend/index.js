const express = require('express');
const package = require('./package.json');
const app = express();
const port = 8080;

const stats = require('./routes/stats');
const getEvent = require('./routes/getEvent');
const createEvent = require('./routes/createEvent');
const getPeople = require('./routes/getPeople');
const createPerson = require('./routes/createPerson');
const updatePerson = require('./routes/updatePerson');

app.use(express.json());

app.get('/', (req, res) => res.send(`Crabfit API v${package.version}`));

app.get('/stats', stats);
app.get('/event/:eventId', getEvent);
app.post('/event', createEvent);
app.get('/event/:eventId/people', getPeople);
app.post('/event/:eventId/people', createPerson);
app.patch('/event/:eventId/people/:personId', updatePerson);

app.listen(port, () => {
	console.log(`Crabfit API listening at http://localhost:${port}`)
});

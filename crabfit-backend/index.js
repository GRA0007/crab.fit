require('dotenv').config();

const { Datastore } = require('@google-cloud/datastore');
const express = require('express');
const cors = require('cors');

const package = require('./package.json');

const stats = require('./routes/stats');
const getEvent = require('./routes/getEvent');
const createEvent = require('./routes/createEvent');
const getPeople = require('./routes/getPeople');
const createPerson = require('./routes/createPerson');
const login = require('./routes/login');
const updatePerson = require('./routes/updatePerson');

const taskCleanup = require('./routes/taskCleanup');
const taskLegacyCleanup = require('./routes/taskLegacyCleanup');
const taskRemoveOrphans = require('./routes/taskRemoveOrphans');

const app = express();
const port = 8080;
const corsOptions = {
	origin: process.env.NODE_ENV === 'production' ? 'https://crab.fit' : 'http://localhost:5173',
};

const datastore = new Datastore({
	keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

app.use(express.json());
app.use((req, res, next) => {
	req.datastore = datastore;
  req.types = {
    event: process.env.NODE_ENV === 'production' ? 'Event' : 'DevEvent',
    person: process.env.NODE_ENV === 'production' ? 'Person' : 'DevPerson',
    stats: process.env.NODE_ENV === 'production' ? 'Stats' : 'DevStats',
  };
	next();
});
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

app.get('/', (req, res) => res.send(`Crabfit API v${package.version}`));

app.get('/stats', stats);
app.get('/event/:eventId', getEvent);
app.post('/event', createEvent);
app.get('/event/:eventId/people', getPeople);
app.post('/event/:eventId/people', createPerson);
app.post('/event/:eventId/people/:personName', login);
app.patch('/event/:eventId/people/:personName', updatePerson);

// Tasks
app.get('/tasks/cleanup', taskCleanup);
app.get('/tasks/legacyCleanup', taskLegacyCleanup);
app.get('/tasks/removeOrphans', taskRemoveOrphans);

app.listen(port, () => {
	console.log(`Crabfit API listening at http://localhost:${port} in ${process.env.NODE_ENV === 'production' ? 'prod' : 'dev'} mode`)
});

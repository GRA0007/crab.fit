import { config } from 'dotenv'
import express from 'express'
import cors from 'cors'

import packageJson from './package.json'

import {
  stats,
  getEvent,
  createEvent,
  getPeople,
  createPerson,
  login,
  updatePerson,
  taskCleanup,
  taskRemoveOrphans,
} from './routes'

config()

const app = express()
const port = 8080
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? 'https://crab.fit' : 'http://localhost:5173',
}

app.use(express.json())
app.options('*', cors(corsOptions))
app.use(cors(corsOptions))

app.get('/', (_req, res) => res.send(`Crabfit API v${packageJson.version}`))

app.get('/stats', stats)
app.get('/event/:eventId', getEvent)
app.post('/event', createEvent)
app.get('/event/:eventId/people', getPeople)
app.post('/event/:eventId/people', createPerson)
app.post('/event/:eventId/people/:personName', login)
app.patch('/event/:eventId/people/:personName', updatePerson)

// Tasks
app.get('/tasks/cleanup', taskCleanup)
app.get('/tasks/removeOrphans', taskRemoveOrphans)

app.listen(port, () => {
  console.log(`Crabfit API listening at http://localhost:${port} in ${process.env.NODE_ENV === 'production' ? 'prod' : 'dev'} mode`)
})

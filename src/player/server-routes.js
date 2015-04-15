import { Router } from 'express'
import PlayerActions from './actions'
import PlayerStore from './store'
import events from './server-events'
import persist from '../common/persist'

const actions = PlayerActions()
const store = PlayerStore()
store.subscribe(actions)

actions.bootstrap(persist.readSync('players') || { players: [] })
store.on('change', () => persist.write('players', store))

function getPlayers (req, res, next) {
  res.send(store.getStateForPlayer(req.session.playerId))
}

function createPlayer (req, res, next) {
  actions.create(req.body)
  res.status(204).end()
}

function selectPlayer (req, res, next) {
  req.session.playerId = req.body.id
  res.status(204).end()
}

function updatePlayer (req, res, next) {
  actions.update(req.body)
  res.status(204).end()
}

function deletePlayer (req, res, next) {
  actions.delete(req.body)
  res.status(204).end()
}

export default Router()
  .get('/events', events(actions, store))
  .get('/players.json', getPlayers)
  .post('/create.json', createPlayer)
  .post('/select.json', selectPlayer)
  .put('/update.json', updatePlayer)
  .delete('/delete.json', deletePlayer)

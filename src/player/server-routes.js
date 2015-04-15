import { Router } from 'express'
import PlayerActions from './actions'
import PlayerStore from './store'
import events from './server-events'

const actions = PlayerActions()
const store = PlayerStore()
store.subscribe(actions)

function getPlayers (req, res, next) {
  res.send(store.getStateForPlayer(req.session.playerId))
}

export default Router()
  .get('/events', events(actions, store))
  .get('/players.json', getPlayers)
//  .post('/create.json')
//  .post('/select.json')
//  .post('/update.json')
//  .delete('/delete.json')

import { Router } from 'express'
import WitchHuntActions from './actions'
import WitchHuntStore from './store'
import transition from './transition'
import events from './server-events'

const actions = WitchHuntActions()
const store = WitchHuntStore()
store.subscribe(actions)

function getState (req, res, next) {
  res.send(store.getStateForPlayer(req.session.playerId))
}

export default Router()
  .get('/events', events(actions, store))
  .get('/state.json', getState)
//  .post('/create.json')
//  .post('/add-player.json')
//  .post('/player-vote.json')
//  .post('/player-ready.json')

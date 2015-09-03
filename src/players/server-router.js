import { Router } from 'express'
import persist from '../common/persist'
import { eventSource } from '../dispatch-router'
import { REPLACE_PLAYERS } from './constants'
import reducer from './reducer'

// FIXME: the following has a race condition
// when there is more than one server process

let players = []
persist.read('players')
  .then(newPlayers => {
    players = newPlayers || []
  })
  .catch(console.error)

persist.subscribe('dispatch', action => {
  const newPlayers = reducer(players, action)
  if (newPlayers !== players) {
    players = newPlayers
    persist.write('players', players)
  }
})

eventSource.on('connect', client => {
  eventSource.send(client, {
    name: 'dispatch',
    data: { type: REPLACE_PLAYERS, players }
  })
})

export default Router()
  .get('/state', (req, res, next) => res.send(players))

import { Router } from 'express'
import persist from '../common/persist'
import { events } from '../dispatch-router'
import { REPLACE_PLAYERS } from './constants'
import reducer from './reducer'

let players = []
persist.read('players')
  .then((newPlayers) => {
    players = newPlayers || []
  })
  .catch(console.error)

persist.subscribe('dispatch', (action) => {
  const newPlayers = reducer(players, action)
  if (newPlayers !== players) {
    players = newPlayers
    persist.write('players', players)
  }
})

events.on('connect', (ws) => {
  ws.send(JSON.stringify({ type: REPLACE_PLAYERS, players }))
})

export default Router()
  .get('/state', (req, res, next) => res.send(players))

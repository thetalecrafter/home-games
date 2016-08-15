const { Router } = require('express')
const persist = require('../common/persist')
const { events } = require('../dispatch-router')
const { REPLACE_PLAYERS } = require('./constants')
const reducer = require('./reducer')

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

events.on('connect', ({ send }) => {
  send({ type: REPLACE_PLAYERS, players })
})

module.exports = Router()
  .get('/state', (req, res, next) => res.send(players))

const { Router } = require('express')
const persist = require('../common/persist')
const { events } = require('../dispatch-router')
const { TRANSITION, REPLACE_GAME } = require('./constants')
const reducer = require('./reducer')
const transition = require('./transition')

const initialState = {
  players: []
}

let state = initialState
persist.read('witch-hunt')
  .then((newState) => {
    state = newState || initialState
  })
  .catch(console.error)

persist.subscribe('dispatch', (action) => {
  if (action.type === TRANSITION) return

  const interState = reducer(state, action)
  const newState = transition(interState)

  if (newState !== state) {
    state = newState
    persist.write('witch-hunt', state)
  }

  if (interState !== newState) {
    persist.publish('dispatch', {
      type: TRANSITION, state
    })
  }
})

events.on('connect', ({ request, send }) => {
  const sid = request.session.id
  const isPlaying = !!state.players.find((player) => player.sid === sid)
  if (!isPlaying) return

  send({ type: REPLACE_GAME, state })
})

module.exports = Router()
  .get('/state', (req, res, next) => res.send(state))

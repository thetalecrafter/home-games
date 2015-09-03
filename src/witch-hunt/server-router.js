import { Router } from 'express'
import persist from '../common/persist'
import { eventSource } from '../dispatch-router'
import { TRANSITION, REPLACE_GAME } from './constants'
import reducer from './reducer'
import transition from './transition'

// FIXME: the following has a race condition
// when there is more than one server process

const initialState = {
  players: []
}

let state = initialState
persist.read('witch-hunt')
  .then(newState => {
    state = newState || initialState
  })
  .catch(console.error)

persist.subscribe('dispatch', action => {
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

eventSource.on('connect', client => {
  const sid = client.request.sessionID
  const isPlaying = !!state.players.find(player => player.sid === sid)
  if (!isPlaying) return

  eventSource.send(client, {
    name: 'dispatch',
    data: { type: REPLACE_GAME, state }
  })
})

export default Router()
  .get('/state', (req, res, next) => res.send(state))

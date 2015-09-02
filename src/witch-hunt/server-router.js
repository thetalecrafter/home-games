import { Router } from 'express'
import persist from '../common/persist'
import reducer from './reducer'
import transition from './transition'
import { TRANSITION } from './constants'

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

export default Router()
  .get('/state', (req, res, next) => res.send(state))

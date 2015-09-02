import { createStore, applyMiddleware } from 'redux'
import compose from './compose-reducers'
import reducers from './base-reducers'

export function createServerStore (initialState = {}) {
  return createBaseStore(createStore, initialState)
}

export function createClientStore (initialState = {}) {
  const createStoreWithMiddleware = applyMiddleware(dispatchToServer)(createStore)
  return createBaseStore(createStoreWithMiddleware, initialState)
}

function createBaseStore (createStoreWithMiddleware, initialState = {}) {
  const mutableReducers = { ...reducers }
  const store = createStoreWithMiddleware(compose(mutableReducers), initialState)

  store.addSubReducers = reducers => Object.assign(mutableReducers, reducers)

  return store
}

function dispatchToServer ({ getState }) {
  return dispatch => action => {
    if (action.isRemote) return dispatch(action)

    const { config } = getState()
    fetch(`${config.api}/dispatch`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(action)
    }).catch(err => {
      console.error('Error dispatching action to server', err)
    })

    return dispatch(action)
  }
}

import { createStore, applyMiddleware } from 'redux'
import compose from './compose-reducers'
import reducers from './base-reducers'
import websocketMiddleware from './redux-websocket-middleware'

export function createServerStore (initialState = {}) {
  return createBaseStore(createStore, initialState)
}

export function createClientStore (initialState = {}) {
  const createStoreWithMiddleware = applyMiddleware(websocketMiddleware)(createStore)
  return createBaseStore(createStoreWithMiddleware, initialState)
  return store
}

function createBaseStore (createStoreWithMiddleware, initialState = {}) {
  const mutableReducers = { ...reducers }
  const store = createStoreWithMiddleware(compose(mutableReducers), initialState)

  store.addSubReducers = reducers => Object.assign(mutableReducers, reducers)

  return store
}

import { createStore, applyMiddleware } from 'redux'
import compose from './compose-reducers'
import reducers from './base-reducers'
import eventSourceMiddleware from './redux-eventsource-middleware'

export function createServerStore (initialState = {}) {
  return createBaseStore(createStore, initialState)
}

export function createClientStore (initialState = {}) {
  const createStoreWithMiddleware = applyMiddleware(eventSourceMiddleware)(createStore)
  return createBaseStore(createStoreWithMiddleware, initialState)
}

function createBaseStore (createStoreWithMiddleware, initialState = {}) {
  const mutableReducers = { ...reducers }
  const store = createStoreWithMiddleware(compose(mutableReducers), initialState)

  store.addSubReducers = (reducers) => Object.assign(mutableReducers, reducers)

  return store
}

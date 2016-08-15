const { createStore, applyMiddleware } = require('redux')
const compose = require('./compose-reducers')
const reducers = require('./base-reducers')
const eventSourceMiddleware = require('./redux-eventsource-middleware')

exports.createServerStore = function createServerStore (initialState = {}) {
  return createBaseStore(createStore, initialState)
}

exports.createClientStore = function createClientStore (initialState = {}) {
  const createStoreWithMiddleware = applyMiddleware(eventSourceMiddleware)(createStore)
  return createBaseStore(createStoreWithMiddleware, initialState)
}

function createBaseStore (createStoreWithMiddleware, initialState = {}) {
  const mutableReducers = Object.assign({}, reducers)
  const store = createStoreWithMiddleware(compose(mutableReducers), initialState)

  store.addSubReducers = (reducers) => Object.assign(mutableReducers, reducers)

  return store
}

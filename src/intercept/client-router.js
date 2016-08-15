const { createElement: h } = require('react')
const Router = require('middle-router')
const { bindActionCreators } = require('redux')
const loadReducer = require('./load-reducer')
const loadState = require('./load-state')
const actionCreators = require('./actions')
const View = require('./view')

module.exports = Router()
  .use(loadReducer, loadState)

  .use('/', ({ resolve, store }) => {
    const actions = bindActionCreators(actionCreators, store.dispatch)
    resolve(() => {
      const { intercept, players, config: { sid } } = store.getState()
      return h(View, Object.assign({ sid, game: intercept, players }, actions))
    })
  })

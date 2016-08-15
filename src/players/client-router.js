const { createElement: h } = require('react')
const Router = require('middle-router')
const { bindActionCreators } = require('redux')
const actionCreators = require('./actions')
const List = require('./view/list')

module.exports = Router()
  .use('/:id?', ({ params, resolve, store }) => {
    const actions = bindActionCreators(actionCreators, store.dispatch)
    const id = params.id
    resolve(() => {
      const players = store.getState().players
      return h(List, { players, selectedId: id, actions })
    })
  })

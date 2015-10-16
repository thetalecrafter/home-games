import React from 'react'
import Router from 'middle-router'
import { bindActionCreators } from 'redux'
import actionCreators from './actions'
import List from './view/list'

export default Router()
  .get('/:id?', (ctx, next, stop) => {
    const actions = bindActionCreators(actionCreators, ctx.store.dispatch)
    const id = ctx.params.id
    ctx.render(() => {
      const players = ctx.store.getState().players
      return <List players={ players } selectedId={ id } actions={ actions } />
    })
    stop()
  })

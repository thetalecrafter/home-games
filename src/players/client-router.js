import React from 'react'
import Router from 'middle-router'
import { bindActionCreators } from 'redux'
import actionCreators from './actions'
import List from './view/list'
import Edit from './view/edit'

export default Router()
  .get('/', (ctx, next) => {
    ctx.render(() => <List players={ ctx.store.getState().players } />)
  })

  .get('/+', (ctx, next) => {
    const actions = bindActionCreators(actionCreators, ctx.store.dispatch)
    ctx.render(() => <Edit { ...actions } />)
  })

  .get('/:id', (ctx, next) => {
    const actions = bindActionCreators(actionCreators, ctx.store.dispatch)
    const id = ctx.params.id
    ctx.render(() => {
      const player = ctx.store.getState().players.find(player => player.id === id)
      return <Edit player={ player } { ...actions } />
    })
  })

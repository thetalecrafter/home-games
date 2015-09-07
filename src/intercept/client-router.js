import React from 'react'
import Router from 'middle-router'
import { bindActionCreators } from 'redux'
import loadReducer from './load-reducer'
import loadState from './load-state'
import actionCreators from './actions'
import View from './view'

export default Router()
  .use(loadReducer, loadState)

  .get('/', (ctx, next) => {
    const actions = bindActionCreators(actionCreators, ctx.store.dispatch)
    ctx.render(() => {
      const { intercept, players, config: { sid } } = ctx.store.getState()
      return (
        <View
          sid={ sid }
          game={ intercept }
          players={ players }
          { ...actions }
        />
      )
    })
  })

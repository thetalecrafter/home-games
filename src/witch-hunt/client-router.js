import React from 'react'
import Router from 'middle-router'
import { bindActionCreators } from 'redux'
import loadReducer from './load-reducer'
import loadState from './load-state'
import actionCreators from './actions'
import View from './view'

export default Router()
  .use(loadReducer, loadState)

  .get('/', ({ resolve, store }) => {
    const actions = bindActionCreators(actionCreators, store.dispatch)
    resolve(() => {
      const { witchHunt, players, config: { sid } } = store.getState()
      return (
        <View
          sid={ sid }
          game={ witchHunt }
          players={ players }
          { ...actions }
        />
      )
    })
  })

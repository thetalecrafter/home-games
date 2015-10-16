import Router from 'middle-router'
import React from 'react'
import View from './view'

export default Router()
  .get('/', (ctx, next, stop) => {
    ctx.render(() => <View store={ ctx.store } />)
    stop()
  })

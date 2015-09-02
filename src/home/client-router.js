import Router from 'middle-router'
import React from 'react'
import View from './view'

export default Router()
  .get('/', (ctx, next) => {
    ctx.render(<View store={ ctx.store } />)
  })

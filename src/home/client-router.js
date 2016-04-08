import Router from 'middle-router'
import React from 'react'
import View from './view'

export default Router()
  .use('/', ({ resolve, store }) => {
    resolve(() => <View { ...store.getState() } />)
  })

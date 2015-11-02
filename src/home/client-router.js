import Router from 'middle-router'
import React from 'react'
import View from './view'

export default Router()
  .get('/', ({ resolve, store }) => {
    resolve(() => <View { ...store.getState() } />)
  })

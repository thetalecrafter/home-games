import React from 'react'
import Router from '../../lib/router'
import wrap from 'uniflow-component'

import PlayerView from './view'
import PlayerActions from './actions'
import PlayerStore from './store'
import connectToEventSource from './client-events'

export default function (app) {
  function playerSetup (ctx, next) {
    const { actions, stores, bootstrap } = app
    const isServer = stores.config.state.request

    if (!actions.player) { actions.player = PlayerActions(stores.config) }
    if (!stores.player) {
      stores.player = PlayerStore()
      stores.player.subscribe(actions.player)
      actions.player.bootstrap(bootstrap.player || {})
      if (!isServer) { connectToEventSource(actions.player, stores.player) }
    }

    if (!isServer) { return next() }
    app.actions.player.load().then(
      data => next(),
      err => next(err)
    )
  }

  function player (context, next) {
    const View = wrap(PlayerView, { players: app.stores.player })
    app.render(<View app={ app } />)
  }

  return new Router()
    .get('/', playerSetup, player)
}

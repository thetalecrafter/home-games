import React from 'react'
import Router from '../../lib/router'

import ShellView from '../common/shell'
import WitchHuntView from './view'
import WitchHuntActions from './actions'
import WitchHuntStore from './store'

export default function (app) {
  function witchHuntSetup (ctx, next) {
    const { actions, stores, bootstrap } = app
    const isServer = stores.config.state.request

    if (!actions.witchHunt) {
      actions.witchHunt = WitchHuntActions(stores.config)
    }
    if (!stores.witchHunt) {
      stores.witchHunt = WitchHuntStore(stores.config)
      stores.witchHunt.subscribe(actions.witchHunt)
      actions.witchHunt.bootstrap(bootstrap.witchHunt || {})
      if (!isServer) { stores.witchHunt.subscribeToServer() }
    }

    if (!isServer) { return next() }
    app.actions.witchHunt.load().then(
      data => next(),
      err => next(err)
    )
  }

  function witchHunt (context, next) {
    const View = app.bind(WitchHuntView, { game: app.stores.witchHunt, players: app.stores.player })
    app.render(<ShellView><View app={ app } /></ShellView>)
  }

  return Router()
    .get('/', witchHuntSetup, witchHunt)
}

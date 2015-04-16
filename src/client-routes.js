// allow client code-split to just sync require on server
if (typeof require.ensure !== 'function') { require.ensure = (_, fn) => fn(require) }

import React from 'react'
import Router from '../lib/router'

import ShellView from './common/shell'
import HomeView from './home/view'

import PlayerActions from './player/actions'
import PlayerStore from './player/store'

export default function Routes(app) {
  const router = new Router()

  function playerSetup (ctx, next) {
    const { actions, stores, bootstrap } = app
    const isServer = stores.config.state.request

    if (!actions.player) {
      actions.player = PlayerActions(stores.config)
    }
    if (!stores.player) {
      stores.player = PlayerStore(stores.config)
      stores.player.subscribe(actions.player)
      actions.player.bootstrap(bootstrap.player || {})
      if (!isServer) { stores.player.subscribeToServer() }
    }

    if (!isServer) { return next() }
    app.actions.player.load().then(
      data => next(),
      err => next(err)
    )
  }

  function home (ctx, next) {
    app.render(<ShellView><HomeView app={ app } /></ShellView>)
  }

  const player = makeJITRouter(app, 'player', save => {
    require.ensure(
      [ './player/client-routes' ],
      () => save(require('./player/client-routes')(app)),
      'player'
    )
  })

  const witchHunt = makeJITRouter(app, 'witch-hunt', save => {
    require.ensure(
      [ './witch-hunt/client-routes' ],
      () => save(require('./witch-hunt/client-routes')(app)),
      'witch-hunt'
    )
  })

  return router
    .use(playerSetup)
    .get('/:locale/', home)
    .get('/:locale/player', player)
    .get('/:locale/witch-hunt', witchHunt)
    .get((ctx, next) => app.onError()) // 404
    .use((err, ctx, next) => app.onError(err)) // 500
}

/**
 * Utility to just-in-time load game-specific code
 **/
function makeJITRouter(app, key, ensure) {
  const wrappingRouter = new Router()
  let dynamicRouter = null
  return wrappingRouter.use((ctx, next) => {
    if (dynamicRouter) { return dynamicRouter.run(ctx, next) }
    app.stores.config.setLoading(key)
    ensure(router => {
      app.stores.config.clearLoading(key)
      dynamicRouter = router
      router.run(ctx, next)
    })
  })
}

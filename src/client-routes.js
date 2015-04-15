// allow client code-split to just sync require on server
if (typeof require.ensure !== 'function') { require.ensure = (_, fn) => fn(require) }

import React from 'react'
import Router from '../lib/router'
import HomeView from './home/view'

export default function Routes(app) {
  const router = new Router()
  const DEFAULT_ROUTE = '/en-US'

  function setLocale (ctx, next) {
    app.stores.config.setLocale(ctx.params.locale || 'en-US')
    next()
  }

  function home (ctx, next) {
    app.render(<HomeView app={ app } />)
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

  function redirectToDefault (ctx, next) {
    if (ctx.path === DEFAULT_ROUTE) { return next() }
    router.route(DEFAULT_ROUTE)
  }

  return router
    .get('/:locale(/?.*)', setLocale)
    .get('/:locale', home)
    .get('/:locale/player', player)
    .get('/:locale/witch-hunt', witchHunt)
    .get('*', redirectToDefault)
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

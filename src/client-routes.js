// allow client code-split to just sync require on server
require.ensure || require.ensure = (_, fn) => fn(require)

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

  const player = makeJITRoute(app, 'player', save => {
    require.ensure([ './player/client-routes' ],
      () => save(require('./player/client-routes')(app))
    )
  })

  const witchHunt = makeJITRoute(app, 'witch-hunt', save => {
    require.ensure([ './witch-hunt/client-routes' ],
      () => save(require('./witch-hunt/client-routes')(app))
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
const jitRoutes = {}
function makeJITRoute(app, key, ensure) {
  return (ctx, next) => {
    if (jitRoutes[key]) { return jitRoutes[key](ctx, next) }
    app.stores.config.setLoading(key)
    ensure(route => {
      jitRoutes[key] = route
      app.stores.config.clearLoading(key)
      route(ctx, next)
    })
  }
}

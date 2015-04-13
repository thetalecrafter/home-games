// allow client code-split to just sync require on server
require.ensure || require.ensure = (_, fn) => fn(require)

import Router from '../lib/router'

export default function Routes(app) {
  const router = new Router()
  const DEFAULT_ROUTE = '/en-US'

  function setLocale (ctx, next) {
    app.stores.config.setLocale(ctx.params.locale || 'en-US')
    next()
  }

  const witchHunt = makeJITRoute('witch-hunt', save => {
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

// allow client code-split to just sync require on server
if (typeof require.ensure !== 'function') { require.ensure = (_, fn) => fn(require) }

const Router = require('middle-router')
const jitRouter = require('./jit-router')

const resolveLocale = require('./resolve-locale')
const homeRouter = require('../home/client-router')
const loadPlayerReducer = require('../players/load-reducer')
const loadPlayerState = require('../players/load-state')

module.exports = function createRouter (options) {
  const router = Router()
    .on('route', (args) => {
      Object.assign(args, options)
    })

    .use('/', ({ redirect, resolve }) => { resolve(redirect('/en/')) })

    .use(loadPlayerReducer, loadPlayerState)

    .use('/:locale/*', resolveLocale)

    .use('/:locale', homeRouter, Router()
      .lazy('/players', jitRouter((save) => require.ensure(
        [], function () { save(require('../players/client-router')) }, 'witch-hunt'
      )))

      .lazy('/witch-hunt', jitRouter((save) => require.ensure(
        [], function () { save(require('../witch-hunt/client-router')) }, 'witch-hunt'
      )))

      .lazy('/intercept', jitRouter((save) => require.ensure(
        [], function () { save(require('../intercept/client-router')) }, 'intercept'
      )))
    )
  return router
}

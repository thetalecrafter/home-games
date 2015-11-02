// allow client code-split to just sync require on server
if (typeof require.ensure !== 'function') { require.ensure = (_, fn) => fn(require) }

import Router from 'middle-router'
import jitRouter from './jit-router'

import homeRouter from '../home/client-router'
import loadPlayerReducer from '../players/load-reducer'
import loadPlayerState from '../players/load-state'

export default function createRouter (options) {
  const router = Router()
    .on('route', (args) => {
      Object.assign(args, options)
    })

    .use(loadPlayerReducer, loadPlayerState)

    .use('/:locale', homeRouter)

    .use('/:locale', Router()
      .use('/players', jitRouter(save => require.ensure(
        [ '../players/client-router' ],
        () => save(require('../players/client-router')),
        'players'
      )))

      .use('/witch-hunt', jitRouter(save => require.ensure(
        [ '../witch-hunt/client-router' ],
        () => save(require('../witch-hunt/client-router')),
        'witch-hunt'
      )))

      .use('/intercept', jitRouter(save => require.ensure(
        [ '../intercept/client-router' ],
        () => save(require('../intercept/client-router')),
        'intercept'
      )))
    )
  return router
}

import Router from 'middle-router'
import { SET_LOADING_CODE } from './constants'

/**
 * Utility to just-in-time load game-specific code
 **/
export default function jitRouter (ensure) {
  let dynamicRouter = null
  return Router().use((ctx, next) => {
    if (dynamicRouter) return dynamicRouter.run(ctx, next)
    if (ctx.isClient) ctx.store.dispatch({ type: SET_LOADING_CODE, value: true, isRemote: true })
    ensure(router => {
      if (ctx.isClient) ctx.store.dispatch({ type: SET_LOADING_CODE, value: false, isRemote: true })
      dynamicRouter = router
      router.run(ctx, next)
    })
  })
}

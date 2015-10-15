import Router from 'middle-router'
import { SET_LOADING_CODE } from './constants'

/**
 * Utility to just-in-time load game-specific code
 **/
export default function jitRouter (ensure) {
  let isLoaded = false
  let proxy = Router()
  return proxy.use(ctx => {
    if (isLoaded) return isLoaded
    if (ctx.isClient) ctx.store.dispatch({ type: SET_LOADING_CODE, value: true, isRemote: true })
    return new Promise(resolve => ensure(router => {
      if (ctx.isClient) ctx.store.dispatch({ type: SET_LOADING_CODE, value: false, isRemote: true })
      proxy.use(router)
      resolve(isLoaded = true)
    }))
  })
}

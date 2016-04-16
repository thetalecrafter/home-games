import Router from 'middle-router'
import middleRun from 'middle-run'
import { SET_LOADING_CODE } from './constants'

/**
 * Utility to just-in-time load game-specific code
 **/
export default function jitRouter (ensure) {
  let run
  return Router().use((step) => {
    if (run) return run(step)
    let { isClient, store } = step
    if (isClient) store.dispatch({ type: SET_LOADING_CODE, value: true, isRemote: true })
    return new Promise((resolve) => ensure(({ default: router }) => {
      if (isClient) store.dispatch({ type: SET_LOADING_CODE, value: false, isRemote: true })
      run = middleRun(router.middleware)
      resolve(run(step))
    }))
  })
}

const Router = require('middle-router')
const middleRun = require('middle-run')
const { SET_LOADING_CODE } = require('./constants')

/**
 * Utility to just-in-time load game-specific code
 **/
module.exports = function jitRouter (ensure) {
  let run
  return Router().use((step) => {
    if (run) return run(step)
    let { isClient, store } = step
    if (isClient) store.dispatch({ type: SET_LOADING_CODE, value: true, isRemote: true })
    return new Promise((resolve) => ensure((router) => {
      if (isClient) store.dispatch({ type: SET_LOADING_CODE, value: false, isRemote: true })
      run = middleRun(router.middleware)
      resolve(run(step))
    }))
  })
}

const { SET_LOADING_CODE } = require('./constants')

/**
 * Utility for just-in-time loaded game-specific code
 **/
module.exports = function jitRouter (ensure) {
  return ({ isClient, store }) => {
    if (isClient) store.dispatch({ type: SET_LOADING_CODE, value: true, isRemote: true })
    return new Promise(ensure).then((router) => {
      if (isClient) store.dispatch({ type: SET_LOADING_CODE, value: false, isRemote: true })
      return router
    })
  }
}

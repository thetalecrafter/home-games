const { SET_LOADING_CODE } = require('./constants')

module.exports = {
  isLoadingCode (state = false, action) {
    switch (action.type) {
      case SET_LOADING_CODE:
        return !!action.value
      default:
        return state
    }
  },

  config (state = {}, action) {
    return state
  },

  http (state = {}, action) {
    return state
  }
}

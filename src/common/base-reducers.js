import { SET_LOADING_CODE } from './constants'

export default {
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

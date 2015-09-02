import {
  CREATE_PLAYER,
  UPDATE_PLAYER,
  DELETE_PLAYER
} from './constants'

export default {
  create (player) {
    return { type: CREATE_PLAYER, player }
  },

  update (player) {
    return { type: UPDATE_PLAYER_NAME, player }
  },

  delete ({ id }) {
    return { type: DELETE_PLAYER, player: { id } }
  }
}

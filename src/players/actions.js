const {
  CREATE_PLAYER,
  UPDATE_PLAYER,
  DELETE_PLAYER,
  UPDATE_PLAYER_AVATAR
} = require('./constants')

module.exports = {
  create (player) {
    return { type: CREATE_PLAYER, player }
  },

  update (player) {
    return { type: UPDATE_PLAYER, player }
  },

  updateAvatar (player) {
    return { type: UPDATE_PLAYER_AVATAR, player }
  },

  delete ({ id }) {
    return { type: DELETE_PLAYER, player: { id } }
  }
}

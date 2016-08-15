const {
  CREATE_PLAYER,
  UPDATE_PLAYER,
  DELETE_PLAYER
} = require('./constants')

module.exports = {
  create (player) {
    return { type: CREATE_PLAYER, player }
  },

  update (player) {
    return { type: UPDATE_PLAYER, player }
  },

  delete ({ id }) {
    return { type: DELETE_PLAYER, player: { id } }
  }
}

const compare = require('../../lib/natural-compare')
const {
  REPLACE_PLAYERS,
  CREATE_PLAYER,
  UPDATE_PLAYER,
  DELETE_PLAYER
} = require('./constants')

const initialState = []

module.exports = function players (state = initialState, action) {
  switch (action.type) {

    case REPLACE_PLAYERS:
      return action.players

    case CREATE_PLAYER:
      const isPlaying = state.some(({ id }) => id === action.player.id)
      if (isPlaying) return state

      return (state
        .concat(action.player)
        .sort((a, b) => compare(a.name, b.name))
      )

    case UPDATE_PLAYER:
      return (state
        .map((player) => (
          (player.id !== action.player.id) ? player
          : Object.assign({}, player, action.player)
        ))
        .sort((a, b) => compare(a.name, b.name))
      )

    case DELETE_PLAYER:
      return (state
        .filter(({ id }) => action.player.id !== id)
      )

    default:
      return state

  }
}

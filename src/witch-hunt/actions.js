const {
  CREATE_GAME,
  START_GAME,
  ADD_PLAYER,
  VOTE,
  CONFIRM,
  END_GAME
} = require('./constants')

module.exports = {
  create () {
    return { type: CREATE_GAME }
  },

  start () {
    return { type: START_GAME }
  },

  addPlayer (player) {
    return { type: ADD_PLAYER, player }
  },

  vote ({ id, vote }) {
    return { type: VOTE, player: { id, vote } }
  },

  confirm ({ id }) {
    return { type: CONFIRM, player: { id } }
  },

  end () {
    return { type: END_GAME }
  }
}

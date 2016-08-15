const {
  CREATE_GAME,
  START_GAME,
  ADD_PLAYER,
  ADD_TO_ROSTER,
  REMOVE_FROM_ROSTER,
  READY,
  VOTE,
  INTERCEPT,
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

  addToRoster ({ id }) {
    return { type: ADD_TO_ROSTER, player: { id } }
  },

  removeFromRoster ({ id }) {
    return { type: REMOVE_FROM_ROSTER, player: { id } }
  },

  ready () {
    return { type: READY }
  },

  vote ({ id }, vote) {
    return { type: VOTE, player: { id }, vote }
  },

  intercept ({ id }, result) {
    return { type: INTERCEPT, player: { id }, result }
  },

  end () {
    return { type: END_GAME }
  }
}

const {
  stages,

  REPLACE_GAME,
  TRANSITION,
  CREATE_GAME,
  START_GAME,
  ADD_PLAYER,
  VOTE,
  CONFIRM,
  END_GAME
} = require('./constants')

const initialState = { players: [] }

module.exports = function witchHunt (state = initialState, action) {
  switch (action.type) {

    case REPLACE_GAME:
    case TRANSITION:
      return action.state

    case CREATE_GAME:
      return {
        stage: stages.ADD_PLAYERS,
        result: null,
        players: []
      }

    case START_GAME:
      return Object.assign({}, state, {
        players: state.players.map((player) =>
          Object.assign({}, player, { isReady: true })
        )
      })

    case ADD_PLAYER: {
      const isPlaying = state.players.some(({ id }) => id === action.player.id)
      if (isPlaying) return state
      return Object.assign({}, state, {
        players: (state.players
          .concat(action.player)
          .sort()
        )
      })
    }

    case VOTE: {
      let isChanged = false
      const players = state.players.map((player) => {
        if (player.id !== action.player.id) return player
        if (player.vote === action.player.vote) return player
        isChanged = true
        return Object.assign({}, player, { vote: action.player.vote })
      })
      if (!isChanged) return state
      return Object.assign({}, state, { players })
    }

    case CONFIRM: {
      let isChanged = false
      const players = state.players.map((player) => {
        if (player.id !== action.player.id) return player
        if (player.isReady) return player
        isChanged = true
        return Object.assign({}, player, { isReady: true })
      })
      if (!isChanged) return state
      return Object.assign({}, state, { players })
    }

    case END_GAME:
      return initialState

    default:
      return state

  }
}

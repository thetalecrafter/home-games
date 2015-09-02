import compare from '../../lib/natural-compare'
import {
  stages,

  REPLACE_GAME,
  TRANSITION,
  CREATE_GAME,
  START_GAME,
  ADD_PLAYER,
  VOTE,
  CONFIRM,
  END_GAME
} from './constants'

const initialState = { players: [] }

export default function witchHunt (state = initialState, action) {
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
    return {
      ...state,
      players: state.players.map(player => ({
        ...player, isReady: true
      }))
    }

  case ADD_PLAYER: {
    const isPlaying = state.players.some(({ id }) => id === action.player.id)
    if (isPlaying) return state
    return {
      ...state,
      players: (state.players
        .concat(action.player)
        .sort((a, b) => compare(a.name, b.name))
      )
    }
  }

  case VOTE: {
    let isChanged = false
    const players = state.players.map(player => {
      if (player.id !== action.player.id) return player
      if (player.vote === action.player.vote) return player
      isChanged = true
      return { ...player, vote: action.player.vote }
    })
    if (!isChanged) return state
    return { ...state, players }
  }

  case CONFIRM: {
    let isChanged = false
    const players = state.players.map(player => {
      if (player.id !== action.player.id) return player
      if (player.isReady) return player
      isChanged = true
      return { ...player, isReady: true }
    })
    if (!isChanged) return state
    return { ...state, players }
  }

  case END_GAME:
    return initialState

  default:
    return state

  }
}

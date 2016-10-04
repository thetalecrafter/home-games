const {
  stages,

  MAX_PLAYERS,

  REPLACE_GAME,
  TRANSITION,
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

const initialState = {
  stage: null,
  players: [],
  missions: [],
  currentMission: 0,
  currentLeader: 0,
  votes: {}
}

module.exports = function intercept (state = initialState, action) {
  switch (action.type) {

    case REPLACE_GAME:
    case TRANSITION:
      return action.state

    case CREATE_GAME:
      return Object.assign({}, initialState, {
        stage: stages.ADD_PLAYERS
      })

    case START_GAME:
    case READY:
    // triggers a transition server-side
      return state

    case ADD_PLAYER: {
      const isPlaying = state.players.some(({ id }) => id === action.player.id)
      const tooManyPlayers = state.players.length >= MAX_PLAYERS
      if (isPlaying || tooManyPlayers) return state
      return Object.assign({}, state, {
        players: (state.players
          .concat(action.player)
          .sort()
        )
      })
    }

    case ADD_TO_ROSTER: {
      const { missions, currentMission } = state
      const mission = missions[currentMission]
      if (!mission) return state

      const isPlaying = state.players.some(({ id }) => id === action.player.id)
      if (!isPlaying) return state

      const newRoster = mission.roster.slice()
      const isOnTeam = mission.roster.includes(action.player.id)
      if (isOnTeam) return state

      newRoster.push(action.player.id)
      const newMissions = missions.slice()
      newMissions[currentMission] = Object.assign({}, mission, { roster: newRoster.sort() })
      return Object.assign({}, state, { missions: newMissions })
    }

    case REMOVE_FROM_ROSTER: {
      const { missions, currentMission } = state
      const mission = missions[currentMission]
      if (!mission) return state

      const isPlaying = state.players.some(({ id }) => id === action.player.id)
      if (!isPlaying) return state

      const newRoster = mission.roster.slice()
      const isOnTeam = mission.roster.includes(action.player.id)
      if (!isOnTeam) return state

      newRoster.splice(newRoster.indexOf(action.player.id), 1)
      const newMissions = missions.slice()
      newMissions[currentMission] = Object.assign({}, mission, { roster: newRoster.sort() })
      return Object.assign({}, state, { missions: newMissions })
    }

    case VOTE: {
      const isPlaying = state.players.some(({ id }) => id === action.player.id)
      const mission = state.missions[state.currentMission]
      if (!mission) return state
      let isChanged = state.votes[action.player.id] !== action.vote
      if (!isPlaying || !isChanged) return state
      const votes = Object.assign({}, state.votes, {
        [action.player.id]: action.vote
      })
      return Object.assign({}, state, { votes })
    }

    case INTERCEPT: {
      const mission = state.missions[state.currentMission]
      if (!mission) return state
      const isOnTeam = mission.roster.includes(action.player.id)
      let isChanged = mission.results[action.player.id] !== action.result
      if (!isOnTeam || !isChanged) return state
      const results = Object.assign({}, mission.results, {
        [action.player.id]: action.result
      })
      const newMissions = state.missions.slice()
      newMissions[state.currentMission] = Object.assign({}, mission, { results })
      return Object.assign({}, state, { missions: newMissions })
    }

    case END_GAME:
      return initialState

    default:
      return state

  }
}

import newGame from './new-game'
import {
  stages,

  MIN_PLAYERS,
  MAX_PLAYERS,

  START_GAME,
  READY
} from './constants'

export default function transition (state, action) {
  switch (state.stage) {

    case stages.ADD_PLAYERS: {
      const canStart = (
      action.type === START_GAME &&
      state.players.length >= MIN_PLAYERS &&
      state.players.length <= MAX_PLAYERS
    )
      if (!canStart) return state
      return transitionFromAddPlayers(state)
    }

    case stages.INTRO: {
      const isReady = state.players.every(player => (
      state.votes[player.id] != null
    ))
      if (!isReady) return state
      return transitionFromIntro(state)
    }

    case stages.ROSTER: {
      if (action.type !== READY) return state
      const { missions, currentMission } = state
      const mission = missions[currentMission]
      if (!mission) return state
      const hasTeam = mission.roster.length === mission.size
      if (!hasTeam) return state
      return transitionFromRoster(state)
    }

    case stages.APPROVAL: {
      const hasAllVotes = state.players.every(player => (
      state.votes[player.id] != null
    ))
      if (!hasAllVotes) return state
      return transitionFromApproval(state)
    }

    case stages.MISSION: {
      const { missions, currentMission } = state
      const mission = missions[currentMission]
      if (!mission) return state
      const hasAllVotes = mission.roster.every(id => (
      mission.results[id] != null
    ))
      if (!hasAllVotes) return state
      return transitionFromMission(state)
    }

    default:
      return state
  }
}

function transitionFromAddPlayers (state) {
  return newGame(state)
}

function transitionFromIntro (state) {
  return { ...state, stage: stages.ROSTER, votes: {} }
}

function transitionFromRoster (state) {
  return { ...state, stage: stages.APPROVAL, votes: {} }
}

function transitionFromApproval (state) {
  const { players, missions, currentMission } = state
  const mission = missions[currentMission]
  const newMissions = missions.slice()
  const newState = { ...state, missions: newMissions, votes: {} }

  let pro = 0
  let con = 0
  state.players.forEach(player => {
    if (state.votes[player.id] === true) ++pro
    if (state.votes[player.id] === false) ++con
  })

  if (con >= pro) {
    if (mission.rejectedRosters >= 4) {
      newState.stage = stages.END // too many vote fails
    } else {
      newState.stage = stages.ROSTER
      newState.currentLeader = (state.currentLeader + 1) % players.length
    }
    newMissions[currentMission] = {
      ...mission,
      votes: state.votes,
      roster: [],
      rejectedRosters: mission.rejectedRosters + 1
    }
  } else {
    newState.stage = stages.MISSION
    newMissions[currentMission] = {
      ...mission,
      votes: state.votes,
      leader: players[state.currentLeader].id
    }
  }

  return newState
}

function transitionFromMission (state) {
  const { players, missions, currentMission } = state
  const mission = missions[currentMission]
  const newMissions = missions.slice()
  const newState = { ...state, missions: newMissions, votes: {} }

  let fails = 0
  mission.roster.forEach(id => {
    if (mission.results[id] === false) ++fails
  })

  const isSuccessful = (fails < mission.failLimit)
  newMissions[currentMission] = {
    ...mission,
    isSuccessful: isSuccessful
  }

  fails = 0
  let successes = 0
  newMissions.forEach(mission => {
    if (mission.isSuccessful === true) ++successes
    if (mission.isSuccessful === false) ++fails
  })

  const isLastMission = currentMission + 1 >= missions.length
  const half = missions.length / 2
  if (isLastMission || successes > half || fails > half) {
    newState.stage = stages.END
  } else {
    newState.stage = stages.ROSTER
    newState.currentLeader = (state.currentLeader + 1) % players.length
  }
  newState.currentMission = currentMission + 1

  return newState
}

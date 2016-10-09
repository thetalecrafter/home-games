const { stages, roles, errors, MIN_PLAYERS } = require('./constants')
const { ADD_PLAYERS, INTRO, NIGHT, MORNING, AFTERNOON, EVENING, END } = stages
const { WITCH, PURITAN } = roles

const transitions = {
  [ADD_PLAYERS]: transitionFromAddPlayers,
  [INTRO]: transitionFromIntro,
  [NIGHT]: transitionFromNight,
  [MORNING]: transitionFromMorning,
  [AFTERNOON]: transitionFromAfternoon,
  [EVENING]: transitionFromEvening
}

module.exports = function transition (state) {
  if (!isEveryoneReady(state)) return state

  const to = transitions[state.stage]
  if (!to) { throw new Error(errors.BAD_TRANSITION) }
  const newState = to(state)
  newState.players = newState.players.map((player) =>
    Object.assign({}, player, { isReady: false, vote: null })
  )
  return newState
}

function transitionFromAddPlayers (state) {
  const numPlayers = state.players.length
  if (numPlayers < MIN_PLAYERS) { throw new Error(errors.NUM_PLAYERS) }

  const stage = INTRO
  const result = null
  const players = state.players.map(
    (player) => Object.assign({}, player, { role: PURITAN })
  )
  let witchesLeft = Math.round(numPlayers / 4)
  while (witchesLeft > 0) {
    const index = Math.floor(Math.random() * numPlayers)
    const player = players[index]
    if (player.role !== WITCH) {
      player.role = WITCH
      --witchesLeft
    }
  }

  return { stage, result, players }
}

function transitionFromIntro (state) {
  return { stage: NIGHT, result: null, players: state.players }
}

function transitionFromNight (state) {
  let stage = MORNING
  const result = { stage }
  let players = state.players

  // choose victim, and suspicion
  const votes = {}
  let victimId = null
  players.forEach((player) => {
    if (player.isDead) { return } // skip dead people
    if (player.role === WITCH) {
      if (!player.vote) { throw new Error(errors.WITCH_MUST_VOTE) }
      const votePlayerId = player.vote
      if (!(votePlayerId in votes)) { votes[votePlayerId] = 0 }
      const countVotes = ++votes[votePlayerId]
      if (!victimId || countVotes > votes[victimId]) {
        victimId = votePlayerId
      }
    } else if (player.vote) {
      const followId = player.vote
      const followPlayer = players.find((player) => player.id === followId)
      const follow = result.follow || (result.follow = {})
      follow[player.id] = { followId, wasAwake: !!followPlayer.vote }
    }
  })
  if ((result.victimId = victimId)) {
    if ((result.victimDied = Math.random() < 0.9)) {
      players = killPlayer(victimId, players)
    }
  }

  return { stage, result, players }
}

function transitionFromMorning (state) {
  let stage = AFTERNOON
  const result = { stage }
  let players = state.players
  const isDone = isAllSame(state)

  // choose trial victim
  if (isDone) {
    stage = END
  } else {
    const votes = {}
    let victimId = null
    players.forEach((player) => {
      if (player.isDead) { return } // skip dead people
      if (!player.vote) { throw new Error(errors.EVERYONE_MUST_VOTE) }
      const votePlayerId = player.vote
      if (!(votePlayerId in votes)) { votes[votePlayerId] = 0 }
      const countVotes = ++votes[votePlayerId]
      if (!victimId || countVotes > votes[victimId]) {
        victimId = votePlayerId
      }
    })
    result.victimId = victimId
    players = players.map((player) => {
      if (player.id !== victimId) { return player }
      const isDead = Math.random() < (
        player.role === WITCH ? 0.2 : 0.6
      )
      result.victimDied = isDead
      return Object.assign({}, player, { isDead })
    })
  }

  return { stage, result, players }
}

function transitionFromAfternoon (state) {
  let stage = EVENING
  let { result, players } = state
  const { victimId, victimDied } = result
  const isDone = isAllSame(state)

  // should execute
  if (isDone) {
    stage = END
    result = { stage }
  } else if (victimDied) {
    stage = NIGHT
    result = { stage }
  } else {
    result = { stage, victimId }
    let yesVotes = 0
    let noVotes = 0
    players.forEach((player) => {
      if (player.isDead || player.id === victimId) { return } // skip dead people
      if (player.vote == null) { throw new Error(errors.EVERYONE_MUST_VOTE) }
      if (player.vote === true) { ++yesVotes }
      if (player.vote === false) { ++noVotes }
    })
    result.victimDied = yesVotes > noVotes
    if (result.victimDied) {
      players = killPlayer(result.victimId, players)
    }
  }

  return { stage, result, players }
}

function transitionFromEvening (state) {
  const stage = isAllSame(state) ? END : NIGHT
  const players = state.players
  return { stage, result: null, players }
}

function killPlayer (victimId, players) {
  return players.map((player) => {
    if (player.id !== victimId) return player
    return Object.assign({}, player, { isDead: true })
  })
}

function isAllWitches (state) {
  return state.players.every(
    ({ isDead, role }) => isDead || role === WITCH
  )
}

function isAllPuritans (state) {
  return state.players.every(
    ({ isDead, role }) => isDead || role === PURITAN
  )
}

function isAllSame (state) {
  return isAllWitches(state) || isAllPuritans(state)
}

function isEveryoneReady (state) {
  if (state.players.length < MIN_PLAYERS) { return false }
  return state.players.every((player) => player.isReady || player.isDead)
}

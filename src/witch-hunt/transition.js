import { stages, roles, errors } from './constants'
const { ADD_PLAYERS, INTRO, NIGHT, MORNING, AFTERNOON, EVENING, END } = stages
const { WITCH, PURITAN } = roles

const transitions = {
  [ADD_PLAYERS]: transitionToIntro,
  [INTRO]: transitionIntroToNight,
  [NIGHT]: transitionToMorning,
  [MORNING]: transitionToAfternoon,
  [AFTERNOON]: transitionToEvening,
  [EVENING]: transitionToNight
}

export default function transition (state) {
  const to = transitions[state.stage]
  if (!to) { throw new Error(errors.BAD_TRANSITION) }
  return to(state)
}

function transitionToIntro (state) {
  const numPlayers = state.players.length
  if (numPlayers < 4) { throw new Error(errors.NUM_PLAYERS) }

  const stage = INTRO
  const result = null
  const players = state.players.map(
    player => Object.assign({}, player, { role: PURITAN })
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

function transitionIntroToNight (state) {
  return { stage: NIGHT, result: null, players: state.players }
}

function transitionToMorning (state) {
  const stage = MORNING
  const result = {}
  let players = state.players

  // choose victim, and suspicion
  const votes = {}
  let victimId = null
  players.each(player => {
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
      const followPlayer = players.find(player => player.id === followId)
      const followed = result.followed || (result.followed = {})
      followed[followId] = !!followPlayer.vote
    }
  })
  result.victimId = victimId
  players = killPlayer(victimId, players)

  return { stage, result, players }
}

function transitionToAfternoon (state) {
  const stage = AFTERNOON
  const result = {}
  let players = state.players

  // choose trial victim
  const votes = {}
  let victimId = null
  players.each(player => {
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
  players = players.map(player => {
    if (player.id !== victimId) { return player }
    const isDead = Math.random() < (
      player.role === WITCH ? 0.2 : 0.8
    )
    result.victimDied = isDead
    return Object.assign({}, player, { isDead })
  })

  return { stage, result, players }
}

function transitionToEvening (state) {
  const stage = EVENING
  let { result, players } = stage

  // should execute
  if (result.victimDied) {
    result = null
  } else {
    result = {}
    let yesVotes = 0
    let noVotes = 0
    players.each(player => {
      if (player.isDead) { return } // skip dead people
      if (player.vote === true) { ++yesVotes }
      if (player.vote === false) { ++noVotes }
    })
    result.victimId = stage.result.victimId
    result.victimDied = yesVotes > noVotes
    if (result.victimDied) {
      players = killPlayer(result.victimId, players)
    }
  }

  return { stage, result, players }
}

function transitionToNight (state) {
  const players = state.players
  const isEnded = players.every(
    player => player.isDead || player.vote === true
  )
  const stage = isEnded ? END : NIGHT

  return { stage, result: null, players }
}

function killPlayer (victimId, players) {
  return players.map(player => {
    if (player.id !== victimId) { return player }
    return Object.assign({}, player, { isDead: true })
  })
}

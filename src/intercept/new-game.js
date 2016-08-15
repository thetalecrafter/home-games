const { roles, stages } = require('./constants')

const rosterSizes = [
  [ 2, 3, 2, 3, 3 ],
  [ 2, 3, 4, 3, 4 ],
  [ 2, 3, 3, 4, 4 ],
  [ 3, 4, 4, 5, 5 ],
  [ 3, 4, 4, 5, 5 ],
  [ 3, 4, 4, 5, 5 ]
]

const doubleAgents = [
  2,
  2,
  3,
  3,
  3,
  4
]

const twoFailsLimit = 7
const twoFailsIndex = 3

module.exports = function newGame (state) {
  const players = state.players.map((player) =>
    Object.assign({}, player, { role: roles.SPY })
  )
  const count = players.length
  const index = count - 5

  const missions = rosterSizes[index].map((size, index) => {
    const failLimit = (
      index === twoFailsIndex &&
      count >= twoFailsLimit
    ) ? 2 : 1
    return {
      size,
      failLimit,
      leader: null,
      roster: [],
      isSuccessful: null,
      votes: null,
      results: {},
      rejectedRosters: 0
    }
  })

  let doublesLeft = doubleAgents[index]
  while (doublesLeft > 0) {
    const player = players[Math.floor(Math.random() * count)]
    if (player.role === roles.SPY) {
      player.role = roles.DOUBLE
      --doublesLeft
    }
  }

  let molesLeft = 1
  while (molesLeft > 0) {
    const player = players[Math.floor(Math.random() * count)]
    if (player.role === roles.SPY) {
      player.role = roles.MOLE
      --molesLeft
    }
  }

  return Object.assign({}, state, {
    stage: stages.INTRO,
    players,
    missions,
    currentMission: 0,
    currentLeader: Math.floor(Math.random() * count)
  })
}

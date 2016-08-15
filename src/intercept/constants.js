// where the overall game is at
exports.stages = {
  ADD_PLAYERS: 'add-players', // setup your player
  INTRO: 'intro', // assigned roles, read begining of story
  ROSTER: 'roster', // determine team
  APPROVAL: 'approval', // vote on team
  MISSION: 'mission', // intercept or betray team
  END: 'end' // final result
}

exports.roles = {
  SPY: 'spy',
  DOUBLE: 'double-agent',
  MOLE: 'mole',
  UNKNOWN: 'unknown'
}

exports.MIN_PLAYERS = 5
exports.MAX_PLAYERS = 10

// actions
exports.REPLACE_GAME = 'in-replace-game'
exports.TRANSITION = 'in-transition'
exports.CREATE_GAME = 'in-create-game'
exports.START_GAME = 'in-start-game'
exports.ADD_PLAYER = 'in-add-player'
exports.ADD_TO_ROSTER = 'in-add-to-roster'
exports.REMOVE_FROM_ROSTER = 'in-remove-from-roster'
exports.VOTE = 'in-vote'
exports.INTERCEPT = 'in-intercept'
exports.END_GAME = 'in-end-game'

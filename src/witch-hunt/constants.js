// where the overall game is at
exports.stages = {
  ADD_PLAYERS: 'add-players', // setup your player
  INTRO: 'intro', // assigned roles, read begining of story
  NIGHT: 'night', // decide what to do
  MORNING: 'morning', // your decision results, decide who to put in trial
  AFTERNOON: 'afternoon', // trial result, possible execute vote
  EVENING: 'evening', // execution result
  END: 'end' // final result
}

exports.roles = {
  WITCH: 'witch',
  PURITAN: 'puritan',
  UNKNOWN: 'unknown'
}

exports.errors = {
  BAD_TRANSITION: 'bad-transition',
  NUM_PLAYERS: 'num-players',
  WITCH_MUST_VOTE: 'witch-must-vote',
  EVERYONE_MUST_VOTE: 'everyone-must-vote'
}

exports.MIN_PLAYERS = 4

// actions
exports.REPLACE_GAME = 'wha-replace-game'
exports.TRANSITION = 'wha-transition'
exports.CREATE_GAME = 'wha-create-game'
exports.START_GAME = 'wha-start-game'
exports.ADD_PLAYER = 'wha-add-player'
exports.VOTE = 'wha-vote'
exports.CONFIRM = 'wha-confirm'
exports.END_GAME = 'wha-end-game'

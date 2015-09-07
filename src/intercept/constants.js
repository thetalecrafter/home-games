// where the overall game is at
export const stages = {
  ADD_PLAYERS: 'add-players', // setup your player
  INTRO: 'intro', // assigned roles, read begining of story
  ROSTER: 'roster', // determine team
  APPROVAL: 'approval', // vote on team
  MISSION: 'mission', // intercept or betray team
  END: 'end' // final result
}

export const roles = {
  SPY: 'spy',
  DOUBLE: 'double-agent',
  MOLE: 'mole',
  UNKNOWN: 'unknown'
}

export const MIN_PLAYERS = 5
export const MAX_PLAYERS = 10

// actions
export const REPLACE_GAME = 'in-replace-game'
export const TRANSITION = 'in-transition'
export const CREATE_GAME = 'in-create-game'
export const START_GAME = 'in-start-game'
export const ADD_PLAYER = 'in-add-player'
export const ADD_TO_ROSTER = 'in-add-to-roster'
export const REMOVE_FROM_ROSTER = 'in-remove-from-roster'
export const VOTE = 'in-vote'
export const INTERCEPT = 'in-intercept'
export const END_GAME = 'in-end-game'

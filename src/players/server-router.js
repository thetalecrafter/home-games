const { Router } = require('express')
const persist = require('../common/persist')
const { events } = require('../dispatch-router')
const { REPLACE_PLAYERS, UPDATE_PLAYER_AVATAR } = require('./constants')
const reducer = require('./reducer')

let players = []
persist.read('players')
  .then((newPlayers) => {
    players = newPlayers || []
  })
  .catch(console.error)

persist.subscribe('dispatch', (action) => {
  const oldPlayers = players
  const newPlayers = reducer(players, action)
  if (newPlayers !== players) {
    players = newPlayers
    persist.write('players', players)
  }
  if (action.type === UPDATE_PLAYER_AVATAR) {
    const { id, avatar, lastUpdated } = action.player
    let oldAvatar = getPlayerAvatarFile(oldPlayers, id)

    let ext = (avatar.match(/image\/(\w+)/) || [])[1]
    if (ext === 'jpeg') ext = 'jpg'
    const buffer = Buffer.from(avatar.slice(avatar.indexOf(',') + 1), 'base64')

    persist.writeFile(`player-avatar-${id}-${lastUpdated}.${ext}`, buffer)
      .then(() => oldAvatar ? persist.deleteFile(oldAvatar) : null)
      .catch(console.error)
  }
})

function getPlayerAvatarFile (players, id) {
  let avatar
  players.forEach((player) => {
    if (player.id === id) avatar = player.avatar
  })
  if (avatar) {
    return `player-avatar-${id}-${avatar.replace(/[^\/]*\//g, '')}` // eslint-disable-line
  }
}

events.on('connect', ({ send }) => {
  send({ type: REPLACE_PLAYERS, players })
})

module.exports = Router()
  .get('/state', (req, res, next) => res.send(players))
  .get('/:id/avatar/:lastUpdated', (req, res, next) => {
    const { id, lastUpdated } = req.params
    const filename = `player-avatar-${id}-${lastUpdated}`
    const ext = filename.slice(filename.indexOf('.') + 1)
    persist.readFile(filename).then((file) => {
      if (file) return file
      // try again after 1 second
      return new Promise((resolve) => setTimeout(resolve, 1000))
        .then(() => persist.readFile(filename))
    })
    .then((file) => {
      if (file) res.type(ext).send(file)
    })
    .catch(next)
  })

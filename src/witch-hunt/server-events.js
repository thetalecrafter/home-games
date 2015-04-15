import ServerEventSource from '../common/eventsource/server'

export default function (actions, store) {
  let events = new ServerEventSource()
  events.on('connect', (req, res) => {
    events.sendToClient(res, { name: 'update', data: [
      store.getStateForPlayer(req.session.playerId)
    ] })
  })

  actions.on('create', () => {
    events.sendEvent({ name: 'create', data: [ store.state ] })
  })
  actions.on('add-player', player => {
    events.sendEvent({ name: 'add-player', data: [ player ] })
  })
  actions.on('player-vote', (player, vote) => {
    events.sendEvent({ name: 'player-vote', data: [ { id: player.id }, vote ] })
  })
  actions.on('player-ready', player => {
    events.sendEvent({ name: 'player-ready', data: [ { id: player.id } ] })
  })
  actions.on('change-stage', data => {
    events.sendEvent({ name: 'change-stage', data: [ data ] })
  })

  return events.expressHandler
}

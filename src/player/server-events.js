import ServerEventSource from '../common/eventsource/server'

export default function (actions, store) {
  let events = new ServerEventSource()
  events.on('connect', (req, res) => {
    events.sendToClient(res, { name: 'bootstrap', data: [
      store.getStateForPlayer(req.session.playerId)
    ] })
  })

  actions.on('create', player => {
    events.sendEvent({ name: 'update', data: [ player ] })
  })
  actions.on('update', player => {
    events.sendEvent({ name: 'update', data: [ player ] })
  })
  actions.on('delete', player => {
    events.sendEvent({ name: 'delete', data: [ { id: player.id } ] })
  })

  return events
}

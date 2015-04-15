import ClientEventSource from '../common/eventsource/client'

export default function (actions, store) {
  const source = new ClientEventSource(actions.getBaseUrl() + 'events')
  source.relay('create', actions.bootstrap)
  source.relay('add-player', actions.addPlayer)
  source.relay('player-vote', actions.vote)
  source.relay('player-ready', actions.ready)
  source.relay('change-stage', actions.changeState)
  return source
}

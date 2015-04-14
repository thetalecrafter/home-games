import ClientEventSource from '../common/eventsource/client'

export default function (actions, store) {
  const source = new ClientEventSource(actions.baseUrl + 'events')
  source.relay('bootstrap', actions.bootstrap)
  source.relay('update', actions.update)
  source.relay('delete', actions.delete)
  return source
}

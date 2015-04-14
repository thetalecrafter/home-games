/*global EventSource*/
export default function (actions, store) {
  const source = new EventSource(actions.baseUrl + 'events')

  function relay (action) {
    return event => {
      const args = JSON.parse(event.data)
      actions[action].apply(actions, args)
    }
  }

  source.addEventListener('create', relay('bootstrap'), false)
  source.addEventListener('add-player', relay('addPlayer'), false)
  source.addEventListener('player-vote', relay('vote'), false)
  source.addEventListener('player-ready', relay('ready'), false)
  source.addEventListener('change-stage', relay('changeState'), false)

  source.addEventListener('error', event => {
    if (event.target.readyState === EventSource.CLOSED) {
      console.error('Witch Hunt EventSource connection closed')
    } else if (event.target.readyState === EventSource.CONNECTING) {
      console.info('Witch Hunt EventSource reconnecting')
    } else {
      console.error('Witch Hunt EventSource error', event)
    }
  }, false)
}

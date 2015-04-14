/*global EventSource*/
export default function (actions, store) {
  const source = new EventSource(actions.baseUrl + 'events')

  function relay (action) {
    return event => {
      const args = JSON.parse(event.data)
      actions[action].apply(actions, args)
    }
  }

  source.addEventListener('bootstrap', relay('bootstrap'), false)
  source.addEventListener('update', relay('update'), false)
  source.addEventListener('delete', relay('delete'), false)

  source.addEventListener('error', event => {
    if (event.target.readyState === EventSource.CLOSED) {
      console.error('Player EventSource connection closed')
    } else if (event.target.readyState === EventSource.CONNECTING) {
      console.info('Player EventSource reconnecting')
    } else {
      console.error('Player EventSource error', event)
    }
  }, false)
}

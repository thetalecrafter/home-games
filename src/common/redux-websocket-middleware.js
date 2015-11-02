/* global WebSocket */
export default function websocketMiddleware (store) {
  const url = (`${store.getState().config.api}/actions`).replace(/^http(s?)/, 'ws$1')
  let buffer = []
  let ws

  function onMessage (event) {
    try {
      const action = JSON.parse(event.data)
      action.isRemote = true
      store.dispatch(action)
    } catch (err) {
      console.error(err)
    }
  }

  function onError (err) {
    console.error(err)
  }

  function onClose () {
    ws.removeEventListener('message', onMessage)
    ws.removeEventListener('error', onError)
    ws.removeEventListener('close', onClose)
    ws = null
    setTimeout(connect, 3000)
  }

  function connect () {
    ws = new WebSocket(url)
    ws.addEventListener('message', onMessage)
    ws.addEventListener('error', onError)
    ws.addEventListener('close', onClose)

    buffer.forEach(action => ws.send(JSON.stringify(action)))
    buffer.length = 0
  }

  connect()
  return dispatch => action => {
    if (action.isRemote) return dispatch(action)

    try {
      if (ws) ws.send(JSON.stringify(action))
      else buffer.push(action)
    } catch (err) {
      console.error('Error dispatching action to server', err)
    }

    return dispatch(action)
  }
}

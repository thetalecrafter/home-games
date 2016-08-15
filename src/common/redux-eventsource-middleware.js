/* global EventSource, fetch */
module.exports = function serverMiddleware (store) {
  const url = `${store.getState().config.api}/actions`
  let source

  function logError (event) {
    if (event.target.readyState === EventSource.CLOSED) {
      console.error('EventSource connection closed', event.target.url)
      source.removeEventListener('error', logError, false)
      source.removeEventListener('dispatch', dispatch, false)
      setTimeout(connect, 3000)
    } else if (event.target.readyState === EventSource.CONNECTING) {
      console.info('EventSource reconnecting', event.target.url)
    } else {
      console.error('EventSource error', event.target.url, event)
    }
  }

  function dispatch (event) {
    try {
      const action = JSON.parse(event.data)
      action.isRemote = true
      store.dispatch(action)
    } catch (err) {
      console.error(err)
    }
  }

  function connect () {
    source = new EventSource(url)
    source.addEventListener('error', logError, false)
    source.addEventListener('dispatch', dispatch, false)
  }

  connect()

  return (dispatch) => (action) => {
    if (!action.isRemote) {
      fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(action)
      }).catch((err) => {
        console.error('Error dispatching action to server', err)
      })
    }
    return dispatch(action)
  }
}

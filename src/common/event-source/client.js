/* global EventSource */

function logError (event) {
  if (event.target.readyState === EventSource.CLOSED) {
    console.error('EventSource connection closed', event.target.url)
  } else if (event.target.readyState === EventSource.CONNECTING) {
    console.info('EventSource reconnecting', event.target.url)
  } else {
    console.error('EventSource error', event.target.url, event)
  }
}

export default function subscribeToSource (store, url) {
  function dispatch(event) {
    try {
      const action = JSON.parse(event.data)
      action.isRemote = true
      store.dispatch(action)
    } catch (err) {
      console.error(err)
    }
  }
  const source = new EventSource(url)
  source.addEventListener('error', logError, false)
  source.addEventListener('dispatch', dispatch, false)
  return () => {
    source.removeEventListener('error', logError, false)
    source.removeEventListener('dispatch', dispatch, false)
  }
}

/* global EventSource */
export default class ClientEventSource {
  constructor (url) {
    this.source = new EventSource(url)
    this.source.addEventListener('error', event => {
      if (event.target.readyState === EventSource.CLOSED) {
        console.error('EventSource connection closed', url)
      } else if (event.target.readyState === EventSource.CONNECTING) {
        console.info('EventSource reconnecting', url)
      } else {
        console.error('EventSource error', url, event)
      }
    }, false)
  }

  relay (evtName, action) {
    this.source.addEventListener(evtName, event => {
      const args = JSON.parse(event.data)
      action(...args)
    }, false)
  }
}

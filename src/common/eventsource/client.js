/* global EventSource */
export default function ClientEventSource (url) {
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
ClientEventSource.prototype = {
  on (evtName, fn) {
    this.source.addEventListener(evtName, fn, false)
  }
}

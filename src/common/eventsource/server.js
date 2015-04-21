import { EventEmitter } from 'events'

let preamble = []
preamble.length = 2049
preamble = preamble.join(' ')
const heartbeatTimeout = 10 * 1000

export default function ServerEventSource () {
  if (!(this instanceof ServerEventSource)) {
    return new ServerEventSource()
  }

  EventEmitter.call(this)
  this.clients = []
  this.timer = null
  this.heartbeat = this.heartbeat.bind(this)
  this.expressHandler = this.expressHandler.bind(this)
}
ServerEventSource.prototype = Object.assign(
  Object.create(EventEmitter.prototype), {

  expressHandler (req, res, next) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    })
    if (req.query.evs_preamble) {
      res.write(':' + preamble + '\n') // 2kB padding for IE
    }
    res.write('retry: 10000\n')

    const client = { request: req, response: res }
    this.clients = this.clients.concat(client)
    res.socket.setTimeout(0)
    req.connection.on('close', () => {
      this.clients = this.clients.filter(c => c !== client)
    })

    if (!this.timer) { this.heartbeat() }
    this.emit('connect', client)
  },

  heartbeat () {
    this.broadcast({ data: Date.now() })
  },

  broadcast (event) {
    clearTimeout(this.timer)
    this.timer = !this.clients.length ? null :
      setTimeout(this.heartbeat, heartbeatTimeout)

    const time = process.hrtime()
    event.id = time[0] * 1e9 + time[1]
    for (let client of this.clients) {
      this.send(client, event)
    }
  },

  send (client, { id, name, data }) {
    if (typeof data !== 'function') {
      return this.write(client, { id, name, data })
    }
    data(client, (err, data) => {
      if (err) {
        return console.error(err.stack)
      } else {
        this.write(client, { id, name, data })
      }
    })
  },

  write (client, { id, name, data }) {
    const res = client.response
    if (name) { res.write(`event: ${name}\n`) }
    if (id) { res.write(`id: ${id}\n`) }
    res.write(`data: ${JSON.stringify(data)}\n\n`)
  }
})

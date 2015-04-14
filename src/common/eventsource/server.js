import { EventEmitter } from 'events'

let preamble = []
preamble.length = 2049
preamble = preamble.join(' ')
const heartbeatTimeout = 10 * 1000

export default class ServerEventSource extends EventEmitter {
  constructor () {
    this.clients = []
    this.timer = null
    this.heartbeat = this.heartbeat.bind(this)
  }

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

    this.clients = this.clients.concat(res)
    res.socket.setTimeout(0)
    req.connection.on('close', () => {
      this.clients = this.clients.filter(client => client !== res)
    })

    if (!this.timer) { this.heartbeat() }
    this.emit('connect', req, res)
  }

  heartbeat () {
    this.sendEvent({ data: Date.now() })
  }

  sendEvent (event) {
    clearTimeout(this.timer)
    this.timer = !this.clients.length ? null :
      setTimeout(this.heartbeat, heartbeatTimeout)

    const time = process.hrtime()
    event.id = time[0] * 1e9 + time[1]
    for (let client of this.clients) {
      this.sendToClient(client, event)
    }
  }

  sendToClient (res, { id, name, data }) {
    if (name) { res.write(`event: ${name}\n`) }
    if (id) { res.write(`id: ${id}\n`) }
    res.write(`data: ${JSON.stringify(data)}\n\n`)
  }
}

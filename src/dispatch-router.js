const { Router } = require('express')
const persist = require('./common/persist')
const { EventEmitter } = require('events')

const events = new EventEmitter()
events.setMaxListeners(Infinity)

let preamble = []
preamble.length = 2049
preamble = preamble.join(' ')
const heartbeatTime = 10 * 1000

module.exports = Router()
  .get('/actions', (req, res, next) => {
    const send = (data) => {
      const msg = JSON.stringify(data, null, '  ')
        .replace(/\r?\n/g, '\ndata: ')
      res.write(`event: dispatch\ndata: ${msg}\n\n`)
      res.flush()
    }

    const sendShutdown = (code) => {
      res.end(`event: shutdown\ndata: ${code}\n\n`)
    }

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    })
    if (req.query.evs_preamble) {
      res.write(':' + preamble + '\n') // 2kB padding for IE
    }
    res.write('retry: 10000\n')
    res.flush()
    res.socket.setTimeout(0)

    const timer = setInterval(() => {
      res.write(`event: heartbeat\ndata: ${Date.now()}\n\n`)
    }, heartbeatTime)

    persist.subscribe('dispatch', send)
    persist.subscribe('shutdown', sendShutdown)
    req.connection.on('close', () => {
      persist.unsubscribe('dispatch', send)
      persist.unsubscribe('shutdown', sendShutdown)
      clearInterval(timer)
    })
    events.emit('connect', { request: req, send })
  })

  .post('/actions', (req, res, next) => {
    persist.publish('dispatch', req.body)
    res.status(204).end()
  })

process.on('SIGTERM', () => {
  persist.publish('shutdown', 'SIGTERM')
  setTimeout(() => process.exit(128 + 15), 10)
})

module.exports.events = events

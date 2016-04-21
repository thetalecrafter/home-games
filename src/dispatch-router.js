import { Router } from 'express'
import persist from './common/persist'
import { EventEmitter } from 'events'

export const events = new EventEmitter()
events.setMaxListeners(Infinity)

let preamble = []
preamble.length = 2049
preamble = preamble.join(' ')
const heartbeatTime = 10 * 1000

export default Router()
  .get('/actions', (req, res, next) => {
    const send = (data) => {
      const msg = JSON.stringify(data, null, '  ')
        .replace(/\r?\n/g, '\ndata: ')
      res.write(`event: dispatch\ndata: ${msg}\n\n`)
      res.flush()
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
    req.connection.on('close', () => {
      persist.unsubscribe('dispatch', send)
      clearInterval(timer)
    })
    events.emit('connect', { request: req, send })
  })

  .post('/actions', (req, res, next) => {
    persist.publish('dispatch', req.body)
    res.status(204).end()
  })

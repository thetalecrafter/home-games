import { Router } from 'express'
import persist from './common/persist'
import { EventEmitter } from 'events'

export const events = new EventEmitter()
events.setMaxListeners(Infinity)

export default Router()
  .get('/actions', (req, { ws }, next) => {
    const send = data => ws.send(JSON.stringify(data))
    persist.subscribe('dispatch', send)
    ws.on('close', () => persist.unsubscribe('dispatch', send))
    ws.on('message', data => persist.publish('dispatch', JSON.parse(data)))
    events.emit('connect', ws)
  })

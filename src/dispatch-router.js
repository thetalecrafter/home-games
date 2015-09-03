import { Router } from 'express'
import persist from './common/persist'
import EventSource from './common/event-source/server'

export const eventSource = new EventSource()
persist.subscribe('dispatch', data => {
  eventSource.broadcast({ name: 'dispatch', data })
})

export default Router()

  .get('/actions', eventSource.expressHandler)

  .post('/dispatch', (req, res, next) => {
    persist.publish('dispatch', req.body)
    res.send(req.body)
  })

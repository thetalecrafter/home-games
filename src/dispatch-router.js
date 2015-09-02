import { Router } from 'express'
import persist from './common/persist'
import EventSource from './common/event-source/server'

const source = new EventSource()
persist.subscribe('dispatch', data => {
  source.broadcast({ name: 'dispatch', data })
})

export default Router()

  .get('/actions', source.expressHandler)

  .post('/dispatch', (req, res, next) => {
    persist.publish('dispatch', req.body)
    res.send(req.body)
  })

const express = require('express')
const client = require('./client-server')
const dispatchRouter = require('./dispatch-router')
const playersRouter = require('./players/server-router')
const witchHuntRouter = require('./witch-hunt/server-router')
const interceptRouter = require('./intercept/server-router')

function error (err, req, res, next) {
  let status = err.status || 500
  let message = err.message
  if (err.code === 'ENOENT') {
    status = 404
    message = 'No such game'
  }
  console.error(err.stack)
  res.status(status).send({
    error: { message: message }
  })
}

const api = express.Router()
  .use(dispatchRouter)
  .use('/players', playersRouter)
  .use('/witch-hunt', witchHuntRouter)
  .use('/intercept', interceptRouter)

module.exports = express.Router()
  .use('/api/v1', api)
  .use(express.static('dist', {
    index: false,
    redirect: false,
    maxAge: 0
  }))
  .use(client)
  .use(error)

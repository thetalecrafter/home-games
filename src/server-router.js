import express from 'express'
import client from './client-server'
import dispatchRouter from './dispatch-router'
import playersRouter from './players/server-router'
import witchHuntRouter from './witch-hunt/server-router'

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

export default express.Router()
	.use('/api/v1', api)
	.use(express.static('dist', {
		index: false,
		redirect: false,
		maxAge: 0
	}))
	.use(client)
  .use(error)

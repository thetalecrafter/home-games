const express = require('express')
const router = require('./server-router')
const bodyParser = require('body-parser')
const session = require('cookie-session')
const compression = require('compression')

const cookieName = 'player'
const secret1 = '27980042-d587-4ad1-ad1d-6275980f9acf'
let i = 0

const app = express()
  .set('api-base-url', '/api/v1')
  .set('port', 1337)
  .use(bodyParser.json())
  .use(session({
    name: cookieName,
    keys: [ secret1 ]
  }))
  .use((req, res, next) => {
    // always put something in the session to create cookie
    req.session.i = req.session.i || ++i
    next()
  })
  .use(compression())
  .use(router)

module.exports = app

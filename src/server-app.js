const express = require('express')
const router = require('./server-router')
const bodyParser = require('body-parser')
const cookieUtil = require('cookie')
const signature = require('cookie-signature')
const session = require('express-session')
const compression = require('compression')
const redis = require('redis')
const RedisStore = require('connect-redis')
const crypto = require('crypto')

const cookieName = 'player'
const secret1 = '27980042-d587-4ad1-ad1d-6275980f9acf'
const REDIS_SOCKET = process.env.REDIS_SOCKET ||
  (process.env.REDIS_SOCKET = '/tmp/redis.home-games.sock')

function genid (req) {
  return crypto.createHash('sha256')
    .update(req.ip + req.get('user-agent'), 'utf8')
    .digest('hex')
}

const app = express()
  .set('api-base-url', '/api/v1')
  .set('port', 1337)
  .set('redis-socket', REDIS_SOCKET)
  .use(bodyParser.json())
  .use(function (req, res, next) {
    // because Chrome doesn't honor localhost or .local cookies
    // and sessions aren't authenticated anyway ¯\_(ツ)_/¯
    if (!req.headers.cookie) {
      const signed = 's:' + signature.sign(genid(req), secret1)
      req.headers.cookie = cookieUtil.serialize(cookieName, signed)
    }
    next()
  })
  .use(session({
    name: cookieName,
    secret: [ secret1 ],
    saveUninitialized: true,
    resave: false,
    store: new (RedisStore(session))({
      client: redis.createClient(REDIS_SOCKET),
      ttl: 24 * 60 * 60
    }),
    genid
  }))
  .use(compression())
  .use(router)

module.exports = app

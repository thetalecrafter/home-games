// Make sure we just ignore .css requires instead of throwing errors
require.extensions['.css'] = function () {}

// use babel for new ES features
require('babel/register')({
  stage: 1,
  loose: 'all'
})

const express = require('express')
const routes = require('./server-routes')
const bodyParser = require('body-parser')
const cookieUtil = require('cookie')
const signature = require('cookie-signature')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const crypto = require('crypto')

const cookieName = 'player'
const secret1 = '27980042-d587-4ad1-ad1d-6275980f9acf'
function genid (req) {
  return crypto.createHash('sha256')
    .update(req.ip + req.get('user-agent'), 'utf8')
    .digest('hex')
}

const app = module.exports = express()
  .set('api-base-url', '/api/v1')
  .set('port', 1337)
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
    store: new FileStore({
      path: __dirname + '/../data/sessions',
      ttl: 24 * 60 * 60
    }),
    genid: genid
  }))
	.use(routes)

app.listen(app.get('port'))
console.log('Started server on port ' + app.get('port'))

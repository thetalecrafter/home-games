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
const session = require('express-session')
const FileStore = require('session-file-store')(session)

const app = module.exports = express()
  .set('api-base-url', '/api/v1')
  .set('port', 1337)
  .use(bodyParser.json())
  .use(session({
    name: 'player',
    secret: [ '27980042-d587-4ad1-ad1d-6275980f9acf' ],
    saveUninitialized: true,
    resave: false,
    store: new FileStore({
      path: __dirname + '/../data/sessions',
      ttl: 24 * 60 * 60
    })
  }))
	.use(routes)

app.listen(app.get('port'))
console.log('Started server on port ' + app.get('port'))

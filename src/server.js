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

module.exports = express()
  .set('api-base-url', 'http://127.0.0.1:1337/api/v1')
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
	.listen(1337)

console.log('Started server on port 1337')

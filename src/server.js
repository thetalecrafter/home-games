// use babel for new ES features
require('babel/register')({
  stage: 1,
  loose: 'all'
})

const express = require('express')
const routes = require('./server-routes')
const bodyParser = require('body-parser')
const session = require('cookie-session')

module.exports = express()
  .set('api-base-url', 'http://localhost:1337/api/v1')
  .use(bodyParser.json())
  .use(session({ name: 'player', keys: [ '27980042-d587-4ad1-ad1d-6275980f9acf' ] }))
	.use(routes)
	.listen(1337)

console.log('Started server on port 1337')

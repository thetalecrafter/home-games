// use babel for new ES features
require('babel/register')({
  stage: 1,
  loose: 'all'
})

const express = require('express')
const routes = require('./server-routes')

module.exports = express()
	.use(routes)
	.listen(1337)

console.log('Started server on port 1337')

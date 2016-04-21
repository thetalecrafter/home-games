// Make sure we just ignore .css requires instead of throwing errors
require.extensions['.css'] = function () {}

// use babel for new ES features
require('babel-register')

// long stack traces
if (process.env.NODE_ENV !== 'production') require('longjohn')
const http = require('http')
const app = require('./server-app').default

const server = http.createServer(app)
server.listen(app.get('port'))
console.log('Started server on port ' + app.get('port'))

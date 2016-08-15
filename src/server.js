// Make sure we just ignore .css requires instead of throwing errors
require.extensions['.css'] = function () {}

// long stack traces
if (process.env.NODE_ENV !== 'production') require('longjohn')
const http = require('http')
const app = require('./server-app')

const server = http.createServer(app)
server.on('listening', () => {
  console.log('Started server on port ' + app.get('port'))
})

if (module === require.main) {
  server.listen(app.get('port'))
}

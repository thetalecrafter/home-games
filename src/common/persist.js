const redis = require('redis')
const { EventEmitter } = require('events')

const REDIS_SOCKET = process.env.REDIS_SOCKET ||
  (process.env.REDIS_SOCKET = '/tmp/redis.home-games.sock')
const rwClient = redis.createClient(REDIS_SOCKET)
const subClient = redis.createClient(REDIS_SOCKET)
const pubClient = redis.createClient(REDIS_SOCKET)
const events = new EventEmitter()
events.setMaxListeners(Infinity)

subClient.subscribe('persist')
subClient.on('message', (channel, message) => {
  if (channel !== 'persist') return
  try {
    let args = JSON.parse(message)
    events.emit(...args)
  } catch (err) {
    console.error(err.message)
  }
})

module.exports = {
  read (name) {
    return new Promise((resolve, reject) => {
      rwClient.get(name, (err, content) => {
        if (err) return reject(err)
        if (!content) return resolve(null)
        try {
          resolve(JSON.parse(content))
        } catch (err) {
          reject(err)
        }
      })
    })
  },

  write (name, content) {
    return new Promise((resolve, reject) => {
      rwClient.set(name, JSON.stringify(content, null, '  '), (err) => {
        if (err) {
          console.error(err.message)
          return reject(err)
        }
        resolve(content)
      })
    })
  },

  subscribe (name, onNext) {
    events.on(name, onNext)
  },

  unsubscribe (name, onNext) {
    events.removeListener(name, onNext)
  },

  publish (name, content) {
    pubClient.publish('persist', JSON.stringify([ name, content ]))
  }
}

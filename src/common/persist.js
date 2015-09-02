import redis from 'redis'
import { EventEmitter } from 'events'

const REDIS_SOCKET = process.env.REDIS_SOCKET
const rwClient = redis.createClient(REDIS_SOCKET)
const subClient = redis.createClient(REDIS_SOCKET)
const pubClient = redis.createClient(REDIS_SOCKET)
const subscriptions = {}
const PUBSUB_EVENT = 'next'

subClient.on('message', (channel, message) => {
  const obs = subscriptions[channel]
  if (!obs) return
  try {
    obs.emit(PUBSUB_EVENT, JSON.parse(message))
  } catch (err) {
    console.error(err.message)
  }
})

function getObserver (name) {
  let obs = subscriptions[name]
  if (!obs) {
    obs = new EventEmitter()
    obs.setMaxListeners(0)
    obs.subscribe = (fn) => {
      obs.on(PUBSUB_EVENT, fn)
      return obs
    }
    obs.unsubscribe = (fn) => {
      obs.removeListener(PUBSUB_EVENT, fn)
      if (!obs.listeners(PUBSUB_EVENT).length) {
        subscriptions.delete(name)
      }
      return obs
    }
    subscriptions[name] = obs
    subClient.subscribe(name)
  }
  return obs
}

export default {
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
      rwClient.set(name, JSON.stringify(content, null, '  '), err => {
        if (err) {
          console.error(err.message)
          return reject(err)
        }
        pubClient.publish(name, JSON.stringify(content))
        resolve(content)
      })
    })
  },

  subscribe (name, onNext) {
    const obs = getObserver(name)
    if (onNext) obs.subscribe(onNext)
    return obs
  },

  unsubscribe (name, onNext) {
    const obs = subscriptions[name]
    if (obs && onNext) obs.unsubscribe(onNext)
    return obs
  },

  publish (name, content) {
    pubClient.publish(name, JSON.stringify(content))
    return subscriptions[name]
  }
}

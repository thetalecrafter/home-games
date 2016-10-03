const { EventEmitter } = require('events')
const { readFile, writeFile } = require('fs')
const { join } = require('path')

const events = new EventEmitter()
events.setMaxListeners(Infinity)

function getFilename (name) {
  return join(__dirname, '../../data', name + '.json')
}

let data = new Map()
let writes = new Map()

function writeNext (queue, name) {
  const filename = getFilename(name)
  const index = queue.length - 1
  const { content } = queue[index]
  console.log('writing ', name)
  writeFile(filename, JSON.stringify(content, null, '  '), (err) => {
    if (err) console.error(err.message)
    queue.splice(0, index + 1).forEach(err
      ? ({ reject }) => reject(err)
      : ({ resolve }) => resolve(content)
    )
    if (queue.length) writeNext(queue, name)
  })
}

module.exports = {
  read (name) {
    if (data.has(name)) return Promise.resolve(data.get(name))
    const filename = getFilename(name)
    return new Promise((resolve, reject) => {
      console.log('reading ', name)
      readFile(filename, 'utf8', (err, content) => {
        if (err && err.code !== 'ENOENT') return reject(err)
        try {
          const value = JSON.parse(content || 'null')
          data.set(name, value)
          resolve(value)
        } catch (err) {
          reject(err)
        }
      })
    })
  },

  write (name, content) {
    data.set(name, content)

    const queue = writes.get(name) || []
    writes.set(name, queue)

    const record = { content }
    record.promise = new Promise((resolve, reject) => {
      record.resolve = resolve
      record.reject = reject
    })
    queue.push(record)
    if (queue.length === 1) writeNext(queue, name)

    return record.promise
  },

  subscribe (name, onNext) {
    events.on(name, onNext)
  },

  unsubscribe (name, onNext) {
    events.removeListener(name, onNext)
  },

  publish (name, content) {
    events.emit(name, content)
  }
}

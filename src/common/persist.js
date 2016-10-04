const { EventEmitter } = require('events')
const { readFile, writeFile, unlink } = require('fs')
const { join } = require('path')

const events = new EventEmitter()
events.setMaxListeners(Infinity)

function getFilename (name) {
  return join(__dirname, '../../data', name)
}

let data = new Map()
let writes = new Map()

function writeNext (queue, filename) {
  const index = queue.length - 1
  const { content } = queue[index]
  console.log('writing', filename)
  writeFile(filename, content, (err) => {
    if (err) console.error(err.message)
    queue.splice(0, index + 1).forEach(err
      ? ({ reject }) => reject(err)
      : ({ resolve }) => resolve(content)
    )
    if (queue.length) writeNext(queue, filename)
  })
}

module.exports = {
  read (name) {
    if (data.has(name)) return Promise.resolve(data.get(name))
    return this.readFile(name + '.json')
      .then((content) => {
        const value = JSON.parse((content || 'null').toString('utf8'))
        data.set(name, value)
        return value
      })
  },

  readFile (name) {
    const filename = getFilename(name)
    return new Promise((resolve, reject) => {
      console.log('reading', filename)
      readFile(filename, (err, content) => {
        if (err && err.code !== 'ENOENT') return reject(err)
        resolve(content)
      })
    })
  },

  write (name, content) {
    data.set(name, content)
    return this.writeFile(name + '.json',
      Buffer.from(JSON.stringify(content, null, '  '))
    ).then((content) => JSON.parse(content))
  },

  writeFile (name, content) {
    const filename = getFilename(name)
    const queue = writes.get(filename) || []
    writes.set(filename, queue)

    const record = { content }
    record.promise = new Promise((resolve, reject) => {
      record.resolve = resolve
      record.reject = reject
    })
    queue.push(record)
    if (queue.length === 1) writeNext(queue, filename)

    return record.promise
  },

  deleteFile (name) {
    const filename = getFilename(name)
    return new Promise((resolve, reject) => {
      console.log('deleting', filename)
      unlink(filename, (err) => {
        if (err && err.code !== 'ENOENT') return reject(err)
        resolve()
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
    console.log(name, JSON.stringify(content)
      .replace(/(data:[^,]+),[^"]+/g, '$1,...')
    )
    events.emit(name, content)
  }
}

import fs from 'fs'
import { join } from 'path'

const dataDir = join(__dirname, '../../data')
export default {
  read (filename) {
    return new Promise((resolve, reject) => {
      fs.readFile(join(dataDir, filename + '.json'), 'utf8', (err, content) => {
        if (err.code === 'ENOENT') { return resolve(null) }
        if (err) { return reject(err) }
        try {
          resolve(JSON.parse(content))
        } catch (err) {
          reject(err)
        }
      })
    })
  },

  readSync (filename) {
    try {
      return JSON.parse(fs.readFileSync(join(dataDir, filename + '.json'), 'utf8'))
    } catch (err) {
      if (err.code === 'ENOENT') { return null }
      throw err
    }
  },

  write (filename, content) {
    return new Promise((resolve, reject) => {
      fs.writeFile(join(dataDir, filename + '.json'), JSON.stringify(content, null, '  '), err => {
        if (err) {
          console.error(err.message)
          return reject(err)
        }
        resolve(content)
      })
    })
  },

  writeSync (filename, content) {
    fs.writeFileSync(join(dataDir, filename + '.json'), JSON.stringify(content, null, '  '))
    return content
  }
}

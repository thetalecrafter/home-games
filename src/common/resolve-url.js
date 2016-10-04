const globals = require('globals')

module.exports = function resolve (path) {
  return `/${globals.getLocale()}/${path.replace(/^\/+/, '')}`
}

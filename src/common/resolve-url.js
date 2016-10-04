const viewGlobals = require('./view-globals')

module.exports = function resolve (path) {
  return `/${viewGlobals.getLocale()}/${path.replace(/^\/+/, '')}`
}

const witchHunt = require('./reducer')

module.exports = function ({ store }) {
  store.addSubReducers({ witchHunt })
}

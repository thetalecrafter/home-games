const players = require('./reducer')

module.exports = function ({ store }) {
  store.addSubReducers({ players })
}

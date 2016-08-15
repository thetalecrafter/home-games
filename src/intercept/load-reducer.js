const intercept = require('./reducer')

module.exports = function ({ store }) {
  store.addSubReducers({ intercept })
}

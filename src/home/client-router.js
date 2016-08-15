const Router = require('middle-router')
const { createElement: h } = require('react')
const View = require('./view')

module.exports = Router()
  .use('/', ({ resolve, store }) => {
    resolve(() => h(View, store.getState()))
  })

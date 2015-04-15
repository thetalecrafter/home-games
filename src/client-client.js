import React from 'react'
import App from './client-app'

const script = document.getElementById('StoreBootstrapData') || {}
const bootstrap = JSON.parse(script.textContent || '{}') || {}
const actions = {} // will hold the actions instances
const stores = {} // will hold the stores instances

const app = new App({
  bootstrap,
  actions,
  stores,
  render (view) {
    React.render(view, document.body)
  },
  onError(err) {
    console.error(err)
  }
})
app.start()

// code split, add Intl global if needed
if (typeof Intl === 'undefined') {
  require.ensure([ 'intl' ], () => {
    require('intl')
    app.reroute()
  }, 'intl')
}


import React from 'react'
import App from './client-app'

const script = document.getElementById('StoreBootstrapData') || {}
const bootstrap = JSON.parse(script.textContent || '{}') || {}

const app = new App({
  bootstrap,
  actions: {},
  stores: {},
  render (view) {
    React.render(view, document.body)
  },
  redirect (url) {
    app.go(url)
  },
  onError (err) {
    console.error(err)
  }
})
app.start({
  routeLinks: true
})

// code split, add Intl global if needed
if (typeof Intl === 'undefined') {
  require.ensure([ 'intl' ], () => {
    require('intl')
    app.reroute()
  }, 'intl')
}


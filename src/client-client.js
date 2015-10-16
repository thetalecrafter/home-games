import React from 'react'
import ReactDOM from 'react-dom'
import { createClientStore as createStore } from './common/base-store'
import createRouter from './common/base-router'

const root = document.getElementById('root')
const script = document.getElementById('StoreState') || {}
const state = JSON.parse(script.textContent || '{}') || {}
const store = createStore(state)
let unsubscribe

const router = createRouter({
  store,
  render (view) {
    function draw () {
      ReactDOM.render(React.createElement(view), root)
    }
    if (unsubscribe) unsubscribe()
    unsubscribe = store.subscribe(draw)
    draw()
  },
  redirect (url) {
    router.go(url)
  },
  bail (err) {
    if (err) console.error(err)
  }
})

if (typeof Intl !== 'object') {
  require.ensure([ 'intl', process.env.LOCALE_DATA ], (require) => {
    require('intl')
    require(process.env.LOCALE_DATA)
    router.start({ routeLinks: true })
  }, 'intl')
} else {
  router.start({ routeLinks: true })
}

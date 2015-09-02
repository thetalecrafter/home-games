import React from 'react'
import { createClientStore as createStore } from './common/base-store'
import createRouter from './common/base-router'
import makeElement from './common/make-element'
import subscribeToSource from './common/event-source/client'

const root = document.getElementById('root')
const script = document.getElementById('StoreState') || {}
const state = JSON.parse(script.textContent || '{}') || {}
const store = createStore(state)
let unsubscribe

const router = createRouter({
  store,
  render (view) {
    if (typeof view === 'function') view = makeElement(view)
    if (unsubscribe) unsubscribe()
    unsubscribe = store.subscribe(
      React.render.bind(React, view, root)
    )
    React.render(view, root)
  },
  redirect (url) {
    router.go(url)
  },
  bail (err) {
    if (err) console.error(err)
  }
})

function start () {
  router.start({ routeLinks: true })
  subscribeToSource(store, `${state.config.api}/actions`)
}

if (typeof Intl !== 'object') {
  require.ensure([ 'intl', process.env.LOCALE_DATA ], (require) => {
    require('intl')
    require(process.env.LOCALE_DATA)
    start()
  }, 'intl')
} else {
  start()
}

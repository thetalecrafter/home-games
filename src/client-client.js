import ReactDOM from 'react-dom'
import { createClientStore as createStore } from './common/base-store'
import createRouter from './common/base-router'
import 'elemental/less/elemental.less'

const root = document.getElementById('root')
const script = document.getElementById('StoreState') || {}
const state = JSON.parse(script.textContent || '{}') || {}
const store = createStore(state)
let view

function draw () {
  ReactDOM.render(view(), root)
}

const router = createRouter({
  store,
  isClient: true,
  isServer: false,
  redirect (url) {
    router.navigate(url)
  }
}).on('route', async (args, routing) => {
  try {
    let subscribed = !!view
    view = await routing
    draw()
    if (!subscribed) store.subscribe(draw)
  } catch (err) {
    console.error(err)
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

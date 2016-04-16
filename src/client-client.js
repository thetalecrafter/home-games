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
    router.replace(url)
  }
}).on('route', (args, routing) => {
  let subscribed = !!view
  routing
    .then((value) => {
      if (value) {
        view = value
        draw()
        if (!subscribed) store.subscribe(draw)
      }
    })
    .catch((err) => console.error(err))
}).start()

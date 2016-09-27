const ReactDOM = require('react-dom')
const createStore = require('./common/base-store').createClientStore
const createRouter = require('./common/base-router')
require('elemental/less/elemental.less')

const root = document.getElementById('root')
const script = document.getElementById('StoreState') || {}
const state = JSON.parse(script.textContent || '{}') || {}
const store = createStore(state)
let view

function draw () {
  if (view) ReactDOM.render(view(), root)
}

const router = createRouter({
  store,
  isClient: true,
  isServer: false,
  redirect (url) {
    router.replace(url)
  }
}).on('route', (args, routing) => {
  routing
    .then((value) => {
      view = value
      draw()
    })
    .catch((err) => console.error(err))
}).start()

store.subscribe(draw)

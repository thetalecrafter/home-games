import wrap from 'uniflow-component'
import ConfigStore from './common/config-store'
import Routes from './client-routes'

export default function App (o) {
  if (!(this instanceof App)) {
    return new App(o)
  }

  this.bootstrap = o.bootstrap
  this.actions = {}
  this.stores = {}
  this.components = {}
  this.render = o.render
  this.onError = o.onError

  this.stores.config = ConfigStore(this.bootstrap.config)
  this.router = Routes(this)
}
App.prototype = {
  start (opts) {
    this.router.start(opts)
  },

  route (url) {
    this.router.route(url)
  },

  reroute () {
    this.router.routeFromLocation()
  },

  getCurrentPlayer () {
    if (!this.stores.player) { return null }
    return this.stores.player.getCurrentPlayer()
  },

  bind (Component, stores) {
    const cache = this.components
    const displayName = Component.displayName || (Component.displayName = 'View' + Math.random())
    const key = displayName + ':' + Object.keys(stores).join(':')
    return cache[key] || (cache[key] = wrap(Component, stores))
  }
}

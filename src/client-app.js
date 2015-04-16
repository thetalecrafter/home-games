import ConfigStore from './common/config-store'
import Routes from './client-routes'

export default class App {
  constructor (o) {
    this.bootstrap = o.bootstrap
    this.actions = o.actions
    this.stores = o.stores
    this.render = o.render
    this.onError = o.onError

    this.stores.config = ConfigStore(this.bootstrap.config)
    this.router = Routes(this)
  }

  start (opts) {
    this.router.start(opts)
  }

  route (url) {
    this.router.route(url)
  }

  reroute () {
    this.router.routeFromLocation()
  }

  getCurrentPlayer () {
    if (!this.stores.player) { return null }
    return this.stores.player.getCurrentPlayer()
  }
}

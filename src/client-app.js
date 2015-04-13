import ConfigStore from './common/config-store'
import Routes from './client-routes'

export default class App {
  constructor (o) {
    this.bootstrap = o.bootstrap
    this.actions = o.actions
    this.stores = o.stores
    this.render = o.render

    this.stores.config = ConfigStore(this.bootstrap.config)
    this.actions.router = Routes(this)
  }

  start () {
    this.router.start()
  }

  route (url) {
    this.router.route(url)
  }
}

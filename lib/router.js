/*global window, location, history*/
import pathToRegexp from 'path-to-regexp'

export default class Router {
  constructor ({ useHash=false }={}) {
    this.useHash = useHash === true ? '#' : useHash
    this.routes = []
    this.routeFromLocation = this.routeFromLocation.bind(this)
  }

  start () {
    const evtname = this.useHash ? 'hashchange' : 'popstate'
    window.addEventListener(evtname, this.routeFromLocation, false)
    this.routeFromLocation()
  }

  stop () {
    const evtname = this.useHash ? 'hashchange' : 'popstate'
    window.removeEventListener(evtname, this.routeFromLocation, false)
  }

  routeFromLocation () {
    const path = this.useHash ?
      location.hash.replace(this.useHash, '') :
      location.pathname + location.search + location.hash
    this.route(path)
  }

  go (url) {
    if (this.useHash) {
      location.hash = this.useHash + url // will trigger hashchange
    } else {
      history.pushState(null, document.title, url)
      this.route(url)
    }
  }

  replace (url) {
    if (this.useHash) {
      location.hash = this.useHash + url
    } else {
      history.replaceState(null, document.title, url)
    }
  }

  use (path, ...callbacks) {
    if (typeof path !== 'string') {
      callbacks.unshift(path)
      path = '*'
    }
    this.routes = this.routes.concat(callbacks.map(fn => new Route(path, fn)))
    return this
  }

  get (...args) {
    return this.use(...args)
  }

  route (url) {
    const qIndex = url.indexOf('?')
    const path = qIndex === -1 ? url : url.slice(0, qIndex)
    const ctx = { url, path, params: {} }
    this.run(ctx, err => {
      console.error(err || ('no route matches ' + url))
    })
    return this
  }

  run (ctx, done) {
    let i = 0
    const subroutes = this.routes
    function next (err) {
      if (i >= subroutes.length) { return done(err) }

      const subroute = subroutes[i++]
      if (err != null && !subroute.isErrorHandler) { return next(err) }
      if (err == null && subroute.isErrorHandler) { return next() }

      const subctx = subroute.match(ctx)
      if (!subctx) { return next(err) }

      try {
        if (subroute.isErrorHandler) {
          subroute.run(err, subctx, next)
        } else {
          subroute.run(subctx, next)
        }
      } catch (err) { next(err) }
    }
    next()
  }
}

class Route {
  constructor (path, route) {
    if (route instanceof Router) {
      this.router = route
      route = route.run.bind(route)
      path = path.replace(/\/+$/, '') + '(/?.*)'
    }
    this.path = path
    this.keys = []
    this.regex = pathToRegexp(path === '*' ? '(.*)' : path, this.keys)
    this.run = route
    this.isErrorHandler = route.length === 3
  }

  match (ctx) {
    if (!this.path || this.path === '*') { return ctx }

    const matches = this.regex.exec(decodeURIComponent(ctx.path))
    if (!matches) { return false }

    const path = this.router ? matches[matches.length - 1] : ctx.path
    const params = Object.assign({}, ctx.params)
    for (let i = 1, ii = matches.length; i < ii; ++i) {
      const key = this.keys[i - 1]
      if (key) { params[key.name] = matches[i] }
    }

    return Object.assign({}, ctx, { path, params })
  }
}

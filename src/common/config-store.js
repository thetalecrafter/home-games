import uniflow from 'uniflow'

export default function ConfigStore (data) {
  return uniflow.createStore({
    state: Object.assign({}, data),

    setLocale (locale) {
      this.setState({ locale })
    },

    setLoading (key) {
      const loading = (this.state.loading || [])
        .filter(existing => existing !== key)
        .concat(key)
      this.setState({ loading })
    },

    clearLoading (key) {
      let loading = (this.state.loading || [])
        .filter(existing => existing !== key)
      if (!loading.length) { loading = null }
      this.setState({ loading })
    },

    toJSON () {
      const blacklist = [ 'stores', 'env', 'request', 'response' ]
      const json = {}
      Object.keys(this.state)
        .filter(key => blacklist.indexOf(key) === -1)
        .forEach(key => json[key] = this.state[key])
      return json
    }
  })
}

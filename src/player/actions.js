/*globals fetch*/
import uniflow from 'uniflow'

export default function PlayerActions (config) {
  const baseUrl = config && (config.state.api + '/player/')
  const addAuth = config && config.state.request ?
    headers => Object.assign(headers, {
      Cookie: config.state.request.get('Cookie')
    }) :
    headers => headers

  return uniflow.createActions({
    getBaseUrl () {
      return baseUrl
    },

    create (player) {
      this.emit('create', player)
      this.send('create.json', player)
    },

    update (player) {
      this.emit('update', player)
      this.send('update.json', player, 'put')
    },

    select (player) {
      this.emit('select', player.id)
      this.send('select.json', { id: player.id })
    },

    delete (player) {
      this.emit('delete', player.id)
      this.send('delete.json', { id: player.id }, 'delete')
    },

    send (path, data, method) {
      if (!config) { return }
      const url = baseUrl + path
      return fetch(url, {
				method: method || data ? 'post' : 'get',
				headers: addAuth({
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}),
				body: data && JSON.stringify(data)
			})
      .then(response => response.json())
      .then(
        json => this.emit(path + '-send-success', path, data, json),
        err => this.emit(path + '-send-failure', path, data, err)
      )
    },

    load () {
      if (!config) { return }
      this.emit('load')
      const url = baseUrl + '/players.json'
      return fetch(url, {
				headers: addAuth({
					'Accept': 'application/json'
				})
      })
			.then(response => response.json())
      .then(
        state => this.emit('load-success', state),
        err => this.emit('load-failure', err)
      )
    },

    bootstrap (json) {
      this.emit('bootstrap', json)
    }
  })
}

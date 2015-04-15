/*globals fetch*/
import uniflow from 'uniflow'

export default function PlayerActions (config) {
  const baseUrl = config && (config.state.api + '/player/')
  return uniflow.createActions({
    create (player) {
      this.emit('create')
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
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
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
				headers: {
					'Accept': 'application/json'
				}
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

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
    create (player) { this.send('create', player) },
    update (player) { this.send('update', player) },
    select (playerId) { this.send('select', playerId) },
    delete (playerId) { this.send('delete', playerId) },

    send (action, ...args) {
      this.emit(action, ...args)
      if (!config) { return }
      const url = baseUrl + 'action/' + action
      return fetch(url, {
				method: 'post',
				headers: addAuth({
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}),
				body: JSON.stringify(args)
			})
      .then(response => response.json())
      .then(
        json => this.emit(action + '-send-success', args, json),
        err => this.emit(action + '-send-failure', args, err)
      )
    },

    load () {
      if (!config) { return }
      this.emit('load')
      const url = baseUrl + '/store-state.json'
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

/*globals fetch*/
import uniflow from 'uniflow'

export default function WitchHuntActions (config) {
  const baseUrl = config && (config.state.api + '/witch-hunt/')
  const addAuth = config && config.state.request ?
    headers => Object.assign(headers, {
      Cookie: config.state.request.get('Cookie')
    }) :
    headers => headers

  return uniflow.createActions({
    create () { this.send('create') },
    addPlayer (player) { this.send('add-player', player) },
    vote (playerId, vote) { this.send('player-vote', playerId, vote) },
    ready (playerId) { this.send('player-ready', playerId) },
    end () { this.send('end') },

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
      const url = baseUrl + '/state.json'
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

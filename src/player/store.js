import uniflow from 'uniflow'
import ClientEventSource from '../common/eventsource/client'
import equal from 'obj-eql'
const deepEqual = equal.bind(null, (a, b) => deepEqual(a, b))

export default function PlayerStore (config) {
  const baseUrl = config && (config.state.api + '/player/')

  return uniflow.createStore({
    state: { players: [] },

    subscribe (actions) {
      actions.on('load-success', this.bootstrap)
      actions.on('bootstrap', this.bootstrap)
      actions.on('create', this.create)
      actions.on('update', this.update)
      actions.on('select', this.select)
      actions.on('delete', this.delete)
    },

    subscribeToServer () {
      if (this.source || !baseUrl) { return }
      this.source = new ClientEventSource(baseUrl + 'store-changes')
      this.source.on('change', event => {
        let data
        try {
          data = JSON.parse(event.data)
        } catch (err) {
          console.error(err)
        }
        if (data && !deepEqual(this.state, data)) {
          this.replaceState(data)
        }
      })
    },

    // action event handlers
    bootstrap (state) {
      this.setState(state)
    },

    create (player) {
      const players = this.state.players.filter(
        oplayer => oplayer.id !== player.id
      ).concat(player)
      this.setState({ players })
    },

    update (player) {
      const players = this.state.players.map(oplayer => {
        return oplayer.id === player.id ? player : oplayer
      })
      this.setState({ players })
    },

    select (selectedId) {
      this.setState({ selectedId })
    },

    delete (playerId) {
      const selectedId = playerId === this.state.selectedId ?
        undefined : this.state.selectedId
      const players = this.state.players.filter(
        player => player.id !== playerId
      )
      this.setState({ players, selectedId })
    },

    getPlayer (playerId) {
      return this.state.players.find(player => player.id === playerId)
    },

    getCurrentPlayer () {
      return this.getPlayer(this.state.selectedId)
    },

    getStateForPlayer (selectedId) {
      return Object.assign({}, this.state, { selectedId })
    },

    nextId () {
      const ids = this.state.players.map(player => +player.id).concat(0)
      return '' + (Math.max(...ids) + 1)
    },

    toJSON () {
      const blacklist = [ 'store' ]
      const json = {}
      Object.keys(this.state)
        .filter(key => blacklist.indexOf(key) === -1)
        .forEach(key => json[key] = this.state[key])
      return json
    }
  })
}

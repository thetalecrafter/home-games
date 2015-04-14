import uniflow from 'uniflow'

export default function PlayerStore () {
  return uniflow.createStore({
    state: { players: {} },

    subscribe (actions) {
      actions.on('load-success', this.update)
      actions.on('bootstrap', this.bootstrap)
      actions.on('create', this.update)
      actions.on('update', this.update)
      actions.on('select', this.select)
      actions.on('delete', this.delete)
    },

    // action event handlers
    bootstrap (state) {
      this.setState(state)
    },

    create (player) {
      const players = Object.assign({}, this.state.players)
      players[player.id] = player
      this.setState({ players })
    },

    update (player) {
      const players = Object.assign({}, this.state.players)
      players[player.id] = player
      this.setState({ players })
    },

    select (selectedId) {
      this.setState({ selectedId })
    },

    getCurrentPlayer () {
      const playerId = this.state.selectedId
      return this.state.players[playerId]
    },

    delete (playerId) {
      const oldPlayers = this.state.players
      const players = {}
      Object.keys(oldPlayers).forEach(id => {
        if (id !== playerId) { players = oldPlayers[id] }
      })
      this.setState({ players })
    },

    getStateForPlayer (selectedId) {
      return Object.assign({}, this.state, { selectedId })
    },

    toJSON () {
      return this.state
    }
  })
}

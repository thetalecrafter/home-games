import uniflow from 'uniflow'

export default function PlayerStore () {
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

    getCurrentPlayer () {
      const playerId = this.state.selectedId
      return this.state.players.find(player => player.id === playerId)
    },

    delete (playerId) {
      const selectedId = playerId === this.state.selectedId ?
        undefined : this.state.selectedId
      const players = this.state.players.filter(
        player => player.id !== playerId
      )
      this.setState({ players, selectedId })
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

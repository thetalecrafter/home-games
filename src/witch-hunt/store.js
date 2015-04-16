import uniflow from 'uniflow'
import { stages, roles } from './constants'
import ClientEventSource from '../common/eventsource/client'
import equal from 'obj-eql'
const deepEqual = equal.bind(null, (a, b) => deepEqual(a, b))

export default function WitchHuntStore (config) {
  const baseUrl = config && (config.state.api + '/witch-hunt/')

  return uniflow.createStore({
    state: { players: [] },

    subscribe (actions) {
      actions.on('load-success', this.bootstrap)
      actions.on('bootstrap', this.bootstrap)
      actions.on('create', this.create)
      actions.on('add-player', this.addPlayer)
      actions.on('player-vote', this.vote)
      actions.on('player-ready', this.ready)
      actions.on('change-stage', this.updateStage)
      actions.on('end', this.end)
    },

    subscribeToServer () {
      if (this.source || !baseUrl) { return }
      this.source = new ClientEventSource(baseUrl + 'store-changes')
      this.source.on('change', event => {
        const data = JSON.parse(event.data)
        if (!deepEqual(this.state, data)) {
          this.replaceState(data)
        }
      })
    },

    bootstrap (state) {
      this.setState(state)
    },

    // action event handlers
    create () {
      this.setState({
        stage: stages.ADD_PLAYERS,
        result: null,
        players: []
      })
    },

    addPlayer (player) {
      const players = this.state.players.filter(
        existing => existing.id !== player.id
      ).concat(player)
      this.setState({ players })
    },

    vote (playerId, vote) {
      const players = this.state.players.map(player => {
        if (player.id !== playerId) { return player }
        return Object.assign({}, player, { vote })
      })
      this.setState({ players })
    },

    ready (playerId) {
      const players = this.state.players.map(player => {
        if (player.id !== playerId) { return player }
        return Object.assign({}, player, { isReady: true })
      })
      this.setState({ players })
    },

    end () {
      this.replaceState({ players: [] })
    },

    // computed data
    isEveryoneReady () {
      if (this.state.players.length < 4) { return false }
      return this.state.players.every(player => player.isReady)
    },

    isPlayerReady (playerId) {
      const player = this.state.players.find(player => player.id === playerId)
      return player && player.isReady
    },

    isPlaying (playerId) {
      return !!this.state.players.find(player => player.id === playerId)
    },

    didWin (player) {
      if (player.role === roles.WITCH) { return !player.isDead }
      return this.state.players.every(
        player => player.isDead || player.role === roles.PURITAN
      )
    },

    getStateForPlayer (playerId) {
      const currentPlayer = this.state.players.find(p => p.id === playerId)
      const role = currentPlayer && currentPlayer.role
      if (role === roles.WITCH) { return this.state }
      const players = this.state.players.map(player => {
        if (player.id === playerId) { return player }
        const role = player.role && roles.UNKNOWN
        return Object.assign({}, player, { role })
      })
      return Object.assign({}, this.state, { players })
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

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
      let players = this.state.players
      const exists = players.some(({ id }) => id === player.id)
      if (!exists) { players = players.concat(player) }
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
      return this.state.players.every(player => player.isReady || player.isDead)
    },

    getPlayer (playerId) {
      return this.state.players.find(player => player.id === playerId)
    },

    isReady (playerId) {
      const player = this.getPlayer(playerId)
      return player && (player.isReady || player.isDead)
    },

    isWitch (playerId) {
      const player = this.getPlayer(playerId)
      return player && player.role === roles.WITCH
    },

    isPlaying (playerId) {
      return !!this.getPlayer(playerId)
    },

    didWin (playerId) {
      const player = this.getPlayer(playerId)
      if (player.role === roles.WITCH) { return !player.isDead }
      return this.state.players.every(
        player => player.isDead || player.role === roles.PURITAN
      )
    },

    getStateForPlayer (playerId) {
      if (this.state.stage === stages.END) { return this.state }
      const currentPlayer = this.state.players.find(p => p.id === playerId)
      const role = currentPlayer && currentPlayer.role
      if (role === roles.WITCH) { return this.state }

      const players = this.state.players.map(player => {
        if (player.id === playerId) { return player }
        const role = player.role && roles.UNKNOWN
        return Object.assign({}, player, { role })
      })
      let result = this.state.result
      if (result && result.follow) {
        const follow = {}
        if (result.follow[playerId]) {
          follow[playerId] = result.follow[playerId]
        }
        result = Object.assign({}, result, { follow })
      }
      return Object.assign({}, this.state, { players, result })
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

import uniflow from 'uniflow'
import { stages } from './constants'

export default function WitchHuntStore () {
  return uniflow.createStore({
    state: {},

    subscribe (actions) {
      actions.on('load-success', this.update)
      actions.on('bootstrap', this.update)
      actions.on('create', this.create)
      actions.on('add-player', this.addPlayer)
      actions.on('player-vote', this.vote)
      actions.on('player-ready', this.ready)
      actions.on('change-stage', this.updateStage)
    },

    // action event handlers
    create () {
      this.setState({
        stage: stages.ADD_PLAYERS,
        result: null,
        players: []
      })
    },

    update (state) {
      this.setState(state)
    },

    addPlayer (player) {
      const players = this.state.players.filter(
        existing => existing.id !== player.id
      ).concat(player)
      this.setState({ players })
    },

    vote (player, vote) {
      const players = this.state.players.map(playa => {
        if (playa.id !== player.id) { return playa }
        return Object.assign({}, playa, { vote })
      })
      this.setState({ players })
    },

    ready (player) {
      const players = this.state.players.map(playa => {
        if (playa.id !== player.id) { return playa }
        return Object.assign({}, playa, { isReady: true })
      })
      this.setState({ players })
    },

    updateStage (state) {
      let { stage, result, players } = state
      players = players.map(player => {
        return Object.assign({}, player, { isReady: false, vote: null })
      })
      this.setState({ stage, result, players })
    },

    // computed data
    isEveryoneReady () {
      return this.state.players.every(player => player.isReady)
    },

    didWin (player) {
      if (player.role === roles.WITCH) { return !player.isDead }
      return this.state.players.every(
        player => player.isDead || player.role === roles.PURITAN
      )
    },

    getStateForPlayer (player) {
      const role = this.state.players.find(p => p.id === player.id).role
      if (role === roles.WITCH) { return this.state }
      const players = this.state.players.map(playa => {
        if (playa.id === player.id) { return playa }
        const role = playa.role && roles.UNKNOWN
        return Object.assign({}, playa, { role })
      })
      return Object.assign({}, this.state, { players })
    },

    toJSON () {
      return this.state
    }
  })
}

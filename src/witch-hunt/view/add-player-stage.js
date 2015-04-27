import React from 'react'
import formatMessage from 'format-message'
import PlayerPicker from '../../player/picker'

export default React.createClass({
  displayName: 'AddPlayerStage',

  propTypes: {
    app: React.PropTypes.object.isRequired,
    game: React.PropTypes.object.isRequired
  },

  render () {
    const app = this.props.app
    const store = this.props.game.store
    const currentPlayer = app.getCurrentPlayer()
    const isPlaying = store.isPlaying(currentPlayer && currentPlayer.id)
    const canStart = store.canStart()
    const addPlayer = app.actions.witchHunt.addPlayer
    const start = app.actions.witchHunt.start
    const availablePlayers = app.stores.player.state.players.map(player => {
      const isDisabled = (isPlaying && currentPlayer.id === player.id) ?
        false : store.isPlaying(player.id)
      return Object.assign({}, player, { isDisabled })
    })
    const count = this.props.game.players.length
    return (
      <div>
        <h2>{ formatMessage('Choose Players') }</h2>
        <p>
          { formatMessage('This game requires at least 4 players.') }
        </p>
        { !isPlaying &&
          <div>
            <PlayerPicker
              players={ availablePlayers }
              selectedId={ app.stores.player.state.selectedId }
              select={ isPlaying ? null : app.actions.player.select }
            />
            <button
              onClick={ currentPlayer && addPlayer.partial(currentPlayer) }
              disabled={ !currentPlayer }
            >
              { formatMessage('Join Game') }
            </button>
          </div>
        }
        <p>
          { formatMessage(`{
              count, plural,
              one {1 player has}
              other {# players have}
            } joined this game.`, {
              count
            }) }
        </p>
        <ol>
          { this.props.game.players.map(player =>
            <li key={ player.id }>
              { player.name }
            </li>
          ) }
        </ol>
        { isPlaying &&
          <button
            onClick={ !canStart ? null : start }
            disabled={ !canStart }
          >
            { formatMessage('Start Game') }
          </button>
        }
      </div>
    )
  }
})

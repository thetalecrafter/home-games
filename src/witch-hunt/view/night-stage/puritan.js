import React from 'react'
import formatMessage from 'format-message'
import { roles } from '../../constants'
import PlayerPicker from '../../../player/picker'

export default React.createClass({
  displayName: 'PuritanNightStage',

  propTypes: {
    app: React.PropTypes.object.isRequired,
    game: React.PropTypes.object.isRequired
  },

  render () {
    const { app, game } = this.props
    let currentPlayer = app.getCurrentPlayer()
    currentPlayer = game.store.getPlayer(currentPlayer.id)
    const isReady = game.store.isReady(currentPlayer.id)
    const { ready, vote } = app.actions.witchHunt
    const followees = game.players.filter(
      ({ id, isDead }) => (id !== currentPlayer.id && !isDead)
    )
    return (
      <div>
        <div>
          <label>
            <input
              type='radio'
              name='playerId'
              onChange={ vote.partial(currentPlayer.id, '') }
            />
            { formatMessage('Sleep') }
          </label>
        </div>
        <p>{ formatMessage('Or choose someone to follow.') }</p>
        <PlayerPicker
          name='playerId'
          players={ followees }
          selectedId={ currentPlayer.isDead ? null : currentPlayer.vote }
          select={ currentPlayer.isDead ? null : vote.partial(currentPlayer.id) }
        />
        { !currentPlayer.isDead && (isReady ?
          formatMessage('Waiting for others...') :
          <button
            onClick={ currentPlayer.vote != null && ready.partial(currentPlayer.id) }
            disabled={ currentPlayer.vote == null }
          >
            { formatMessage('I’m Ready') }
          </button>
        ) }
      </div>
    )
  }
})

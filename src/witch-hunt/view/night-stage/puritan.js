import React from 'react'
import formatMessage from 'format-message'
import { roles } from '../../constants'
import PlayerPicker from '../../../player/picker'
import ReadyButton from '../ready-button'

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
    const { vote } = app.actions.witchHunt
    const followees = game.players.filter(
      ({ id, isDead }) => (id !== currentPlayer.id && !isDead)
    )
    const disabled = currentPlayer.isDead || currentPlayer.isReady
    return (
      <div>
        <div>
          <label>
            <input
              type='radio'
              name='playerId'
              checked={ currentPlayer.vote === '' }
              disabled={ disabled }
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
          select={ disabled ? null : vote.partial(currentPlayer.id) }
        />
        <ReadyButton
          app={ app }
          game={ game }
          disabled={ currentPlayer.vote == null }
        />
      </div>
    )
  }
})

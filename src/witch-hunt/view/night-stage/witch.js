import React from 'react'
import formatMessage from 'format-message'
import { roles } from '../../constants'
import PlayerPicker from '../../../player/picker'

export default React.createClass({
  displayName: 'WitchNightStage',

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

    const otherWitches = []
    const puritans = []
    game.players.forEach(player => {
      if (player.id === currentPlayer.id || player.isDead) { return }
      if (player.role === roles.WITCH) {
        otherWitches.push({ player, selectedId: player.vote })
      } else {
        puritans.push(player)
      }
    })

    return (
      <div>
        <p>{ formatMessage(`Select a Puritan to curse.`) }</p>
        <PlayerPicker
          players={ puritans }
          selectedId={ currentPlayer.isDead ? null : currentPlayer.vote }
          select={ currentPlayer.isDead ? null : vote.partial(currentPlayer.id) }
          others={ otherWitches }
        />
        { !currentPlayer.isDead && (isReady ?
          formatMessage('Waiting for others...') :
          <button
            onClick={ currentPlayer.vote && ready.partial(currentPlayer.id) }
            disabled={ !currentPlayer.vote }
          >
            { formatMessage('I’m Ready') }
          </button>
        ) }
      </div>
    )
  }
})

import React from 'react'
import formatMessage from 'format-message'
import { roles } from '../../constants'
import PlayerPicker from '../../../player/picker'
import ReadyButton from '../ready-button'

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
    const disabled = currentPlayer.isDead || currentPlayer.isReady
    const { vote } = app.actions.witchHunt

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
          select={ disabled ? null : vote.partial(currentPlayer.id) }
          others={ otherWitches }
        />
        <ReadyButton
          app={ app }
          game={ game }
          disabled={ !currentPlayer.vote }
        />
      </div>
    )
  }
})

import React from 'react'
import formatMessage from 'format-message'
import { roles } from '../../constants'
import PlayerPicker from '../../../players/picker'
import ReadyButton from '../ready-button'

export default class WitchNightStage extends React.Component {
  static displayName = 'WitchNightStage'

  static propTypes = {
    sid: React.PropTypes.string.isRequired,
    game: React.PropTypes.object.isRequired,
    vote: React.PropTypes.func.isRequired,
    confirm: React.PropTypes.func.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return (
      nextProps.game !== this.props.game ||
      nextProps.sid !== this.props.sid
    )
  }

  render () {
    const { sid, game, vote, confirm } = this.props
    const currentPlayer = game.players.find(player => player.sid === sid)
    const disabled = currentPlayer.isDead || currentPlayer.isReady

    const otherWitches = []
    const puritans = []
    game.players.forEach(player => {
      if (player.id === currentPlayer.id || player.isDead) return
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
          select={ disabled ? null : (id) => vote({ id: currentPlayer.id, vote: id }) }
          others={ otherWitches }
        />
        <ReadyButton
          player={ currentPlayer }
          game={ game }
          disabled={ !currentPlayer.vote }
          confirm={ confirm }
        />
      </div>
    )
  }
}

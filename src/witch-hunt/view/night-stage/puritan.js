import React from 'react'
import formatMessage from 'format-message'
import { roles } from '../../constants'
import PlayerPicker from '../../../players/picker'
import ReadyButton from '../ready-button'

export default class PuritanNightStage extends React.Component {
  static displayName = 'PuritanNightStage'

  static propTypes = {
    sid: React.PropTypes.string.isRequired,
    game: React.PropTypes.object.isRequired,
    vote: React.PropTypes.func.isRequired,
    confirm: React.PropTypes.func.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return (
      nextProps.game !== this.props.game
      || nextProps.sid !== this.props.sid
    )
  }

  render () {
    const { sid, game, vote, confirm } = this.props
    const currentPlayer = game.players.find(player => player.sid === sid)
    const followees = game.players.filter(
      player => (player !== currentPlayer && !player.isDead)
    )
    const disabled = currentPlayer.isDead || currentPlayer.isReady
    return (
      <div>
        { !currentPlayer.isDead &&
          <div>
            <label>
              <input
                type='radio'
                name='playerId'
                checked={ currentPlayer.vote === '' }
                disabled={ disabled }
                onChange={ () => vote({ id: currentPlayer.id, vote: '' }) }
              />
              { formatMessage('Sleep') }
            </label>
            <p>{ formatMessage('Or choose someone to follow.') }</p>
            <PlayerPicker
              name='playerId'
              players={ followees }
              selectedId={ currentPlayer.isDead ? null : currentPlayer.vote }
              select={ disabled ? null : (id) => vote({ id: currentPlayer.id, vote: id }) }
            />
          </div>
        }
        <ReadyButton
          player={ currentPlayer }
          game={ game }
          disabled={ currentPlayer.vote == null }
          confirm={ confirm }
        />
      </div>
    )
  }
}

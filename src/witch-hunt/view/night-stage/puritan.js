import React from 'react'
import formatMessage from 'format-message'
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

  constructor (props) {
    super(props)
    this.voteSleep = this.voteSleep.bind(this)
  }

  shouldComponentUpdate (nextProps) {
    return (
      nextProps.game !== this.props.game ||
      nextProps.sid !== this.props.sid
    )
  }

  voteSleep () {
    const { sid, game, vote } = this.props
    const currentPlayer = game.players.find((player) => player.sid === sid)
    vote({ id: currentPlayer.id, vote: '' })
  }

  votePlayer (id) {
    const { sid, game, vote } = this.props
    const currentPlayer = game.players.find((player) => player.sid === sid)
    vote({ id: currentPlayer.id, vote: id })
  }

  render () {
    const { sid, game, confirm } = this.props
    const currentPlayer = game.players.find((player) => player.sid === sid)
    const followees = game.players.filter(
      (player) => (player !== currentPlayer && !player.isDead)
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
                onChange={ this.voteSleep }
              />
              { formatMessage('Sleep') }
            </label>
            <p>{ formatMessage('Or choose someone to follow.') }</p>
            <PlayerPicker
              name='playerId'
              players={ followees }
              selectedId={ currentPlayer.isDead ? null : currentPlayer.vote }
              select={ disabled ? null : this.votePlayer }
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

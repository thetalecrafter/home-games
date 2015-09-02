import React from 'react'
import formatMessage from 'format-message'

export default class ReadyButton extends React.Component {
  static displayName = 'ReadyButton'

  static propTypes = {
    player: React.PropTypes.object.isRequired,
    game: React.PropTypes.object.isRequired,
    disabled: React.PropTypes.bool.isRequired,
    confirm: React.PropTypes.func.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return (
      nextProps.disabled !== this.props.disabled
      || nextProps.player !== this.props.player
      || nextProps.game !== this.props.game
    )
  }

  getNotReadyCount (game) {
    return game.players.reduce((count, player) => {
      if (player.isDead || player.isReady) { return count }
      return count + 1
    }, 0)
  }

  render () {
    const { player, game, disabled, confirm } = this.props
    const count = this.getNotReadyCount(game)

    return (
      <div>
        { player.isDead || player.isReady ?
          <span>
            { formatMessage(`Waiting for {
                count, plural,
                one {1 other player}
                other {# other players}
              }...`, { count })
            }
          </span> :
          <button
            onClick={ disabled ? null : () => confirm(player) }
            disabled={ disabled }
          >
            { formatMessage('I’m Ready') }
          </button>
        }
      </div>
    )
  }
}

import React from 'react'
import formatMessage from 'format-message'

export default class ReadyButton extends React.Component {
  static displayName = 'ReadyButton'

  static propTypes = {
    player: React.PropTypes.object.isRequired,
    game: React.PropTypes.object.isRequired,
    confirm: React.PropTypes.func
  }

  shouldComponentUpdate (nextProps) {
    return (
      nextProps.player !== this.props.player
      || nextProps.game !== this.props.game
      || nextProps.confirm !== this.props.confirm
    )
  }

  getNotReadyCount (game) {
    return game.players.length - Object.keys(game.votes).length
  }

  render () {
    const { player, game, confirm } = this.props
    const count = this.getNotReadyCount(game)

    return (
      <div>
        { !confirm ?
          <span>
            { formatMessage(`Waiting for {
                count, plural,
                one {1 other player}
                other {# other players}
              }...`, { count })
            }
          </span> :
          <button onClick={ confirm }>
            { formatMessage('I’m Ready') }
          </button>
        }
      </div>
    )
  }
}

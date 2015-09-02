import React from 'react'
import formatMessage from 'format-message'
import { roles } from '../constants'

export default class EndStage extends React.Component {
  static displayName = 'EndStage'

  static propTypes = {
    game: React.PropTypes.object.isRequired,
    end: React.PropTypes.func.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.game !== this.props.game
  }

  end = () => {
    const message = (
      formatMessage('Are you sure you want to end the game?') +
      '\n\n' +
      formatMessage(`All players will be taken back to the game description and
        a new game can be started.`).replace(/\s+/g, ' ')
    )
    if (window.confirm(message)) {
      this.props.end()
    }
  }

  didWin (game, player) {
    if (player.isDead) return false
    if (player.role === roles.WITCH) return true
    return game.players.every(
      player => player.isDead || player.role === roles.PURITAN
    )
  }

  render () {
    const { game } = this.props
    return (
      <div>
        <h2>{ formatMessage('Epilogue') }</h2>
        <table>
        { game.players.map(player =>
          <tr key={ player.id }>
            <th>{ player.name }</th>
            <td>
              { player.role === roles.WITCH ?
                formatMessage('Witch') :
                formatMessage('Puritan')
              }
            </td>
            <td>
              { player.isDead ?
                formatMessage('Died') :
                formatMessage('Survived')
              }
            </td>
            <td>
              { this.didWin(game, player) ?
                formatMessage('Won') :
                formatMessage('Lost')
              }
            </td>
          </tr>
        ) }
        </table>
        <button onClick={ this.end }>
          { formatMessage('End Game') }
        </button>
      </div>
    )
  }
}

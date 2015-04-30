import React from 'react'
import formatMessage from 'format-message'
import { roles } from '../constants'

export default React.createClass({
  displayName: 'EndStage',

  propTypes: {
    app: React.PropTypes.object.isRequired,
    game: React.PropTypes.object.isRequired
  },

  end () {
    const message = (
      formatMessage('Are you sure you want to end the game?') +
      '\n\n' +
      formatMessage(`All players will be taken back to the game description and
        a new game can be started.`).replace(/\s+/g, ' ')
    )
    const confirm = window.confirm(message)
    if (confirm) {
      this.props.app.actions.witchHunt.end()
    }
  },

  render () {
    const { game } = this.props
    const { store, players } = game
    return (
      <div>
        <h2>{ formatMessage('Epilogue') }</h2>
        <table>
        { players.map(player =>
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
              { store.didWin(player.id) ?
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
})

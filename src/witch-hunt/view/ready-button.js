import React from 'react'
import formatMessage from 'format-message'

export default React.createClass({
  displayName: 'ReadyButton',

  propTypes: {
    app: React.PropTypes.object.isRequired,
    game: React.PropTypes.object.isRequired,
    disabled: React.PropTypes.bool.isRequired
  },

  render () {
    const { app, game, disabled } = this.props
    let currentPlayer = app.getCurrentPlayer()
    currentPlayer = game.store.getPlayer(currentPlayer.id)
    const { ready } = app.actions.witchHunt
    const count = game.store.getNotReadyCount()

    return (
      <div>
        { currentPlayer.isDead || currentPlayer.isReady ?
          <span>
            { formatMessage(`Waiting for {
                count, plural,
                one {1 other player}
                other {# other players}
              }...`, { count })
            }
          </span> :
          <button
            onClick={ disabled ? null : ready.partial(currentPlayer.id) }
            disabled={ disabled }
          >
            { formatMessage('I’m Ready') }
          </button>
        }
      </div>
    )
  }
})

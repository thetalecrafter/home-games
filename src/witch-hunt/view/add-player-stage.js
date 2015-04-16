import React from 'react'
import formatMessage from 'format-message'
import PlayerPicker from '../../player/picker'

export default class AddPlayerStage extends React.Component {
  render () {
    const app = this.props.app
    const store = this.props.game.store
    const currentPlayer = app.getCurrentPlayer()
    const isPlaying = store.isPlaying(currentPlayer && currentPlayer.id)
    const isReady = store.isPlayerReady(currentPlayer && currentPlayer.id)
    const addPlayer = app.actions.witchHunt.addPlayer
    const ready = app.actions.witchHunt.ready
    const Picker = PlayerPicker.bind(this.props.app)
    return (
      <div>
        <h2>{ formatMessage('Choose Players') }</h2>
        <p>
          { formatMessage('The game will begin once everyone has chosen their player.') }
        </p>
        <Picker app={ app } />
        { !isPlaying &&
          <button
            onClick={ currentPlayer && addPlayer.partial(currentPlayer) }
            disabled={ !currentPlayer }
          >
            { formatMessage('Join Game') }
          </button>
        }
        { isPlaying && (
            isReady ?
            formatMessage('Waiting for players...') :
            <button onClick={ ready.partial(currentPlayer) }>
              { formatMessage('I’m Ready') }
            </button>
          )
        }
      </div>
    )
  }
}

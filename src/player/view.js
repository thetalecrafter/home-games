import React from 'react'
import formatMessage from 'format-message'
import EditPlayerView from './view/edit-player'
import './view/view.css'

export default React.createClass({
  displayName: 'PlayerView',

  propTypes: {
    app: React.PropTypes.object.isRequired,
    players: React.PropTypes.object.isRequired
  },

  getInitialState () {
    return {
      player: null
    }
  },

  getActions () {
    return this.props.app.actions.player
  },

  render () {
    const { players, selectedId } = this.props.players
    const { create, update, select, delete: remove } = this.getActions()
    const nextId = this.props.app.stores.player.nextId
    return (
      <div className='PlayerView u-chunk'>
        <h1>{ formatMessage('Players') }</h1>
        { players.map(player =>
          <div key={ player.id }>
            <label>
              <input type='radio'
                onChange={ select.partial(player.id) }
                checked={ player.id === selectedId }
              />
              { player.avatarUrl &&
                <img className='PlayerView-playerAvatar'
                  alt={ player.name }
                  src={ player.avatarUrl }
                />
              }
              { player.name }
            </label>
            <button onClick={ () => this.setState({ player }) }>
              ✎ { formatMessage('Change') }
            </button>
            <button onClick={ remove.partial(player.id) }>
              ⌫ { formatMessage('Remove') }
            </button>
          </div>
        ) }
        { this.state.player ?
          <EditPlayerView
            player={ this.state.player }
            cancel={ () => this.setState({ player: null }) }
            save={ this.state.player.id ?
              player => {
                update(player)
                this.setState({ player: null })
              } :
              player => {
                create(Object.assign({}, player, { id: nextId() }))
                this.setState({ player: null })
              }
            }
            saveText={ this.state.player.id ?
              formatMessage('Update') :
              formatMessage('Create')
            }
          /> :
          <button onClick={ () => this.setState({ player: {} }) }>
            { formatMessage('Add Player') }
          </button>
        }
      </div>
    )
  }
})

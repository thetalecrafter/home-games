import React from 'react'
import formatMessage from 'format-message'
import resolve from '../../common/resolve-url'
import Shell from '../../common/shell'
import Player from './list-item'
import EditModal from './edit-modal'
import './list.css'

export default class PlayersList extends React.Component {
  static displayName = 'PlayersList'

  static propTypes = {
    players: React.PropTypes.array.isRequired,
    selectedId: React.PropTypes.string,
    actions: React.PropTypes.object.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return (
      nextProps.players !== this.props.players ||
      nextProps.selectedId !== this.props.selectedId
    )
  }

  render () {
    const { players, selectedId, actions } = this.props
    return (
      <Shell className='PlayersList u-chunk'>
        <a href={ resolve('/') }>
          &laquo; { formatMessage('Home') }
        </a>
        <h1>{ formatMessage('Players') }</h1>
        <ul>
          { players.map(player =>
            <Player
              key={ player.id }
              player={ player }
              isSelected={ player.id === selectedId }
              actions={ actions }
            />
          ) }
        </ul>
        <a href={ resolve('players/+') }>
          { formatMessage('Add Player') }
        </a>
        <EditModal
          isOpen={ selectedId === '+' || selectedId === ' ' }
          onClose={ () => window.history.back() }
          { ...actions }
        />
      </Shell>
    )
  }
}

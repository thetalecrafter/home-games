import React from 'react'
import resolve from '../../common/resolve-url'
import EditModal from './edit-modal'
import './list-item.css'

export default class PlayersListItem extends React.Component {
  static displayName = 'PlayersListItem'

  static propTypes = {
    player: React.PropTypes.object.isRequired,
    isSelected: React.PropTypes.bool,
    actions: React.PropTypes.object.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return (
      nextProps.player !== this.props.player ||
      nextProps.isSelected !== this.props.isSelected
    )
  }

  render () {
    const { player, isSelected, actions } = this.props
    return (
      <li>
        <a className='PlayersListItem' href={ resolve(`players/${player.id}`) }>
          { player.avatar &&
            <img className='PlayersListItem-avatar'
              alt={ player.name }
              src={ player.avatar }
            />
          }
          <span className='PlayersListItem-name'>
            { player.name }
          </span>
          <span className='PlayersListItem-gender'>
            {
              player.gender === 'male' ? '♂'
              : player.gender === 'female' ? '♀'
              : ''
            }
          </span>
        </a>
        <EditModal
          player={ player }
          isOpen={ isSelected }
          onClose={ () => window.history.back() }
          { ...actions }
        />
      </li>
    )
  }
}

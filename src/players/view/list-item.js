import React from 'react'
import resolve from '../../common/resolve-url'
import EditModal from './edit-modal'
import './list-item.css'

const PlayersListItem = ({ player, isSelected, actions }) =>
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

PlayersListItem.displayName = 'PlayersListItem'
PlayersListItem.propTypes = {
  player: React.PropTypes.object.isRequired,
  isSelected: React.PropTypes.bool,
  actions: React.PropTypes.object.isRequired
}
export default PlayersListItem

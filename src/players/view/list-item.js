import React from 'react'
import resolve from '../../common/resolve-url'
import EditModal from './edit-modal'
import './list-item.css'

function back () {
  window.history.back()
}

const PlayersListItem = ({ icon, player, isSelected, actions }) =>
  <li className='PlayersListItem'>
    <a className='PlayersListItem-link' href={ resolve(`players/${player.id}`) }>
      { player.avatar
        ? <img className='PlayersListItem-avatar'
          alt={ player.name }
          src={ player.avatar }
        />
        : <span className='PlayersListItem-avatar-none'>{ icon }</span>
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
      player={ player.id === '+' ? null : player }
      isOpen={ isSelected }
      onClose={ back }
      { ...actions }
    />
  </li>

PlayersListItem.displayName = 'PlayersListItem'
PlayersListItem.propTypes = {
  player: React.PropTypes.object.isRequired,
  isSelected: React.PropTypes.bool,
  actions: React.PropTypes.object.isRequired,
  icon: React.PropTypes.node
}
export default PlayersListItem

import React from 'react'
import formatMessage from 'format-message'
import resolve from '../../common/resolve-url'
import './list-item.css'

export default class PlayersListItem extends React.Component {
  static displayName = 'PlayersListItem'

  static propTypes = {
    player: React.PropTypes.object.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.player !== this.props.player
  }

  render () {
    const { player, actions } = this.props
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
              player.gender === 'male' ? '♂' :
              player.gender === 'female' ? '♀' :
              ''
            }
          </span>
        </a>
      </li>
    )
  }
}

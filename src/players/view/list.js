import React from 'react'
import formatMessage from 'format-message'
import resolve from '../../common/resolve-url'
import Shell from '../../common/shell'
import Player from './list-item'
import './list.css'

export default class PlayersList extends React.Component {
  static displayName = 'PlayersList'

  static propTypes = {
    players: React.PropTypes.array.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.players !== this.props.players
  }

  render () {
    const { players } = this.props
    return (
      <Shell className='PlayersList u-chunk'>
        <a href={ resolve('/') }>
          &laquo; { formatMessage('Home') }
        </a>
        <h1>{ formatMessage('Players') }</h1>
        <ul>
          { players.map(player =>
            <Player key={ player.id } player={ player } />
          ) }
        </ul>
        <a href={ resolve('players/+') }>
          { formatMessage('Add Player') }
        </a>
      </Shell>
    )
  }
}

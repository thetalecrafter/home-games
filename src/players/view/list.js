import React from 'react'
import formatMessage from 'format-message'
import Glyph from 'elemental/lib/components/Glyph'
import resolve from '../../common/resolve-url'
import Shell from '../../common/shell'
import Player from './list-item'
import './list.css'

const PlayersList = ({ players, selectedId, actions }) =>
  <Shell className='PlayersList u-chunk'>
    <a href={ resolve('/') }>
      &laquo; { formatMessage('Home') }
    </a>
    <h2>{ formatMessage('Players') }</h2>
    <ul className='PlayersList-list'>
      { players.map(player =>
        <Player
          key={ player.id }
          player={ player }
          isSelected={ player.id === selectedId }
          actions={ actions }
        />
      ) }
      <Player
        key={ '+' }
        player={ { id: '+', name: formatMessage('Add Player') } }
        isSelected={ selectedId === '+' || selectedId === ' ' }
        actions={ actions }
        icon={ <Glyph icon='plus' /> }
      />
    </ul>
  </Shell>

PlayersList.displayName = 'PlayersList'
PlayersList.propTypes = {
  players: React.PropTypes.array.isRequired,
  selectedId: React.PropTypes.string,
  actions: React.PropTypes.object.isRequired
}
export default PlayersList

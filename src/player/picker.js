import React from 'react'
import formatMessage from 'format-message'

export default React.createClass({
  displayName: 'PlayerPicker',

  propTypes: {
    name: React.PropTypes.string,
    players: React.PropTypes.array.isRequired,
    selectedId: React.PropTypes.string,
    select: React.PropTypes.func,
    others: React.PropTypes.array
  },

  getDefaultProps () {
    return {
      name: 'playerId',
      others: []
    }
  },

  render () {
    const { name, players, selectedId, select, others } = this.props

    return (
      <div>
        { players.map(player =>
          <div key={ player.id }>
            <label>
              <input type='radio'
                name={ name }
                onChange={ select && select.partial(player.id) }
                disabled={ !select }
                checked={ player.id === selectedId }
              />
              { player.name }
            </label>
            { others
              .filter(({ selectedId }) => selectedId === player.id)
              .map((other, i, a) =>
                <span key={ other.player.id }>
                  { i === 0 ? ' (' : formatMessage(', ') }
                  { other.player.name }
                  { (a.length - 1) === i && ')' }
                </span>
              )
            }
          </div>
        ) }
      </div>
    )
  }
})
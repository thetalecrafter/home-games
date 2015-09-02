import React from 'react'
import formatMessage from 'format-message'

export default class PlayerPicker extends React.Component {
  static displayName = 'PlayerPicker'

  static propTypes = {
    name: React.PropTypes.string,
    players: React.PropTypes.array.isRequired,
    selectedId: React.PropTypes.string,
    select: React.PropTypes.func,
    others: React.PropTypes.array
  }

  static defaultProps = {
    name: 'playerId',
    others: []
  }

  shouldComponentUpdate (nextProps) {
    return (
      nextProps.name !== this.props.name
      || nextProps.players !== this.props.players
      || nextProps.selectedId !== this.props.selectedId
      || nextProps.select !== this.props.select
      || nextProps.others !== this.props.others
    )
  }

  render () {
    const { name, players, selectedId, select, others } = this.props

    return (
      <div>
        { players.map(player =>
          <div key={ player.id }>
            <label>
              <input type='radio'
                name={ name }
                onChange={ select && () => select(player.id) }
                disabled={ !select || player.isDisabled }
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
}

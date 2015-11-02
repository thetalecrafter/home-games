import React from 'react'

export default class PlayerPicker extends React.Component {
  static displayName = 'PlayerPicker'

  static propTypes = {
    name: React.PropTypes.string,
    players: React.PropTypes.array.isRequired,
    isSelected: React.PropTypes.func.isRequired,
    isDisabled: React.PropTypes.func.isRequired,
    onChange: React.PropTypes.func
  }

  static defaultProps = {
    name: 'playerIds'
  }

  shouldComponentUpdate (nextProps) {
    return (
      nextProps.name !== this.props.name ||
      nextProps.players !== this.props.players ||
      nextProps.isSelected !== this.props.isSelected ||
      nextProps.isDisabled !== this.props.isDisabled ||
      nextProps.onChange !== this.props.onChange
    )
  }

  render () {
    const { name, players, isSelected, isDisabled, onChange } = this.props

    return (
      <div>
        { players.map(player =>
          <div key={ player.id }>
            <label>
              <input type='checkbox'
                name={ name }
                onChange={ onChange && ((evt) => onChange(evt, player)) }
                disabled={ isDisabled(player) }
                checked={ isSelected(player) }
              />
              { player.name }
            </label>
          </div>
        ) }
      </div>
    )
  }
}

const { createClass, createElement: h, PropTypes } = require('react')
const { compareName } = require('../../common/natural-compare')

module.exports = createClass({
  displayName: 'PlayerPickerMulti',

  propTypes: {
    name: PropTypes.string,
    players: PropTypes.array.isRequired,
    isSelected: PropTypes.func.isRequired,
    isDisabled: PropTypes.func.isRequired,
    onChange: PropTypes.func
  },

  didChange (event) {
    const player = this.props.players[event.target.value]
    this.props.onChange(event, player)
  },

  render () {
    const { name = 'playerIds', players, isSelected, isDisabled, onChange } = this.props
    return (
      h('div', null, players.sort(compareName()).map((player, index) =>
        h('label', { key: player.id },
          h('input', {
            type: 'checkbox',
            name: name,
            onChange: onChange && this.didChange,
            disabled: isDisabled(player),
            checked: isSelected(player),
            value: index
          }),
          player.name
        )
      ))
    )
  }
})

const { createElement: h, PropTypes } = require('react')
const formatMessage = require('format-message')

const PlayerPicker = ({ name = 'playerId', players, selectedId, select, others = [] }) =>
  h('div', null, players.map((player) =>
    h('div', { key: player.id },
      h('label', null,
        h('input', {
          type: 'radio',
          name: name,
          onChange: select ? () => select(player.id) : null,
          disabled: !select || player.isDisabled,
          checked: player.id === selectedId
        }),
        player.name
      ),
      formatMessage(' ('),
      delimit(others
        .filter(({ selectedId }) => selectedId === player.id)
        .map((other) =>
          h('span', { key: other.player.id }, other.player.name)
        ),
        formatMessage(', ')
      ),
      formatMessage(')')
    )
  ))

function delimit (array, delimiter) {
  const newArray = []
  for (const value of array) {
    newArray.push(value)
    newArray.push(delimiter)
  }
  newArray.pop()
  return newArray
}

PlayerPicker.displayName = 'PlayerPicker'
PlayerPicker.propTypes = {
  name: PropTypes.string,
  players: PropTypes.array.isRequired,
  selectedId: PropTypes.string,
  select: PropTypes.func,
  others: PropTypes.array
}
module.exports = PlayerPicker

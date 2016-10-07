const { createElement: h, PropTypes } = require('react')
const t = require('format-message')
const { compareName } = require('../../common/natural-compare')
const Avatar = require('./avatar')
const classnames = require('classnames')
require('./picker.css')

const PlayerPicker = ({ name = 'playerId', players, selectedId, select, others }) =>
  h('div', null, players.sort(compareName()).map((player) =>
    h('div', { key: player.id, className: 'PlayerPicker-player' },
      h('label', {
        className: classnames('PlayerPicker-label', {
          'PlayerPicker-label--selected': player.id === selectedId
        })
      },
        h(Avatar, {
          className: classnames('PlayerPicker-avatar', {
            'PlayerPicker-avatar--selected': player.id === selectedId
          }),
          name: player.name,
          avatar: player.avatar
        }),
        h('span', { className: 'PlayerPicker-name' }, player.name),
        h('input', {
          className: 'PlayerPicker-input',
          type: 'radio',
          name: name,
          onChange: select ? () => select(player.id) : null,
          disabled: !select || player.isDisabled,
          checked: player.id === selectedId
        })
      ),
      others && h('div', { className: 'PlayerPicker-others' },
        t('('),
        delimit(others
          .filter(({ selectedId }) => selectedId === player.id)
          .map((other) =>
            h('span', { key: other.player.id }, other.player.name)
          ),
          t(', ')
        ),
        t(')')
      )
    )
  ))

function delimit (array, delimiter) {
  const newArray = []
  for (let value of array) {
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

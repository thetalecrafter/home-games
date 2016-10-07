const { createElement: h, PropTypes } = require('react')
const t = require('format-message')
const { compareName } = require('../../common/natural-compare')
const Avatar = require('./avatar')
const classnames = require('classnames')
require('./picker.css')

const PlayerPicker = ({ name = 'playerId', players, selectedId, select, others }) =>
  h('div', null, players.sort(compareName()).map((player) => {
    const isDisabled = !select || player.isDisabled
    const isSelected = player.id === selectedId
    const selectedBy = (others || [])
      .filter(({ selectedId }) => selectedId === player.id)

    return h('div', { key: player.id, className: 'PlayerPicker-player' },
      h('label', {
        className: 'PlayerPicker-label'
      },
        player.icon || h(Avatar, {
          className: classnames('PlayerPicker-avatar', {
            'is-selected': isSelected,
            'is-disabled': isDisabled
          }),
          name: player.name,
          avatar: player.avatar
        }),
        h('span', {
          className: classnames('PlayerPicker-name', {
            'is-selected': isSelected,
            'is-disabled': isDisabled
          })
        }, player.name),
        selectedBy.length > 0 && h('div', { className: 'PlayerPicker-others' },
          t('(chosen by '),
          delimit(
            selectedBy.map((other) =>
              h('span', { key: other.player.id }, other.player.name)
            ),
            t(', ')
          ),
          t(')')
        ),
        h('input', {
          className: 'PlayerPicker-input',
          type: 'radio',
          name: name,
          onChange: select ? () => select(player.id) : null,
          disabled: isDisabled,
          checked: isSelected
        })
      )
    )
  }))

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

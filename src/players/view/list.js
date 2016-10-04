const { createElement: h, PropTypes } = require('react')
const t = require('format-message')
const Glyph = require('elemental/lib/components/Glyph')
const resolve = require('../../common/resolve-url')
const { compareName } = require('../../common/natural-compare')
const Shell = require('../../common/shell')
const Player = require('./list-item')
require('./list.css')

const PlayersList = ({ players, selectedId, actions }) =>
  h(Shell, { className: 'PlayersList u-chunk' },
    h('a', { href: resolve('/') },
      h(Glyph, { className: 'u-space-right', icon: 'chevron-left' }),
      t('Home')
    ),
    h('h2', null, t('Players')),
    h('ul', { className: 'PlayersList-list' },
      players.sort(compareName()).map((player) => h(Player, {
        key: player.id,
        player,
        isSelected: player.id === selectedId,
        actions
      })),
      h(Player, {
        key: '+',
        player: { id: '+', name: t('Add Player') },
        isSelected: selectedId === '+' || selectedId === ' ',
        actions,
        icon: h(Glyph, { icon: 'plus' })
      })
    )
  )

PlayersList.displayName = 'PlayersList'
PlayersList.propTypes = {
  players: PropTypes.array.isRequired,
  selectedId: PropTypes.string,
  actions: PropTypes.object.isRequired
}
module.exports = PlayersList

const { createClass, createElement: h, PropTypes } = require('react')
const formatMessage = require('format-message')
const { roles } = require('../constants')

module.exports = createClass({
  displayName: 'EndStage',

  propTypes: {
    game: PropTypes.object.isRequired
  },

  shouldComponentUpdate (nextProps) {
    return nextProps.game !== this.props.game
  },

  didWin (game, player) {
    if (player.isDead) return false
    if (player.role === roles.WITCH) return true
    return game.players.every(
      (player) => player.isDead || player.role === roles.PURITAN
    )
  },

  render () {
    const { game } = this.props
    return (
      h('div', null,
        h('h2', null, formatMessage('Epilogue')),
        h('table', null, game.players.map((player) =>
          h('tr', { key: player.id },
            h('th', null, player.name),
            h('td', null,
              player.role === roles.WITCH
                ? formatMessage('Witch')
                : formatMessage('Puritan')
            ),
            h('td', null,
              player.isDead
                ? formatMessage('Died')
                : formatMessage('Survived')
            ),
            h('td', null,
              this.didWin(game, player)
                ? formatMessage('Won')
                : formatMessage('Lost')
            )
          )
        ))
      )
    )
  }
})

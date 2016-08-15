const { createClass, createElement: h, PropTypes } = require('react')
const formatMessage = require('format-message')

module.exports = createClass({
  displayName: 'ReadyButton',

  propTypes: {
    player: PropTypes.object.isRequired,
    game: PropTypes.object.isRequired,
    confirm: PropTypes.func
  },

  shouldComponentUpdate (nextProps) {
    return (
      nextProps.player !== this.props.player ||
      nextProps.game !== this.props.game ||
      nextProps.confirm !== this.props.confirm
    )
  },

  getNotReadyCount (game) {
    return game.players.length - Object.keys(game.votes).length
  },

  render () {
    const { game, confirm } = this.props
    const count = this.getNotReadyCount(game)

    return (
      h('div', null,
        confirm
          ? h('button', { onClick: confirm },
            formatMessage('I’m Ready')
          )
          : h('span', null,
            formatMessage(`Waiting for {
                count, plural,
                one {1 other player}
                other {# other players}
              }...`, { count })
          )
      )
    )
  }
})

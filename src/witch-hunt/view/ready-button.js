const { createClass, createElement: h, PropTypes } = require('react')
const Button = require('elemental/lib/components/Button')
const t = require('format-message')

module.exports = createClass({
  displayName: 'ReadyButton',

  propTypes: {
    player: PropTypes.object.isRequired,
    game: PropTypes.object.isRequired,
    disabled: PropTypes.bool.isRequired,
    confirm: PropTypes.func.isRequired
  },

  shouldComponentUpdate (nextProps) {
    return (
      nextProps.disabled !== this.props.disabled ||
      nextProps.player !== this.props.player ||
      nextProps.game !== this.props.game
    )
  },

  getNotReadyCount (game) {
    return game.players.reduce((count, player) => {
      if (player.isDead || player.isReady) { return count }
      return count + 1
    }, 0)
  },

  render () {
    const { player, game, disabled, confirm } = this.props
    const count = this.getNotReadyCount(game)

    return (
      h('div', null,
        (player.isDead || player.isReady)
          ? h('span', null,
            t(`Waiting for {
                count, plural,
                one {1 other player}
                other {# other players}
              }...`, { count })
          )
          : h(Button, {
            type: 'primary',
            onClick: disabled ? null : () => confirm(player),
            disabled
          },
            t('I’m Ready')
          )
      )
    )
  }
})

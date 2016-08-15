const { createClass, createElement: h, PropTypes } = require('react')
const formatMessage = require('format-message')
const { roles } = require('../../constants')
const PlayerPicker = require('../../../players/picker')
const ReadyButton = require('../ready-button')

module.exports = createClass({
  displayName: 'WitchNightStage',

  propTypes: {
    sid: PropTypes.string.isRequired,
    game: PropTypes.object.isRequired,
    vote: PropTypes.func.isRequired,
    confirm: PropTypes.func.isRequired
  },

  shouldComponentUpdate (nextProps) {
    return (
      nextProps.game !== this.props.game ||
      nextProps.sid !== this.props.sid
    )
  },

  render () {
    const { sid, game, vote, confirm } = this.props
    const currentPlayer = game.players.find((player) => player.sid === sid)
    const disabled = currentPlayer.isDead || currentPlayer.isReady

    const otherWitches = []
    const puritans = []
    game.players.forEach((player) => {
      if (player.id === currentPlayer.id || player.isDead) return
      if (player.role === roles.WITCH) {
        otherWitches.push({ player, selectedId: player.vote })
      } else {
        puritans.push(player)
      }
    })

    return (
      h('div', null,
        h('p', null, formatMessage('Select a Puritan to curse.')),
        h(PlayerPicker, {
          players: puritans,
          selectedId: currentPlayer.isDead ? null : currentPlayer.vote,
          select: disabled ? null : (id) => vote({ id: currentPlayer.id, vote: id }),
          others: otherWitches
        }),
        h(ReadyButton, {
          player: currentPlayer,
          game,
          disabled: !currentPlayer.vote,
          confirm
        })
      )
    )
  }
})

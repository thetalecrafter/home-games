const { createClass, createElement: h, PropTypes } = require('react')
const t = require('format-message')
const PlayerPicker = require('../../../players/view/picker')
const ReadyButton = require('../ready-button')

module.exports = createClass({
  displayName: 'PuritanNightStage',

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

  voteSleep () {
    const { sid, game, vote } = this.props
    const currentPlayer = game.players.find((player) => player.sid === sid)
    vote({ id: currentPlayer.id, vote: '' })
  },

  votePlayer (id) {
    const { sid, game, vote } = this.props
    const currentPlayer = game.players.find((player) => player.sid === sid)
    vote({ id: currentPlayer.id, vote: id })
  },

  render () {
    const { sid, game, confirm } = this.props
    const currentPlayer = game.players.find((player) => player.sid === sid)
    const followees = game.players.filter(
      (player) => (player !== currentPlayer && !player.isDead)
    )
    const disabled = currentPlayer.isDead || currentPlayer.isReady
    return (
      h('div', null,
        !currentPlayer.isDead &&
          h('div', null,
            h('label', null,
              h('input', {
                type: 'radio',
                name: 'playerId',
                checked: currentPlayer.vote === '',
                disabled,
                onChange: this.voteSleep
              }),
              t('Sleep')
            ),
            h('p', null, t('Or choose someone to follow.')),
            h(PlayerPicker, {
              name: 'playerId',
              players: followees,
              selectedId: currentPlayer.isDead ? null : currentPlayer.vote,
              select: disabled ? null : this.votePlayer
            })
          ),
        h(ReadyButton, {
          player: currentPlayer,
          game,
          disabled: currentPlayer.vote == null,
          confirm
        })
      )
    )
  }
})

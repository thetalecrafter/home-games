const { createClass, createElement: h, PropTypes } = require('react')
const formatMessage = require('format-message')
const ReadyButton = require('./ready-button')

module.exports = createClass({
  displayName: 'EveningStage',

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
    const { sid, game, confirm } = this.props
    const currentPlayer = game.players.find((player) => player.sid === sid)

    let victimResult
    if (game.result && game.result.victimId) {
      const { victimId, victimDied } = game.result
      const { name: victimName } = game.players.find((player) => player.id === victimId)
      if (victimDied) {
        victimResult = (victimId === currentPlayer.id)
          ? h('div', null,
            h('h3', null, formatMessage('You have died')),
            h('p', null,
              formatMessage(`Surviving the trial only further convinced your
                community of your wickedness. Your soaked clothing continued to
                drip long after you strangled on the gallows. When they cut you
                down, your body was tossed into an open pit outside town.`)
            )
          )
          : h('p', null,
            formatMessage(`Surviving the trial only further convinced everyone
              of { name }’s wickedness. { name }’s soaked clothing continued to
              drip long after strangling on the gallows. When { name } was cut
              down, the body was tossed into an open pit outside town.`,
              { name: victimName })
          )
      } else {
        victimResult = (victimId === currentPlayer.id)
          ? h('p', null,
            formatMessage(`Though you survived the trial, your struggle was
              enough to convince your fellows of your innocence... for now.`)
          )
          : h('p', null,
            formatMessage(`Though { name } survived the trial, the struggle was
              enough to convince everyone of { name }’s innocence... for now.`,
              { name: victimName })
          )
      }
    }

    return (
      h('div', null,
        h('h2', null, formatMessage('Evening')),
        victimResult,
        h(ReadyButton, {
          player: currentPlayer,
          game,
          disabled: false,
          confirm
        })
      )
    )
  }
})

const { createClass, createElement: h, PropTypes } = require('react')
const t = require('format-message')
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
            h('h3', null, t('You have died')),
            h('p', null,
              t(`Surviving the trial only further convinced your
                community of your wickedness. Your soaked clothing continued to
                drip long after you strangled on the gallows. When they cut you
                down, your body was tossed into an open pit outside town.`)
            )
          )
          : h('p', null,
            t(`Surviving the trial only further convinced everyone
              of { name }’s wickedness. { name }’s soaked clothing continued to
              drip long after strangling on the gallows. When { name } was cut
              down, the body was tossed into an open pit outside town.`,
              { name: victimName })
          )
      } else {
        victimResult = (victimId === currentPlayer.id)
          ? h('p', null,
            t(`Though you survived the trial, your struggle was
              enough to convince your fellows of your innocence... for now.`)
          )
          : h('p', null,
            t(`Though { name } survived the trial, the struggle was
              enough to convince everyone of { name }’s innocence... for now.`,
              { name: victimName })
          )
      }
    }

    return (
      h('div', { className: 'WitchHuntPanel' },
        h('h2', null, t('Evening')),
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

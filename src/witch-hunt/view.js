const { createClass, createElement: h, PropTypes } = require('react')
const t = require('format-message')
const { stages } = require('./constants')
const resolve = require('../common/resolve-url')

const Button = require('elemental/lib/components/Button')
const Glyph = require('elemental/lib/components/Glyph')
const AddPlayerStage = require('./view/add-player-stage')
const IntroStage = require('./view/intro-stage')
const NightStage = require('./view/night-stage')
const MorningStage = require('./view/morning-stage')
const AfternoonStage = require('./view/afternoon-stage')
const EveningStage = require('./view/evening-stage')
const EndStage = require('./view/end-stage')
const GameDescription = require('./view/description')
const Background = require('./view/background')
require('./view/view.css')

module.exports = createClass({
  displayName: 'WitchHunt',

  propTypes: {
    sid: PropTypes.string.isRequired,
    game: PropTypes.object.isRequired,
    players: PropTypes.array.isRequired,
    end: PropTypes.func.isRequired
  },

  shouldComponentUpdate (nextProps) {
    return (
      nextProps.players !== this.props.players ||
      nextProps.game !== this.props.game ||
      nextProps.sid !== this.props.sid
    )
  },

  getView (isPlaying, stage) {
    if (!isPlaying && stage !== stages.ADD_PLAYERS) {
      return GameDescription
    }
    switch (stage) {
      case stages.ADD_PLAYERS: return AddPlayerStage
      case stages.INTRO: return IntroStage
      case stages.NIGHT: return NightStage
      case stages.MORNING: return MorningStage
      case stages.AFTERNOON: return AfternoonStage
      case stages.EVENING: return EveningStage
      case stages.END: return EndStage
      default: return GameDescription
    }
  },

  end () {
    const message = (
      t('Are you sure you want to end the game?') +
      '\n\n' +
      t('All players will be taken back to the game description and a new game can be started.')
    )
    if (window.confirm(message)) {
      this.props.end()
    }
  },

  render () {
    const { sid, game } = this.props
    const { stage, result } = game
    const player = game.players.find((player) => player.sid === sid)
    const isPlaying = !!player
    const Stage = this.getView(isPlaying, stage)

    return (
      h('div', { className: 'WitchHunt u-chunk WitchHunt--' + stage },
        h(Background, { stage, player, result }),
        h('main', { className: 'WitchHunt-main' },
          h(Stage, this.props)
        ),
        h('header', { className: 'WitchHunt-header' },
          h('a', { href: resolve('/'), className: 'WitchHunt-home-link' },
            h(Glyph, { className: 'u-space-right', icon: 'chevron-left' }),
            t('Home')
          ),
          h('h1', { className: 'WitchHunt-title' }, t('Witch Hunt')),
          isPlaying &&
            h(Button, {
              className: 'WitchHunt-abandon',
              type: 'link-danger',
              onClick: this.end
            },
              t('Quit')
            )
        )
      )
    )
  }
})

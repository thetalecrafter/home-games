const { createClass, createElement: h, PropTypes } = require('react')
const formatMessage = require('format-message')
const { stages } = require('./constants')
const resolve = require('../common/resolve-url')

const AddPlayerStage = require('./view/add-player-stage')
const IntroStage = require('./view/intro-stage')
const NightStage = require('./view/night-stage')
const MorningStage = require('./view/morning-stage')
const AfternoonStage = require('./view/afternoon-stage')
const EveningStage = require('./view/evening-stage')
const EndStage = require('./view/end-stage')
const GameDescription = require('./view/description')
require('./view/view.css')

module.exports = createClass({
  displayName: 'WitchHuntView',

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
      formatMessage('Are you sure you want to end the game?') +
      '\n\n' +
      formatMessage('All players will be taken back to the game description and a new game can be started.')
    )
    if (window.confirm(message)) {
      this.props.end()
    }
  },

  render () {
    const { sid, game } = this.props
    const stage = game.stage
    const isPlaying = !!game.players.find((player) => player.sid === sid)
    const Stage = this.getView(isPlaying, stage)

    return (
      h('div', { className: 'WitchHuntView u-chunk WitchHuntView--' + stage },
        h('a', { href: resolve('/') },
          `« ${formatMessage('Home')}`
        ),
        h('h1', null, formatMessage('Witch Hunt')),
        h(Stage, this.props),
        isPlaying &&
          h('button', { onClick: this.end, className: 'WitchHuntView-abandon' },
            stage === stages.END
              ? formatMessage('End Game')
              : formatMessage('Abandon Game')
          )
      )
    )
  }
})

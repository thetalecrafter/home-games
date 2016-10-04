const { createClass, createElement: h, PropTypes } = require('react')
const t = require('format-message')
const { stages } = require('./constants')
const resolve = require('../common/resolve-url')

const Glyph = require('elemental/lib/components/Glyph')
const AddPlayerStage = require('./view/add-player-stage')
const IntroStage = require('./view/intro-stage')
const RosterStage = require('./view/roster-stage')
const ApprovalStage = require('./view/approval-stage')
const MissionStage = require('./view/mission-stage')
const EndStage = require('./view/end-stage')
const GameDescription = require('./view/description')
const Status = require('./view/status')
require('./view/view.css')

module.exports = createClass({
  displayName: 'InterceptView',

  propTypes: {
    sid: PropTypes.string.isRequired,
    game: PropTypes.object.isRequired,
    players: PropTypes.array.isRequired,
    end: PropTypes.func.isRequired
  },

  getView (isPlaying, stage) {
    if (!isPlaying && stage !== stages.ADD_PLAYERS) {
      return GameDescription
    }
    switch (stage) {
      case stages.ADD_PLAYERS: return AddPlayerStage
      case stages.INTRO: return IntroStage
      case stages.ROSTER: return RosterStage
      case stages.APPROVAL: return ApprovalStage
      case stages.MISSION: return MissionStage
      case stages.END: return EndStage
      default: return GameDescription
    }
  },

  didClickEnd (end) {
    const message = (
      t('Are you sure you want to end the game?') +
      '\n\n' +
      t('All players will be taken back to the game description and a new game can be started.')
    )
    if (window.confirm(message)) this.props.end()
  },

  render () {
    const { sid, game } = this.props
    const stage = game.stage
    const isPlaying = !!game.players.find((player) => player.sid === sid)
    const Stage = this.getView(isPlaying, stage)

    return (
      h('div', { className: 'InterceptView u-chunk InterceptView--' + stage },
        h('a', { href: resolve('/') },
          h(Glyph, { className: 'u-space-right', icon: 'chevron-left' }),
          t('Home')
        ),
        h('h1', null, t('Intercept')),
        h(Stage, this.props),
        isPlaying &&
          h('div', null,
            h(Status, { missions: game.missions, current: game.currentMission }),
            h('button', { onClick: this.didClickEnd, className: 'Intercept-abandon' },
              stage === stages.END
                ? t('End Game')
                : t('Abandon Game')
            )
          )
      )
    )
  }
})

const { createClass, createElement: h, PropTypes } = require('react')
const t = require('format-message')
const SpyMissionStage = require('./mission-stage/spy')
const DoubleMissionStage = require('./mission-stage/double')
const MoleMissionStage = require('./mission-stage/mole')
const StandbyMissionStage = require('./mission-stage/standby')
const { roles } = require('../constants')

module.exports = createClass({
  displayName: 'MissionStage',

  propTypes: {
    sid: PropTypes.string.isRequired,
    game: PropTypes.object.isRequired,
    intercept: PropTypes.func.isRequired
  },

  shouldComponentUpdate (nextProps) {
    return (
      nextProps.game !== this.props.game ||
      nextProps.sid !== this.props.sid
    )
  },

  getView (isOnTeam, role) {
    if (isOnTeam) {
      switch (role) {
        case roles.SPY: return SpyMissionStage
        case roles.DOUBLE: return DoubleMissionStage
        case roles.MOLE: return MoleMissionStage
      }
    }
    return StandbyMissionStage
  },

  intercept (value) {
    const { sid, game, intercept } = this.props
    const { id } = game.players.find((player) => player.sid === sid)
    intercept({ id }, value)
  },

  render () {
    const { sid, game } = this.props
    const { missions, currentMission } = game
    const { roster, results } = missions[currentMission]
    const { id, role } = game.players.find((player) => player.sid === sid)
    const isOnTeam = roster.includes(id)
    const count = roster.length - Object.keys(results).length
    const View = this.getView(isOnTeam, role)
    return (
      h('div', null,
        h('h2', null, t('Intercept Enemy Message')),
        h(View, { result: results[id], vote: this.intercept }),
        h('span', null,
          t(
            `{ count, plural,
                one {Waiting for # player...}
              other {Waiting for # players...}
            }`,
            { count }
          )
        )
      )
    )
  }
})

const { createClass, createElement: h, PropTypes } = require('react')
const t = require('format-message')
const WitchNightStage = require('./night-stage/witch')
const PuritanNightStage = require('./night-stage/puritan')
const { roles } = require('../constants')

module.exports = createClass({
  displayName: 'NightStage',

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
    const { sid, game } = this.props
    const currentPlayer = game.players.find((player) => player.sid === sid)
    const isWitch = currentPlayer.role === roles.WITCH
    return (
      h('div', null,
        h('h2', null, t('Night')),
        isWitch
          ? h(WitchNightStage, this.props)
          : h(PuritanNightStage, this.props)
      )
    )
  }
})

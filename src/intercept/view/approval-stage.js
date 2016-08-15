const { createClass, createElement: h, PropTypes } = require('react')
const formatMessage = require('format-message')
const VoteResults = require('./vote-results')

module.exports = createClass({
  displayName: 'ApprovalStage',

  propTypes: {
    sid: PropTypes.string.isRequired,
    game: PropTypes.object.isRequired,
    vote: PropTypes.func.isRequired
  },

  shouldComponentUpdate (nextProps) {
    return (
      nextProps.game !== this.props.game ||
      nextProps.sid !== this.props.sid
    )
  },

  approve () {
    const { sid, game, vote } = this.props
    const currentPlayer = game.players.find((player) => player.sid === sid)
    vote(currentPlayer, true)
  },

  reject () {
    const { sid, game, vote } = this.props
    const currentPlayer = game.players.find((player) => player.sid === sid)
    vote(currentPlayer, false)
  },

  isPlayerSelected (player) {
    const { game } = this.props
    const { missions, currentMission } = game
    const mission = missions[currentMission]
    return mission.roster.includes(player.id)
  },

  renderPlayer (player) {
    return h('li', { key: player.id }, player.name)
  },

  render () {
    const { game } = this.props
    const { missions, currentMission } = game
    const mission = missions[currentMission]
    const { votes, players } = game
    const count = players.length - Object.keys(votes).length

    return (
      h('div', null,
        h('h2', null, formatMessage('Team Approval')),
        h('ul', null,
          players.filter(this.isPlayerSelected).map(this.renderPlayer)
        ),
        h('div', null,
          formatMessage('Current Votes:'),
          h(VoteResults, { players, votes }),
          h('span', null,
            formatMessage(`Waiting for {
                count, plural,
                one {1 other player}
                other {# other players}
              }...`, { count })
          )
        ),
        h('span', null,
          h('button', { onClick: this.approve },
            formatMessage('Approve Team')
          ),
          h('button', { onClick: this.reject },
            formatMessage('Reject Team')
          )
        ),
        mission.votes &&
          h('p', null,
            formatMessage(
              'Rejected teams: { count }',
              { count: mission.rejectedRosters }
            )
          )
      )
    )
  }
})

const { createClass, createElement: h, PropTypes } = require('react')
const formatMessage = require('format-message')
const PlayerPicker = require('../../players/picker-multi')
const VoteResults = require('./vote-results')

module.exports = createClass({
  displayName: 'RosterStage',

  propTypes: {
    sid: PropTypes.string.isRequired,
    game: PropTypes.object.isRequired,
    addToRoster: PropTypes.func.isRequired,
    removeFromRoster: PropTypes.func.isRequired,
    ready: PropTypes.func.isRequired
  },

  shouldComponentUpdate (nextProps) {
    return (
      nextProps.game !== this.props.game ||
      nextProps.sid !== this.props.sid
    )
  },

  isPickingDisabled () {
    const { sid, game } = this.props
    const leader = game.players[game.currentLeader]
    const isLeader = (leader.sid === sid)
    return !isLeader
  },

  isPlayerSelected (player) {
    const { game } = this.props
    const { missions, currentMission } = game
    const mission = missions[currentMission]
    return mission.roster.includes(player.id)
  },

  didPickPlayer ({ target }, player) {
    const { addToRoster, removeFromRoster } = this.props
    if (target.checked) addToRoster(player)
    else removeFromRoster(player)
  },

  render () {
    const { sid, game, ready } = this.props
    const leader = game.players[game.currentLeader]
    const isLeader = (leader.sid === sid)
    const { missions, currentMission } = game
    const mission = missions[currentMission]
    const canBeReady = mission.roster.length === mission.size

    return (
      h('div', null,
        h('h2', null, formatMessage('Team Selection')),
        h('p', null,
          isLeader
            ? formatMessage('You are the leader. Please choose your team.')
            : formatMessage('{ name } will choose the team.', { name: leader.name })
        ),
        h('p', null,
          formatMessage(
            `{ numPlayers, plural,
                one {# player is needed for this mission.}
              other {# players are needed for this mission.}
            }`,
            { numPlayers: mission.size }
          )
        ),
        h(PlayerPicker, {
          players: game.players,
          isSelected: this.isPlayerSelected,
          isDisabled: this.isPickingDisabled,
          onChange: this.didPickPlayer
        }),
        isLeader &&
          h('button', { onClick: ready, disabled: !canBeReady },
            formatMessage('Propose Team')
          ),
        mission.votes &&
          h('div', null,
            h('p', null,
              formatMessage(
                'Rejected teams: { count }',
                { count: mission.rejectedRosters }
              )
            ),
            formatMessage('Last rejected team votes:'),
            h(VoteResults, { players: game.players, votes: mission.votes })
          )
      )
    )
  }
})

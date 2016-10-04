const { createClass, createElement: h, PropTypes } = require('react')
const t = require('format-message')
const PlayerPicker = require('../../players/view/picker-multi')
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
        h('h2', null, t('Team Selection')),
        h('p', null,
          isLeader
            ? t('You are the leader. Please choose your team.')
            : t('{ name } will choose the team.', { name: leader.name })
        ),
        h('p', null,
          t(
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
            t('Propose Team')
          ),
        mission.votes &&
          h('div', null,
            h('p', null,
              t(
                'Rejected teams: { count }',
                { count: mission.rejectedRosters }
              )
            ),
            t('Last rejected team votes:'),
            h(VoteResults, { players: game.players, votes: mission.votes })
          )
      )
    )
  }
})

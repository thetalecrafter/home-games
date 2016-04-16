import React from 'react'
import formatMessage from 'format-message'
import PlayerPicker from '../../players/picker-multi'
import VoteResults from './vote-results'

export default class RosterStage extends React.Component {
  static displayName = 'RosterStage'

  static propTypes = {
    sid: React.PropTypes.string.isRequired,
    game: React.PropTypes.object.isRequired,
    addToRoster: React.PropTypes.func.isRequired,
    removeFromRoster: React.PropTypes.func.isRequired,
    ready: React.PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.isPickingDisabled = this.isPickingDisabled.bind(this)
    this.isPlayerSelected = this.isPlayerSelected.bind(this)
    this.didPickPlayer = this.didPickPlayer.bind(this)
  }

  shouldComponentUpdate (nextProps) {
    return (
      nextProps.game !== this.props.game ||
      nextProps.sid !== this.props.sid
    )
  }

  isPickingDisabled () {
    const { sid, game } = this.props
    const leader = game.players[game.currentLeader]
    const isLeader = (leader.sid === sid)
    return !isLeader
  }

  isPlayerSelected (player) {
    const { game } = this.props
    const { missions, currentMission } = game
    const mission = missions[currentMission]
    return mission.roster.includes(player.id)
  }

  didPickPlayer ({ target }, player) {
    const { addToRoster, removeFromRoster } = this.props
    if (target.checked) addToRoster(player)
    else removeFromRoster(player)
  }

  render () {
    const { sid, game, ready } = this.props
    const leader = game.players[game.currentLeader]
    const isLeader = (leader.sid === sid)
    const { missions, currentMission } = game
    const mission = missions[currentMission]
    const canBeReady = mission.roster.length === mission.size

    return (
      <div>
        <h2>{ formatMessage('Team Selection') }</h2>
        <p>
          { isLeader
            ? formatMessage('You are the leader. Please choose your team.')
            : formatMessage('{ name } will choose the team.', { name: leader.name })
          }
        </p>
        <p>
          { formatMessage(
            `{ numPlayers, plural,
                one {# player is needed for this mission.}
              other {# players are needed for this mission.}
            }`,
            { numPlayers: mission.size }
          ) }
        </p>
        <PlayerPicker
          players={ game.players }
          isSelected={ this.isPlayerSelected }
          isDisabled={ this.isPickingDisabled }
          onChange={ this.didPickPlayer }
        />
        { isLeader &&
          <button onClick={ ready } disabled={ !canBeReady }>
            { formatMessage('Propose Team') }
          </button>
        }
        { mission.votes &&
          <div>
            <p>
              { formatMessage(
                'Rejected teams: { count }',
                { count: mission.rejectedRosters }
              ) }
            </p>
            { formatMessage('Last rejected team votes:') }
            <VoteResults players={ game.players } votes={ mission.votes } />
          </div>
        }
      </div>
    )
  }
}

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

  shouldComponentUpdate (nextProps) {
    return (
      nextProps.game !== this.props.game
      || nextProps.sid !== this.props.sid
    )
  }

  render () {
    const { sid, game, addToRoster, removeFromRoster, ready } = this.props
    const isLeader = game.currentLeader === game.players.findIndex(player => player.sid === sid)
    const { missions, currentMission } = game
    const mission = missions[currentMission]
    const canBeReady = mission.roster.length === mission.size

    return (
      <div>
        <h2>{ formatMessage('Team Selection') }</h2>
        { isLeader &&
          <p>
            { formatMessage('You are the leader. Please choose your team.') }
          </p>
        }
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
          isSelected={ player => mission.roster.includes(player.id) }
          isDisabled={ player => !isLeader }
          onChange={ ({ target }, player) => {
            if (target.checked) addToRoster(player)
            else removeFromRoster(player)
          } }
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

import React from 'react'
import formatMessage from 'format-message'
import VoteResults from './vote-results'

export default class ApprovalStage extends React.Component {
  static displayName = 'ApprovalStage'

  static propTypes = {
    sid: React.PropTypes.string.isRequired,
    game: React.PropTypes.object.isRequired,
    vote: React.PropTypes.func.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return (
      nextProps.game !== this.props.game ||
      nextProps.sid !== this.props.sid
    )
  }

  render () {
    const { sid, game, vote } = this.props
    const { missions, currentMission } = game
    const mission = missions[currentMission]
    const { votes, players } = game
    const currentPlayer = players.find(player => player.sid === sid)
    const count = players.length - Object.keys(votes).length

    return (
      <div>
        <h2>{ formatMessage('Team Approval') }</h2>
        <ul>
        { players.filter(player => mission.roster.includes(player.id))
          .map(player =>
            <li key={ player.id }>
              { player.name }
            </li>
          )
        }
        </ul>
        <div>
          { formatMessage('Current Votes:') }
          <VoteResults players={ players } votes={ votes } />
          <span>
            { formatMessage(`Waiting for {
                count, plural,
                one {1 other player}
                other {# other players}
              }...`, { count })
            }
          </span>
        </div>
        <span>
          <button onClick={ () => vote(currentPlayer, true) }>
            { formatMessage('Approve Team') }
          </button>
          <button onClick={ () => vote(currentPlayer, false) }>
            { formatMessage('Reject Team') }
          </button>
        </span>
        { mission.votes &&
          <p>
            { formatMessage(
              'Rejected teams: { count }',
              { count: mission.rejectedRosters }
            ) }
          </p>
        }
      </div>
    )
  }
}

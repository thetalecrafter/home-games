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

  constructor (props) {
    super(props)
    this.approve = this.approve.bind(this)
    this.reject = this.reject.bind(this)
    this.isPlayerSelected = this.isPlayerSelected.bind(this)
  }

  shouldComponentUpdate (nextProps) {
    return (
      nextProps.game !== this.props.game ||
      nextProps.sid !== this.props.sid
    )
  }

  approve () {
    const { sid, game, vote } = this.props
    const currentPlayer = game.players.find((player) => player.sid === sid)
    vote(currentPlayer, true)
  }

  reject () {
    const { sid, game, vote } = this.props
    const currentPlayer = game.players.find((player) => player.sid === sid)
    vote(currentPlayer, false)
  }

  isPlayerSelected (player) {
    const { game } = this.props
    const { missions, currentMission } = game
    const mission = missions[currentMission]
    return mission.roster.includes(player.id)
  }

  renderPlayer (player) {
    return (
      <li key={ player.id }>
        { player.name }
      </li>
    )
  }

  render () {
    const { game } = this.props
    const { missions, currentMission } = game
    const mission = missions[currentMission]
    const { votes, players } = game
    const count = players.length - Object.keys(votes).length

    return (
      <div>
        <h2>{ formatMessage('Team Approval') }</h2>
        <ul>
        { players.filter(this.isPlayerSelected).map(this.renderPlayer) }
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
          <button onClick={ this.approve }>
            { formatMessage('Approve Team') }
          </button>
          <button onClick={ this.reject }>
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

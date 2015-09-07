import React from 'react'
import formatMessage from 'format-message'

export default class VoteResults extends React.Component {
  static displayName = 'VoteResults'

  static propTypes = {
    players: React.PropTypes.array.isRequired,
    votes: React.PropTypes.object.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return (
      nextProps.players !== this.props.players
      || nextProps.votes !== this.props.votes
    )
  }

  render () {
    const { players, votes } = this.props
    return (
      <ul>
      { players.filter(player => votes[player.id] != null)
        .map(player =>
        <li key={ player.id }>
          { formatMessage(
            `{ vote, select,
              approve {{name} approved}
               reject {{name} rejected}
                other {}
            }`,
            {
              name: player.name,
              gender: player.gender,
              vote: votes[player.id] ? 'approve' : 'reject'
            }
          ) }
        </li>
      ) }
      </ul>
    )
  }
}

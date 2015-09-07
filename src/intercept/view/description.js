import React from 'react'
import formatMessage from 'format-message'

const summary = (
  <p>
    { formatMessage(
      `Intercept the enemy's battle plans to win the decisive victory, but
      beware the double agents that strive to sabotage our efforts.`
    ) }
  </p>
)
const description = (
  <div>
    <p>
      { formatMessage('Intercept is a game for 5 to 10 players.') }
    </p>
    <p>
      { formatMessage(
        `The game goes through up to 5 missions. For each mission a team is
        selected by the round-robin chosen leader. The rest of the team votes
        to approve or reject the team, to make sure the right operatives are
        sent. If the team is rejected, the next leader will propose a new team.
        Once the team is approved, double agents will try to sabotage the
        mission while avoiding detection.`
      ) }
    </p>
    <p>
      { formatMessage(
        `The game ends when either 3 mission succeeded, or 3 missions failed.
        The enemy will also immediately win if the proposed mission teams are
        rejected 5 times in a row.`
      ) }
    </p>
    <p>
      { formatMessage(
        `Can you send the right operatives to intercept the enemy's plans? Or
        will your armies be destroyed by superior intel?`
      ) }
    </p>
  </div>
)

export default class GameDescription extends React.Component {
  static displayName = 'GameDescription'

  static propTypes = {
    game: React.PropTypes.object.isRequired,
    create: React.PropTypes.func.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.game !== this.props.game
  }

  render () {
    const { game, create } = this.props
    const isStarted = !!game.stage 
    const didClickStart = isStarted ? null : () => create()
    return (
      <div>
        { summary }
        <button onClick={ didClickStart } disabled={ isStarted }>
          { isStarted ?
            formatMessage('Game In Progress') :
            formatMessage('Play Intercept')
          }
        </button>
        { description }
      </div>
    )
  }
}

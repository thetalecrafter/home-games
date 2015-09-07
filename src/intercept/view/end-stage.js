import React from 'react'
import formatMessage from 'format-message'
import { roles } from '../constants'

export default class EndStage extends React.Component {
  static displayName = 'EndStage'

  static propTypes = {
    game: React.PropTypes.object.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.game !== this.props.game
  }

  didWin (fails, successes, player) {
    // rejected teams too many times
    if (fails < 3 && successes < 3) {
      return (player.role === roles.DOUBLE)
    }

    if (player.role === roles.DOUBLE) return fails > successes
    return fails < successes
  }

  render () {
    const { game } = this.props

    let fails = 0
    let successes = 0
    game.missions.forEach(mission => {
      if (mission.isSuccessful === true) ++successes
      if (mission.isSuccessful === false) ++fails
    })

    return (
      <div>
        <h2>{ formatMessage('Epilogue') }</h2>
        <p>
        { (fails < 3 && successes < 3) ?
          formatMessage(
          `Indecision kept the team from intercepting vital enemy messages.
          Double Agents win.`
          ) :
          fails > successes ?
          formatMessage(
          `The Double Agents successfully sabotaged the interception of enemy
          messages. Double Agents win.`
          ) :
          formatMessage(
          `The team of Spies successfully intercepted the enemy messages,
          avoiding disruption from the Double Agents. Spies win.`
          )
        }
        </p>
        <table>
        { game.players.map(player =>
          <tr key={ player.id }>
            <th>{ player.name }</th>
            <td>
              {
                player.role === roles.DOUBLE ? formatMessage('Double Agent') :
                player.role === roles.MOLE ? formatMessage('Mole') :
                formatMessage('Spy')
              }
            </td>
            <td>
              { this.didWin(fails, successes, player) ?
                formatMessage('Won') :
                formatMessage('Lost')
              }
            </td>
          </tr>
        ) }
        </table>
      </div>
    )
  }
}

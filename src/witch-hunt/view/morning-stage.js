import React from 'react'
import formatMessage from 'format-message'
import PlayerPicker from '../../players/picker'
import ReadyButton from './ready-button'
import { roles } from '../constants'

export default class MorningStage extends React.Component {
  static displayName = 'MorningStage'

  static propTypes = {
    sid: React.PropTypes.string.isRequired,
    game: React.PropTypes.object.isRequired,
    vote: React.PropTypes.func.isRequired,
    confirm: React.PropTypes.func.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return (
      nextProps.game !== this.props.game ||
      nextProps.sid !== this.props.sid
    )
  }

  isAllSame (players) {
    return players.every(
      ({ isDead, role }) => isDead || role === roles.WITCH
    ) || players.every(
      ({ isDead, role }) => isDead || role === roles.PURITAN
    )
  }

  render () {
    const { sid, game, vote, confirm } = this.props
    const { victimId, victimDied, follow } = game.result
    const victim = game.players.find(player => player.id === victimId)
    const currentPlayer = game.players.find(player => player.sid === sid)
    const others = game.players.filter(
      player => (player !== currentPlayer && !player.isDead)
    ).map(
      player => ({ player, selectedId: player.vote })
    )
    const disabled = currentPlayer.isDead || currentPlayer.isReady
    const isDone = this.isAllSame(game.players)

    let followResult
    if (follow && follow[currentPlayer.id]) {
      const followId = follow[currentPlayer.id].followId
      const followPlayer = game.players.find(player => player.id === followId)
      const name = followPlayer.name
      followResult = follow[currentPlayer.id].wasAwake
        ? formatMessage(`You followed { name } for much of the evening. { name }
        was sneaking about, but you couldn’t keep up without being noticed,
        so eventually you went back to bed without really seeing anything.`,
        { name })
        : formatMessage(`You stayed up for a little while, but { name } just went
        to sleep as usual, and then, so did you.`, { name })
    }

    let victimResult
    if (victim) {
      const victimName = victim.name
      if (victimDied) {
        victimResult = (victimId === currentPlayer.id)
          ? <div>
            <h3>{ formatMessage('You have died') }</h3>
            <p>
              { formatMessage(`Shortly after you retired to your bed, a sudden
                pain flashed in your shoulder and chest. After a few moments
                your life came to an end.`)
              }
            </p>
          </div>
          : <p>
            { formatMessage(`Late this morning someone realized { name } wasn’t
              about the usual tasks. { name } was quickly found to be dead in
              bed.`, { name: victimName })
            }
          </p>
      } else {
        victimResult = (victimId === currentPlayer.id)
          ? <div>
            <h3>{ formatMessage('You have been cursed') }</h3>
            <p>
              { formatMessage(`You woke this morning with a terrible headache
                and fever. You tried to get out of bed but felt so dizzy you
                immediately returned to bed.`)
              }
            </p>
          </div>
          : <p>
            { formatMessage(`Late this morning someone realized { name } wasn’t
              about the usual tasks. { name } was then found to be terribly ill
              in bed.`, { name: victimName })
            }
          </p>
      }
    }

    return (
      <div>
        <h2>{ formatMessage('Morning') }</h2>
        { followResult && <p>{ followResult }</p> }

        { victimResult
          ? <div>
            { victimResult }
            { !isDone &&
              <div>
                <p>{ formatMessage('Whom shall be tried for this tragedy?') }</p>
                <PlayerPicker
                  players={ game.players.filter(player => !player.isDead) }
                  selectedId={ currentPlayer.isDead ? null : currentPlayer.vote }
                  select={ disabled ? null : (id) => vote({ id: currentPlayer.id, vote: id }) }
                  others={ others }
                />
              </div>
            }
          </div>
          : <p>
            { formatMessage(`You all went about their usual tasks this morning.
              Everyone was accounted for.`)
            }
          </p>
        }
        <ReadyButton
          player={ currentPlayer }
          game={ game }
          disabled={ !!victimResult && !isDone && currentPlayer.vote == null }
          confirm={ confirm }
        />
      </div>
    )
  }
}

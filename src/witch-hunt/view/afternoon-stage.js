import React from 'react'
import formatMessage from 'format-message'
import ReadyButton from './ready-button'

export default class AfternoonStage extends React.Component {
  static displayName = 'AfternoonStage'

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

  render () {
    const { sid, game, vote, confirm } = this.props
    const { victimId, victimDied } = game.result
    const victim = game.players.find(player => player.id === victimId)
    const currentPlayer = game.players.find(player => player.sid === sid)
    const canVote = (
      !victimDied &&
      victimId !== currentPlayer.id &&
      !currentPlayer.isDead
    )
    const needsToVote = canVote && currentPlayer.vote == null
    const disabled = !canVote || currentPlayer.isReady

    const victimName = victim.name
    let victimResult
    if (victimDied) {
      victimResult = (victimId === currentPlayer.id)
        ? <div>
          <h3>{ formatMessage('You have died') }</h3>
          <p>
            { formatMessage(`To prove your innocence, you were thrown into the
              lake. You struggled and flailed, but you quickly sank into water
              and drowned. After your body was pulled from the lake, you were
              given a proper christian burial.`)
            }
          </p>
        </div>
        : <p>
          { formatMessage(`As a trial, you all tossed { name } into the lake.
            { name } struggled and flailed, but quickly sank into water and
            drowned. After the body was pulled from the lake, you gave { name }
            a proper christian burial.`, { name: victimName })
          }
        </p>
    } else {
      victimResult = (victimId === currentPlayer.id)
        ? <p>
          { formatMessage(`To prove your innocence, you were thrown into the
            lake. You struggled and flailed, and managed to stay afloat. In
            horror, the others watched you exert inhuman power in returning to
            the shore.`)
          }
        </p>
        : <p>
          { formatMessage(`As a trial, you all tossed { name } into the lake.
            { name } struggled and flailed, and managed to stay afloat. In
            horror, you watched the inhuman power { name } exerted to return to
            the shore.`, { name: victimName })
          }
        </p>
    }

    return (
      <div>
        <h2>{ formatMessage('Afternoon') }</h2>
        { victimResult }
        { !victimDied && victimId !== currentPlayer.id &&
          <div>
            <p>
              { formatMessage(`Does this prove to you that { name } is a witch,
                and should now be executed?`, { name: victimName })
              }
            </p>
            <label>
              <input
                type='radio'
                name='vote'
                checked={ currentPlayer.vote === true }
                disabled={ disabled }
                onChange={ disabled ? null : () => vote({ id: currentPlayer.id, vote: true }) } />
              { formatMessage('Yes') }
            </label>
            <label>
              <input
                type='radio'
                name='vote'
                checked={ currentPlayer.vote === false }
                disabled={ disabled }
                onChange={ disabled ? null : () => vote({ id: currentPlayer.id, vote: false }) } />
              { formatMessage('No') }
            </label>
          </div>
        }
        { !victimDied && victimId === currentPlayer.id &&
          <p>
            { formatMessage(`Your community will now decide your fate. Having
              survived the trial, they undoubtedly will assume you are a witch.`)
            }
          </p>
        }
        <ReadyButton
          player={ currentPlayer }
          game={ game }
          disabled={ needsToVote }
          confirm={ confirm }
        />
      </div>
    )
  }
}

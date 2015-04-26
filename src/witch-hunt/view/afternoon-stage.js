import React from 'react'
import formatMessage from 'format-message'
import ReadyButton from './ready-button'

export default React.createClass({
  displayName: 'AfternoonStage',

  propTypes: {
    app: React.PropTypes.object.isRequired,
    game: React.PropTypes.object.isRequired
  },

  render () {
    const { app, game } = this.props
    const { victimId, victimDied } = game.result
    const victim = game.store.getPlayer(victimId)
    let currentPlayer = app.getCurrentPlayer()
    currentPlayer = game.store.getPlayer(currentPlayer.id)
    const canVote = (
      !victimDied &&
      victimId !== currentPlayer.id &&
      !currentPlayer.isDead
    )
    const needsToVote = canVote && currentPlayer.vote == null
    const disabled = !canVote || currentPlayer.isReady
    const { vote } = app.actions.witchHunt

    const victimName = victim.name
    let victimResult
    if (victimDied) {
      victimResult = (victimId === currentPlayer.id) ?
        <div>
          <h3>{ formatMessage('You have died') }</h3>
          <p>
            { formatMessage(`To prove your innocence, you were thrown into the
              lake. You struggled and flailed, but you quickly sank into water
              and drowned. After your body was pulled from the lake, you were
              given a proper christian burial.`)
            }
          </p>
        </div> :
        <p>
          { formatMessage(`As a trial, you all tossed { name } into the lake.
            { name } struggled and flailed, but quickly sank into water and
            drowned. After the body was pulled from the lake, you gave { name }
            a proper christian burial.`, { name: victimName })
          }
        </p>
    } else {
      victimResult = (victimId === currentPlayer.id) ?
        <p>
          { formatMessage(`To prove your innocence, you were thrown into the
            lake. You struggled and flailed, and managed to stay afloat. In
            horror, the others watched you exert inhuman power in returning to
            the shore.`)
          }
        </p> :
        <p>
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
                onChange={ disabled ? null : vote.partial(currentPlayer.id, true) } />
              { formatMessage('Yes') }
            </label>
            <label>
              <input
                type='radio'
                name='vote'
                checked={ currentPlayer.vote === false }
                disabled={ disabled }
                onChange={ disabled ? null : vote.partial(currentPlayer.id, false) } />
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
          app={ app }
          game={ game }
          disabled={ needsToVote }
        />
      </div>
    )
  }
})

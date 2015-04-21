import React from 'react'
import formatMessage from 'format-message'

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
    const isReady = game.store.isReady(currentPlayer.id)
    const canVote = (
      !victimDied &&
      victimId !== currentPlayer.id &&
      !currentPlayer.isDead
    )
    const needsToVote = canVote && currentPlayer.vote == null
    const { ready, vote } = app.actions.witchHunt

    const victimName = victim.name
    let victimResult
    if (victimDied) {
      victimResult = (victimId === currentPlayer.id) ?
        formatMessage(`To prove your innocence, you were thrown into the lake.
          You struggled and flailed, but you quickly sank into water to rise
          no more.`) :
        formatMessage(`As a trial, you all tossed { name } into the lake.
          { name } struggled and flailed, but quickly sank into water to rise
          no more.`,
          { name: victimName })
    } else {
      victimResult = (victimId === currentPlayer.id) ?
        formatMessage(`To prove your innocence, you were thrown into the lake.
          You struggled and flailed, and managed to stay afloat. In horror, the
          others watched you exert inhuman power in returning to the shore.`) :
        formatMessage(`As a trial, you all tossed { name } into the lake.
          { name } struggled and flailed, and managed to stay afloat. In
          horror, you watched the inhuman power { name } exerted to return to
          the shore.`,
          { name: victimName })
    }

    return (
      <div>
        <h2>{ formatMessage('Afternoon') }</h2>
        <p>{ victimResult }</p>
        { canVote &&
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
                onChange={ vote.partial(currentPlayer.id, true) } />
              { formatMessage('Yes') }
            </label>
            <label>
              <input
                type='radio'
                name='vote'
                checked={ currentPlayer.vote === false }
                onChange={ vote.partial(currentPlayer.id, false) } />
              { formatMessage('No') }
            </label>
          </div>
        }
        { victimId === currentPlayer.id &&
          <p>
            { formatMessage(`Your community will now decide your fate. Having
              survived the trial, they undoubtedly will assume you are a witch.`)
            }
          </p>
        }
        { !currentPlayer.isDead && (isReady ?
          formatMessage('Waiting for others...') :
          <button
            onClick={ !needsToVote && ready.partial(currentPlayer.id) }
            disabled={ needsToVote }
          >
            { formatMessage('I’m Ready') }
          </button>
        ) }
      </div>
    )
  }
})

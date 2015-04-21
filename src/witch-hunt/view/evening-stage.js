import React from 'react'
import formatMessage from 'format-message'

export default React.createClass({
  displayName: 'EveningStage',

  propTypes: {
    app: React.PropTypes.object.isRequired,
    game: React.PropTypes.object.isRequired
  },

  render () {
    const { app, game } = this.props
    let currentPlayer = app.getCurrentPlayer()
    currentPlayer = game.store.getPlayer(currentPlayer.id)
    const isReady = game.store.isReady(currentPlayer.id)
    const { ready, vote } = app.actions.witchHunt

    let victimResult
    if (game.result) {
      const { victimId, victimDied } = game.result
      const { name: victimName } = game.store.getPlayer(victimId)
      if (victimDied) {
        victimResult = (victimId === currentPlayer.id) ?
          formatMessage(`Surviving the trial only further convinced your
            community of your wickedness. Your soaked clothing continued to
            drip long after you strangled on the gallows.`) :
          formatMessage(`Surviving the trial only further convinced everyone
            of { name }’s wickedness. { name }’s soaked clothing continued to
            drip long after strangling on the gallows.`,
            { name: victimName })
      } else {
        victimResult = (victimId === currentPlayer.id) ?
          formatMessage(`Though you survived the trial, your struggle was
            enough to convince your fellows of your innocence... for now.`) :
          formatMessage(`Though { name } survived the trial, the struggle was
            enough to convince everyone of { name }’s innocence... for now.`,
            { name: victimName })
      }
    }

    return (
      <div>
        <h2>{ formatMessage('Evening') }</h2>
        { victimResult &&
          <p>{ victimResult }</p>
        }
        { !currentPlayer.isDead &&
          <div>
            <p>
              { formatMessage(`Have we freed ourselves of the witches? Shall
                the trials end?`)
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
        { !currentPlayer.isDead && (isReady ?
          formatMessage('Waiting for others...') :
          <button
            onClick={ currentPlayer.vote != null && ready.partial(currentPlayer.id) }
            disabled={ currentPlayer.vote == null }
          >
            { formatMessage('I’m Ready') }
          </button>
        ) }
      </div>
    )
  }
})

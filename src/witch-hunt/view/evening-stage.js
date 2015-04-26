import React from 'react'
import formatMessage from 'format-message'
import ReadyButton from './ready-button'

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
    const { vote } = app.actions.witchHunt

    let victimResult
    if (game.result && game.result.victimId) {
      const { victimId, victimDied } = game.result
      const { name: victimName } = game.store.getPlayer(victimId)
      if (victimDied) {
        victimResult = (victimId === currentPlayer.id) ?
          <div>
            <h3>{ formatMessage('You have died') }</h3>
            <p>
              { formatMessage(`Surviving the trial only further convinced your
                community of your wickedness. Your soaked clothing continued to
                drip long after you strangled on the gallows. When they cut you
                down, your body was tossed into an open pit outside town.`)
              }
            </p>
          </div> :
          <p>
            { formatMessage(`Surviving the trial only further convinced everyone
              of { name }’s wickedness. { name }’s soaked clothing continued to
              drip long after strangling on the gallows. When { name } was cut
              down, the body was tossed into an open pit outside town.`,
              { name: victimName })
            }
          </p>
      } else {
        victimResult = (victimId === currentPlayer.id) ?
          <p>
            { formatMessage(`Though you survived the trial, your struggle was
              enough to convince your fellows of your innocence... for now.`)
            }
          </p> :
          <p>
            { formatMessage(`Though { name } survived the trial, the struggle was
              enough to convince everyone of { name }’s innocence... for now.`,
              { name: victimName })
            }
          </p>
      }
    }

    return (
      <div>
        <h2>{ formatMessage('Evening') }</h2>
        { victimResult }
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
              disabled={ currentPlayer.isDead }
              onChange={ currentPlayer.isDead ? null : vote.partial(currentPlayer.id, true) }
            />
            { formatMessage('Yes') }
          </label>
          <label>
            <input
              type='radio'
              name='vote'
              checked={ currentPlayer.vote === false }
              disabled={ currentPlayer.isDead }
              onChange={ currentPlayer.isDead ? null : vote.partial(currentPlayer.id, false) }
            />
            { formatMessage('No') }
          </label>
        </div>
        <ReadyButton
          app={ app }
          game={ game }
          disabled={ currentPlayer.vote == null }
        />
      </div>
    )
  }
})

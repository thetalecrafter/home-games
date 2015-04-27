import React from 'react'
import formatMessage from 'format-message'
import PlayerPicker from '../../player/picker'
import ReadyButton from './ready-button'

export default React.createClass({
  displayName: 'MorningStage',

  propTypes: {
    app: React.PropTypes.object.isRequired,
    game: React.PropTypes.object.isRequired
  },

  render () {
    const { app, game } = this.props
    const { victimId, follow } = game.result
    const victim = game.store.getPlayer(victimId)
    let currentPlayer = app.getCurrentPlayer()
    currentPlayer = game.store.getPlayer(currentPlayer.id)
    const { vote } = app.actions.witchHunt
    const others = game.players.filter(
      ({ id, isDead }) => (id !== currentPlayer.id && !isDead)
    ).map(
      player => ({ player, selectedId: player.vote })
    )
    const disabled = currentPlayer.isDead || currentPlayer.isReady
    const isDone = game.store.isAllSame()

    let followResult
    if (follow && follow[currentPlayer.id]) {
      const followPlayer = game.store.getPlayer(follow[currentPlayer.id].followId)
      const name = followPlayer.name
      followResult = follow[currentPlayer.id].wasAwake ?
        formatMessage(`You followed { name } for much of the evening. { name }
          was sneaking about, but you couldn’t keep up without being noticed,
          so eventually you went back to bed without really seeing anything.`,
          { name }
        ) :
        formatMessage(`You stayed up for a little while, but { name } just went
          to sleep as usual, and then, so did you.`, { name })
    }

    let victimResult
    if (victim) {
      const victimName = victim.name
      victimResult = (victimId === currentPlayer.id) ?
        <div>
          <h3>{ formatMessage('You have died') }</h3>
          <p>{ formatMessage(`Shortly after you retired to your bed, a
          sudden pain flashed in your shoulder and chest. After a few moments
          your life came to an end.`) }</p>
        </div> :
        <p>{ formatMessage(`Late this morning someone realized { name } wasn’t about
          the usual tasks. { name } was quickly found to be dead alone in bed.`,
          { name: victimName }) }</p>
    }

    return (
      <div>
        <h2>{ formatMessage('Morning') }</h2>
        { followResult && <p>{ followResult }</p> }

        { victimResult ?
          <div>
            { victimResult }
            { !isDone &&
              <div>
                <p>{ formatMessage('Whom shall be tried for this tragedy?') }</p>
                <PlayerPicker
                  players={ game.players.filter(({ isDead }) => !isDead) }
                  selectedId={ currentPlayer.isDead ? null : currentPlayer.vote }
                  select={ disabled ? null : vote.partial(currentPlayer.id) }
                  others={ others }
                />
              </div>
            }
          </div> :
          <p>
            { formatMessage(`You all went about their usual tasks this morning.
              Everyone was accounted for.`) }
          </p>
        }
        <ReadyButton
          app={ app }
          game={ game }
          disabled={ !!victimResult && !isDone && currentPlayer.vote == null }
        />
      </div>
    )
  }
})

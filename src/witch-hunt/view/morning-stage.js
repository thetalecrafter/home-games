import React from 'react'
import formatMessage from 'format-message'
import PlayerPicker from '../../player/picker'

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
    const isReady = game.store.isReady(currentPlayer.id)
    const { ready, vote } = app.actions.witchHunt
    const others = game.players.filter(
      ({ id, isDead }) => (id !== currentPlayer.id && !isDead)
    ).map(
      player => ({ player, selectedId: player.vote })
    )

    let followResult
    if (victimId !== currentPlayer.id && follow[currentPlayer.id]) {
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

    const victimName = victim.name
    const victimResult = (victimId === currentPlayer.id) ?
      formatMessage(`Shortly after you retired to your bed, a
        sudden pain flashed in your shoulder and chest. After a few moments
        your life came to an end.`) :
      formatMessage(`Late this morning someone realized { name } wasn’t about
        the usual tasks. { name } was quickly found to be dead alone in bed.`,
        { name: victimName })

    return (
      <div>
        <h2>{ formatMessage('Morning') }</h2>
        { followResult && <p>{ followResult }</p> }

        <p>{ victimResult }</p>

        <p>{ formatMessage('Whom shall be tried for this tragedy?') }</p>
        <PlayerPicker
          players={ game.players.filter(({ isDead }) => !isDead) }
          selectedId={ currentPlayer.isDead ? null : currentPlayer.vote }
          select={ currentPlayer.isDead ? null : vote.partial(currentPlayer.id) }
          others={ others }
        />
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

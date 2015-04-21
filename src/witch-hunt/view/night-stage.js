import React from 'react'
import formatMessage from 'format-message'
import WitchNightStage from './night-stage/witch'
import PuritanNightStage from './night-stage/puritan'

export default React.createClass({
  displayName: 'NightStage',

  propTypes: {
    app: React.PropTypes.object.isRequired,
    game: React.PropTypes.object.isRequired
  },

  render () {
    const { app, game } = this.props
    const currentPlayer = app.getCurrentPlayer()
    const isWitch = game.store.isWitch(currentPlayer.id)
    return (
      <div>
        <h2>{ formatMessage('Night') }</h2>
        { isWitch ?
          <WitchNightStage app={ app } game={ game } /> :
          <PuritanNightStage app={ app } game={ game } />
        }
      </div>
    )
  }
})

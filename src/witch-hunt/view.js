import React from 'react'
import formatMessage from 'format-message'
import { stages } from './constants'

import AddPlayerStage from './view/add-player-stage'
import IntroStage from './view/intro-stage'
import NightStage from './view/night-stage'
import MorningStage from './view/morning-stage'
import AfternoonStage from './view/afternoon-stage'
import EveningStage from './view/evening-stage'
import EndStage from './view/end-stage'
import GameDescription from './view/description'
import './view/view.css'

export default React.createClass({
  displayName: 'WitchHuntView',

  propTypes: {
    app: React.PropTypes.object.isRequired,
    game: React.PropTypes.object.isRequired,
    players: React.PropTypes.object.isRequired
  },

  getViewForStage (stage) {
    switch (stage) {
      case stages.ADD_PLAYERS: return AddPlayerStage
      case stages.INTRO: return IntroStage
      case stages.NIGHT: return NightStage
      case stages.MORNING: return MorningStage
      case stages.AFTERNOON: return AfternoonStage
      case stages.EVENING: return EveningStage
      case stages.END: return EndStage
      default: return GameDescription
    }
  },

  render () {
    const { app, game } = this.props
    const stage = game.stage
    const currentPlayer = app.getCurrentPlayer()
    const isPlaying = game.store.isPlaying(currentPlayer && currentPlayer.id)
    const Stage = isPlaying || stage === stages.ADD_PLAYERS ?
      this.getViewForStage(stage) :
      GameDescription
    return (
      <div className='WitchHuntView u-chunk'>
        <h1>{ formatMessage('Witch Hunt') }</h1>
        <Stage app={ app } game={ game } players={ this.props.players } />
      </div>
    )
  }
})

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

export default class WitchHuntView extends React.Component {
  static displayName = 'WitchHuntView'

  static propTypes = {
    sid: React.PropTypes.string.isRequired,
    game: React.PropTypes.object.isRequired,
    players: React.PropTypes.array.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return (
      nextProps.players !== this.props.players
      || nextProps.game !== this.props.game
      || nextProps.sid !== this.props.sid
    )
  }

  getView (isPlaying, stage) {
    if (!isPlaying && stage !== stages.ADD_PLAYERS) {
      return GameDescription
    }
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
  }

  render () {
    const { sid, game, players } = this.props
    const stage = game.stage
    const isPlaying = !!game.players.find(player => player.sid === sid)
    const Stage = this.getView(isPlaying, stage)

    return (
      <div className={ 'WitchHuntView u-chunk WitchHuntView--' + stage }>
        <h1>{ formatMessage('Witch Hunt') }</h1>
        <Stage { ...this.props } />
      </div>
    )
  }
}

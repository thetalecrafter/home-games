import React from 'react'
import formatMessage from 'format-message'
import { stages } from './constants'
import resolve from '../common/resolve-url'

import AddPlayerStage from './view/add-player-stage'
import IntroStage from './view/intro-stage'
import RosterStage from './view/roster-stage'
import ApprovalStage from './view/approval-stage'
import MissionStage from './view/mission-stage'
import EndStage from './view/end-stage'
import GameDescription from './view/description'
import Status from './view/status'
import './view/view.css'

export default class InterceptView extends React.Component {
  static displayName = 'InterceptView'

  static propTypes = {
    sid: React.PropTypes.string.isRequired,
    game: React.PropTypes.object.isRequired,
    players: React.PropTypes.array.isRequired,
    end: React.PropTypes.func.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return (
      nextProps.players !== this.props.players ||
      nextProps.game !== this.props.game ||
      nextProps.sid !== this.props.sid
    )
  }

  getView (isPlaying, stage) {
    if (!isPlaying && stage !== stages.ADD_PLAYERS) {
      return GameDescription
    }
    switch (stage) {
      case stages.ADD_PLAYERS: return AddPlayerStage
      case stages.INTRO: return IntroStage
      case stages.ROSTER: return RosterStage
      case stages.APPROVAL: return ApprovalStage
      case stages.MISSION: return MissionStage
      case stages.END: return EndStage
      default: return GameDescription
    }
  }

  end = () => {
    const message = (
      formatMessage('Are you sure you want to end the game?') +
      '\n\n' +
      formatMessage(`All players will be taken back to the game description and
        a new game can be started.`).replace(/\s+/g, ' ')
    )
    if (window.confirm(message)) {
      this.props.end()
    }
  }

  render () {
    const { sid, game } = this.props
    const stage = game.stage
    const isPlaying = !!game.players.find(player => player.sid === sid)
    const Stage = this.getView(isPlaying, stage)

    return (
      <div className={ 'InterceptView u-chunk InterceptView--' + stage }>
        <a href={ resolve('/') }>
          &laquo; { formatMessage('Home') }
        </a>
        <h1>{ formatMessage('Intercept') }</h1>
        <Stage { ...this.props } />
        { isPlaying &&
          <div>
            <Status missions={ game.missions } current={ game.currentMission } />
            <button onClick={ this.end } className='Intercept-abandon'>
              { stage === stages.END
                ? formatMessage('End Game')
                : formatMessage('Abandon Game')
              }
            </button>
          </div>
        }
      </div>
    )
  }
}

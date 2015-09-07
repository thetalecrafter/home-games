import React from 'react'
import formatMessage from 'format-message'
import SpyMissionStage from './mission-stage/spy'
import DoubleMissionStage from './mission-stage/double'
import MoleMissionStage from './mission-stage/mole'
import StandbyMissionStage from './mission-stage/standby'
import { roles } from '../constants'

export default class MissionStage extends React.Component {
  static displayName = 'MissionStage'

  static propTypes = {
    sid: React.PropTypes.string.isRequired,
    game: React.PropTypes.object.isRequired,
    intercept: React.PropTypes.func.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return (
      nextProps.game !== this.props.game
      || nextProps.sid !== this.props.sid
    )
  }

  getView (isOnTeam, role) {
    if (isOnTeam) {
      switch (role) {
        case roles.SPY:    return SpyMissionStage
        case roles.DOUBLE: return DoubleMissionStage
        case roles.MOLE:   return MoleMissionStage
      }
    }
    return StandbyMissionStage
  }

  render () {
    const { sid, game, intercept } = this.props
    const { missions, currentMission } = game
    const { roster, results } = missions[currentMission]
    const { id, role } = game.players.find(player => player.sid === sid)
    const isOnTeam = roster.includes(id)
    const count = roster.length - Object.keys(results).length
    const View = this.getView(isOnTeam, role)
    return (
      <div>
        <h2>{ formatMessage('Intercept Enemy Message') }</h2>
        <View result={ results[id] } vote={ value => intercept({ id }, value) } />
        <span>
          { formatMessage(
            `{ count, plural,
                one {Waiting for # player...}
              other {Waiting for # players...}
            }`,
            { count }
          ) }
        </span>
      </div>
    )
  }
}

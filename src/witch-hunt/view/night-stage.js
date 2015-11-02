import React from 'react'
import formatMessage from 'format-message'
import WitchNightStage from './night-stage/witch'
import PuritanNightStage from './night-stage/puritan'
import { roles } from '../constants'

export default class NightStage extends React.Component {
  static displayName = 'NightStage'

  static propTypes = {
    sid: React.PropTypes.string.isRequired,
    game: React.PropTypes.object.isRequired,
    vote: React.PropTypes.func.isRequired,
    confirm: React.PropTypes.func.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return (
      nextProps.game !== this.props.game ||
      nextProps.sid !== this.props.sid
    )
  }

  render () {
    const { sid, game } = this.props
    const currentPlayer = game.players.find(player => player.sid === sid)
    const isWitch = currentPlayer.role === roles.WITCH
    return (
      <div>
        <h2>{ formatMessage('Night') }</h2>
        { isWitch
          ? <WitchNightStage { ...this.props } />
          : <PuritanNightStage { ...this.props } />
        }
      </div>
    )
  }
}

import React from 'react'
import formatMessage from 'format-message'

export default class InterceptStatus extends React.Component {
  static displayName = 'InterceptStatus'

  static propTypes = {
    missions: React.PropTypes.array.isRequired,
    current: React.PropTypes.number.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return (
      nextProps.missions !== this.props.missions ||
      nextProps.current !== this.props.current
    )
  }

  getMissionTooltip (mission, index, current) {
    if (index === current) return formatMessage('Current Mission')
    if (index > current) return formatMessage('Future Mission')
    const intercepted = mission.roster
      .filter(id => mission.results[id])
      .length
    const total = mission.size
    return formatMessage(
      '{intercepted, number} / {total, number} messages intercepted',
      { intercepted, total }
    )
  }

  getMissionSize (mission) {
    if (mission.failLimit === 1) {
      return formatMessage('{count, number}', { count: mission.size })
    }
    return formatMessage('{needed, number}/{total, number}', {
      needed: mission.size - mission.failLimit + 1,
      total: mission.size
    })
  }

  render () {
    const { missions, current } = this.props
    return (
      <div>
        { missions.map((mission, index) =>
          <span
            key={ index }
            className='InterceptStatus-mission'
            title={ this.getMissionTooltip(mission, index, current) }
          >
          {
            (index >= current)
            ? this.getMissionSize(mission)
            : mission.isSuccessful ? '✔' : '✘'
          }
          </span>
        ) }
      </div>
    )
  }
}

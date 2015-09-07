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
      nextProps.missions !== this.props.missions
      || nextProps.current !== this.props.current
    )
  }

  render () {
    const { missions, current } = this.props
    return (
      <div>
        { missions.map((mission, index) =>
          <span key={ index } className='InterceptStatus-mission'>
          {
            (index === current) ? '●' :
            (index > current) ? '○' :
            mission.isSuccessful ? '✔' : '✘'
          }
          </span>
        ) }
      </div>
    )
  }
}

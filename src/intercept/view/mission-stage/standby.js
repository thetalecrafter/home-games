import React from 'react'
import formatMessage from 'format-message'

export default class StandbyMissionStage extends React.Component {
  static displayName = 'StandbyMissionStage'

  static propTypes = {
  }

  shouldComponentUpdate (nextProps) {
    return false
  }

  render () {
    return (
      <p>
        { formatMessage(
          'Please wait while your comrades complete their assignment.'
        ) }
      </p>
    )
  }
}

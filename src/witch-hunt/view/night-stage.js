import React from 'react'
import formatMessage from 'format-message'

export default class NightStage extends React.Component {
  render () {
    return (
      <div>
        <h2>{ formatMessage('Night') }</h2>
      </div>
    )
  }
}

NightStage.displayName = 'NightStage'

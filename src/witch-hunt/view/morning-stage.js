import React from 'react'
import formatMessage from 'format-message'

export default class MorningStage extends React.Component {
  render () {
    return (
      <div>
        <h2>{ formatMessage('Morning') }</h2>
      </div>
    )
  }
}

MorningStage.displayName = 'MorningStage'

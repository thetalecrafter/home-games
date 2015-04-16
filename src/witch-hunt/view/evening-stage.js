import React from 'react'
import formatMessage from 'format-message'

export default class EveningStage extends React.Component {
  render () {
    return (
      <div>
        <h2>{ formatMessage('Evening') }</h2>
      </div>
    )
  }
}

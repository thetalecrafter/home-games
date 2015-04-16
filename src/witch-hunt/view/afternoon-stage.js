import React from 'react'
import formatMessage from 'format-message'

export default class AfternoonStage extends React.Component {
  render () {
    return (
      <div>
        <h2>{ formatMessage('Afternoon') }</h2>
      </div>
    )
  }
}

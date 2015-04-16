import React from 'react'
import formatMessage from 'format-message'

export default class IntroStage extends React.Component {
  render () {
    return (
      <div>
        <h2>{ formatMessage('Introduction') }</h2>
      </div>
    )
  }
}

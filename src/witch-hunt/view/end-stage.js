import React from 'react'
import formatMessage from 'format-message'

export default class EndStage extends React.Component {
  render () {
    return (
      <div>
        <h2>{ formatMessage('Epilogue') }</h2>
      </div>
    )
  }
}

import React from 'react'
import formatMessage from 'format-message'

export default React.createClass({
  displayName: 'EndStage',

  render () {
    return (
      <div>
        <h2>{ formatMessage('Epilogue') }</h2>
      </div>
    )
  }
})

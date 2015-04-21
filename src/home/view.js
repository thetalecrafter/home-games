import React from 'react'
import formatMessage from 'format-message'

export default React.createClass({
  displayName: 'HomeView',

  render () {
    return (
      <div>
        <h1>{ formatMessage('Home Games') }</h1>
        <a href='player'>{ formatMessage('Manage Players') }</a>
        <a href='witch-hunt'>{ formatMessage('Witch Hunt') }</a>
      </div>
    )
  }
})

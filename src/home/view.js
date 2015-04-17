import React from 'react'
import formatMessage from 'format-message'

export default class HomeView extends React.Component {
  render () {
    return (
      <div>
        <h1>{ formatMessage('Home Games') }</h1>
        <a href="player">Manage Players</a>
        <a href="witch-hunt">Witch Hunt</a>
      </div>
    )
  }
}

HomeView.displayName = 'HomeView'

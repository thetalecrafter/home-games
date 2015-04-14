import React from 'react'
import formatMessage from 'format-message'

export default class PlayerView extends React.Component {
  render () {
    return (
      <h1>{ formatMessage('Player') }</h1>
    )
  }
}

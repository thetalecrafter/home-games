import React from 'react'
import formatMessage from 'format-message'

export default class HomeView extends React.Component {
  render () {
    return (
      <h1>{ formatMessage('Home Games') }</h1>
    )
  }
}

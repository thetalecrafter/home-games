import React from 'react'
import formatMessage from 'format-message'
import './header.css'

export default class Header extends React.Component {
  render () {
    return (
      <header className="app-header">
        <span className="app-header-text">
          { formatMessage('Game Gallery') }
        </span>
      </header>
    )
  }
}

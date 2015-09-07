import React from 'react'
import formatMessage from 'format-message'
import Shell from '../common/shell'

export default class HomeView extends React.Component {
  static displayName = 'HomeView'

  render () {
    return (
      <Shell>
        <h1>{ formatMessage('Home Games') }</h1>
        <ul>
          <li>
            <a href='players'>{ formatMessage('Manage Players') }</a>
          </li>
          <li>
            <a href='witch-hunt'>{ formatMessage('Witch Hunt') }</a>
          </li>
          <li>
            <a href='intercept'>{ formatMessage('Intercept') }</a>
          </li>
        </ul>
      </Shell>
    )
  }
}

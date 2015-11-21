import React from 'react'
import formatMessage from 'format-message'
import Shell from '../common/shell'
import resolveUrl from '../common/resolve-url'

const Home = () =>
  <Shell>
    <h1>{ formatMessage('Home Games') }</h1>
    <ul>
      <li>
        <a href={ resolveUrl('/players/') }>{ formatMessage('Manage Players') }</a>
      </li>
      <li>
        <a href={ resolveUrl('/witch-hunt/') }>{ formatMessage('Witch Hunt') }</a>
      </li>
      <li>
        <a href={ resolveUrl('/intercept/') }>{ formatMessage('Intercept') }</a>
      </li>
    </ul>
  </Shell>

Home.displayName = 'Home'
export default Home

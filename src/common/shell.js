import React from 'react'
import classnames from 'classnames'
import './shell.css'

export default class ShellView extends React.Component {
  static displayName = 'ShellView'

  static propTypes = {
    className: React.PropTypes.string,
    children: React.PropTypes.node
  }

  render () {
    return (
      <div className={ classnames('Shell', this.props.className) }>
        { this.props.children }
      </div>
    )
  }
}

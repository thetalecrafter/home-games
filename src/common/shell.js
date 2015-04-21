import React from 'react'
import './shell.css'

export default React.createClass({
  displayName: 'ShellView',

  propTypes: {
    children: React.PropTypes.element
  },

  render () {
    return (
      <div className='Shell'>
        { this.props.children }
      </div>
    )
  }
})

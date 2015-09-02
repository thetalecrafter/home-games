import React from 'react'

class PassThrough extends React.Component {
  render () {
    return this.props.render()
  }
}

export default function createView (render) {
  return <PassThrough render={ render } />
}

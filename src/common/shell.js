import React from 'react'
import Header from './header'
import Footer from './footer'
import './app.css'

export default class App extends React.Component {
  render () {
    return (
      <div className="app">
        { this.props.children }
        <Header />
        <Footer />
      </div>
    )
  }
}

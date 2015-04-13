import React from 'react'
import './footer.css'

export default class Footer extends React.Component {
  render () {
    return (
      <footer className="app-footer">
        © { (new Date()).getFullYear() } Andy VanWagoner
      </footer>
    )
  }
}

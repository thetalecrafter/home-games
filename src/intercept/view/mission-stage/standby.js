const { createClass, createElement: h } = require('react')
const t = require('format-message')

module.exports = createClass({
  displayName: 'StandbyMissionStage',

  propTypes: {},

  shouldComponentUpdate (nextProps) {
    return false
  },

  render () {
    return (
      h('p', null,
        t(
          'Please wait while your comrades complete their assignment.'
        )
      )
    )
  }
})

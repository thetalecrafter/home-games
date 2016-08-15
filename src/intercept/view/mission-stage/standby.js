const { createClass, createElement: h } = require('react')
const formatMessage = require('format-message')

module.exports = createClass({
  displayName: 'StandbyMissionStage',

  propTypes: {},

  shouldComponentUpdate (nextProps) {
    return false
  },

  render () {
    return (
      h('p', null,
        formatMessage(
          'Please wait while your comrades complete their assignment.'
        )
      )
    )
  }
})

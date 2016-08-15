const { createClass, createElement: h, PropTypes } = require('react')
const formatMessage = require('format-message')

module.exports = createClass({
  displayName: 'SpyMissionStage',

  propTypes: {
    result: PropTypes.bool,
    vote: PropTypes.func.isRequired
  },

  shouldComponentUpdate (nextProps) {
    return nextProps.result !== this.props.result
  },

  vote () {
    this.props.vote(true)
  },

  render () {
    const { result } = this.props
    return (
      h('div', null,
        h('p', null,
          formatMessage(
            `As a Spy, you need to intercept messages to win, you cannot
            sabotage the mission.`
          )
        ),
        result == null
          ? h('div', null,
            h('button', { onClick: this.vote },
              formatMessage('Intercept Message')
            ),
            h('button', { disabled: true },
              formatMessage('Sabotage Mission')
            )
          )
          : result &&
            h('p', null,
              formatMessage('You have successfully completed your mission.')
            )
      )
    )
  }
})

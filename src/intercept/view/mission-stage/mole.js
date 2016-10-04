const { createClass, createElement: h, PropTypes } = require('react')
const t = require('format-message')

module.exports = createClass({
  displayName: 'MoleMissionStage',

  propTypes: {
    result: PropTypes.bool,
    vote: PropTypes.func.isRequired
  },

  shouldComponentUpdate (nextProps) {
    return nextProps.result !== this.props.result
  },

  intercept () {
    this.props.vote(true)
  },

  sabotage () {
    this.props.vote(false)
  },

  render () {
    const { result } = this.props
    return (
      h('div', null,
        h('p', null,
          t(
            `As a Mole, you need to intercept messages to win, but you may
            sabotage the mission if needed to keep the trust of the double
            agents.`
          )
        ),
        result == null
          ? h('div', null,
            h('button', { onClick: this.intercept },
              t('Intercept Message')
            ),
            h('button', { onClick: this.sabotage },
              t('Sabotage Mission')
            )
          )
          : result
          ? h('p', null,
            t('You have successfully completed your mission.')
          )
          : h('p', null,
            t('You have sabotaged the mission.')
          )
      )
    )
  }
})

const { createClass, createElement: h, PropTypes } = require('react')
const formatMessage = require('format-message')

module.exports = createClass({
  displayName: 'InterceptStatus',

  propTypes: {
    missions: PropTypes.array.isRequired,
    current: PropTypes.number.isRequired
  },

  shouldComponentUpdate (nextProps) {
    return (
      nextProps.missions !== this.props.missions ||
      nextProps.current !== this.props.current
    )
  },

  getMissionTooltip (mission, index, current) {
    if (index === current) return formatMessage('Current Mission')
    if (index > current) return formatMessage('Future Mission')
    const intercepted = mission.roster
      .filter((id) => mission.results[id])
      .length
    const total = mission.size
    return formatMessage(
      '{intercepted, number} / {total, number} messages intercepted',
      { intercepted, total }
    )
  },

  getMissionSize (mission) {
    if (mission.failLimit === 1) {
      return formatMessage('{count, number}', { count: mission.size })
    }
    return formatMessage('{needed, number}/{total, number}', {
      needed: mission.size - mission.failLimit + 1,
      total: mission.size
    })
  },

  render () {
    const { missions, current } = this.props
    return (
      h('div', null, missions.map((mission, index) =>
        h('span', {
          key: index,
          className: 'InterceptStatus-mission',
          title: this.getMissionTooltip(mission, index, current)
        },
          (index >= current)
            ? this.getMissionSize(mission)
            : mission.isSuccessful ? '✔' : '✘'
        )
      ))
    )
  }
})

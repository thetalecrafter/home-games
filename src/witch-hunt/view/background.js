const { createClass, createElement: h, PropTypes } = require('react')
const { stages, roles } = require('../constants')
require('./background.css')

module.exports = createClass({
  displayName: 'WitchHuntBackground',

  propTypes: {
    stage: PropTypes.string,
    player: PropTypes.object,
    result: PropTypes.object
  },

  getInitialState () {
    return { previous: '', name: 'village' }
  },

  shouldComponentUpdate (nextProps, nextState) {
    return (
      nextState.name !== this.state.name ||
      nextState.previous !== this.state.previous
    )
  },

  componentWillMount () {
    this.setState({
      name: this.getBackground(this.props)
    })
  },

  componentWillReceiveProps (nextProps) {
    const name = this.getBackground(nextProps)
    if (name !== this.state.name) {
      this.setState({ previous: this.state.name, name })
    }
  },

  getBackground ({ stage, player, result }) {
    switch (stage) {
      case stages.ADD_PLAYERS: return 'gallery'
      case stages.INTRO: return 'village'
      case stages.NIGHT: return player && player.role === roles.WITCH ? 'witches' : 'twilight'
      case stages.MORNING: return 'morning'
      case stages.AFTERNOON: return result && result.victimDied ? 'martyr' : 'village'
      case stages.EVENING: return 'harvest'
      case stages.END: return 'skull'
      default: return 'village'
    }
  },

  render () {
    const { name, previous } = this.state
    return (
      h('div', {
        className: 'WitchHuntBackground WitchHuntBackground--static' +
          ' WitchHuntBackground--' + (previous || name)
      },
        previous && h('div', {
          className: 'WitchHuntBackground WitchHuntBackground--' + name
        })
      )
    )
  }
})

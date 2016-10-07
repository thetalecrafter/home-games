const { createClass, createElement: h, PropTypes } = require('react')
const { stages } = require('../constants')
require('./background.css')

module.exports = createClass({
  displayName: 'WitchHuntBackground',

  propTypes: {
    stage: PropTypes.string,
    player: PropTypes.object
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
      name: this.getBackground(this.props.stage, this.props.player)
    })
  },

  componentWillReceiveProps (nextProps) {
    const name = this.getBackground(nextProps.stage, nextProps.player)
    if (name !== this.state.name) {
      this.setState({ previous: this.state.name, name })
    }
  },

  getBackground (stage, player) {
    switch (stage) {
      case stages.ADD_PLAYERS: return 'gallery'
      case stages.INTRO: return 'village'
      case stages.NIGHT: return player.isWitch ? 'witches' : 'twilight'
      case stages.MORNING: return 'village'
      case stages.AFTERNOON: return 'village'
      case stages.EVENING: return 'village'
      case stages.END: return 'village'
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

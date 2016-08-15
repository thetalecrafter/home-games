const { createClass, createElement: h, PropTypes } = require('react')
const formatMessage = require('format-message')

module.exports = createClass({
  displayName: 'VoteResults',

  propTypes: {
    players: PropTypes.array.isRequired,
    votes: PropTypes.object.isRequired
  },

  shouldComponentUpdate (nextProps) {
    return (
      nextProps.players !== this.props.players ||
      nextProps.votes !== this.props.votes
    )
  },

  hasPlayerVoted (player) {
    const { votes } = this.props
    return votes[player.id] != null
  },

  renderPlayer (player) {
    const { votes } = this.props
    return (
      h('li', { key: player.id },
        formatMessage(
          `{ vote, select,
            approve {{name} approved}
             reject {{name} rejected}
              other {}
          }`,
          {
            name: player.name,
            gender: player.gender,
            vote: votes[player.id] ? 'approve' : 'reject'
          }
        )
      )
    )
  },

  render () {
    const { players } = this.props
    return (
      h('ul', null, players.filter(this.hasPlayerVoted).map(this.renderPlayer))
    )
  }
})

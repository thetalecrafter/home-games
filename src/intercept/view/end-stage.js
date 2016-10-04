const { createClass, createElement: h, PropTypes } = require('react')
const t = require('format-message')
const { roles } = require('../constants')

module.exports = createClass({
  displayName: 'EndStage',

  propTypes: {
    game: PropTypes.object.isRequired
  },

  shouldComponentUpdate (nextProps) {
    return nextProps.game !== this.props.game
  },

  didWin (fails, successes, player) {
    // rejected teams too many times
    if (fails < 3 && successes < 3) {
      return (player.role === roles.DOUBLE)
    }

    if (player.role === roles.DOUBLE) return fails > successes
    return fails < successes
  },

  render () {
    const { game } = this.props

    let fails = 0
    let successes = 0
    game.missions.forEach((mission) => {
      if (mission.isSuccessful === true) ++successes
      if (mission.isSuccessful === false) ++fails
    })

    return (
      h('div', null,
        h('h2', null, t('Epilogue')),
        h('p', null,
        (fails < 3 && successes < 3)
          ? t(
          `Indecision kept the team from intercepting vital enemy messages.
          Double Agents win.`
          )
          : fails > successes
          ? t(
          `The Double Agents successfully sabotaged the interception of enemy
          messages. Double Agents win.`
          )
          : t(
          `The team of Spies successfully intercepted the enemy messages,
          avoiding disruption from the Double Agents. Spies win.`
          )
        ),
        h('table', null, game.players.map((player) =>
          h('tr', { key: player.id },
            h('th', null, player.name),
            h('td', null,
              player.role === roles.DOUBLE ? t('Double Agent')
                : player.role === roles.MOLE ? t('Mole')
                : t('Spy')
            ),
            h('td', null,
              this.didWin(fails, successes, player)
                ? t('Won')
                : t('Lost')
            )
          )
        ))
      )
    )
  }
})

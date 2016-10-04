const { createClass, createElement: h, PropTypes } = require('react')
const t = require('format-message')

const summary = (
  h('p', null,
    t(`Who are the devil’s agents among you? Convince your
      fellows of your innocence to survive, or prove your worth through a
      tortuous trial. Purge your community of the evil ones, or be the witch
      that destroys your enemies.`)
  )
)
const description = (
  h('div', null,
    h('p', null,
      t('Witch Hunt requires at least 4 players.')
    ),
    h('p', null,
      t(`The game takes place over a series of days and nights.
        Each night the witches conspire to curse their persecutors, while the
        pure in heart sleep, and the curious try to discover their peers.`)
    ),
    h('p', null,
      t(`In the morning you find out who has been killed by the
        witches, and vote on a player to put on trial. The trial will likely
        kill an innocent person, but it is necessary to uncover the witches.
        If the player survives the trial, they have proven their wickedness.
        Vote again to execute them.`)
    ),
    h('p', null,
      t(`Is your community safe at last? Only if everyone agrees
        can the trials end, and the result be revealed.`)
    ),
    h('p', null,
      t(`The game is set in a location similar to North America
        during the early modern period. While the scenarios depicted in this
        game are fictional, an estimated 40,000 people were executed in real
        witch trials across Europe and in North America. Remember to be
        patient and tolerant with each other outside of the game, and that a
        bigot hunt is no different from a witch hunt.`)
    )
  )
)

module.exports = createClass({
  displayName: 'GameDescription',

  propTypes: {
    game: PropTypes.object.isRequired,
    create: PropTypes.func.isRequired
  },

  shouldComponentUpdate (nextProps) {
    return nextProps.game !== this.props.game
  },

  render () {
    const { game, create } = this.props
    const isStarted = !!game.stage
    const didClickStart = isStarted ? null : () => create()
    return (
      h('div', null,
        summary,
        h('button', { onClick: didClickStart, disabled: isStarted },
          isStarted
            ? t('Game In Progress')
            : t('Play Witch Hunt')
        ),
        description
      )
    )
  }
})

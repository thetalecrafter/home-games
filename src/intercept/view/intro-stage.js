const { createClass, createElement: h, PropTypes } = require('react')
const t = require('format-message')
const ReadyButton = require('./ready-button')
const { roles } = require('../constants')

const spy = (
  h('div', null,
    h('h2', null, t('You are a Spy!')),
    h('p', null,
      t(
        `You have been tasked with intercepting strategic enemy intel. The most
        difficult part of your job will be decerning which of your fellow spies
        is actually working for your enemy.`
      )
    ),
    h('p', null,
      t(
        `You should always include yourself to go on missions you lead, since
        you are the only one you can trust completely.`
      )
    )
  )
)

const doubleAgent = (
  h('div', null,
    h('h2', null, t('You are a Double Agent!')),
    h('p', null,
      t(
        `The fools around you have no idea that they are your true enemy. With
        your cunning, you will sabotage this group so that your superior nation
        can justly conquer.`
      )
    ),
    h('p', null,
      t(
        `Do not let anyone besides your fellow double agents know where your
        real allegiance lies. Act in every way as a normal spy, until you can
        sabotage an interception.`
      )
    )
  )
)

const mole = (
  h('div', null,
    h('h2', null, t('You are a Mole!')),
    h('p', null,
      t(
        `You are a Triple Agent. The Double Agents think you are one of them,
        and you must use this to your advantage. The Spies also rightly think
        you are one of them, don't let them down.`
      )
    ),
    h('p', null,
      t(
        `Pretend to be a Double Agent, but be very careful, you only win if the
        missions are successful.`
      )
    )
  )
)

module.exports = createClass({
  displayName: 'IntroStage',

  propTypes: {
    sid: PropTypes.string.isRequired,
    game: PropTypes.object.isRequired,
    vote: PropTypes.func.isRequired
  },

  render () {
    const { sid, game, vote } = this.props
    const currentPlayer = game.players.find((player) => player.sid === sid)
    const isReady = game.votes[currentPlayer.id]
    return (
      h('div', null,
        currentPlayer.role === roles.SPY ? spy
          : currentPlayer.role === roles.DOUBLE ? doubleAgent
          : mole,
        currentPlayer.role === roles.SPY
          ? h('p', null,
            t(
              'There are {count, number} Double Agents in this game.',
              { count: game.players.filter((player) => player.role === roles.DOUBLE).length }
            )
          )
          : h('p', null,
            t('Here are your fellow Double Agents:'),
            h('ul', null,
              game.players
                .filter((player) => player.role !== roles.SPY && player !== currentPlayer)
                .map((player) =>
                  h('li', { key: player.id }, player.name)
                )
            )
          ),
        h(ReadyButton, {
          player: currentPlayer,
          game: game,
          confirm: isReady ? null : () => vote(currentPlayer, true)
        })
      )
    )
  }
})

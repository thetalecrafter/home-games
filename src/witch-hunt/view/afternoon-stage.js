const { createClass, createElement: h, PropTypes } = require('react')
const t = require('format-message')
const ReadyButton = require('./ready-button')

module.exports = createClass({
  displayName: 'AfternoonStage',

  propTypes: {
    sid: PropTypes.string.isRequired,
    game: PropTypes.object.isRequired,
    vote: PropTypes.func.isRequired,
    confirm: PropTypes.func.isRequired
  },

  shouldComponentUpdate (nextProps) {
    return (
      nextProps.game !== this.props.game ||
      nextProps.sid !== this.props.sid
    )
  },

  render () {
    const { sid, game, vote, confirm } = this.props
    const { victimId, victimDied } = game.result
    const victim = game.players.find((player) => player.id === victimId)
    const currentPlayer = game.players.find((player) => player.sid === sid)
    const canVote = (
      !victimDied &&
      victimId !== currentPlayer.id &&
      !currentPlayer.isDead
    )
    const needsToVote = canVote && currentPlayer.vote == null
    const disabled = !canVote || currentPlayer.isReady

    const victimName = victim.name
    let victimResult
    if (victimDied) {
      victimResult = (victimId === currentPlayer.id)
        ? h('div', null,
          h('h3', null, t('You have died')),
          h('p', null,
            t(`To prove your innocence, you were thrown into the
              lake. You struggled and flailed, but you quickly sank into water
              and drowned. After your body was pulled from the lake, you were
              given a proper christian burial.`)
          )
        )
        : h('p', null,
          t(`As a trial, you all tossed { name } into the lake.
            { name } struggled and flailed, but quickly sank into water and
            drowned. After the body was pulled from the lake, you gave { name }
            a proper christian burial.`, { name: victimName })
        )
    } else {
      victimResult = (victimId === currentPlayer.id)
        ? h('p', null,
          t(`To prove your innocence, you were thrown into the
            lake. You struggled and flailed, and managed to stay afloat. In
            horror, the others watched you exert inhuman power in returning to
            the shore.`)
        )
        : h('p', null,
          t(`As a trial, you all tossed { name } into the lake.
            { name } struggled and flailed, and managed to stay afloat. In
            horror, you watched the inhuman power { name } exerted to return to
            the shore.`, { name: victimName })
        )
    }

    return (
      h('div', null,
        h('h2', null, t('Afternoon')),
        victimResult,
        !victimDied && victimId !== currentPlayer.id &&
          h('div', null,
            h('p', null,
              t(`Does this prove to you that { name } is a witch,
                and should now be executed?`, { name: victimName })
            ),
            h('label', null,
              h('input', {
                type: 'radio',
                name: 'vote',
                checked: currentPlayer.vote === true,
                disabled: disabled,
                onChange: disabled ? null : () => vote({ id: currentPlayer.id, vote: true })
              }),
              t('Yes')
            ),
            h('label', null,
              h('input', {
                type: 'radio',
                name: 'vote',
                checked: currentPlayer.vote === false,
                disabled: disabled,
                onChange: disabled ? null : () => vote({ id: currentPlayer.id, vote: false })
              }),
              t('No')
            )
          ),
        !victimDied && victimId === currentPlayer.id &&
          h('p', null,
            t(`Your community will now decide your fate. Having
              survived the trial, they undoubtedly will assume you are a witch.`)
          ),
        h(ReadyButton, {
          player: currentPlayer,
          game,
          disabled: needsToVote,
          confirm
        })
      )
    )
  }
})

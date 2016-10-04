const { createClass, createElement: h, PropTypes } = require('react')
const t = require('format-message')
const PlayerPicker = require('../../players/view/picker')
const ReadyButton = require('./ready-button')
const { roles } = require('../constants')

module.exports = createClass({
  displayName: 'MorningStage',

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

  isAllSame (players) {
    return players.every(
      ({ isDead, role }) => isDead || role === roles.WITCH
    ) || players.every(
      ({ isDead, role }) => isDead || role === roles.PURITAN
    )
  },

  render () {
    const { sid, game, vote, confirm } = this.props
    const { victimId, victimDied, follow } = game.result
    const victim = game.players.find((player) => player.id === victimId)
    const currentPlayer = game.players.find((player) => player.sid === sid)
    const others = game.players.filter(
      (player) => (player !== currentPlayer && !player.isDead)
    ).map(
      (player) => ({ player, selectedId: player.vote })
    )
    const disabled = currentPlayer.isDead || currentPlayer.isReady
    const isDone = this.isAllSame(game.players)

    let followResult
    if (follow && follow[currentPlayer.id]) {
      const followId = follow[currentPlayer.id].followId
      const followPlayer = game.players.find((player) => player.id === followId)
      const name = followPlayer.name
      followResult = follow[currentPlayer.id].wasAwake
        ? t(`You followed { name } for much of the evening. { name }
        was sneaking about, but you couldn’t keep up without being noticed,
        so eventually you went back to bed without really seeing anything.`,
        { name })
        : t(`You stayed up for a little while, but { name } just went
        to sleep as usual, and then, so did you.`, { name })
    }

    let victimResult
    if (victim) {
      const victimName = victim.name
      if (victimDied) {
        victimResult = (victimId === currentPlayer.id)
          ? h('div', null,
            h('h3', null, t('You have died')),
            h('p', null,
              t(`Shortly after you retired to your bed, a sudden
                pain flashed in your shoulder and chest. After a few moments
                your life came to an end.`)
            )
          )
          : h('p', null,
            t(`Late this morning someone realized { name } wasn’t
              about the usual tasks. { name } was quickly found to be dead in
              bed.`, { name: victimName })
          )
      } else {
        victimResult = (victimId === currentPlayer.id)
          ? h('div', null,
            h('h3', null, t('You have been cursed')),
            h('p', null,
              t(`You woke this morning with a terrible headache
                and fever. You tried to get out of bed but felt so dizzy you
                immediately returned to bed.`)
            )
          )
          : h('p', null,
            t(`Late this morning someone realized { name } wasn’t
              about the usual tasks. { name } was then found to be terribly ill
              in bed.`, { name: victimName })
          )
      }
    }

    return (
      h('div', null,
        h('h2', null, t('Morning')),
        followResult && h('p', null, followResult),

        victimResult
          ? h('div', null,
            victimResult,
            !isDone &&
              h('div', null,
                h('p', null, t('Whom shall be tried for this tragedy?')),
                h(PlayerPicker, {
                  players: game.players.filter((player) => !player.isDead),
                  selectedId: currentPlayer.isDead ? null : currentPlayer.vote,
                  select: disabled ? null : (id) => vote({ id: currentPlayer.id, vote: id }),
                  others
                })
              )
          )
          : h('p', null,
            t(`You all went about their usual tasks this morning.
              Everyone was accounted for.`)
          ),
        h(ReadyButton, {
          player: currentPlayer,
          game,
          disabled: !!victimResult && !isDone && currentPlayer.vote == null,
          confirm
        })
      )
    )
  }
})

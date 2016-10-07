const { createClass, createElement: h, PropTypes } = require('react')
const t = require('format-message')
const ReadyButton = require('./ready-button')
const { roles } = require('../constants')

const witch = (
  h('div', null,
    h('p', null,
      t(`You have found that you have uncanny powers to influence
        those around you, and can cause occurrences inexplicable to ordinary
        understanding. In order to survive, you must use this power to stop
        those who would destroy you.`)
    ),
    h('p', null,
      t(`Each night you will choose with your cohorts whom you
        must curse, so that you may live.`)
    ),
    h('p', null,
      t(`Each day you will defend your friends against the deadly
        trails, but do not let the commoners know that you are a witch, or who
        your fellow witches are.`)
    ),
    h('p', null,
      t('A swift end to the trials is your safest course.')
    )
  )
)

const puritan = (
  h('div', null,
    h('p', null,
      t(`You are godly and kind. Your hard work will ensure your
        place in heaven, but the Devil is among your community and will surely
        destroy everything you love, and take away your heavenly reward, unless
        you discover and destroy his agents.`)
    ),
    h('p', null,
      t(`Each night you can choose to sleep, or to follow a member
        of your community. Following can help you find who is a witch, but you
        may look a little suspicious in the process.`)
    ),
    h('p', null,
      t(`Each day you will put to trial the person you most think
        to be a witch. If they survive the trial, it is surely through the evil
        one’s power, and they must be executed immediately.`)
    ),
    h('p', null,
      t(`An early ending to the trials may leave your enemies a
        chance to drag you down to hell.`)
    )
  )
)

module.exports = createClass({
  displayName: 'IntroStage',

  propTypes: {
    sid: PropTypes.string.isRequired,
    game: PropTypes.object.isRequired,
    confirm: PropTypes.func.isRequired
  },

  render () {
    const { sid, game, confirm } = this.props
    const currentPlayer = game.players.find((player) => player.sid === sid)
    const isWitch = currentPlayer.role === roles.WITCH
    return (
      h('div', { className: 'WitchHuntPanel' },
        h('h2', null,
          isWitch
            ? t('You are a witch!')
            : t('You are a puritan')
        ),
        isWitch ? witch : puritan,
        h(ReadyButton, {
          player: currentPlayer,
          game,
          disabled: false,
          confirm
        })
      )
    )
  }
})

const { createClass, createElement: h, PropTypes } = require('react')
const t = require('format-message')
const Button = require('elemental/lib/components/Button')
const Glyph = require('elemental/lib/components/Glyph')
const resolve = require('../../common/resolve-url')
const PlayerPicker = require('../../players/view/picker')
const { MIN_PLAYERS } = require('../constants')
require('./add-player-stage.css')

module.exports = createClass({
  displayName: 'AddPlayerStage',

  propTypes: {
    sid: PropTypes.string.isRequired,
    game: PropTypes.object.isRequired,
    players: PropTypes.array.isRequired,
    addPlayer: PropTypes.func.isRequired,
    start: PropTypes.func.isRequired
  },

  getInitialState () {
    return { selectedId: null }
  },

  shouldComponentUpdate (nextProps, nextState) {
    return (
      nextState.selectedId !== this.state.selectedId ||
      nextProps.players !== this.props.players ||
      nextProps.game !== this.props.game ||
      nextProps.sid !== this.props.sid
    )
  },

  select (selectedId) {
    this.setState({ selectedId })
  },

  join () {
    const id = this.state.selectedId
    const { sid, game, players, addPlayer } = this.props
    const player = (
      game.players.every((player) => player.id !== id) &&
      players.find((player) => player.id === id)
    )
    if (player) addPlayer(Object.assign({}, player, { sid }))
  },

  render () {
    const { sid, game, players, start } = this.props
    const currentPlayer = game.players.find((player) => player.sid === sid)
    const isPlaying = !!currentPlayer
    const count = game.players.length
    const canStart = isPlaying && count >= MIN_PLAYERS

    const availablePlayers = isPlaying || players.map((player) => {
      const isDisabled = game.players.some(({ id }) => player.id === id)
      return Object.assign({}, player, { isDisabled })
    })

    return (
      h('div', null,
        h('div', { className: 'WitchHuntPanel' },
          h('h2', null, t('Pick Your Player')),
          !isPlaying &&
            h('div', null,
              h(PlayerPicker, {
                players: availablePlayers,
                selectedId: this.state.selectedId,
                select: this.select
              }),
              h('a', { href: resolve('players/+'), className: 'WitchHuntAddPlayers-new-link' },
                h('span', { className: 'WitchHuntAddPlayers-new-icon' }, h(Glyph, { icon: 'plus' })),
                h('span', { className: 'WitchHuntAddPlayers-new-text' }, t('Add Player'))
              ),
              h('div', { className: 'WitchHuntAddPlayers-join' },
                h(Button, {
                  type: 'primary',
                  disabled: !this.state.selectedId,
                  onClick: this.join
                },
                  t('Join Game')
                )
              )
            ),
          h('p', null,
            t(`{
                count, plural,
                one {1 player has}
                other {# players have}
              } joined.`, {
                count
              }),
            ' ',
            t('This game requires at least 4 players.')
          ),
          game.players.length > 0 &&
            h('ol', null, game.players.map((player) =>
              h('li', { key: player.id }, player.name)
            )),
          isPlaying &&
            h(Button, {
              type: 'primary',
              onClick: canStart ? start : null,
              disabled: !canStart
            },
              t('Start Game')
            )
        )
      )
    )
  }
})

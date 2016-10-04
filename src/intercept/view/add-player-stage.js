const { createClass, createElement: h, PropTypes } = require('react')
const formatMessage = require('format-message')
const resolve = require('../../common/resolve-url')
const PlayerPicker = require('../../players/view/picker')
const { MIN_PLAYERS, MAX_PLAYERS } = require('../constants')
const { compareName } = require('../../common/natural-compare')

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
    const canStart = (
      isPlaying &&
      count >= MIN_PLAYERS &&
      count <= MAX_PLAYERS
    )

    const availablePlayers = isPlaying || players.map((player) => {
      const isDisabled = game.players.some(({ id }) => player.id === id)
      return Object.assign({}, player, { isDisabled })
    })

    return (
      h('div', null,
        h('h2', null, formatMessage('Choose Players')),
        h('p', null,
          formatMessage('This game requires 5 to 10 players.')
        ),
        !isPlaying &&
          h('div', null,
            h(PlayerPicker, {
              players: availablePlayers,
              selectedId: this.state.selectedId,
              select: this.select
            }),
            h('a', { href: resolve('players/+') },
              formatMessage('Add Player')
            ),
            h('button', { onClick: this.join },
              formatMessage('Join Game')
            )
          ),
        h('p', null,
          formatMessage(`{
              count, plural,
              =0 {nobody has}
              one {1 player has}
              other {# players have}
            } joined this game.`, {
              count
            })
        ),
        h('ol', null, game.players.sort(compareName()).map((player) =>
          h('li', { key: player.id }, player.name)
        )),
        isPlaying &&
          h('button', {
            onClick: canStart ? start : null,
            disabled: !canStart
          },
            formatMessage('Start Game')
          )
      )
    )
  }
})

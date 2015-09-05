import React from 'react'
import formatMessage from 'format-message'
import resolve from '../../common/resolve-url'
import PlayerPicker from '../../players/picker'
import { MIN_PLAYERS } from '../constants'

export default class AddPlayerStage extends React.Component {
  static displayName = 'AddPlayerStage'

  static propTypes = {
    sid: React.PropTypes.string.isRequired,
    game: React.PropTypes.object.isRequired,
    players: React.PropTypes.array.isRequired,
    addPlayer: React.PropTypes.func.isRequired,
    start: React.PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = { selectedId: null }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (
      nextState.selectedId !== this.state.selectedId
      || nextProps.players !== this.props.players
      || nextProps.game !== this.props.game
      || nextProps.sid !== this.props.sid
    )
  }

  select = (selectedId) => {
    this.setState({ selectedId })
  }

  join = () => {
    const id = this.state.selectedId
    const { sid, game, players, addPlayer } = this.props
    const player = (
      game.players.every(player => player.id !== id)
      && players.find(player => player.id === id)
    )
    if (player) addPlayer({ ...player, sid })
  }

  render () {
    const { sid, game, players, start } = this.props
    const store = this.props.game.store
    const currentPlayer = game.players.find(player => player.sid === sid)
    const isPlaying = !!currentPlayer
    const count = game.players.length
    const canStart = isPlaying && count >= MIN_PLAYERS

    const availablePlayers = isPlaying || players.map(player => {
      const isDisabled = game.players.some(({ id }) => player.id === id)
      return { ...player, isDisabled }
    })

    return (
      <div>
        <h2>{ formatMessage('Choose Players') }</h2>
        <p>
          { formatMessage('This game requires at least 4 players.') }
        </p>
        { !isPlaying &&
          <div>
            <PlayerPicker
              players={ availablePlayers }
              selectedId={ this.state.selectedId }
              select={ this.select }
            />
            <a href={ resolve('players/+') }>
              { formatMessage('Add Player') }
            </a>
            <button onClick={ this.join }>
              { formatMessage('Join Game') }
            </button>
          </div>
        }
        <p>
          { formatMessage(`{
              count, plural,
              one {1 player has}
              other {# players have}
            } joined this game.`, {
              count
            }) }
        </p>
        <ol>
          { game.players.map(player =>
            <li key={ player.id }>
              { player.name }
            </li>
          ) }
        </ol>
        { isPlaying &&
          <button
            onClick={ canStart ? start : null }
            disabled={ !canStart }
          >
            { formatMessage('Start Game') }
          </button>
        }
      </div>
    )
  }
}

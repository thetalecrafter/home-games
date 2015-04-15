import React from 'react'
import formatMessage from 'format-message'

export default class PlayerView extends React.Component {
  constructor () {
    super()
    this.state = this.initialState
    this.create = this.create.bind(this)
    this.didChange = this.didChange.bind(this)
  }

  get initialState () {
    return {
      name: ''
    }
  }

  didChange (event) {
    const target = event.target
    const { name, value } = target
    this.setState({ [name]: value })
  }

  getActions () {
    return this.props.app.actions.player
  }

  render () {
    const { players, selectedId } = this.props.players
    const { select, delete: remove } = this.getActions()
    return (
      <div>
        <h1>{ formatMessage('Players') }</h1>
        { players.map(player =>
          <div key={ player.id }>
            <span onClick={ select.partial(player) }>
              { player.id === selectedId && '✓' }
              { player.name }
            </span>
            <button onClick={ remove.partial(player) }>
              ⌫
            </button>
          </div>
        ) }
        <input
          type="text"
          name="name"
          value={ this.state.name }
          onChange={ this.didChange }
        />
        <button
          disabled={ !this.state.name.trim() }
          onClick={ this.state.name.trim() && this.create }
        >
          { formatMessage('Create Player') }
        </button>
      </div>
    )
  }

  create () {
    const create = this.getActions().create
    const player = {
      id: this.props.players.store.nextId(),
      name: this.state.name.trim()
    }
    this.setState(this.initialState, () => create(player))
  }
}

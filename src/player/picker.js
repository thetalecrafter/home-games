import React from 'react'
import formatMessage from 'format-message'
import wrap from 'uniflow-component'

export default class PlayerPicker extends React.Component {
  getActions () {
    return this.props.app.actions.player
  }

  render () {
    const { players, selectedId } = this.props.players
    const { select } = this.getActions()
    return (
      <div>
        { players.map(player =>
          <div key={ player.id }>
            <label>
              <input type="radio"
                onChange={ select.partial(player.id) }
                checked={ player.id === selectedId }
              />
              { player.name }
            </label>
          </div>
        ) }
      </div>
    )
  }

  static bind (app) {
    const store = app.stores.player
    return store.PlayerPicker || (
      store.PlayerPicker = wrap(PlayerPicker, { players: store })
    )
  }
}

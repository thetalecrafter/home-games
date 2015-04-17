import React from 'react'
import formatMessage from 'format-message'
import wrap from 'uniflow-component'

export default class PlayerPicker extends React.Component {
  getActions () {
    return this.props.app.actions.player
  }

  getStore () {
    return this.props.app.stores.player
  }

  render () {
    const { players, selectedId } = this.getStore().state
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
}

PlayerPicker.displayName = 'PlayerPicker'
PlayerPicker.propTypes = {
  app: React.PropTypes.object.isRequired
}

import React from 'react'

const PlayerPickerMulti = ({ name = 'playerIds', players, isSelected, isDisabled, onChange }) =>
  <div>
    { players.map(player =>
      <div key={ player.id }>
        <label>
          <input type='checkbox'
            name={ name }
            onChange={ onChange && ((evt) => onChange(evt, player)) }
            disabled={ isDisabled(player) }
            checked={ isSelected(player) }
          />
          { player.name }
        </label>
      </div>
    ) }
  </div>

PlayerPickerMulti.displayName = 'PlayerPickerMulti'
PlayerPickerMulti.propTypes = {
  name: React.PropTypes.string,
  players: React.PropTypes.array.isRequired,
  isSelected: React.PropTypes.func.isRequired,
  isDisabled: React.PropTypes.func.isRequired,
  onChange: React.PropTypes.func
}
export default PlayerPickerMulti

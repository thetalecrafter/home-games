import React from 'react'
import formatMessage from 'format-message'
import resolve from '../../common/resolve-url'
import ListItem from 'material-ui/lib/lists/list-item'
import Avatar from 'material-ui/lib/avatar'
import FontIcon from 'material-ui/lib/font-icon'

export default class PlayersListItem extends React.Component {
  static displayName = 'PlayersListItem'

  static propTypes = {
    player: React.PropTypes.object.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.player !== this.props.player
  }

  render () {
    const { player, actions } = this.props
    return (
      <ListItem
        href={ resolve(`players/${player.id}`) }
        leftAvatar={ player.avatar
          ? <Avatar src={ player.avatar } />
          : <Avatar>{ player.name[0] }</Avatar>
        }
        primaryText={ player.name }
      />
    )
  }
}

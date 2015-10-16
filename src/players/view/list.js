import React from 'react'
import formatMessage from 'format-message'
import resolve from '../../common/resolve-url'
import Shell from '../../common/shell'
import Player from './list-item'
import AppBar from 'material-ui/lib/app-bar'
import Avatar from 'material-ui/lib/avatar'
import Card from 'material-ui/lib/card/card'
import List from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import ListDivider from 'material-ui/lib/lists/list-divider'
import FontIcon from 'material-ui/lib/font-icon'
import IconButton from 'material-ui/lib/icon-button'
import './list.css'

export default class PlayersList extends React.Component {
  static displayName = 'PlayersList'

  static propTypes = {
    players: React.PropTypes.array.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.players !== this.props.players
  }

  render () {
    const { players } = this.props
    return (
      <Shell className='PlayersList u-chunk'>
        <AppBar
          title={ formatMessage('Manage Players') }
          iconElementLeft={
            <IconButton
              iconClassName='material-icons'
              linkButton={ true }
              href={ resolve('/') }
            >
              chevron_left
            </IconButton>
          }
        />
        <Card>
          <List>
            { players.map(player =>
              <Player key={ player.id } player={ player } />
            ) }
            <ListDivider />
            <ListItem
              href={ resolve('players/+') }
              primaryText={ formatMessage('Add Player') }
              leftAvatar={
                <Avatar
                  icon={ <FontIcon className='material-icons'>add</FontIcon> }
                />
              }
            />
          </List>
        </Card>
      </Shell>
    )
  }
}

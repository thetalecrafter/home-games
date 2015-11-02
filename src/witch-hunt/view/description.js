import React from 'react'
import formatMessage from 'format-message'

const summary = (
  <p>
    { formatMessage(`Who are the devil’s agents among you? Convince your
      fellows of your innocence to survive, or prove your worth through a
      tortuous trial. Purge your community of the evil ones, or be the witch
      that destroys your enemies.`)
    }
  </p>
)
const description = (
  <div>
    <p>
      { formatMessage('Witch Hunt requires at least 4 players.') }
    </p>
    <p>
      { formatMessage(`The game takes place over a series of days and nights.
        Each night the witches conspire to curse their persecutors, while the
        pure in heart sleep, and the curious try to discover their peers.`)
      }
    </p>
    <p>
      { formatMessage(`In the morning you find out who has been killed by the
        witches, and vote on a player to put on trial. The trial will likely
        kill an innocent person, but it is necessary to uncover the witches.
        If the player survives the trial, they have proven their wickedness.
        Vote again to execute them.`)
      }
    </p>
    <p>
      { formatMessage(`Is your community safe at last? Only if everyone agrees
        can the trials end, and the result be revealed.`)
      }
    </p>
    <p>
      { formatMessage(`The game is set in a location similar to North America
        during the early modern period. While the scenarios depicted in this
        game are fictional, an estimated 40,000 people were executed in real
        witch trials across Europe and in North America. Remember to be
        patient and tolerant with each other outside of the game, and that a
        bigot hunt is no different from a witch hunt.`)
      }
    </p>
  </div>
)

export default class GameDescription extends React.Component {
  static displayName = 'GameDescription'

  static propTypes = {
    game: React.PropTypes.object.isRequired,
    create: React.PropTypes.func.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.game !== this.props.game
  }

  render () {
    const { game, create } = this.props
    const isStarted = !!game.stage
    const didClickStart = isStarted ? null : () => create()
    return (
      <div>
        { summary }
        <button onClick={ didClickStart } disabled={ isStarted }>
          { isStarted
            ? formatMessage('Game In Progress')
            : formatMessage('Play Witch Hunt')
          }
        </button>
        { description }
      </div>
    )
  }
}

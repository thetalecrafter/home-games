import React from 'react'
import formatMessage from 'format-message'
import ReadyButton from './ready-button'

export default class EveningStage extends React.Component {
  static displayName = 'EveningStage'

  static propTypes = {
    sid: React.PropTypes.string.isRequired,
    game: React.PropTypes.object.isRequired,
    vote: React.PropTypes.func.isRequired,
    confirm: React.PropTypes.func.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return (
      nextProps.game !== this.props.game ||
      nextProps.sid !== this.props.sid
    )
  }

  render () {
    const { sid, game, confirm } = this.props
    const currentPlayer = game.players.find((player) => player.sid === sid)

    let victimResult
    if (game.result && game.result.victimId) {
      const { victimId, victimDied } = game.result
      const { name: victimName } = game.players.find((player) => player.id === victimId)
      if (victimDied) {
        victimResult = (victimId === currentPlayer.id)
          ? <div>
            <h3>{ formatMessage('You have died') }</h3>
            <p>
              { formatMessage(`Surviving the trial only further convinced your
                community of your wickedness. Your soaked clothing continued to
                drip long after you strangled on the gallows. When they cut you
                down, your body was tossed into an open pit outside town.`)
              }
            </p>
          </div>
          : <p>
            { formatMessage(`Surviving the trial only further convinced everyone
              of { name }’s wickedness. { name }’s soaked clothing continued to
              drip long after strangling on the gallows. When { name } was cut
              down, the body was tossed into an open pit outside town.`,
              { name: victimName })
            }
          </p>
      } else {
        victimResult = (victimId === currentPlayer.id)
          ? <p>
            { formatMessage(`Though you survived the trial, your struggle was
              enough to convince your fellows of your innocence... for now.`)
            }
          </p>
          : <p>
            { formatMessage(`Though { name } survived the trial, the struggle was
              enough to convince everyone of { name }’s innocence... for now.`,
              { name: victimName })
            }
          </p>
      }
    }

    return (
      <div>
        <h2>{ formatMessage('Evening') }</h2>
        { victimResult }
        <ReadyButton
          player={ currentPlayer }
          game={ game }
          disabled={ false }
          confirm={ confirm }
        />
      </div>
    )
  }
}

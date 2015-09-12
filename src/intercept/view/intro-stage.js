import React from 'react'
import formatMessage from 'format-message'
import ReadyButton from './ready-button'
import { roles } from '../constants'

const spy = (
  <div>
    <h2>{ formatMessage('You are a Spy!') }</h2>
    <p>
      { formatMessage(
        `You have been tasked with intercepting strategic enemy intel. The most
        difficult part of your job will be decerning which of your fellow spies
        is actually working for your enemy.`
      ) }
    </p>
    <p>
      { formatMessage(
        `You should always include yourself to go on missions you lead, since
        you are the only one you can trust completely.`
      ) }
    </p>
  </div>
)

const doubleAgent = (
  <div>
    <h2>{ formatMessage('You are a Double Agent!') }</h2>
    <p>
      { formatMessage(
        `The fools around you have no idea that they are your true enemy. With
        your cunning, you will sabotage this group so that your superior nation
        can justly conquer.`
      ) }
    </p>
    <p>
      { formatMessage(
        `Do not let anyone besides your fellow double agents know where your
        real allegiance lies. Act in every way as a normal spy, until you can
        sabotage an interception.`
      ) }
    </p>
  </div>
)

const mole = (
  <div>
    <h2>{ formatMessage('You are a Mole!') }</h2>
    <p>
      { formatMessage(
        `You are a Triple Agent. The Double Agents think you are one of them,
        and you must use this to your advantage. The Spies also rightly think
        you are one of them, don't let them down.`
      ) }
    </p>
    <p>
      { formatMessage(
        `Pretend to be a Double Agent, but be very careful, you only win if the
        missions are successful.`
      ) }
    </p>
  </div>
)

export default class IntroStage extends React.Component {
  static displayName = 'IntroStage'

  static propTypes = {
    sid: React.PropTypes.string.isRequired,
    game: React.PropTypes.object.isRequired,
    vote: React.PropTypes.func.isRequired
  }

  render () {
    const { sid, game, vote } = this.props
    const currentPlayer = game.players.find(player => player.sid === sid)
    const isReady = game.votes[currentPlayer.id]
    return (
      <div>
        {
          currentPlayer.role === roles.SPY ? spy :
          currentPlayer.role === roles.DOUBLE ? doubleAgent :
          mole
        }
        { currentPlayer.role === roles.SPY ?
          <p>
            { formatMessage(
              'There are {count, number} Double Agents in this game.',
              { count: game.players.filter(player => player.role === roles.DOUBLE).length }
            ) }
          </p> :
          <p>
            { formatMessage('Here are your fellow Double Agents:') }
            <ul>
              { game.players
                .filter(player => player.role !== roles.SPY && player !== currentPlayer)
                .map(player =>
                  <li key={ player.id }>{ player.name }</li>
                )
              }
            </ul>
          </p>
        }
        <ReadyButton
          player={ currentPlayer }
          game={ game }
          confirm={ isReady ? null : () => vote(currentPlayer, true) }
        />
      </div>
    )
  }
}

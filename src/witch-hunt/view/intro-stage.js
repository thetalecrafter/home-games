import React from 'react'
import formatMessage from 'format-message'
import ReadyButton from './ready-button'

const witch = (
  <div>
    <p>
      { formatMessage(`You have found that you have uncanny powers to influence
        those around you, and can cause occurrences inexplicable to ordinary
        understanding. In order to survive, you must use this power to stop
        those who would destroy you.`)
      }
    </p>
    <p>
      { formatMessage(`Each night you will choose with your cohorts whom you
        must curse, so that you may live.`)
      }
    </p>
    <p>
      { formatMessage(`Each day you will defend your friends against the deadly
        trails, but do not let the commoners know that you are a witch, or who
        your fellow witches are.`)
      }
    </p>
    <p>
      { formatMessage(`A swift end to the trials is your safest course.`) }
    </p>
  </div>
)

const puritan = (
  <div>
    <p>
      { formatMessage(`You are godly and kind. Your hard work will ensure your
        place in heaven, but the Devil is among your community and will surely
        destroy everything you love, and take away your heavenly reward, unless
        you discover and destroy his agents.`)
      }
    </p>
    <p>
      { formatMessage(`Each night you can choose to sleep, or to follow a member
        of your community. Following can help you find who is a witch, but you
        may look a little suspicious in the process.`)
      }
    </p>
    <p>
      { formatMessage(`Each day you will put to trial the person you most think
        to be a witch. If they survive the trial, it is surely through the evil
        one’s power, and they must be executed immediately.`)
      }
    </p>
    <p>
      { formatMessage(`An early ending to the trials may leave your enemies a
        chance to drag you down to hell.`)
      }
    </p>
  </div>
)

export default React.createClass({
  displayName: 'IntroStage',

  propTypes: {
    app: React.PropTypes.object.isRequired,
    game: React.PropTypes.object.isRequired
  },

  render () {
    const { app, game } = this.props
    const store = game.store
    const currentPlayer = app.getCurrentPlayer()
    const isWitch = store.isWitch(currentPlayer.id)
    return (
      <div>
        <h2>
          { isWitch ?
            formatMessage('You are a witch!') :
            formatMessage('You are a puritan')
          }
        </h2>
        { isWitch ? witch : puritan }
        <ReadyButton
          app={ app }
          game={ game }
          disabled={ false }
        />
      </div>
    )
  }
})

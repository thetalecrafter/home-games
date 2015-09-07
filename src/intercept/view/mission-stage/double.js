import React from 'react'
import formatMessage from 'format-message'

export default class DoubleAgentMissionStage extends React.Component {
  static displayName = 'DoubleAgentMissionStage'

  static propTypes = {
    result: React.PropTypes.bool,
    vote: React.PropTypes.func.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.result !== this.props.result
  }

  render () {
    const { result, vote } = this.props
    return (
      <div>
        <p>
          { formatMessage(
            `As a Double Agent, you need to sabotage missions to win, but you
            may successfully intercept the message if needed to keep the trust
            of the others.`
          ) }
        </p>
        { result == null ?
          <div>
            <button onClick={ () => vote(true) }>
              { formatMessage('Intercept Message') }
            </button>
            <button onClick={ () => vote(false) }>
              { formatMessage('Sabotage Mission') }
            </button>
          </div> :
          result ?
          <p>
            { formatMessage('You have successfully completed your mission.') }
          </p> :
          <p>
            { formatMessage('You have sabotaged the mission.') }
          </p>
        }
      </div>
    )
  }
}

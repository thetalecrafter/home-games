import React from 'react'
import formatMessage from 'format-message'

export default class MoleMissionStage extends React.Component {
  static displayName = 'MoleMissionStage'

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
            `As a Mole, you need to intercept messages to win, but you may
            sabotage the mission if needed to keep the trust of the double
            agents.`
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

